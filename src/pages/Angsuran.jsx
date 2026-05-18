import { useContext, useState, useEffect, useRef } from "react";
import { ClientsContext } from "../context/ClientsContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

/* =========================
   DATE SAFE NORMALIZER
========================= */
function normalizeDate(input) {
  if (!input) return null;

  if (typeof input === "number") return input;

  if (typeof input === "object" && input.seconds) {
    return input.seconds * 1000;
  }

  if (typeof input?.toDate === "function") {
    return input.toDate().getTime();
  }

  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d.getTime();
}

/* =========================
   SAFE MONTH ADDER (ANTI BUG)
========================= */
function addMonthsSafe(date, months) {
  const d = new Date(date);
  const day = d.getDate();

  d.setMonth(d.getMonth() + months);

  // fix overflow bulan (Feb dll)
  if (d.getDate() !== day) {
    d.setDate(0);
  }

  return d;
}

/* =========================
   MONTH GENERATOR
   RULE: angsuran mulai +1 bulan
========================= */
function generateMonth(startDate, index) {
  const ts = normalizeDate(startDate);
  if (!ts) return "-";

  const base = new Date(ts);

  const finalDate = addMonthsSafe(base, index + 1);

  return finalDate.toLocaleDateString("id-ID", {
    month: "short",
    year: "2-digit",
  });
}

/* =========================
   STATUS CLASS
========================= */
function getStatusClass(status) {
  switch (status) {
    case "merah":
      return "status-merah";
    case "kuning":
      return "status-kuning";
    case "hijau":
      return "status-hijau";
    case "biru":
      return "status-biru";
    default:
      return "";
  }
}

/* =========================
   UPDATE STATUS
========================= */
async function updateStatus(clientId, index, status, clients, setSelectedCell) {
  const client = clients.find((c) => c.id === clientId);
  if (!client) return;

  const existing = Array.isArray(client.angsuran) ? client.angsuran : [];
  const newAngsuran = [...existing];

  newAngsuran[index] = {
    ...(newAngsuran[index] || {}),
    status,
    updatedAt: Date.now(),
  };

  try {
    await updateDoc(doc(db, "clients", clientId), {
      angsuran: newAngsuran,
    });

    setSelectedCell(null);
  } catch (err) {
    console.error(err);
    alert("Gagal update status");
  }
}

export default function Angsuran() {
  const { clients = [] } = useContext(ClientsContext);

  const [selectedCell, setSelectedCell] = useState(null);
  const [search, setSearch] = useState("");
  const popupRef = useRef(null);

  /* =========================
     CLOSE POPUP OUTSIDE CLICK
  ========================= */
  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setSelectedCell(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* =========================
     FILTER CLIENTS (SUDAH CAIR ONLY)
  ========================= */
  const filteredClients = clients
    .filter((c) => {
      const q = search.toLowerCase();

      const matchSearch =
        (c.nama || "").toLowerCase().includes(q) ||
        (c.bank || "").toLowerCase().includes(q);

      const matchStatus =
        c.progress === "SUDAH_CAIR" || c.progress === "BELUM_TERBANG";

      return matchSearch && matchStatus;
    })
    .sort((a, b) =>
      (a.nama || "").localeCompare(b.nama || "", "id", {
        sensitivity: "base",
      })
    );

  /* =========================
     GLOBAL MAX TENOR
  ========================= */
  const maxTenor =
    filteredClients.length > 0
      ? Math.max(...filteredClients.map((c) => Number(c.tenor) || 0))
      : 0;

  /* =========================
     UI
  ========================= */
  return (
    <div>
      <div className="page-header">
        <h2>Angsuran Kredit</h2>
      </div>

      {/* SEARCH */}
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Search nama / bank..."
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
        <table className="data-table angsuran-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Bank</th>
              <th>Tanggal Cair</th>

              {Array.from({ length: maxTenor }).map((_, i) => (
                <th key={i}>{i + 1}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredClients.map((client, index) => {
              const tenor = Number(client.tenor) || 0;

              return (
                <tr key={client.id}>
                  <td>{index + 1}</td>
                  <td>{client.nama}</td>
                  <td>{client.bank}</td>

                  <td>
                    {(() => {
                      const ts = normalizeDate(client.tanggalCair);
                      return ts
                        ? new Date(ts).toLocaleDateString("id-ID")
                        : "-";
                    })()}
                  </td>

                  {/* CELLS */}
                  {Array.from({ length: maxTenor }).map((_, i) => {
                    const angsuran = client.angsuran?.[i];
                    const cellKey = `${client.id}-${i}`;

                    const active = i < tenor;

                    return (
                      <td key={i} style={{ position: "relative" }}>
                        <div
                          className={`angsuran-box ${getStatusClass(
                            angsuran?.status
                          )}`}
                          style={{
                            cursor: active ? "pointer" : "not-allowed",
                            opacity: active ? 1 : 0.3,
                            filter: active ? "none" : "grayscale(1)",
                          }}
                          onClick={() =>
                            active && setSelectedCell(cellKey)
                          }
                        >
                          {active
                            ? generateMonth(client.tanggalCair, i)
                            : "-"}
                        </div>

                        {/* POPUP */}
                        {selectedCell === cellKey && active && (
                          <div
                            ref={popupRef}
                            style={{
                              position: "absolute",
                              top: "32px",
                              left: "0",
                              background: "rgba(18,18,18,0.95)",
                              backdropFilter: "blur(10px)",
                              border:
                                "1px solid rgba(255,255,255,0.08)",
                              padding: "6px",
                              zIndex: 9999,
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                              borderRadius: "10px",
                              minWidth: "160px",
                              boxShadow:
                                "0 18px 40px rgba(0,0,0,0.45)",
                            }}
                          >
                            <button
                              onClick={() =>
                                updateStatus(
                                  client.id,
                                  i,
                                  "merah",
                                  clients,
                                  setSelectedCell
                                )
                              }
                            >
                              🔴 Belum Bayar
                            </button>

                            <button
                              onClick={() =>
                                updateStatus(
                                  client.id,
                                  i,
                                  "kuning",
                                  clients,
                                  setSelectedCell
                                )
                              }
                            >
                              🟡 Debitur
                            </button>

                            <button
                              onClick={() =>
                                updateStatus(
                                  client.id,
                                  i,
                                  "hijau",
                                  clients,
                                  setSelectedCell
                                )
                              }
                            >
                              🟢 Manggala
                            </button>

                            <button
                              onClick={() =>
                                updateStatus(
                                  client.id,
                                  i,
                                  "biru",
                                  clients,
                                  setSelectedCell
                                )
                              }
                            >
                              🔵 Blokir
                            </button>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}