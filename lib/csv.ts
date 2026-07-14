/**
 * Tiny CSV builder for the admin export endpoints. No dependencies —
 * RFC-4180-style quoting plus a guard against spreadsheet formula injection.
 */

/** Quote one cell. Nullish → empty; formula-looking cells are neutralized so a
 *  malicious submission can't become a live formula when opened in Excel.
 *  Covers leading = + - @, leading tab / carriage return, and the
 *  leading-whitespace-then-formula variants some spreadsheets still parse. */
export function escapeCsvCell(value: unknown): string {
  let s = value === null || value === undefined ? "" : String(value);
  if (/^[\t\r]/.test(s) || /^\s*[=+\-@]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

/** Header row + data rows → one CRLF-joined CSV string. */
export function toCsv(headers: string[], rows: unknown[][]): string {
  return [headers, ...rows]
    .map((row) => row.map(escapeCsvCell).join(","))
    .join("\r\n");
}

/** Wrap a CSV string as a download Response. The BOM makes Excel detect UTF-8. */
export function csvResponse(baseName: string, csv: string): Response {
  const date = new Date().toISOString().slice(0, 10);
  return new Response("\uFEFF" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ctr-foodworks-${baseName}-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
