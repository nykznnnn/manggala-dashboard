import { useContext, useState } from "react";
import { ClientsContext } from "../context/ClientsContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { formatRupiah } from "../utils/format";
import { rebuildAngsuranSimple } from "../utils/rebuildAngsuran";

export default function Pencairan() {
  const { clients = [] } = useContext(ClientsContext);

  const [editClient, setEditClient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  // =========================
  // EMPTY FORM
  // =========================
  const emptyForm = {
    bank: "",
    tanggalCair: "",
    jaminan: "",
    provisiADM: "",
    blokir: "",
    angsuranBulanan: "",
    plafond: "",
    kwitansi: "",
    tenor: "",
  };

  const [form, setForm] = useState(emptyForm);

  // =========================
  // HANDLE INPUT
  // =========================
  function handleChange(e) {
    const { name, value } = e.target;

    const numberFields = [
      "plafond",
      "provisiADM",
      "blokir",
      "angsuranBulanan",
      "tenor",
      "jaminan",
    ];

    setForm((prev) => ({
      ...prev,
      [name]: numberFields.includes(name)
        ? value === ""
          ? ""
          : Number(value)
        : value,
    }));
  }

  // =========================
  // SAFE DATE
  // =========================
  const safeDate = (val) => {
    if (!val) return "";
    const d = new Date(val);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  // =========================
  // OPEN EDIT
  // =========================
  function openEdit(client) {
    if (!client?.id) return;

    setEditClient(client);

    setForm({
      bank: client.bank || "",
      tanggalCair: safeDate(client.tanggalCair),

      jaminan: client.jaminan ?? "",
      provisiADM: client.provisiADM ?? "",
      blokir: client.blokir ?? "",
      angsuranBulanan: client.angsuranBulanan ?? "",
      plafond: client.plafond ?? "",

      kwitansi: client.kwitansi || "",
      tenor: client.tenor ?? "",
    });

    setShowModal(true);
  }

  // =========================
  // SAFE NUMBER
  // =========================
  const toNumber = (val) => {
    if (val === "" || val === null || val === undefined) return null;
    const n = Number(val);
    return isNaN(n) ? null : n;
  };

  // =========================
  // SUBMIT (FINAL FIX + REBUILD)
  // =========================
  async function handleSubmit(e) {
    e.preventDefault();

    if (!editClient?.id) return;

    try {
      const existing = clients.find((c) => c.id === editClient.id);

      const newTanggal = form.tanggalCair
        ? new Date(form.tanggalCair).getTime()
        : null;

      const tanggalBerubah =
        existing?.tanggalCair !== newTanggal;

      const tenorBerubah =
        Number(existing?.tenor) !== Number(form.tenor);

      const harusRebuild = tanggalBerubah || tenorBerubah;

      await updateDoc(doc(db, "clients", editClient.id), {
        bank: form.bank,

        tanggalCair: newTanggal,

        jaminan: toNumber(form.jaminan),
        provisiADM: toNumber(form.provisiADM),
        blokir: toNumber(form.blokir),
        angsuranBulanan: toNumber(form.angsuranBulanan),
        plafond: toNumber(form.plafond),
        tenor: toNumber(form.tenor),

        kwitansi: form.kwitansi,

        // 🔥 AUTO REBUILD ANGsuran
        angsuran: harusRebuild
          ? rebuildAngsuranSimple(form.tenor)
          : existing?.angsuran,
      });

      setShowModal(false);
      setEditClient(null);
      setForm(emptyForm);
    } catch (err) {
      console.error(err);
      alert("Gagal update data");
    }
  }

  // =========================
  // FILTER + SORT
  // =========================
  const filteredClients = clients
    .filter((c) => {
      const q = search.toLowerCase();

      return (
        (c.nama || "").toLowerCase().includes(q) ||
        (c.bank || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) =>
      (a.nama || "").localeCompare(b.nama || "", "id", {
        sensitivity: "base",
      })
    );

  // =========================
  // UI
  // =========================
  return (
    <div>
      <div className="page-header">
        <h2>Daftar Pencairan</h2>
      </div>

{/* SEARCH */}
<div className="search-wrapper">
<input
  type="text"
  placeholder="Masukan Nama Client . . ."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="search-input"
/>
</div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Bank</th>
              <th>Tanggal Cair</th>
              <th>Tenor</th>
              <th>Jaminan</th>
              <th>Provisi / ADM</th>
              <th>Plafond</th>
              <th>Angsuran Bulanan</th>
              <th>Kuitansi</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredClients.map((client, index) => (
              <tr key={client.id}>
                <td>{index + 1}</td>
                <td>{client.nama || "-"}</td>
                <td>{client.bank || "-"}</td>

                <td>
                  {client.tanggalCair
                    ? new Date(client.tanggalCair).toLocaleDateString("id-ID")
                    : "-"}
                </td>

                <td>
                  {client.tenor ? `${client.tenor} bln` : "-"}
                </td>

                <td>{formatRupiah(client.jaminan)}</td>
                <td>{formatRupiah(client.provisiADM)}</td>
                <td>{formatRupiah(client.plafond)}</td>
                <td>{formatRupiah(client.angsuranBulanan)}</td>

                <td>
                  {client.kwitansi ? (
                    <button
                      className="table-btn"
                      onClick={() => window.open(client.kwitansi, "_blank")}
                    >
                      Lihat
                    </button>
                  ) : (
                    "-"
                  )}
                </td>

                <td>
                  <button
                    className="table-btn"
                    onClick={() => openEdit(client)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Edit Pencairan</h3>

              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form className="client-form" onSubmit={handleSubmit}>
              <input name="bank" value={form.bank} onChange={handleChange} />
              <input type="date" name="tanggalCair" value={form.tanggalCair} onChange={handleChange} />
              <input name="tenor" type="number" value={form.tenor} onChange={handleChange} />
              <input name="jaminan" type="number" value={form.jaminan} onChange={handleChange} />
              <input name="provisiADM" type="number" value={form.provisiADM} onChange={handleChange} />
              <input name="blokir" type="number" value={form.blokir} onChange={handleChange} />
              <input name="angsuranBulanan" type="number" value={form.angsuranBulanan} onChange={handleChange} />
              <input name="plafond" type="number" value={form.plafond} onChange={handleChange} />
              <input name="kwitansi" value={form.kwitansi} onChange={handleChange} />

              <button type="submit" className="submit-btn">
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}