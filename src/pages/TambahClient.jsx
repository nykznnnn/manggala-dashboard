import { useMemo, useState } from "react";
import "./SimulasiPencairan.css";

export default function SimulasiPencairan() {
  const [plafond, setPlafond] = useState(0);
  const [tenor, setTenor] = useState(12);
  const [bunga, setBunga] = useState(10);
  const [admin, setAdmin] = useState(2);

  // ======== SIMULATION ========
  const result = useMemo(() => {
    const adminFee = (plafond * admin) / 100;
    const pokokSetelahAdmin = plafond - adminFee;

    const bungaTotal = (pokokSetelahAdmin * bunga * tenor) / 100;
    const totalPengembalian = pokokSetelahAdmin + bungaTotal;

    const cicilanBulanan = totalPengembalian / tenor;

    return {
      adminFee,
      pokokSetelahAdmin,
      bungaTotal,
      totalPengembalian,
      cicilanBulanan,
    };
  }, [plafond, tenor, bunga, admin]);

  return (
    <div className="simulasi-page">
      {/* HEADER */}
      <div className="simulasi-header">
        <h1>Simulasi Pencairan</h1>
        <p>Hitung estimasi dana cair, biaya, dan cicilan</p>
      </div>

      {/* GRID */}
      <div className="simulasi-grid">
        {/* INPUT */}
        <div className="simulasi-card">
          <h2>Input</h2>

          <label>Plafond</label>
          <input
            type="number"
            value={plafond}
            onChange={(e) => setPlafond(Number(e.target.value))}
          />

          <label>Tenor (bulan)</label>
          <input
            type="number"
            value={tenor}
            onChange={(e) => setTenor(Number(e.target.value))}
          />

          <label>Bunga (%)</label>
          <input
            type="number"
            value={bunga}
            onChange={(e) => setBunga(Number(e.target.value))}
          />

          <label>Admin (%)</label>
          <input
            type="number"
            value={admin}
            onChange={(e) => setAdmin(Number(e.target.value))}
          />
        </div>

        {/* RESULT */}
        <div className="simulasi-card result">
          <h2>Hasil Simulasi</h2>

          <div className="result-row">
            <span>Biaya Admin</span>
            <b>{result.adminFee.toLocaleString()}</b>
          </div>

          <div className="result-row">
            <span>Dana Cair Bersih</span>
            <b>{result.pokokSetelahAdmin.toLocaleString()}</b>
          </div>

          <div className="result-row">
            <span>Total Bunga</span>
            <b>{result.bungaTotal.toLocaleString()}</b>
          </div>

          <div className="result-row highlight">
            <span>Cicilan / Bulan</span>
            <b>{result.cicilanBulanan.toLocaleString()}</b>
          </div>

          <div className="result-row">
            <span>Total Pengembalian</span>
            <b>{result.totalPengembalian.toLocaleString()}</b>
          </div>
        </div>
      </div>
    </div>
  );
}