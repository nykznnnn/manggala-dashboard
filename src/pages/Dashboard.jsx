import { useContext, useMemo } from "react";
import { ClientsContext } from "../context/ClientsContext";

export default function Dashboard() {
  const { clients = [] } = useContext(ClientsContext);

  const safeClients = useMemo(() => clients, [clients]);

  // =========================
  // STATUS CONSTANT (HARUS SAMA DENGAN CLIENTS)
  // =========================
  const STATUS = {
    REGISTRASI: "REGISTRASI",
    SUDAH_CAIR: "SUDAH_CAIR",
    BELUM_TERBANG: "BELUM_TERBANG",
  };

  // =========================
  // BASIC KPI
  // =========================
  const totalClients = safeClients.length;

  const totalPending = safeClients.filter(
    (c) => c.progress === STATUS.REGISTRASI
  ).length;

const totalCair = safeClients.filter(
  (c) => c.progress !== "REGISTRASI"
).length;

  const totalBelumTerbang = safeClients.filter(
    (c) => c.progress === STATUS.BELUM_TERBANG
  ).length;

  const totalPlafond = safeClients.reduce(
    (acc, c) => acc + Number(c.plafond || 0),
    0
  );

  // =========================
  // FINANCE ENGINE (FIXED)
  // =========================
  let totalCashIn = 0;
  let totalTalangan = 0;
  let totalTunggakan = 0;

  safeClients.forEach((client) => {
    const angsuranBulanan = Number(client.angsuranBulanan || 0);

    (client.angsuran || []).forEach((item) => {
      const amount = Number(item.amount || 0);

      totalCashIn += amount;

      if (item.status === "hijau") {
        totalTalangan += angsuranBulanan;
      }

      if (item.status === "merah") {
        totalTunggakan += angsuranBulanan;
      }
    });
  });

  const outstanding = totalPlafond - totalCashIn;

  // =========================
  // UI
  // =========================
return (
  <div>

    <div className="page-header">
      <h2>Dashboard</h2>
      <p style={{ opacity: 0.6 }}>
        Overview client, progress, dan financial status
      </p>
    </div>

    {/* KPI GRID */}
    <div className="stats-grid">

      <div className="stats-card">
        <span>Total Client</span>
        <h3>{totalClients}</h3>
      </div>

      <div className="stats-card">
        <span>Registrasi</span>
        <h3>{totalPending}</h3>
      </div>

      <div className="stats-card">
        <span>Sudah Cair</span>
        <h3>{totalCair}</h3>
      </div>

      <div className="stats-card">
        <span>Belum Terbang</span>
        <h3>{totalBelumTerbang}</h3>
      </div>

    </div>

    {/* FINANCE SECTION */}
    <div className="dashboard-section">

      <h3>Status Angsuran</h3>

      <div className="status-grid">

        <div className="status-card hijau">
          <span>Total Talangan</span>
          <h2>Rp {totalTalangan.toLocaleString()}</h2>
        </div>

        <div className="status-card merah">
          <span>Total Tunggakan</span>
          <h2>Rp {totalTunggakan.toLocaleString()}</h2>
        </div>

        <div className="status-card biru">
          <span>Total Plafond</span>
          <h2>Rp {totalPlafond.toLocaleString()}</h2>
        </div>

      </div>
    </div>

    {/* RECENT CLIENT */}
    <div className="dashboard-section">

      <h3>Recent Client</h3>

      <div className="table-wrapper">
        <table className="data-table">

          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Bank</th>
              <th>Progress</th>
              <th>Plafond</th>
            </tr>
          </thead>

          <tbody>
            {safeClients.slice(0, 7).map((client, index) => (
              <tr key={client.id}>
                <td>{index + 1}</td>
                <td>{client.nama}</td>
                <td>{client.bank}</td>
                <td>{client.progress}</td>
                <td>
                  Rp {Number(client.plafond || 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>

  </div>
);
}