/**
 * Universal export standard: every export in THORKAN OS emits BOTH
 * an Excel (.xlsx) and a Word (.docx) artifact in a single action.
 */

export type ExportRow = Record<string, string | number>;

export type ExportPayload = {
  /** File + document title, e.g. "SECURITY_REPORT" */
  title: string;
  /** Module code, printed in the docx header */
  module?: string | undefined;
  /** Tabular data — sheet rows and docx table rows */
  rows: ExportRow[];
  /** Optional narrative paragraphs for the Word document */
  notes?: string[] | undefined;
};

function slug(value: string) {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

async function buildXlsx(payload: ExportPayload) {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(payload.rows.length ? payload.rows : [{ DATA: "EMPTY" }]);
  XLSX.utils.book_append_sheet(wb, ws, slug(payload.title).slice(0, 28) || "REPORT");
  if (payload.notes?.length) {
    const notes = XLSX.utils.aoa_to_sheet(payload.notes.map((n) => [n]));
    XLSX.utils.book_append_sheet(wb, notes, "NOTES");
  }
  const out = XLSX.write(wb, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  return new Blob([out], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

async function buildDocx(payload: ExportPayload) {
  const {
    Document,
    Packer,
    Paragraph,
    HeadingLevel,
    Table,
    TableRow,
    TableCell,
    TextRun,
    WidthType,
  } = await import("docx");

  const headers = Object.keys(payload.rows[0] ?? { DATA: "" });
  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: headers.map(
          (h) =>
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })],
            })
        ),
      }),
      ...payload.rows.map(
        (row) =>
          new TableRow({
            children: headers.map(
              (h) => new TableCell({ children: [new Paragraph(String(row[h] ?? ""))] })
            ),
          })
      ),
    ],
  });

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: payload.title, heading: HeadingLevel.HEADING_1 }),
          new Paragraph({
            text: `THORKAN OS // ${payload.module ?? "SYSTEM"} // GENERATED ${new Date().toUTCString()}`,
          }),
          new Paragraph(" "),
          table,
          new Paragraph(" "),
          ...(payload.notes ?? []).map((n) => new Paragraph(n)),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}

/** Generates and downloads .xlsx + .docx simultaneously. */
export async function exportReport(payload: ExportPayload) {
  const base = `${slug(payload.title) || "THORKAN_REPORT"}_${stamp()}`;
  const [xlsx, docx] = await Promise.all([buildXlsx(payload), buildDocx(payload)]);
  download(xlsx, `${base}.xlsx`);
  download(docx, `${base}.docx`);
  return base;
}