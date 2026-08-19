import { createFileRoute, Link } from "@tanstack/react-router";
import { createElement } from "react";
import { Shell } from "@/components/os/Shell";
import { PageHeader, Stat } from "@/components/os/Panel";
import { GRID_MODULES } from "@/components/os/modules";
import { useTelemetry } from "@/lib/os-hooks";

export const Route = createFileRoute("/hub")({
  head: () => ({
    meta: [
      { title: "Command Grid — THORKAN OS" },
      {
        name: "description",
        content:
          "Ten-module command central grid: security core, research matrix, AI feed, vehicle diagnostics, finance metrics and automation.",
      },
      { property: "og:title", content: "Command Grid — THORKAN OS" },
      {
        property: "og:description",
        content: "Ten-module cyberpunk command central grid with live metric badges.",
      },
    ],
  }),
  component: HubPage,
});

function HubPage() {
  const throughput = useTelemetry(4.2, 0.6);
  const latency = useTelemetry(12.4, 2);
  const nodes = useTelemetry(1402, 40);

  return (
    <Shell>
      <div className="space-y-4">
        <PageHeader
          title="COMMAND_CENTRAL // 10_GRID"
          subtitle="MODULAR SUBSYSTEM ROUTER // SECTOR_7"
        />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="THREAT LEVEL" value="DEFCON 2" sub="Intrusion attempts up 42%" tone="destructive" />
          <Stat label="NETWORK LATENCY" value={`${latency.toFixed(1)}ms`} sub="Nominal state active" />
          <Stat label="ENCRYPTED NODES" value={nodes.toFixed(0)} sub="98.2% security coverage" />
          <Stat label="DATA THROUGHPUT" value={`${throughput.toFixed(1)} GB/s`} sub="Egress monitoring enabled" />
        </div>

        <div className="grid grid-cols-1 gap-[1px] border border-border bg-border sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
          {GRID_MODULES.map((m) => (
            <Link
              key={m.id}
              to={m.to}
              className="group relative flex min-h-[190px] flex-col items-center justify-center gap-3 bg-card/50 p-4 transition-all hover:bg-primary/10 hover:shadow-[inset_0_0_40px_oklch(0.885_0.184_168/12%)]"
            >
              {createElement(m.icon, {
                className:
                  "h-8 w-8 text-primary/70 transition-all group-hover:scale-110 group-hover:text-primary",
              })}
              <p className="text-center text-[11px] tracking-[0.16em] text-foreground">
                {m.index} // {m.code}
              </p>
              <p className="os-label text-center">{m.blurb}</p>
              <span className="absolute right-2 bottom-2 text-[8px] tracking-[0.16em] text-primary/50">
                {m.badge}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  );
}