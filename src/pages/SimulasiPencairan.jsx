import { useMemo, useState } from "react";
import "./SimulasiPencairan.css";


/* =========================
   HELPERS
========================= */

const format = (value) => {
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(Math.round(value || 0));
};

const toNum = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return 0;
  }

  const number = Number(value);

  return isNaN(number)
    ? 0
    : number;
};


/* =========================
   REUSABLE COMPONENTS
========================= */

function InputField({
  label,
  value,
  onChange,
  placeholder = "0",
}) {
  return (
    <div className="form-group">

      <label>{label}</label>

      <input
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {

          const onlyNumber =
            e.target.value.replace(/\D/g, "");

          onChange(onlyNumber);

        }}
      />

    </div>
  );
}

function ResultRow({
  label,
  value,
  className = "",
}) {
  return (
    <div className={`result-row ${className}`}>

      <span>{label}</span>

      <strong>
        Rp {format(value)}
      </strong>

    </div>
  );
}


/* =========================
   MAIN COMPONENT
========================= */

export default function SimulasiPencairan() {

  /* =========================
     STATE
  ========================= */

  const [plafond, setPlafond] = useState("");
  const [tenor, setTenor] = useState("36");
  const [saldoBlokirBulan, setSaldoBlokirBulan] = useState("3");

  const [prosesPenempatan, setProsesPenempatan] = useState("");
  const [pelunasan, setPelunasan] = useState("");
  const [jasaProses, setJasaProses] = useState("");
  const [biayaLain, setBiayaLain] = useState("");


  /* =========================
     CALCULATION
  ========================= */

  const result = useMemo(() => {

    const p = toNum(plafond);
    const t = toNum(tenor);
    const b = toNum(saldoBlokirBulan);

    if (p <= 0 || t <= 0) {
      return {
        plafond: 0,
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

    const ASURANSI_BANK_PERCENT =
      t > 47
        ? 0.01232
        : 0.00906;

    const JASA_AGENCY_FLAT = 15000000;

    const JAMINAN_AGENCY_FLAT =
      p > 201000000
        ? 20000000
        : 10000000;

    const AKTA_OTENTIK = 4000000;

    const APHT_NOTARIS = 1200000;

    const proses = toNum(prosesPenempatan);
    const pel = toNum(pelunasan);
    const jasa = toNum(jasaProses);
    const lain = toNum(biayaLain);

    const baseAngsuran =
      (p * BUNGA_BANK) + (p / t);

    const angsuranPerBulan =
      Math.round(baseAngsuran);

    const saldoBlokirCalc =
      angsuranPerBulan * b;

    const admProvisi =
      p * PROVISI_ADM_PERCENT;

    const asuransi =
      p * ASURANSI_BANK_PERCENT;

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
      plafond: p,
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

  }, [
    plafond,
    tenor,
    saldoBlokirBulan,
    prosesPenempatan,
    pelunasan,
    jasaProses,
    biayaLain,
  ]);


  /* =========================
     RENDER
  ========================= */

  return (
    
    <div className="simulasi-page">

      {/* HEADER */}
      <div className="simulasi-header">

        <h1>
          Simulasi Pencairan
        </h1>

        <p>
          Estimasi dana cair dan rincian biaya
        </p>
      {/* ACTIONS */}
      <div className="result-actions">

        <button
          className="print-btn"
          onClick={() => window.print()}
        >
          🖨️ Print
        </button>

      </div>
      </div>


      {/* GRID */}
      <div className="simulasi-grid">


        {/* INPUT PANEL */}
        <div className="simulasi-card input-panel">

          <div className="panel-section">

            <h2>
              Informasi Kredit
            </h2>

            <InputField
              label="Plafond"
              value={plafond}
              onChange={setPlafond}
            />

            <InputField
              label="Tenor"
              value={tenor}
              onChange={setTenor}
            />

            <InputField
              label="Saldo Blokir (bulan)"
              value={saldoBlokirBulan}
              onChange={setSaldoBlokirBulan}
            />

          </div>


          <div className="panel-section">

            <h2>
              Biaya Tambahan
            </h2>

            <InputField
              label="Biaya Proses Penempatan"
              value={prosesPenempatan}
              onChange={setProsesPenempatan}
            />

            <InputField
              label="Pelunasan Bank"
              value={pelunasan}
              onChange={setPelunasan}
            />

            <InputField
              label="Jasa Proses SHM"
              value={jasaProses}
              onChange={setJasaProses}
            />

            <InputField
              label="Biaya Lain"
              value={biayaLain}
              onChange={setBiayaLain}
            />

          </div>
        </div>


        {/* RESULT PANEL */}
        <div
          id="print-area"
          className="simulasi-card result-panel"
        >

          <div className="result-header">

            <h1>
              Simulasi Pencairan Dana
            </h1>

            <p>
              Rincian estimasi biaya dan hasil pencairan
            </p>

          </div>


          {/* RINCIAN */}
          <div className="result-section">

            <h2>
              Rincian Alokasi Dana
            </h2>

            <ResultRow
              label="Plafond Pinjaman"
              value={result.plafond}
            />

            <ResultRow
              label="Angsuran / Bulan"
              value={result.angsuranPerBulan}
            />

          </div>


          {/* PENGELUARAN */}
          <div className="result-section">

            <h2>
              Rincian Pengeluaran
            </h2>

            {Number(prosesPenempatan) > 0 && (
              <ResultRow
                label="Biaya Proses Penempatan"
                value={prosesPenempatan}
              />
            )}

            {Number(jasaProses) > 0 && (
              <ResultRow
                label="Jasa Proses SHM"
                value={jasaProses}
              />
            )}

            {Number(pelunasan) > 0 && (
              <ResultRow
                label="Pelunasan Bank"
                value={pelunasan}
              />
            )}

            {Number(biayaLain) > 0 && (
              <ResultRow
                label="Biaya Lain"
                value={biayaLain}
              />
            )}

            <ResultRow
              label={`Saldo Blokir (${saldoBlokirBulan} Bulan)`}
              value={result.saldoBlokirCalc}
            />

            <ResultRow
              label="Jaminan Agency"
              value={result.JAMINAN_AGENCY_FLAT}
            />

            <ResultRow
              label="Akta Otentik"
              value={result.AKTA_OTENTIK}
            />

            <ResultRow
              label="Asuransi Bank"
              value={result.asuransi}
            />

            <ResultRow
              label="ADM - Provisi Bank"
              value={result.admProvisi}
            />

            <ResultRow
              label="APHT Notaris"
              value={result.APHT_NOTARIS}
            />

            <ResultRow
              label="Jasa Agency & Legal"
              value={result.JASA_AGENCY_FLAT}
            />

            <ResultRow
              label="Total Pengeluaran"
              value={result.totalPengeluaran}
              className="total-row"
            />

          </div>


          {/* FINAL RESULT */}
          <div className="hero-result">

            <span>
              Sisa Uang Pencairan
            </span>

            <h1>
              Rp {format(result.sisaUang)}
            </h1>

          </div>

        </div>

      </div>

    </div>
  );
}