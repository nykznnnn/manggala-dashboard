import { useContext, useMemo } from "react";
import {
  Wallet,
  ShieldCheck,
  Landmark,
  UserPlus,
  CheckCircle2,
  Clock3,
  Users,
  Bell,
  MoreVertical,
} from "lucide-react";

import { ClientsContext } from "../context/ClientsContext";

export default function Dashboard() {
  const { clients = [] } = useContext(ClientsContext);

  const safeClients = useMemo(() => clients, [clients]);

  const STATUS = {
    REGISTRASI: "REGISTRASI",
    SUDAH_CAIR: "SUDAH_CAIR",
    BELUM_TERBANG: "BELUM_TERBANG",
  };

  // =========================
  // TOTAL DATA
  // =========================

  const totalClients = safeClients.length;

  const totalRegistrasi = safeClients.filter(
    (c) => c.progress === STATUS.REGISTRASI
  ).length;

  const totalSudahCair = safeClients.filter(
    (c) => c.progress === STATUS.SUDAH_CAIR
  ).length;

  const totalBelumTerbang = safeClients.filter(
    (c) => c.progress === STATUS.BELUM_TERBANG
  ).length;

  const totalPlafond = safeClients.reduce(
    (acc, client) => acc + Number(client.plafond || 0),
    0
  );

  const totalProvisi = safeClients.reduce(
    (acc, client) => acc + Number(client.provisi || 0),
    0
  );

  let totalTalangan = 0;

  safeClients.forEach((client) => {
    const angsuranBulanan = Number(client.angsuranBulanan || 0);

    (client.angsuran || []).forEach((item) => {
      if (item.status === "hijau") {
        totalTalangan += angsuranBulanan;
      }
    });
  });

  // =========================
  // HELPER
  // =========================

  const formatRupiah = (number) => {
    return `Rp ${Number(number || 0).toLocaleString("id-ID")}`;
  };

  const getProgressClass = (progress) => {
    switch (progress) {
      case STATUS.SUDAH_CAIR:
        return "badge-success";

      case STATUS.BELUM_TERBANG:
        return "badge-warning";

      default:
        return "badge-primary";
    }
  };

  const getProgressLabel = (progress) => {
    switch (progress) {
      case STATUS.SUDAH_CAIR:
        return "SUDAH_CAIR";

      case STATUS.BELUM_TERBANG:
        return "BELUM_TERBANG";

      default:
        return "REGISTRASI";
    }
  };

  return (
    <div className="dashboard-page">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>

          <p className="dashboard-subtitle">
            Ringkasan client, progress, dan status keuangan
          </p>
        </div>

        <div className="dashboard-header-right">
       

          <div className="dashboard-user">
            <div className="dashboard-avatar">
              <Users size={20} />
            </div>

            <div>
              <h4>Admin Manggala</h4>
              <span>Administrator</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* STATUS ANG SURAN */}
      {/* ================================================= */}

      <div className="dashboard-section">
        <div className="section-top">
          <h3>Status Angsuran</h3>

          <div className="client-counter">
            <Users size={16} />
            <span>{totalClients} Client Terdaftar</span>
          </div>
        </div>

<div className="status-grid">
  {/* TALANGAN */}

  <div className="status-card green-card">
    <div className="status-card-overlay"></div>

    <div className="status-card-content">
      <div className="status-icon">
        <Wallet size={24} />
      </div>

      <div>
        <span>Total Talangan</span>

        <h2>{formatRupiah(totalTalangan)}</h2>
      </div>
    </div>

    <div className="status-wave green-wave"></div>
  </div>

  {/* PROVISI */}

  <div className="status-card red-card">
    <div className="status-card-overlay"></div>

    <div className="status-card-content">
      <div className="status-icon">
        <ShieldCheck size={24} />
      </div>

      <div>
        <span>Total Provisi/Administrasi</span>

        <h2>{formatRupiah(totalProvisi)}</h2>
      </div>
    </div>

    <div className="status-wave red-wave"></div>
  </div>

  {/* PLAFOND */}

  <div className="status-card blue-card">
    <div className="status-card-overlay"></div>

    <div className="status-card-content">
      <div className="status-icon">
        <Landmark size={24} />
      </div>

      <div>
        <span>Total Plafond</span>

        <h2>{formatRupiah(totalPlafond)}</h2>
      </div>
    </div>

    <div className="status-wave blue-wave"></div>
  </div>
</div>
      </div>

      {/* ================================================= */}
      {/* PROGRESS CLIENT */}
      {/* ================================================= */}

      <div className="dashboard-section">
        <h3>Progress Client</h3>

        <div className="progress-grid">
          {/* REGISTRASI */}

          <div className="progress-card">
            <div className="progress-icon blue-icon">
              <UserPlus size={22} />
            </div>

            <div className="progress-content">
              <span>Baru Daftar</span>
              <h2>{totalRegistrasi}</h2>
            </div>

            <div className="progress-line blue-line"></div>
          </div>

          {/* SUDAH CAIR */}

          <div className="progress-card">
            <div className="progress-icon green-icon">
              <CheckCircle2 size={22} />
            </div>

            <div className="progress-content">
              <span>Sudah Cair</span>

              <h2>{totalSudahCair+totalBelumTerbang}</h2>
            </div>

            <div className="progress-line green-line"></div>
          </div>

          {/* BELUM TERBANG */}

          <div className="progress-card">
            <div className="progress-icon orange-icon">
              <Clock3 size={22} />
            </div>

            <div className="progress-content">
              <span>Belum Terbang</span>

              <h2>{totalBelumTerbang}</h2>
            </div>

            <div className="progress-line orange-line"></div>
          </div>

          {/* TOTAL CLIENT */}

          <div className="progress-card">
            <div className="progress-icon purple-icon">
              <Users size={22} />
            </div>

            <div className="progress-content">
              <span>Total Client</span>

              <h2>{totalClients}</h2>
            </div>

            <div className="progress-line purple-line"></div>
          </div>
        </div>
      </div>

      {/* Tabel Client Terbaru */}
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
{[...safeClients]
  .sort((a, b) => {

    // REGISTRASI paling atas
    if (a.progress === "REGISTRASI" && b.progress !== "REGISTRASI") {
      return -1;
    }

    if (b.progress === "REGISTRASI" && a.progress !== "REGISTRASI") {
      return 1;
    }

    // selain registrasi -> urut tanggal cair terbaru
    if (!a.tanggalCair) return 1;
    if (!b.tanggalCair) return -1;

    return new Date(b.tanggalCair) - new Date(a.tanggalCair);
  })
  .slice(0, 7)
  .map((client, index) => (
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