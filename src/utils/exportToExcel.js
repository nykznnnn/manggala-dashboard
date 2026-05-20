import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportToExcel = async (
  data,
  fileName = "laporan-client"
) => {

  // =========================
  // WORKBOOK
  // =========================

  const workbook = new ExcelJS.Workbook();

  const worksheet = workbook.addWorksheet("Clients");

  // =========================
  // COLUMN SETUP
  // =========================

worksheet.columns = Object.keys(data[0]).map((key) => {

  // hitung panjang terpanjang
  const maxLength = Math.max(
    key.length,
    ...data.map((row) =>
      String(row[key] || "").length
    )
  );

let width = Math.min(
  Math.max(maxLength + 5, 12),
  50
);

// kolom khusus
if (key === "No") width = 6;

return {
  header: key,
  key,
  width,
};
});

  // =========================
  // ADD ROWS
  // =========================

  data.forEach((item) => {
    worksheet.addRow(item);
  });

  // =========================
  // HEADER STYLE
  // =========================

  const headerRow = worksheet.getRow(1);

  headerRow.height = 28;

  headerRow.eachCell((cell) => {

    cell.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
      size: 12,
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1D4ED8" },
    };

    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // =========================
  // BODY STYLE
  // =========================

  worksheet.eachRow((row, rowNumber) => {

    // skip header
    if (rowNumber === 1) return;

    row.height = 24;

    row.eachCell((cell, colNumber) => {

      // alignment
      cell.alignment = {
        vertical: "middle",
        horizontal: "left",
        wrapText: true,
      };

      // border
      cell.border = {
        top: {
          style: "thin",
          color: { argb: "FFE2E8F0" },
        },

        left: {
          style: "thin",
          color: { argb: "FFE2E8F0" },
        },

        bottom: {
          style: "thin",
          color: { argb: "FFE2E8F0" },
        },

        right: {
          style: "thin",
          color: { argb: "FFE2E8F0" },
        },
      };

      // zebra rows
      if (rowNumber % 2 === 0) {

        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF8FAFC" },
        };
      }

// =========================
// KWITANSI LINK STYLE
// =========================

const header = worksheet
  .getRow(1)
  .getCell(colNumber)
  .value;

if (
  header === "Kwitansi" &&
  cell.value &&
  cell.value !== "-"
) {

  cell.font = {
    color: { argb: "FF2563EB" },
    underline: true,
  };
}
    });
  });

  // =========================
  // FREEZE HEADER
  // =========================

  worksheet.views = [
    {
      state: "frozen",
      ySplit: 1,
    },
  ];

  // =========================
  // GENERATE FILE
  // =========================

  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob(
    [buffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );

  saveAs(blob, `${fileName}.xlsx`);
};