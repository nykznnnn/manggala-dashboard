import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ClientsContext } from "../context/ClientsContext";
import { generateAngsuran } from "../utils/angsuran";
import { motion } from "framer-motion";
import { exportToExcel } from "../utils/exportToExcel";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

export default function Clients() {
  const { clients = [] } = useContext(ClientsContext);
  const navigate = useNavigate();

  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  // CONTEXT MENU
  const [menu, setMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    client: null,
  });

  const menuRef = useRef(null);

  const PROGRESS = {
    REGISTRASI: "REGISTRASI",
    SUDAH_CAIR: "SUDAH_CAIR",
    BELUM_TERBANG: "BELUM_TERBANG",
  };

  const emptyForm = {
    nama: "",
    alamat: "",
    progress: PROGRESS.REGISTRASI,
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
    provisi: "",
    blokir: "",
    angsuranBulanan: "",
    kwitansi: "",
  };

  const [form, setForm] = useState(emptyForm);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function openAdd() {
    setEditId(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEdit(c) {
    setEditId(c.id);
    setForm({ ...emptyForm, ...c });
    setShowModal(true);
  }

  function openMenu(e, client) {
    e.preventDefault();

    setMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      client,
    });
  }

  function closeMenu() {
    setMenu({ visible: false, x: 0, y: 0, client: null });
  }

  async function handleDelete() {
    const c = menu.client;
    if (!c?.id) return;

    const ok = window.confirm(`Delete client "${c.nama}"?`);
    if (!ok) return;

    await deleteDoc(doc(db, "clients", c.id));

    closeMenu();
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...form,
      plafond: Number(form.plafond || 0),
      provisi: Number(form.provisi || 0),
      blokir: Number(form.blokir || 0),
      angsuranBulanan: Number(form.angsuranBulanan || 0),
    };

    if (editId) {
      await updateDoc(doc(db, "clients", editId), payload);
    } else {
      await addDoc(collection(db, "clients"), {
        ...payload,
        angsuran: generateAngsuran(36),
      });
    }

    setShowModal(false);
    setForm(emptyForm);
    setEditId(null);
  }

useEffect(() => {
  function handleClickOutside(e) {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      closeMenu();
    }
  }

  function handleEsc(e) {
    if (e.key === "Escape") closeMenu();
  }

  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("keydown", handleEsc);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    document.removeEventListener("keydown", handleEsc);
  };
}, []);

/* =========================
   FILTERED CLIENTS
========================= */

const filteredClients = [...clients]
  .filter((c) => {
    const q = search.toLowerCase();

    return (
      (c.nama || "").toLowerCase().includes(q) ||
      (c.bank || "").toLowerCase().includes(q) ||
      (c.negara || "").toLowerCase().includes(q)
    );
  })
  .sort((a, b) =>
    (a.nama || "").localeCompare(b.nama || "", "id", {
      sensitivity: "base",
    })
  );

const handleExport = () => {

const sortedClients = [...clients].sort((a, b) =>
  (a.nama || "").localeCompare(
    b.nama || "",
    "id",
    { sensitivity: "base" }
  )
);

const data = sortedClients.map((c, index) => {

// =========================
// TOTAL TALANGAN
// =========================

const totalTalanganCount = (c.angsuran || []).filter(
  (a) => a.status === "hijau"
).length;

const totalTalanganNominal =
  totalTalanganCount *
  Number(c.angsuranBulanan || 0);

// =========================
// TOTAL TUNGGAKAN
// =========================

const totalTunggakanCount = (c.angsuran || []).filter(
  (a) => a.status === "merah"
).length;

const totalTunggakanNominal =
  totalTunggakanCount *
  Number(c.angsuranBulanan || 0);

// SISA ANGSURAN
const sisaAngsuran = (c.angsuran || []).filter(
  (a) =>
    a.warna === undefined ||
    a.warna === null ||
    a.warna === ""
).length;

    return {
      No: index + 1,

      Nama: String(c.nama || ""),

      Alamat: String(c.alamat || ""),

      Progress: String(c.progress || ""),

      Agunan: String(c.agunan || ""),

      "Ket. Agunan": String(c.ketAgunan || ""),

      Hubungan: String(c.hubungan || ""),

      Company: String(c.company || ""),

      Job: String(c.job || ""),

      Negara: String(c.negara || ""),

      Bank: String(c.bank || ""),

      "Tanggal Cair": c.tanggalCair
  ? new Date(c.tanggalCair).toLocaleDateString("id-ID")
  : "-",

     Plafond: `Rp ${Number(c.plafond || 0).toLocaleString("id-ID")}`,

Jaminan: `Rp ${Number(c.jaminan || 0).toLocaleString("id-ID")}`,

"Provisi/ADM": `Rp ${Number(c.provisi || 0).toLocaleString("id-ID")}`,

"Angsuran": `Rp ${Number(
  c.angsuranBulanan || 0
).toLocaleString("id-ID")}`,

      "Talangan": `${totalTalanganCount}x - Rp ${totalTalanganNominal.toLocaleString("id-ID")}`,
      "Tunggakan": `${totalTunggakanCount}x - Rp ${totalTunggakanNominal.toLocaleString("id-ID")}`,

      "Sisa Angsuran": `${sisaAngsuran} Bulan`,

     Kwitansi: c.kwitansi || "-",
    };
  });

  exportToExcel(data, "laporan-client");
};

return (
  <div>
    <div className="page-header">
      <h2>Clients</h2>
    </div>

    <div
      style={{
        display: "flex",
        gap: "12px",
        marginBottom: "18px",
        flexWrap: "wrap",
      }}
    >
      <button className="add-btn" onClick={openAdd}>
        + Tambah Client
      </button>

      <button
  className="add-btn"
  onClick={handleExport}
>
  Export Excel
</button>

      <input
        type="text"
        placeholder="Search nama / bank / negara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "12px 14px",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          background: "var(--card)",
          color: "var(--text)",
          minWidth: "260px",
        }}
      />
    </div>


      {/* TABLE */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Alamat</th>
              <th>Progress</th>
              <th>Agunan</th>
              <th>Company</th>
              <th>Negara</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
  {filteredClients
    .sort((a, b) =>
      (a.nama || "").localeCompare(b.nama || "", "id", {
        sensitivity: "base",
      })
    )
    .map((c, index) => (
      <tr
        key={c.id}
        onContextMenu={(e) => openMenu(e, c)}
        style={{ cursor: "default" }}
      ><td>{index + 1}</td>
        <td>{c.nama}</td>
        <td>{c.alamat}</td>
        <td>{c.progress}</td>
        <td>{c.agunan}</td>
        <td>{c.company}</td>
        <td>{c.negara}</td>

        <td>
          <button
            className="table-btn"
            onClick={(e) => openMenu(e, c)}
          >
            •••
          </button>
        </td>
      </tr>
    ))}
</tbody>
        </table>
      </div>

      {/* CONTEXT MENU PREMIUM */}
      {menu.visible && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.08)",
            backdropFilter: "blur(6px)",
            zIndex: 999,
          }}
        >
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: menu.y,
              left: menu.x,
              minWidth: "180px",
              background: "#111",
              color: "#fff",
              borderRadius: "14px",
              padding: "8px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
              transform: "scale(0.95)",
              animation: "pop .12s ease-out forwards",
            }}
          >
            <button
              onClick={() => {
                navigate(`/clients/${menu.client.id}`);
                closeMenu();
              }}
              style={btnStyle}
            >
              Detail
            </button>

            <button
              onClick={() => {
                openEdit(menu.client);
                closeMenu();
              }}
              style={btnStyle}
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              style={{ ...btnStyle, color: "#ff4d4d" }}
            >
              Delete
            </button>
          </div>
        </div>
      )}

{/* FORM MODAL */}
{showModal && (
  <div className="modal-overlay">
    <div className="modal-box">
      <div className="modal-header">
        <h3>
          {editId 
            ? `Edit Client${form.nama ? ` - ${form.nama}` : ''}` 
            : "Tambah Client"}
        </h3>
        <button
          className="close-btn"
          onClick={() => setShowModal(false)}
        >
          ✕
        </button>
      </div>

      <form className="client-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Nama</label>
          <input name="nama" placeholder="Nama" value={form.nama} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Alamat</label>
          <input name="alamat" placeholder="Alamat" value={form.alamat} onChange={handleChange} />
        </div>

        <div className="form-field">
          <label>Progress</label>
          <select name="progress" value={form.progress} onChange={handleChange}>
            <option value="REGISTRASI">REGISTRASI</option>
            <option value="SUDAH_CAIR">SUDAH_CAIR</option>
            <option value="BELUM_TERBANG">BELUM_TERBANG</option>
          </select>
        </div>

        <div className="form-field">
          <label>Bank</label>
          <input name="bank" placeholder="Bank" value={form.bank} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Agunan</label>
          <input name="agunan" placeholder="Agunan" value={form.agunan} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Ket Agunan</label>
          <input name="ketAgunan" placeholder="Ket Agunan" value={form.ketAgunan} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Hubungan</label>
          <input name="hubungan" placeholder="Hubungan" value={form.hubungan} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Job</label>
          <input name="job" placeholder="Job" value={form.job} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Company</label>
          <input name="company" placeholder="Company" value={form.company} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Negara</label>
          <input name="negara" placeholder="Negara" value={form.negara} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Survei</label>
          <input name="survei" placeholder="Survei" value={form.survei} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>Tiket</label>
          <input name="tiket" placeholder="Tiket" value={form.tiket} onChange={handleChange} />
        </div>

        <button className="submit-btn" type="submit">
          Save
        </button>
      </form>
    </div>
  </div>
)}

      {/* ANIMATION */}
      <style>{`
        @keyframes pop {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const btnStyle = {
  width: "100%",
  textAlign: "left",
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  background: "transparent",
  color: "white",
  cursor: "pointer",
};