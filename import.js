import admin from "firebase-admin";
import fs from "fs";
import csv from "csv-parser";

// =========================
// FIREBASE SERVICE ACCOUNT
// =========================
const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// =========================
// HELPERS
// =========================
function cleanNumber(value) {
  if (!value) return 0;
  const num = value.toString().replace(/[^0-9]/g, "");
  return num ? Number(num) : 0;
}

function normalizeName(name) {
  if (!name) return "";
  return name.trim().toLowerCase();
}

// =========================
// LOAD CSV FUNCTION
// =========================
function loadCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

// =========================
// MERGE LOGIC TAB1 + TAB2
// =========================
function mergeData(tab1, tab2) {
  return tab1.map((c) => {
    const match = tab2.find(
      (t) => normalizeName(t.Nama) === normalizeName(c.Nama)
    );

    return {
      // =====================
      // DATA UTAMA (TAB 1)
      // =====================
      nama: c.Nama || "",
      alamat: c.Alamat || "",
      bank: c.Bank || "",
      agunan: c.Agunan || "",
      hubungan: c.Hubungan || "",
      ketAgunan: c.Keterangan || "",
      job: c.Job || "",
      company: c.Company || "",
      negara: c.Negara || "",

      // STATUS → PROGRESS CLEAN
      progress:
        c.Status === "Sudah Cair"
          ? "SUDAH_CAIR"
          : "REGISTRASI",

      plafond: cleanNumber(c.Plafond),

      survei: c.Survei === "✓",
      visa: c.Visa === "✓",
      tiket: c.Tiket === "✓",

      support: c.Support || "",

      // =====================
      // DATA PENCARIAN TAB 2
      // =====================
      tanggalCair: match?.Tanggal || "",
      jaminan: cleanNumber(match?.Jaminan),
      provisi: cleanNumber(match?.["Provisi/ADM"]),
      blokir: cleanNumber(match?.Blokir),
      angsuranBulanan: cleanNumber(match?.Angsuran),
      kwitansi: match?.Kuitansi || "",

      // =====================
      // DEFAULT SYSTEM
      // =====================
      tenor: 36,
      angsuran: [],
    };
  });
}

// =========================
// UPLOAD TO FIRESTORE
// =========================
async function uploadToFirestore(data) {
  const collectionRef = db.collection("clients");

  let count = 0;

  for (const item of data) {
    await collectionRef.add(item);
    count++;
  }

  console.log("🔥 IMPORT SUCCESS");
  console.log("TOTAL CLIENT UPLOADED:", count);
}

// =========================
// MAIN EXECUTION
// =========================
async function main() {
  try {
    console.log("📥 Loading CSV...");

    const tab1 = await loadCSV("./tab1.csv");
    const tab2 = await loadCSV("./tab2.csv");

    console.log("TAB1:", tab1.length);
    console.log("TAB2:", tab2.length);

    const merged = mergeData(tab1, tab2);

    console.log("🔗 MERGED:", merged.length);

    await uploadToFirestore(merged);
  } catch (err) {
    console.error("❌ ERROR:", err);
  }
}

main();