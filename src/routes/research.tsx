import { createFileRoute } from "@tanstack/react-router";
import { FileText, Sparkles } from "lucide-react";
import { useState } from "react";
import { Shell } from "@/components/os/Shell";
import { CyberButton, PageHeader, Panel, Tag } from "@/components/os/Panel";
import { useLocalStorage } from "@/lib/os-hooks";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research Matrix — THORKAN OS" },
      {
        name: "description",
        content:
          "Vector document vault with a tactical markdown reader, abstract synthesis terminal and linked citation tracking.",
      },
      { property: "og:title", content: "Research Matrix — THORKAN OS" },
      {
        property: "og:description",
        content: "Source vault, document reader and AI synthesis terminal for tactical intel.",
      },
    ],
  }),
  component: ResearchPage,
});

const DOCS = [
  { id: "d1", kind: "PDF", title: "Quantum Encryption Standards 2024", age: "2h ago", tag: "VOL_2" },
  { id: "d2", kind: "INTEL", title: "Satellite Uplink Vulnerability Mapping", age: "14h ago", tag: "CONF" },
  { id: "d3", kind: "DOC", title: "Deep Learning for Radar Signature…", age: "1d ago", tag: "OPEN" },
];

function ResearchPage() {
  const [active, setActive] = useState(DOCS[0]!.id);
  const [citations, setCitations] = useLocalStorage<Record<string, boolean>>("thorkan.citations", {
    kyber: true,
    latency: false,
  });
  const doc = DOCS.find((d) => d.id === active) ?? DOCS[0]!;

  return (
    <Shell>
      <div className="space-y-4">
        <PageHeader
          title="RESEARCH MATRIX"
          subtitle="LAB.INTEL_RESEARCH // DOC_VECTOR_DB"
          right={<Tag>PAGES: 12 / 84</Tag>}
        />
        <div className="grid gap-3 xl:grid-cols-[220px_minmax(0,2fr)_280px]">
          <Panel title="SOURCE_VAULT">
            <ul className="space-y-2">
              {DOCS.map((d) => (
                <li key={d.id}>
                  <button
                    onClick={() => setActive(d.id)}
                    className={`w-full border p-2 text-left transition-colors ${
                      active === d.id
                        ? "border-primary/60 bg-primary/10"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Tag>{d.kind}</Tag>
                      <span className="text-[8px] text-muted-foreground">{d.tag}</span>
                    </div>
                    <p className="mt-1 text-[10px] leading-snug text-foreground">{d.title}</p>
                    <p className="os-label mt-1">{d.age}</p>
                  </button>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="STRATEGIC_DOCUMENT_VIEWER" right={<FileText className="h-3 w-3" />}>
            <article className="space-y-3 bg-background/40 p-3 text-[11px] leading-relaxed text-foreground/90">
              <h3 className="text-sm text-primary">{doc.title}</h3>
              <p className="os-label">
                Author: Unit 734 | Classification: TOP SECRET | Date: Oct 2024
              </p>
              <p>
                <span className="text-primary">Abstract:</span> The proliferation of Shor's
                algorithm-capable processors necessitates a paradigm shift in frontline tactical
                communications. This research explores the integration of lattice-based cryptography
                into existing signal arrays.
              </p>
              <blockquote className="border-l-2 border-primary/60 bg-primary/5 p-2 text-accent italic">
                "We observe a 45% increase in overhead when implementing Kyber-768 parameters in
                low-bandwidth environments."
              </blockquote>
              <pre className="overflow-x-auto border border-border bg-background/70 p-2 font-mono text-[10px] text-accent">
                {`> init_kem(KYBER_768)
> derive_shared(secret, peer_pk)
> latency_delta = +120ms  // SECTOR_9`}
              </pre>
              <p>
                Preliminary field tests in the Sector 9 grid suggest that current hardware can
                support these protocols if optimization cycles are prioritized. Figure 1.4 details
                the latency vs security trade-off observed during the recent "Signal 99" exercises.
              </p>
            </article>
          </Panel>

          <Panel title="SYNTHESIS_TERMINAL" right={<Sparkles className="h-3 w-3" />}>
            <div className="space-y-3">
              <div className="border border-primary/40 bg-primary/5 p-2">
                <p className="os-label text-primary">AI_SUMMARY::ABSTRACT</p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  The document focuses on lattice-based cryptography for tactical systems, noting
                  significant overhead in low-bandwidth scenarios.
                </p>
              </div>
              <div className="border border-border p-2">
                <p className="text-[10px] text-accent">
                  How does the latency affect command chain response times?
                </p>
              </div>
              <div className="border border-border bg-secondary/40 p-2">
                <p className="text-[10px] text-muted-foreground">
                  Based on CITATION-12, command latency increases by 120ms. This may trigger a
                  "Yellow" status for real-time drone control loops. Recommend offloading key
                  exchanges to edge nodes.
                </p>
              </div>
              <div>
                <p className="os-label mb-2">LINKED_CITATIONS</p>
                {[
                  ["kyber", "Kyber Parameters in Sector 9"],
                  ["latency", "Latency Deviations (FIG 1.4)"],
                ].map(([k, label]) => (
                  <label
                    key={k}
                    className="flex items-center gap-2 py-1 text-[10px] text-muted-foreground"
                  >
                    <Checkbox
                      checked={!!citations[k as string]}
                      onCheckedChange={(v) =>
                        setCitations((c) => ({ ...c, [k as string]: Boolean(v) }))
                      }
                    />
                    <span className="truncate">{label}</span>
                  </label>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <CyberButton>SUMMARIZE</CyberButton>
                <CyberButton tone="ghost">EXPORT CITATION</CyberButton>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </Shell>
  );
}