import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";

export default function TambahClient() {
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    progress: "REGISTRASI",

    bank: "",
    agunan: "",
    ketAgunan: "",
    hubungan: "",
    job: "",
    company: "",
    negara: "",

    plafond: "",
    survei: "",
    tiket: "",

    tanggalCair: "",
    jaminan: "",
    provisiADM: "",
    blokir: "",
    angsuranBulanan: "",
    kwitansi: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // =========================
  // SAFE NUMBER CONVERTER
  // =========================
  const toNumber = (val) =>
    val === "" || val === null || val === undefined
      ? null
      : Number(val);

  // =========================
  // SUBMIT FIRESTORE (CLEAN STRUCTURE)
  // =========================
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await addDoc(collection(db, "clients"), {
        ...formData,

        plafond: toNumber(formData.plafond),
        provisiADM: toNumber(formData.provisiADM),
        blokir: toNumber(formData.blokir),
        angsuranBulanan: toNumber(formData.angsuranBulanan),

        // normalize date ke timestamp
        tanggalCair: formData.tanggalCair
          ? new Date(formData.tanggalCair).getTime()
          : null,

        // init angsuran kosong (biar semua page konsisten)
        angsuran: [],
      });

      alert("Client berhasil ditambahkan!");

      setFormData({
        nama: "",
        alamat: "",
        progress: "REGISTRASI",
        bank: "",
        agunan: "",
        ketAgunan: "",
        hubungan: "",
        job: "",
        company: "",
        negara: "",
        plafond: "",
        survei: "",
        tiket: "",
        tanggalCair: "",
        jaminan: "",
        provisiADM: "",
        blokir: "",
        angsuranBulanan: "",
        kwitansi: "",
      });
    } catch (err) {
      console.error("Add client error:", err);
      alert("Gagal menambah client");
    }
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">
        Tambah Client
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">

        <input name="nama" placeholder="Nama" value={formData.nama} onChange={handleChange} />
        <input name="alamat" placeholder="Alamat" value={formData.alamat} onChange={handleChange} />

        <input name="bank" placeholder="Bank" value={formData.bank} onChange={handleChange} />
        <input name="progress" placeholder="Progress" value={formData.progress} onChange={handleChange} />

        <input name="agunan" placeholder="Agunan" value={formData.agunan} onChange={handleChange} />
        <input name="ketAgunan" placeholder="Ket Agunan" value={formData.ketAgunan} onChange={handleChange} />

        <input name="hubungan" placeholder="Hubungan" value={formData.hubungan} onChange={handleChange} />
        <input name="job" placeholder="Job" value={formData.job} onChange={handleChange} />

        <input name="company" placeholder="Company" value={formData.company} onChange={handleChange} />
        <input name="negara" placeholder="Negara" value={formData.negara} onChange={handleChange} />

        <input type="number" name="plafond" placeholder="Plafond" value={formData.plafond} onChange={handleChange} />
        <input name="survei" placeholder="Survei" value={formData.survei} onChange={handleChange} />

        <input name="tiket" placeholder="Tiket" value={formData.tiket} onChange={handleChange} />

        <input type="date" name="tanggalCair" value={formData.tanggalCair} onChange={handleChange} />

        <input name="jaminan" placeholder="Jaminan" value={formData.jaminan} onChange={handleChange} />

        <input type="number" name="provisiADM" placeholder="Provisi" value={formData.provisiADM} onChange={handleChange} />
        <input type="number" name="blokir" placeholder="Blokir" value={formData.blokir} onChange={handleChange} />
        <input type="number" name="angsuranBulanan" placeholder="Angsuran Bulanan" value={formData.angsuranBulanan} onChange={handleChange} />

        <input name="kwitansi" placeholder="Kwitansi" value={formData.kwitansi} onChange={handleChange} />

        <div className="col-span-2">
          <button type="submit" className="bg-blue-600 px-5 py-3 rounded hover:bg-blue-700">
            Simpan Client
          </button>
        </div>

      </form>
    </div>
  );
}