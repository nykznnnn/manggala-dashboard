import { useContext, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ClientsContext } from "../context/ClientsContext";

export default function ClientDetail() {
  const { id } = useParams();
  const { clients } = useContext(ClientsContext);

  const [activeTab, setActiveTab] = useState("profile");

  const client = useMemo(() => {
    return clients?.find(
      (c) => String(c.id) === String(id)
    );
  }, [clients, id]);

  if (!clients || clients.length === 0) {
    return (
      <div className="page-container">
        <h2>Loading data clients...</h2>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="page-container">
        <h2>Client tidak ditemukan</h2>
      </div>
    );
  }

const angsuran = Array.isArray(client.angsuran)
  ? client.angsuran
  : [];

/* JUMLAH TALANGAN
   hitung status hijau */
const jumlahTalangan = angsuran.filter(
  (a) => a.status === "hijau"
).length;

/* ANGSURAN PER BULAN */
const angsuranBulanan = Number(
  client.angsuranBulanan || 0
);

/* TOTAL TALANGAN */
const totalTalangan =
  jumlahTalangan * angsuranBulanan;

  return (
    <div className="page-container">

      {/* HEADER */}
      <div className="detail-hero">

        <div>
          <h1>{client.nama}</h1>

          <p className="detail-subtitle">
            {client.bank} • {client.progress}
          </p>
        </div>

        <div className="detail-badge">
          Rp{" "}
          {Number(client.plafond || 0).toLocaleString()}
        </div>

      </div>

      {/* SUMMARY */}
      <div className="summary-grid">

        <div className="summary-card">
          <span>Angsuran / Bulan</span>
          <h3>
            Rp{" "}
            {Number(
              angsuranBulanan
            ).toLocaleString()}
          </h3>
        </div>

        <div className="summary-card">
          <span>Jumlah Talangan</span>
          <h3>{jumlahTalangan}x</h3>
        </div>

        <div className="summary-card">
          <span>Total Talangan</span>
          <h3>
            Rp{" "}
            {Number(
              totalTalangan
            ).toLocaleString()}
          </h3>
        </div>

      </div>

      {/* TABS */}
      <div className="tabs-wrapper">

        <button
          className={
            activeTab === "profile"
              ? "tab active"
              : "tab"
          }
          onClick={() =>
            setActiveTab("profile")
          }
        >
          Profile
        </button>

        <button
          className={
            activeTab === "pencairan"
              ? "tab active"
              : "tab"
          }
          onClick={() =>
            setActiveTab("pencairan")
          }
        >
          Pencairan
        </button>

      </div>

      {/* CONTENT */}
      <div className="detail-card">

        {activeTab === "profile" && (
          <div className="detail-grid">

            <Info
              label="Nama"
              value={client.nama}
            />

            <Info
              label="Alamat"
              value={client.alamat}
            />

            <Info
              label="Bank"
              value={client.bank}
            />

            <Info
              label="Progress"
              value={client.progress}
            />

            <Info
              label="Job"
              value={client.job}
            />

            <Info
              label="Company"
              value={client.company}
            />

            <Info
              label="Negara"
              value={client.negara}
            />

            <Info
              label="Hubungan"
              value={client.hubungan}
            />

          </div>
        )}

        {activeTab === "pencairan" && (
          <div className="detail-grid">

            <Info
              label="Plafond"
              value={`Rp ${Number(
                client.plafond || 0
              ).toLocaleString()}`}
            />

            <Info
              label="Provisi"
              value={`Rp ${Number(
                client.provisi || 0
              ).toLocaleString()}`}
            />

            <Info
              label="Blokir"
              value={`Rp ${Number(
                client.blokir || 0
              ).toLocaleString()}`}
            />

            <Info
  label="Jaminan"
  value={
    client.jaminan
      ? `Rp ${Number(
          client.jaminan
        ).toLocaleString()}`
      : "-"
  }
/>

            <Info
  label="Tanggal Cair"
  value={
    client.tanggalCair
      ? new Date(
          client.tanggalCair
        ).toLocaleDateString("id-ID")
      : "-"
  }
/>

            <div className="info-card">

  {client.kwitansi ? (
    <button
      className="table-btn"
      style={{ marginTop: "10px" }}
      onClick={() =>
        window.open(client.kwitansi, "_blank")
      }
    >
       Lihat Kuitansi Pencairan
    </button>
  ) : (
    <h4>-</h4>
  )}
</div>

          </div>
        )}

      </div>

    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="info-card">

      <span>{label}</span>

      <h4>{value || "-"}</h4>

    </div>
  );
}