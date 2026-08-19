import { createFileRoute } from "@tanstack/react-router";
import { Camera, Lightbulb, Lock, ShieldAlert, Thermometer } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Shell } from "@/components/os/Shell";
import { CyberButton, PageHeader, Panel, Tag } from "@/components/os/Panel";
import { useLocalStorage, useSeries, useTelemetry } from "@/lib/os-hooks";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

export const Route = createFileRoute("/home-automation")({
  head: () => ({
    meta: [
      { title: "Home Automation — THORKAN OS" },
      {
        name: "description",
        content:
          "Smart home command surface: power grid consumption, security perimeter toggles, CCTV feed, climate control and smart lighting.",
      },
      { property: "og:title", content: "Home Automation — THORKAN OS" },
      {
        property: "og:description",
        content: "Power grid, perimeter security, climate and lighting orchestration.",
      },
    ],
  }),
  component: AutomationPage,
});

type Lights = Record<string, number>;

function AutomationPage() {
  const grid = useSeries(26, 800, 60, 2000);
  const kw = useTelemetry(842.4, 12);
  const [perimeter, setPerimeter] = useLocalStorage<Record<string, boolean>>(
    "thorkan.perimeter",
    { main: true, motion: true, camera: false }
  );
  const [setpoint, setSetpoint] = useLocalStorage("thorkan.setpoint", 21.5);
  const [lights, setLights] = useLocalStorage<Lights>("thorkan.lights", {
    COMMAND_HUB: 100,
    LAB_01: 30,
    SLEEP_POD: 40,
    HOLOGRID: 80,
  });
  const [panic, setPanic] = useLocalStorage("thorkan.panic", false);

  return (
    <Shell>
      <div className="space-y-4">
        <PageHeader
          title="HOME AUTOMATION"
          subtitle="GRID IDENTITY: STRATOS_NODE_08"
          right={<Tag tone={panic ? "destructive" : "primary"}>{panic ? "PANIC_ACTIVE" : "SECURED"}</Tag>}
        />

        <div className="grid gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Panel
            title="POWER GRID STATUS"
            right={<span className="text-primary">{kw.toFixed(1)} kW PEAK</span>}
          >
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={grid}>
                  <defs>
                    <linearGradient id="grid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="var(--chart-1)"
                    fill="url(#grid)"
                    strokeWidth={1.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="os-label mt-1">CURRENT CONSUMPTION PEAK // NODE_08</p>
          </Panel>

          <Panel title="SECURITY PERIMETER" right={<ShieldAlert className="h-3 w-3" />}>
            <div className="space-y-2">
              {[
                ["main", "MAIN ACCESS", "SECURED", Lock],
                ["motion", "MOTION SENSORS", "12 ACTIVE", ShieldAlert],
                ["camera", "PERIMETER CAM", "OFFLINE", Camera],
              ].map(([key, label, sub, Icon]) => {
                const IconC = Icon as typeof Lock;
                const k = key as string;
                return (
                  <div
                    key={k}
                    className="flex items-center justify-between gap-3 border border-border p-2"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <IconC className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <div className="min-w-0">
                        <p className="truncate text-[10px] text-foreground">{label as string}</p>
                        <p className="os-label truncate">{sub as string}</p>
                      </div>
                    </div>
                    <Switch
                      checked={!!perimeter[k]}
                      onCheckedChange={(v) => setPerimeter((p) => ({ ...p, [k]: v }))}
                    />
                  </div>
                );
              })}
              <div className="os-scanlines grid h-28 place-items-center border border-border bg-background/60">
                <p className="os-label">LIVE_FEED: ENTRANCE_01</p>
              </div>
              <CyberButton tone="danger" className="w-full" onClick={() => setPanic((p) => !p)}>
                {panic ? "DISENGAGE PANIC PROTOCOL" : "TRIGGER PANIC PROTOCOL"}
              </CyberButton>
            </div>
          </Panel>
        </div>

        <div className="grid gap-3 xl:grid-cols-2">
          <Panel title="CLIMATE CONTROL" right={<Thermometer className="h-3 w-3" />}>
            <div className="flex flex-wrap items-end gap-6">
              <p className="text-3xl text-primary">
                22<span className="text-sm">°C</span>
                <span className="os-label mt-1 block">AMBIENT</span>
              </p>
              <p className="text-3xl text-primary">
                45<span className="text-sm">%</span>
                <span className="os-label mt-1 block">HUMIDITY</span>
              </p>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline justify-between">
                <span className="os-label">TARGET SETPOINT</span>
                <span className="text-[11px] text-primary">{setpoint.toFixed(1)}°C</span>
              </div>
              <Slider
                className="mt-2"
                min={16}
                max={30}
                step={0.5}
                value={[setpoint]}
                onValueChange={(v) => setSetpoint(v[0] ?? setpoint)}
              />
              <div className="mt-3 grid grid-cols-2 gap-2">
                <CyberButton tone="ghost" onClick={() => setSetpoint((s) => Math.max(16, s - 0.5))}>
                  - 0.5°
                </CyberButton>
                <CyberButton tone="ghost" onClick={() => setSetpoint((s) => Math.min(30, s + 0.5))}>
                  + 0.5°
                </CyberButton>
              </div>
            </div>
          </Panel>

          <Panel title="SMART LIGHTING" right={<Lightbulb className="h-3 w-3" />}>
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(lights).map(([zone, level]) => (
                <div key={zone} className="border border-border p-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[10px] text-foreground">{zone}</span>
                    <span className="text-[10px] text-primary">{level}%</span>
                  </div>
                  <Slider
                    className="mt-2"
                    min={0}
                    max={100}
                    value={[level]}
                    onValueChange={(v) => setLights((l) => ({ ...l, [zone]: v[0] ?? level }))}
                  />
                  <p className="os-label mt-1">BRIGHTNESS: {level}%</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <Panel title="SYSTEM EVENT LOG">
          <div className="max-h-28 overflow-y-auto font-mono text-[10px] text-accent">
            <p>[14:02:11] GRID: Load balanced across inverter bank B.</p>
            <p>[14:04:52] SEC: Motion sensor 07 triggered // classified: FAUNA.</p>
            <p>[14:09:31] CLIMATE: Setpoint adjusted by operator.</p>
            <p>[14:12:08] LIGHT: HOLOGRID dimmed to scene 'NIGHT_OPS'.</p>
          </div>
        </Panel>
      </div>
    </Shell>
  );
}