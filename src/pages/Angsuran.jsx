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
const [popupPosition, setPopupPosition] = useState({
  x: 0,
  y: 0,
});
  const [search, setSearch] = useState("");
  const tableWrapperRef = useRef(null);
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

  return () =>
    document.removeEventListener("mousedown", handleClickOutside);
}, []);

/* =========================
   CLOSE POPUP ON SCROLL
========================= */
useEffect(() => {
  const wrapper = tableWrapperRef.current;

  if (!wrapper) return;

  const closePopup = () => {
    setSelectedCell(null);
  };

  wrapper.addEventListener("scroll", closePopup);

  return () => {
    wrapper.removeEventListener("scroll", closePopup);
  };
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
.sort((a, b) => {
  const dateA = normalizeDate(a.tanggalCair) || 0;
  const dateB = normalizeDate(b.tanggalCair) || 0;

  return dateB - dateA;
});

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
      <div className="table-wrapper" ref={tableWrapperRef}>
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
                      <td key={i} >
<div
  className={`angsuran-box ${getStatusClass(
    angsuran?.status
  )} ${!active ? "disabled" : ""}`}
onClick={(e) => {
  if (!active) return;

  const rect = e.currentTarget.getBoundingClientRect();

const popupWidth = 190;

let x = rect.left;

if (x + popupWidth > window.innerWidth) {
  x = window.innerWidth - popupWidth - 16;
}

setPopupPosition({
  x,
  y: rect.bottom + 6,
});

  setSelectedCell({
    key: cellKey,
    clientId: client.id,
    index: i,
  });
}}
>
                          {active
                            ? generateMonth(client.tanggalCair, i)
                            : "-"}
                        </div>

                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {selectedCell && (
  <div
    ref={popupRef}
    className="status-popup"
    style={{
      position: "fixed",
      left: popupPosition.x,
      top: popupPosition.y,
      zIndex: 9999,
    }}
  >

    <button
      className="status-option merah"
      onClick={() =>
        updateStatus(
          selectedCell.clientId,
          selectedCell.index,
          "merah",
          clients,
          setSelectedCell
        )
      }
    >
      <span className="dot"></span>
      Belum Bayar
    </button>

    <button
      className="status-option kuning"
      onClick={() =>
        updateStatus(
          selectedCell.clientId,
          selectedCell.index,
          "kuning",
          clients,
          setSelectedCell
        )
      }
    >
      <span className="dot"></span>
      Debitur
    </button>

    <button
      className="status-option hijau"
      onClick={() =>
        updateStatus(
          selectedCell.clientId,
          selectedCell.index,
          "hijau",
          clients,
          setSelectedCell
        )
      }
    >
      <span className="dot"></span>
      Manggala
    </button>

    <button
      className="status-option biru"
      onClick={() =>
        updateStatus(
          selectedCell.clientId,
          selectedCell.index,
          "biru",
          clients,
          setSelectedCell
        )
      }
    >
      <span className="dot"></span>
      Saldo Blokir
    </button>

  </div>
)}
      </div>
    </div>
  );
}