import { useMemo, useState } from "react";
import "./SimulasiPencairan.css";

export default function SimulasiPencairan() {
  const [plafond, setPlafond] = useState(''); // string kosong untuk input
  const [tenor, setTenor] = useState(36);
  const [saldoBlokirBulan, setSaldoBlokirBulan] = useState(3);

  const [prosesPenempatan, setProsesPenempatan] = useState('');
  const [pelunasan, setPelunasan] = useState('');
  const [jasaProses, setJasaProses] = useState('');
  const [biayaLain, setBiayaLain] = useState('');

  const toNum = (v) => {
    if (v === undefined || v === null || v === '') return 0;
    const num = Number(v);
    return isNaN(num) ? 0 : num;
  };

  const format = (val) =>
    new Intl.NumberFormat('id-ID', {
      maximumFractionDigits: 0,
    }).format(Math.round(val || 0));

  const result = useMemo(() => {
    const p = toNum(plafond);
    const t = toNum(tenor);
    const b = toNum(saldoBlokirBulan);
    if (p <= 0 || t <= 0) {
      return {
        angsuranPerBulan: 0,
        saldoBlokirCalc: 0,
        admProvisi: 0,
        asuransi: 0,
        JASA_AGENCY_FLAT: 0,
        JAMINAN_AGENCY_FLAT: 0,
        AKTA_OTENTIK: 0,
        APHT_NOTARIS: 0,
        totalPengeluaran: 0,
        sisaUang: 0,
      };
    }

    const BUNGA_BANK = 0.01;
    const PROVISI_ADM_PERCENT = 0.03;
    const ASURANSI_BANK_PERCENT = t > 47 ? 0.01232 : 0.00906;

    const JASA_AGENCY_FLAT =
      p <= 125000000
        ? 10000000
        : p <= 175000000
        ? 12500000
        : 15000000;

    const JAMINAN_AGENCY_FLAT = p > 201000000 ? 20000000 : 10000000;
    const AKTA_OTENTIK = 4000000;
    const APHT_NOTARIS = 1200000;

    const proses = toNum(prosesPenempatan);
    const pel = toNum(pelunasan);
    const jasa = toNum(jasaProses);
    const lain = toNum(biayaLain);

    const baseAngsuran = p * BUNGA_BANK + p / t;
    const angsuranPerBulan = Math.round(baseAngsuran);
    const saldoBlokirCalc = angsuranPerBulan * b;

    const admProvisi = p * PROVISI_ADM_PERCENT;
    const asuransi = p * ASURANSI_BANK_PERCENT;

    const totalPengeluaran =
      proses +
      pel +
      jasa +
      lain +
      JASA_AGENCY_FLAT +
      JAMINAN_AGENCY_FLAT +
      AKTA_OTENTIK +
      APHT_NOTARIS +
      admProvisi +
      asuransi +
      saldoBlokirCalc;

    return {
      angsuranPerBulan,
      saldoBlokirCalc,
      admProvisi,
      asuransi,
      JASA_AGENCY_FLAT,
      JAMINAN_AGENCY_FLAT,
      AKTA_OTENTIK,
      APHT_NOTARIS,
      totalPengeluaran,
      sisaUang: p - totalPengeluaran,
    };
  }, [plafond, tenor, saldoBlokirBulan, prosesPenempatan, pelunasan, jasaProses, biayaLain]);

  return ( // lanjutkan dengan JSX yang sudah ada
    <div className="simulasi-page">

      {/* HEADER */}
      <div className="simulasi-header">
        <div>
          <h1>Simulasi Pencairan</h1>
          <p>Estimasi dana cair & rincian biaya</p>
        </div>
      </div>

      <div className="simulasi-grid">

        {/* INPUT */}
        <div className="simulasi-card input-panel">

          <h2>Informasi Kredit</h2>

          <div className="form-group">
            <label>Plafond</label>
            <input type="number" value={plafond} onChange={(e) => setPlafond(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Tenor</label>
            <input type="number" value={tenor} onChange={(e) => setTenor(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Saldo Blokir (bulan)</label>
            <input type="number" value={saldoBlokirBulan} onChange={(e) => setSaldoBlokirBulan(e.target.value)} />
          </div>

          <h2 className="section-title">Biaya Tambahan</h2>

          <div className="form-group">
            <label>Proses Penempatan</label>
            <input type="number" value={prosesPenempatan} onChange={(e) => setProsesPenempatan(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Pelunasan</label>
            <input type="number" value={pelunasan} onChange={(e) => setPelunasan(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Jasa Proses</label>
            <input type="number" value={jasaProses} onChange={(e) => setJasaProses(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Biaya Lain</label>
            <input type="number" value={biayaLain} onChange={(e) => setBiayaLain(e.target.value)} />
          </div>

        </div>

        {/* RESULT */}
        <div className="simulasi-card result-panel">

          <div className="breakdown-item">
            <span>Saldo Blokir</span>
            <strong>Rp {format(result.saldoBlokirCalc)}</strong>
          </div>

          <div className="breakdown-item">
            <span>Angsuran / Bulan</span>
            <strong>Rp {format(result.angsuranPerBulan)}</strong>
          </div>

          <div className="breakdown-item">
            <span>Asuransi</span>
            <strong>Rp {format(result.asuransi)}</strong>
          </div>

          <div className="breakdown-item">
            <span>Jasa Agency</span>
            <strong>Rp {format(result.JASA_AGENCY_FLAT)}</strong>
          </div>

          <div className="breakdown-item">
            <span>Jaminan Agency</span>
            <strong>Rp {format(result.JAMINAN_AGENCY_FLAT)}</strong>
          </div>

          <div className="breakdown-item">
            <span>Total Pengeluaran</span>
            <strong>Rp {format(result.totalPengeluaran)}</strong>
          </div>
          <div className="hero-result">
            <span>Sisa Uang Pencairan</span>
            <h1>Rp {format(result.sisaUang)}</h1>
          </div>
        </div>

      </div>
    </div>
  );
}