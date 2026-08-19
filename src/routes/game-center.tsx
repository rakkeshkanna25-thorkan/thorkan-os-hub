import { createFileRoute } from "@tanstack/react-router";
import { Gamepad2, Users } from "lucide-react";
import { Shell } from "@/components/os/Shell";
import { CyberButton, Meter, PageHeader, Panel, Stat, Tag } from "@/components/os/Panel";
import { useTelemetry } from "@/lib/os-hooks";

export const Route = createFileRoute("/game-center")({
  head: () => ({
    meta: [
      { title: "Esports Telemetry — THORKAN OS" },
      {
        name: "description",
        content:
          "Cross-platform squad telemetry: server tick rates, player K/D matrices, franchise feeds and live patch logs.",
      },
      { property: "og:title", content: "Esports Telemetry — THORKAN OS" },
      {
        property: "og:description",
        content: "Squad performance vectors, player matrices and live patch feeds.",
      },
    ],
  }),
  component: GamePage,
});

const PLAYERS = [
  { name: "Viper_09", kd: 4.02, rank: "GODLIKE", score: 92 },
  { name: "Ghost_Specter", kd: 3.48, rank: "LEGEND", score: 78 },
  { name: "Rogue_Lead", kd: 2.91, rank: "ELITE", score: 64 },
];

const PATCHES = [
  ["14:22:04 // VIPER", "Minecraft build 1.20.5 optimized. Shaders updated for RTX 50 series compatibility."],
  ["13:45:12 // GAME_MASTER", "Free Fire India server migration test initiated. Latency expected to drop below 20ms."],
  ["12:18:00 // INTEL_FEED", "GTA 6: New map segment identified in data dump. Coordinate mapping 85% complete."],
  ["11:59:48 // SQUAD_BOT", "Viper_09 achieved 'Unstoppable' streak in Free Fire Max."],
];

function GamePage() {
  const ping = useTelemetry(12, 3);
  const fps = useTelemetry(144, 6);
  const loss = useTelemetry(0.02, 0.02);

  return (
    <Shell>
      <div className="space-y-4">
        <PageHeader
          title="ESPORTS TELEMETRY"
          subtitle="MULTIVERSE SYNC // ACTIVE SQUAD MONITORING"
          right={
            <div className="flex gap-2">
              <Stat label="PING" value={`${ping.toFixed(0)}ms`} />
              <Stat label="FPS" value={fps.toFixed(0)} />
              <Stat label="PKT LOSS" value={`${loss.toFixed(2)}%`} tone="warning" />
            </div>
          }
        />

        <div className="grid gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Panel
            title="TEAM PERFORMANCE VECTOR"
            right={
              <span className="flex gap-2">
                <Tag>LIVE DATA</Tag>
                <Tag tone="muted">SCALED X100</Tag>
              </span>
            }
          >
            <div className="os-grid-bg relative h-52 border border-border bg-background/50">
              <svg viewBox="0 0 100 40" className="h-full w-full" preserveAspectRatio="none">
                <polyline
                  points="0,32 12,28 24,30 36,20 48,24 60,12 72,16 84,8 100,10"
                  fill="none"
                  stroke="var(--chart-1)"
                  strokeWidth="0.6"
                />
                <polyline
                  points="0,36 12,34 24,30 36,32 48,26 60,28 72,22 84,24 100,18"
                  fill="none"
                  stroke="var(--chart-2)"
                  strokeWidth="0.6"
                  strokeDasharray="2 2"
                />
              </svg>
              <p className="os-label absolute top-2 left-2">CROSS-PLATFORM ENGAGEMENT METRICS</p>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                ["MINECRAFT", "SERVER: MYTHIC-OPEN-01", ["ACTIVE PLAYERS", "1,244"], ["WORLD LATENCY", "42ms"], ["TICK RATE", "19.8 TPS"]],
                ["FREE FIRE MAX", "REGION: SE ASIA / INDIA", ["TOURNAMENT RANK", "#4 GLOBAL"], ["K/D RATIO", "60.4%"], ["MATCHES TODAY", "120 SQUADS"]],
              ].map((g) => (
                <div key={g[0] as string} className="border border-border p-2">
                  <div className="os-scanlines mb-2 grid h-20 place-items-center border border-border bg-gradient-to-br from-primary/20 to-background">
                    <Gamepad2 className="h-6 w-6 text-primary/70" />
                  </div>
                  <p className="text-[11px] text-primary">{g[0] as string}</p>
                  <p className="os-label">{g[1] as string}</p>
                  <div className="mt-2 space-y-1">
                    {(g.slice(2) as string[][]).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-2 text-[9px]">
                        <span className="truncate text-muted-foreground">{k}</span>
                        <span className="shrink-0 text-foreground">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <div className="space-y-3">
            <Panel title="PLAYER MATRICES" right={<Users className="h-3 w-3" />}>
              <div className="space-y-3">
                {PLAYERS.map((p) => (
                  <div key={p.name} className="border border-border p-2">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[11px] text-foreground">{p.name}</span>
                      <Tag>{p.rank}</Tag>
                    </div>
                    <Meter label={`K/D: ${p.kd}`} value={p.score} />
                  </div>
                ))}
                <CyberButton className="w-full">EXPORT SQUAD DATA</CyberButton>
              </div>
            </Panel>

            <Panel title="PATCH LOG FEED" right="LISTENING FOR DATA…">
              <div className="max-h-52 space-y-2 overflow-y-auto">
                {PATCHES.map(([meta, body]) => (
                  <div key={meta} className="border-l-2 border-primary/50 pl-2">
                    <p className="text-[9px] text-primary">{meta}</p>
                    <p className="text-[10px] leading-relaxed text-muted-foreground">{body}</p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </Shell>
  );
}