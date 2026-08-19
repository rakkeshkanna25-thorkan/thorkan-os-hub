import { createFileRoute } from "@tanstack/react-router";
import { Activity, TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Shell } from "@/components/os/Shell";
import { CyberButton, Meter, PageHeader, Panel, Stat, Tag } from "@/components/os/Panel";
import { useSeries, useTelemetry } from "@/lib/os-hooks";

export const Route = createFileRoute("/ai-feed")({
  head: () => ({
    meta: [
      { title: "AI Creation Feed — THORKAN OS" },
      {
        name: "description",
        content:
          "Automated intelligence monitoring: trending model leaderboard, scraper health, pipeline logs and deployment status.",
      },
      { property: "og:title", content: "AI Creation Feed — THORKAN OS" },
      {
        property: "og:description",
        content: "Model leaderboard, scraper telemetry and live AI intelligence briefs.",
      },
    ],
  }),
  component: AiFeedPage,
});

const MODELS = [
  { name: "GPT-5-ALPHA-PREVIEW", delta: "+41%", score: 92 },
  { name: "CLAUDE-3.6-OPUS", delta: "+19%", score: 78 },
  { name: "GEMINI-2-PRO", delta: "+8%", score: 61 },
];

const PIPELINE = [
  "[12:44:02] SCRAPER_ENG_04  Parsed 42 articles from arxiv.org",
  "[12:44:05] ML_NLP_01  Classifying: 'Neuro-symbolic architectures' -> HIGH",
  "[12:44:11] VECTOR_DB  Upsert 256 embeddings // dim 1536",
  "[12:44:19] API_BRIDGE  Sync OK // latency 24ms",
  "[12:44:31] GEN_LAYER_4  Draft brief compiled",
];

function AiFeedPage() {
  const series = useSeries(24, 60, 12);
  const latency = useTelemetry(24, 6);
  const parsed = useTelemetry(142, 6);

  return (
    <Shell>
      <div className="space-y-4">
        <PageHeader
          title="AI CREATION FEED"
          subtitle="AUTOMATED INTELLIGENCE MONITORING // CHANNEL: #SIG-ALPHA-9"
          right={
            <span className="flex gap-2">
              <Tag>● LIVE DATASTREAM</Tag>
              <Tag tone="muted">SCRAPER: NOMINAL</Tag>
            </span>
          }
        />

        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div className="space-y-3">
            <Panel title="TRENDING MODELS" right={<TrendingUp className="h-3 w-3 text-primary" />}>
              <div className="space-y-3">
                {MODELS.map((m) => (
                  <div key={m.name}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[10px] text-foreground">{m.name}</span>
                      <span className="shrink-0 text-[10px] text-primary">{m.delta}</span>
                    </div>
                    <Meter label="BENCHMARK INDEX" value={m.score} />
                  </div>
                ))}
                <CyberButton tone="ghost" className="w-full">
                  VIEW ALL MODEL METRICS
                </CyberButton>
              </div>
            </Panel>
            <Panel title="SCRAPER HEALTH" right={<Activity className="h-3 w-3 text-primary" />}>
              <div className="grid grid-cols-2 gap-3">
                <Stat label="SOURCES" value={`${parsed.toFixed(0)}/150`} />
                <Stat label="LATENCY" value={`${latency.toFixed(0)}ms`} />
              </div>
              <div className="mt-3 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={series}>
                    <defs>
                      <linearGradient id="aifeed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="i" hide />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        fontSize: 10,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke="var(--chart-1)"
                      fill="url(#aifeed)"
                      strokeWidth={1.5}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>

          <div className="space-y-3">
            <Panel title="PRIORITY BRIEF" right="ID: 06 // DIGITAL_SENTINEL">
              <div className="os-scanlines relative h-40 overflow-hidden border border-border bg-gradient-to-br from-primary/25 via-background to-background">
                <div className="os-grid-bg absolute inset-0" />
                <div className="absolute bottom-2 left-2 flex gap-2">
                  <Tag tone="destructive">BREAKING</Tag>
                  <Tag tone="muted">2H AGO</Tag>
                </div>
              </div>
              <h3 className="mt-3 text-sm text-primary">
                Project Stargate: $100B AI Infrastructure Initiative Confirmed
              </h3>
              <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
                The massive computational facility aimed at housing millions of specialized AI chips
                is entering its final architectural phase, signaling a new era of model training
                capabilities.
              </p>
              <CyberButton className="mt-3">READ INTELLIGENCE BRIEF →</CyberButton>
            </Panel>

            <div className="grid gap-3 sm:grid-cols-2">
              <Panel title="RESEARCH UPDATE">
                <h4 className="text-[11px] text-foreground">
                  Recursive Self-Improvement Loop Detected in Lab Tests
                </h4>
                <p className="mt-2 text-[10px] text-muted-foreground">
                  Autonomous agent systems have demonstrated the ability to rewrite their own neural
                  weight optimization scripts, yielding a 3.1% delta.
                </p>
                <p className="os-label mt-2">◆ 24 // SIGNAL 88%</p>
              </Panel>
              <Panel title="MARKET ALERT">
                <h4 className="text-[11px] text-foreground">
                  NVIDIA Unveils 'Blackwell' Successor: Project Obsidian
                </h4>
                <p className="mt-2 text-[10px] text-muted-foreground">
                  A new silicon architecture promising 10x throughput for inference tasks was leaked
                  today, causing major ripples across GPU futures.
                </p>
                <p className="os-label mt-2">◆ 112 // SIGNAL 65%</p>
              </Panel>
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <Panel title="PIPELINE LOGS" right="LAST SYNC: 7:00:04:12">
                <div className="max-h-32 overflow-y-auto font-mono text-[10px] text-accent">
                  {PIPELINE.map((l) => (
                    <p key={l}>{l}</p>
                  ))}
                </div>
              </Panel>
              <Panel title="DEPLOYMENT STATUS">
                <div className="space-y-2">
                  {[
                    ["Main Net (SIG-ALPHA)", "STABLE"],
                    ["Shadow Net (BETA)", "SYNCING"],
                    ["Edge Cache", "STABLE"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-2">
                      <span className="truncate text-[10px] text-muted-foreground">{k}</span>
                      <Tag tone={v === "STABLE" ? "primary" : "warning"}>{v}</Tag>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}