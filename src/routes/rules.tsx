import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Boxes, Database, GitBranch, Play, Save, Zap } from "lucide-react";
import { Shell } from "@/components/os/Shell";
import { CyberButton, Meter, PageHeader, Panel, Stat, Tag } from "@/components/os/Panel";
import { useInterval } from "@/lib/os-hooks";

export const Route = createFileRoute("/rules")({
  head: () => ({
    meta: [
      { title: "Rule Engine Builder — THORKAN OS" },
      {
        name: "description",
        content:
          "Visual node workflow editor, memory stack orchestration and live script stream logs for the THORKAN OS rule engine.",
      },
      { property: "og:title", content: "Rule Engine Builder — THORKAN OS" },
      {
        property: "og:description",
        content: "Wire triggers, conditions and actions on a node graph with live execution logs.",
      },
    ],
  }),
  component: RulesPage,
});

type NodeKind = "trigger" | "condition" | "action" | "memory";
type GraphNode = { id: string; kind: NodeKind; label: string; sub: string; x: number; y: number };

const NODES: GraphNode[] = [
  { id: "n1", kind: "trigger", label: "WEBHOOK_IN", sub: "POST /ingest", x: 40, y: 40 },
  { id: "n2", kind: "trigger", label: "CRON_TICK", sub: "*/15 * * * *", x: 40, y: 210 },
  { id: "n3", kind: "condition", label: "THREAT_SCORE", sub: "> 0.74", x: 290, y: 60 },
  { id: "n4", kind: "memory", label: "VECTOR_RECALL", sub: "k=8 · ns:intel", x: 290, y: 220 },
  { id: "n5", kind: "action", label: "LOCK_PERIMETER", sub: "sys.home.arm()", x: 540, y: 30 },
  { id: "n6", kind: "action", label: "DISPATCH_ALERT", sub: "signal://ops", x: 540, y: 150 },
  { id: "n7", kind: "action", label: "WRITE_LEDGER", sub: "db.events.insert", x: 540, y: 265 },
];

const EDGES: [string, string][] = [
  ["n1", "n3"],
  ["n2", "n4"],
  ["n3", "n5"],
  ["n3", "n6"],
  ["n4", "n6"],
  ["n4", "n7"],
];

const KIND_STYLE: Record<NodeKind, { border: string; text: string; chip: string }> = {
  trigger: { border: "border-primary/60", text: "text-primary", chip: "TRIGGER" },
  condition: { border: "border-warning/60", text: "text-warning", chip: "CONDITION" },
  action: { border: "border-accent/60", text: "text-accent", chip: "ACTION" },
  memory: { border: "border-chart-3/60", text: "text-chart-3", chip: "MEMORY" },
};

const NODE_W = 168;
const NODE_H = 58;

function NodeGraph({
  selected,
  onSelect,
  activeId,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
  activeId: string;
}) {
  const byId = useMemo(() => Object.fromEntries(NODES.map((n) => [n.id, n])), []);

  return (
    <div className="os-grid-bg os-scanlines relative overflow-x-auto border border-border">
      <div className="relative h-[360px] w-[740px]">
        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          {EDGES.map(([from, to]) => {
            const a = byId[from]!;
            const b = byId[to]!;
            const x1 = a.x + NODE_W;
            const y1 = a.y + NODE_H / 2;
            const x2 = b.x;
            const y2 = b.y + NODE_H / 2;
            const mid = (x1 + x2) / 2;
            const live = activeId === from || activeId === to;
            return (
              <path
                key={`${from}-${to}`}
                d={`M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2},${y2}`}
                fill="none"
                stroke={live ? "var(--primary)" : "var(--border)"}
                strokeWidth={live ? 1.6 : 1}
                strokeDasharray="4 4"
              />
            );
          })}
        </svg>

        {NODES.map((n) => {
          const s = KIND_STYLE[n.kind];
          const isSel = selected === n.id;
          const isActive = activeId === n.id;
          return (
            <button
              key={n.id}
              onClick={() => onSelect(n.id)}
              style={{ left: n.x, top: n.y, width: NODE_W, height: NODE_H }}
              className={`os-panel os-corner absolute px-2 py-1.5 text-left transition-all ${s.border} ${
                isSel ? "os-panel-active" : ""
              } ${isActive ? "animate-pulse-ring" : ""}`}
            >
              <span className={`text-[8px] tracking-[0.18em] ${s.text}`}>{s.chip}</span>
              <p className="truncate text-[11px] font-bold text-foreground">{n.label}</p>
              <p className="truncate text-[9px] text-muted-foreground">{n.sub}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const MEMORY_STACK = [
  { label: "SHORT_TERM_BUFFER", value: 68, detail: "1.2K tokens · ttl 15m" },
  { label: "EPISODIC_LEDGER", value: 42, detail: "8.4K events" },
  { label: "VECTOR_NAMESPACE", value: 81, detail: "intel · 24.1K vecs" },
  { label: "RULE_CACHE", value: 27, detail: "112 compiled rules" },
];

const LOG_LINES = [
  "[RUN] trigger:WEBHOOK_IN accepted payload 1.42kb",
  "[EVAL] condition:THREAT_SCORE → 0.812 :: PASS",
  "[MEM ] vector_recall k=8 ns=intel latency=41ms",
  "[ACT ] sys.home.arm() → perimeter LOCKED",
  "[ACT ] dispatch_alert signal://ops → ack 200",
  "[DB  ] db.events.insert id=evt_7fa21c committed",
  "[GC  ] short_term_buffer pruned 214 tokens",
  "[RUN] cron_tick fired schedule=*/15",
  "[WARN] rule_cache miss → recompiling RULE_44",
  "[OK  ] pipeline complete in 1.284s",
];

function RulesPage() {
  const [selected, setSelected] = useState<string | null>("n3");
  const [running, setRunning] = useState(true);
  const [cursor, setCursor] = useState(0);
  const [logs, setLogs] = useState<string[]>(LOG_LINES.slice(0, 6));

  useInterval(
    () => {
      setCursor((c) => (c + 1) % NODES.length);
      setLogs((prev) => {
        const next = LOG_LINES[(prev.length + 3) % LOG_LINES.length]!;
        return [...prev.slice(-40), next];
      });
    },
    running ? 1400 : null
  );

  const node = NODES.find((n) => n.id === selected) ?? null;

  return (
    <Shell>
      <div className="space-y-4">
        <PageHeader
          title="RULE ENGINE BUILDER"
          subtitle="RULE.ENGINE_BUILDER // NODE_ORCHESTRATION v3.1"
          right={
            <div className="flex gap-2">
              <CyberButton onClick={() => setRunning((r) => !r)}>
                <Play className="h-3 w-3" />
                {running ? "PAUSE_ENGINE" : "RUN_ENGINE"}
              </CyberButton>
              <CyberButton tone="ghost">
                <Save className="h-3 w-3" />
                COMMIT
              </CyberButton>
            </div>
          }
        />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="ACTIVE_RULES" value="112" sub="7 graphs deployed" />
          <Stat label="EXEC / MIN" value="428" sub="p95 1.28s" />
          <Stat label="FAILURE_RATE" value="0.42%" tone="warning" sub="2 retries queued" />
          <Stat
            label="ENGINE_STATE"
            value={running ? "LIVE" : "HALTED"}
            tone={running ? "primary" : "warning"}
            sub="workerd runtime"
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Panel
            title="VISUAL NODE WORKFLOW EDITOR"
            right={<GitBranch className="h-3 w-3" />}
            bodyClassName="p-2"
          >
            <NodeGraph
              selected={selected}
              onSelect={setSelected}
              activeId={NODES[cursor]!.id}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {(Object.keys(KIND_STYLE) as NodeKind[]).map((k) => (
                <Tag key={k} tone={k === "condition" ? "warning" : k === "memory" ? "muted" : "primary"}>
                  {KIND_STYLE[k].chip}
                </Tag>
              ))}
            </div>
          </Panel>

          <div className="space-y-4">
            <Panel title="NODE INSPECTOR" right={<Boxes className="h-3 w-3" />}>
              {node ? (
                <div className="space-y-2 text-[10px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="os-label">ID</span>
                    <span className="text-primary">{node.id.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="os-label">KIND</span>
                    <span className={KIND_STYLE[node.kind].text}>{KIND_STYLE[node.kind].chip}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="os-label">LABEL</span>
                    <span className="truncate text-foreground">{node.label}</span>
                  </div>
                  <div className="border border-border bg-secondary/40 p-2 font-mono text-[9px] text-muted-foreground">
                    {`{ "op": "${node.label.toLowerCase()}", "expr": "${node.sub}" }`}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <CyberButton tone="ghost" className="flex-1">
                      <Zap className="h-3 w-3" />
                      TEST_NODE
                    </CyberButton>
                  </div>
                </div>
              ) : (
                <p className="os-label">SELECT A NODE</p>
              )}
            </Panel>

            <Panel title="MEMORY STACK ORCHESTRATION" right={<Database className="h-3 w-3" />}>
              <div className="space-y-3">
                {MEMORY_STACK.map((m, i) => (
                  <div key={m.label}>
                    <Meter label={m.label} value={m.value} tone={i === 2 ? "accent" : "primary"} />
                    <p className="mt-1 text-[9px] text-muted-foreground">{m.detail}</p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>

        <Panel title="SCRIPT STREAM LOGS" right={running ? "STREAMING" : "PAUSED"}>
          <div className="max-h-[240px] overflow-y-auto bg-background/60 p-2 font-mono text-[10px] leading-relaxed">
            {logs.map((l, i) => (
              <p
                key={`${i}-${l}`}
                className={
                  l.startsWith("[WARN")
                    ? "text-warning"
                    : l.startsWith("[OK")
                      ? "text-primary"
                      : "text-muted-foreground"
                }
              >
                <span className="text-primary/50">{String(i).padStart(3, "0")} </span>
                {l}
              </p>
            ))}
          </div>
        </Panel>
      </div>
    </Shell>
  );
}