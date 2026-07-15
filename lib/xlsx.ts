import ExcelJS from "exceljs";
import { EXPORT_LOGO_B64, EXPORT_LOGO_EXT } from "./export-logo";

/**
 * Branded Excel (.xlsx) export builder. Every workbook gets the CTR Food
 * Works logo floating over the first rows, a title block, and an accent
 * header row with a frozen top pane. Served with attachment headers so the
 * browser downloads a ready-to-open Excel file.
 */

const BRAND = "CTR Food Works";
const SLUG = "ctr-foodworks";
const ACCENT_ARGB = "FFC43725";
const MUTED_ARGB = "FF828B9E";

type Cell = string | number | null | undefined;

export async function xlsxFromTable(
  baseName: string,
  sheetName: string,
  title: string,
  headers: string[],
  rows: Cell[][],
  widths?: number[],
): Promise<Response> {
  const wb = new ExcelJS.Workbook();
  wb.creator = BRAND;

  const HEADER_ROW = 7;
  const ws = wb.addWorksheet(sheetName, {
    views: [{ state: "frozen", ySplit: HEADER_ROW }],
  });

  // Brand logo floats over the top-left rows.
  const imgId = wb.addImage({ base64: EXPORT_LOGO_B64, extension: "png" });
  ws.addImage(imgId, {
    tl: { col: 0.15, row: 0.4 },
    ext: EXPORT_LOGO_EXT,
  });

  // Title block under the logo area.
  const titleCell = ws.getCell(5, 1);
  titleCell.value = `${BRAND} — ${title}`;
  titleCell.font = { bold: true, size: 14 };
  const generated = ws.getCell(6, 1);
  generated.value = `Generated ${new Date().toISOString().slice(0, 10)}`;
  generated.font = { size: 10, color: { argb: MUTED_ARGB } };

  // Accent header row.
  const hr = ws.getRow(HEADER_ROW);
  headers.forEach((h, i) => {
    const c = hr.getCell(i + 1);
    c.value = h;
    c.font = { bold: true, size: 11, color: { argb: "FFFFFFFF" } };
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: ACCENT_ARGB } };
    c.alignment = { vertical: "middle" };
  });
  hr.height = 20;

  for (const row of rows) {
    ws.addRow(row.map((v) => (v === null || v === undefined ? "" : v)));
  }

  const colWidths = widths ?? headers.map(() => 22);
  colWidths.forEach((w, i) => {
    ws.getColumn(i + 1).width = w;
  });

  const buf = await wb.xlsx.writeBuffer();
  const date = new Date().toISOString().slice(0, 10);
  return new Response(buf as unknown as BodyInit, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${SLUG}-${baseName}-${date}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
