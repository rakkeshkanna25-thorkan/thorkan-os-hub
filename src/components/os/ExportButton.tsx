import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { exportReport, type ExportRow } from "@/lib/os-export";

/**
 * Universal export control — always emits .xlsx AND .docx together.
 */
export function ExportButton({
  label = "EXPORT REPORT",
  title,
  module,
  rows,
  notes,
  tone = "primary",
  className,
}: {
  label?: string;
  title: string;
  module?: string;
  rows: ExportRow[] | (() => ExportRow[]);
  notes?: string[];
  tone?: "primary" | "ghost" | "danger";
  className?: string;
}) {
  const [busy, setBusy] = useState(false);

  const cls = {
    primary:
      "border-primary/60 bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-[0_0_18px_var(--ring)]",
    ghost: "border-border text-muted-foreground hover:border-primary/50 hover:text-primary",
    danger: "border-destructive/60 bg-destructive/10 text-destructive hover:bg-destructive/25",
  }[tone];

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          const data = typeof rows === "function" ? rows() : rows;
          const base = await exportReport({ title, module, rows: data, notes });
          toast.success("DUAL_EXPORT_COMPLETE", {
            description: `${base}.xlsx + ${base}.docx written to local disk`,
          });
        } catch (err) {
          toast.error("EXPORT_FAILED", { description: String(err) });
        } finally {
          setBusy(false);
        }
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 border px-3 py-1.5 text-[10px] tracking-[0.16em] uppercase transition-all disabled:opacity-60",
        cls,
        className
      )}
    >
      {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
      {busy ? "GENERATING XLSX + DOCX" : label}
      <span className="hidden text-[8px] text-muted-foreground sm:inline">[XLSX+DOCX]</span>
    </button>
  );
}