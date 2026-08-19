import { createFileRoute } from "@tanstack/react-router";
import { Bitcoin, Coins, Filter } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Shell } from "@/components/os/Shell";
import { PageHeader, Panel, Stat, Tag } from "@/components/os/Panel";
import { useSeries, useTelemetry } from "@/lib/os-hooks";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics Hub — THORKAN OS" },
      {
        name: "description",
        content:
          "Financial matrix with commodity and crypto tickers, equity performance vectors, sync metrics and freelance delivery milestones.",
      },
      { property: "og:title", content: "Analytics Hub — THORKAN OS" },
      {
        property: "og:description",
        content: "Live commodities, equity charts and delivery milestone orchestration.",
      },
    ],
  }),
  component: AnalyticsPage,
});

const MILESTONES = [
  ["UI_REDACT", "COMPLETED"],
  ["CORE_BACKEND", "COMPLETED"],
  ["API_BRIDGE", "PROCESSING"],
  ["STRESS_TEST", "QUEUED"],
  ["DEPLOY_MAIN", "STANDBY"],
] as const;

function Ring({ label, sub, value }: { label: string; sub: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-3 border border-border p-2">
      <div className="min-w-0">
        <p className="truncate text-[11px] text-foreground">{label}</p>
        <p className="os-label truncate">{sub}</p>
      </div>
      <div
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[10px] text-primary"
        style={{
          background: `conic-gradient(var(--primary) ${value}%, var(--secondary) ${value}% 100%)`,
        }}
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-card">{value}%</span>
      </div>
    </div>
  );
}

function AnalyticsPage() {
  const tech = useSeries(28, 60, 14, 2200);
  const btc = useTelemetry(63492, 420);
  const gold = useTelemetry(2042.3, 6);
  const silver = useTelemetry(23.14, 0.3);

  return (
    <Shell>
      <div className="space-y-4">
        <PageHeader
          title="ANALYTICS HUB"
          subtitle="METRIC.SAAS_FINANCE // REAL_TIME_STREAM"
          right={<Tag>MRR: $42.5K</Tag>}
        />

        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div className="space-y-3">
            <Panel title="FINANCIAL MATRIX">
              <ul className="space-y-2">
                {[
                  ["GOLD_AU", "COMMODITY MARKET", `$${gold.toFixed(2)}`, "+0.84%", Coins],
                  ["SILVER_AG", "COMMODITY MARKET", `$${silver.toFixed(2)}`, "-0.12%", Coins],
                  ["BITCOIN_BTC", "CRYPTO ASSET", `$${btc.toFixed(0)}`, "+4.21%", Bitcoin],
                ].map(([code, market, price, delta, Icon]) => {
                  const IconC = Icon as typeof Coins;
                  const down = String(delta).startsWith("-");
                  return (
                    <li
                      key={String(code)}
                      className="flex items-center justify-between gap-3 border border-border p-2"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <IconC className="h-4 w-4 shrink-0 text-primary" />
                        <div className="min-w-0">
                          <p className="truncate text-[10px] text-foreground">{String(code)}</p>
                          <p className="os-label truncate">{String(market)}</p>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[11px] text-foreground">{String(price)}</p>
                        <p className={cn("text-[9px]", down ? "text-destructive" : "text-primary")}>
                          {String(delta)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Panel>

            <Panel title="SYNC METRICS">
              <div className="space-y-2">
                <Ring label="Goal Achievements" sub="FISCAL QUARTER 3" value={75} />
                <Ring label="Fitness Sync" sub="BIOMETRIC STREAM" value={38} />
                <Ring label="Office Completion" sub="PROJECT NODE 4/12" value={92} />
              </div>
            </Panel>
          </div>

          <div className="space-y-3">
            <Panel
              title="EQUITY PERFORMANCE MATRIX"
              right={
                <span className="flex gap-2">
                  <Tag>● TECH_NODE</Tag>
                  <Tag tone="muted">● RETAIL_SEC</Tag>
                </span>
              }
            >
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={tech}>
                    <defs>
                      <linearGradient id="equity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.45} />
                        <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="i" hide />
                    <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
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
                      fill="url(#equity)"
                      strokeWidth={1.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-4">
                <Stat label="HIGH PROFIT TRACKER" value="+28.4%" />
                <Stat label="AVERAGE YIELD" value="12.2%" />
                <Stat label="VOLATILITY INDEX" value="0.14" tone="warning" />
                <Stat label="STATUS" value="OPTIMIZED" />
              </div>
            </Panel>

            <Panel title="FREELANCE DELIVERY MILESTONES" right={<Filter className="h-3 w-3" />}>
              <div className="relative mt-4 grid grid-cols-5 gap-2">
                <div className="absolute top-[5px] right-[10%] left-[10%] h-[1px] bg-border" />
                {MILESTONES.map(([name, state]) => {
                  const done = state === "COMPLETED";
                  const live = state === "PROCESSING";
                  return (
                    <div key={name} className="relative min-w-0 text-center">
                      <span
                        className={cn(
                          "relative z-10 mx-auto block h-3 w-3 rounded-full border",
                          done
                            ? "border-primary bg-primary"
                            : live
                              ? "animate-pulse-ring border-primary bg-background"
                              : "border-border bg-background"
                        )}
                      />
                      <p className="mt-2 truncate text-[9px] text-foreground">{name}</p>
                      <p
                        className={cn(
                          "truncate text-[8px]",
                          done ? "text-primary" : live ? "text-warning" : "text-muted-foreground"
                        )}
                      >
                        {state}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Panel>

            <Panel title="LIVE ORCHESTRATION LOGS">
              <div className="max-h-32 overflow-y-auto font-mono text-[10px] text-accent">
                <p>[14:22:51] FIN_MATRIX: Pulling real-time commodities data from Global_Gateway_01…</p>
                <p>[14:22:55] SUCCESS: Asset GOLD_AU updated (+0.84%).</p>
                <p>[14:23:12] SYNC: Biometric fitness stream handshake established (Encrypted).</p>
                <p>[14:23:38] MILESTONE: API_BRIDGE construction at 68.2% completion.</p>
                <p>[14:23:55] ALERT: Minor latency detected in RETAIL_SEC data packet. Retrying…</p>
                <p>[14:32:50] NORMALIZED: System heartbeat steady at 144bpm logic cycles.</p>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </Shell>
  );
}