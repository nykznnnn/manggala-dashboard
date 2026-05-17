import { useContext, useState, useEffect, useRef } from "react";
import { ClientsContext } from "../context/ClientsContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";

export default function Angsuran() {
  const { clients = [] } = useContext(ClientsContext);

  const [selectedCell, setSelectedCell] = useState(null);
  const [search, setSearch] = useState("");
  const popupRef = useRef(null);

  // =========================
  // CLOSE POPUP ON CLICK OUTSIDE
  // =========================
  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setSelectedCell(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // =========================
  // NORMALIZER DATE (SAFE MODE)
  // =========================
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
    if (!isNaN(d.getTime())) return d.getTime();

    return null;
  }

  // =========================
  // MONTH GENERATOR
  // =========================
  function generateMonth(startDate, index) {
    const ts = normalizeDate(startDate);
    if (!ts) return "-";

    const d = new Date(ts);
    d.setMonth(d.getMonth() + index + 1);

    return d.toLocaleDateString("id-ID", {
      month: "short",
      year: "2-digit",
    });
  }

  // =========================
  // STATUS STYLE
  // =========================
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

  // =========================
  // LOCK MONTH LOGIC
  // =========================
  function isMonthActive(startDate, index) {
    const ts = normalizeDate(startDate);
    if (!ts) return true;

    const start = new Date(ts);

    const startIndex =
      start.getFullYear() * 12 + start.getMonth();

    const now = new Date();
    const nowIndex =
      now.getFullYear() * 12 + now.getMonth();

    return index <= nowIndex - startIndex;
  }

  // =========================
  // SAFE UPDATE (FIXED CRITICAL BUG)
  // =========================
  async function updateStatus(clientId, index, status) {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    const existing = Array.isArray(client.angsuran)
      ? client.angsuran
      : [];

    const newAngsuran = [...existing];

    newAngsuran[index] = {
      ...(newAngsuran[index] || {}), // 🔥 FIX: prevent overwrite null/undefined
      status,
      updatedAt: Date.now(),
    };

    try {
      await updateDoc(doc(db, "clients", clientId), {
        angsuran: newAngsuran,
      });

      setSelectedCell(null);
    } catch (err) {
      console.error("Update angsuran error:", err);
      alert("Gagal update status");
    }
  }
const filteredClients = [...clients]
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
        <h2>Angsuran Kredit</h2>
      </div>
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
      <div className="table-wrapper">
        <table className="data-table angsuran-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Bank</th>
              <th>Tanggal Cair</th>

              {Array.from({ length: 48 }).map((_, i) => (
                <th key={i}>{i + 1}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredClients
  .sort((a, b) =>
    (a.nama || "").localeCompare(b.nama || "", "id", {
      sensitivity: "base",
    })
  )
  .map((client, index) => (
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

                {Array.from({ length: 48 }).map((_, i) => {
                  const angsuran = client.angsuran?.[i];
                  const active = isMonthActive(client.tanggalCair, i);
                  const cellKey = `${client.id}-${i}`;

                  return (
                    <td key={i} style={{ position: "relative" }}>
                      <div
                        className={`angsuran-box ${getStatusClass(
                          angsuran?.status
                        )}`}
                        style={{
                          cursor: active ? "pointer" : "not-allowed",
                          opacity: active ? 1 : 0.4,
                        }}
                        onClick={() => active && setSelectedCell(cellKey)}
                      >
                        {generateMonth(client.tanggalCair, i)}
                      </div>

                      {selectedCell === cellKey && (
                        <div
                          ref={popupRef}
                          style={{
                            position: "absolute",
                            top: "30px",
                            left: "0",
                            background: "#fff",
                            border: "1px solid #ddd",
                            padding: "8px",
                            zIndex: 100,
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                            borderRadius: "6px",
                            minWidth: "140px",
                          }}
                        >
                          <button onClick={() => updateStatus(client.id, i, "merah")}>
                            🔴 Belum Bayar
                          </button>

                          <button onClick={() => updateStatus(client.id, i, "kuning")}>
                            🟡 Client
                          </button>

                          <button onClick={() => updateStatus(client.id, i, "hijau")}>
                            🟢 Manggala
                          </button>

                          <button onClick={() => updateStatus(client.id, i, "biru")}>
                            🔵 Blokir
                          </button>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}