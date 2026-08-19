import { createFileRoute } from "@tanstack/react-router";
import { BatteryCharging, Car, Gauge, MapPin } from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { Shell } from "@/components/os/Shell";
import { Meter, PageHeader, Panel, Stat, Tag } from "@/components/os/Panel";
import { useSeries, useTelemetry } from "@/lib/os-hooks";

export const Route = createFileRoute("/vehicle")({
  head: () => ({
    meta: [
      { title: "Vehicle Telemetry — THORKAN OS" },
      {
        name: "description",
        content:
          "Normalized smart-vehicle diagnostics: wireframe visualizer, tire pressure, battery state, G-force and live GPS packet tracking.",
      },
      { property: "og:title", content: "Vehicle Telemetry — THORKAN OS" },
      {
        property: "og:description",
        content: "Live EV drivetrain diagnostics, tire pressure and satellite tracking.",
      },
    ],
  }),
  component: VehiclePage,
});

function VehiclePage() {
  const fuel = useTelemetry(82, 3);
  const engineTemp = useTelemetry(194, 6);
  const rpm = useTelemetry(8450, 300);
  const lean = useTelemetry(15.4, 4);
  const series = useSeries(30, 60, 18, 1200);

  return (
    <Shell>
      <div className="space-y-4">
        <PageHeader
          title="VEHICLE TELEMETRY (NORMALIZED)"
          subtitle="LAT: 34.0522° N | LON: 118.2437° W | STATUS: LINK_ESTABLISHED"
          right={
            <span className="flex gap-2">
              <Tag>● LIVE UPLINK</Tag>
              <Tag tone="muted">GPS_TRACKING_SATELLITE_7</Tag>
            </span>
          }
        />

        <div className="grid gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Panel title="SMART SEDAN // UNIT-042" right="BATTERY: NOMINAL">
            <div className="os-scanlines relative grid h-64 place-items-center overflow-hidden border border-border bg-gradient-to-b from-primary/10 to-background">
              <div className="os-grid-bg absolute inset-0" />
              <Car className="relative h-32 w-32 text-primary/70 drop-shadow-[0_0_25px_oklch(0.885_0.184_168/45%)]" />
              <span className="absolute top-2 left-2 os-label">3D_HULL_MESH_MODULE</span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <Stat label="FUEL LEVEL" value={`${fuel.toFixed(0)} %`} sub="Regen braking active" />
              <Stat label="ENGINE TEMP" value={`${engineTemp.toFixed(0)} °F`} sub="Coolant loop stable" />
              <Stat label="RPM" value={rpm.toFixed(0)} sub="Redline 12K" tone="warning" />
            </div>
          </Panel>

          <div className="space-y-3">
            <Panel title="TIRE PRESSURE (PSI)" right={<Gauge className="h-3 w-3" />}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["FL", 32],
                  ["FR", 31],
                  ["RL", 33],
                  ["RR", 32],
                ].map(([pos, psi]) => (
                  <div key={pos as string} className="border border-border p-2">
                    <p className="os-label">{pos} PSI</p>
                    <p className="text-lg text-primary">{psi}</p>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title="BATTERY / DRIVETRAIN" right={<BatteryCharging className="h-3 w-3" />}>
              <div className="space-y-2">
                <Meter label="STATE OF CHARGE" value={82} />
                <Meter label="MOTOR EFFICIENCY" value={91} />
                <Meter label="THERMAL HEADROOM" value={67} tone="warning" />
                <Meter label="CHAIN TENSION" value={74} tone="accent" />
              </div>
            </Panel>
          </div>
        </div>

        <div className="grid gap-3 xl:grid-cols-3">
          <Panel title="G-FORCE / LEAN ANGLE">
            <div className="grid place-items-center py-4">
              <div className="relative grid h-32 w-32 place-items-center rounded-full border border-primary/40">
                <div
                  className="absolute h-full w-[2px] bg-primary/70 transition-transform duration-700"
                  style={{ transform: `rotate(${lean}deg)` }}
                />
                <span className="relative bg-background px-1 text-sm text-primary">
                  {lean.toFixed(1)}°
                </span>
              </div>
              <p className="os-label mt-2">LEAN ANGLE // MOTO-V3</p>
            </div>
          </Panel>

          <Panel title="GPS PACKET TRACE" right={<MapPin className="h-3 w-3" />}>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series}>
                  <Line
                    type="monotone"
                    dataKey="v"
                    dot={false}
                    stroke="var(--chart-1)"
                    strokeWidth={1.5}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="os-label mt-1">SENSORS: 1099 ON/SEC</p>
          </Panel>

          <Panel title="SYSTEM_DIAGNOSTICS_LOG">
            <div className="max-h-40 overflow-y-auto font-mono text-[10px] leading-relaxed text-accent">
              <p>[14:32:11] INF: Initializing vehicle telemetry link via secure tunnel…</p>
              <p>[14:32:12] SUC: Connection established to UNIT-042 (Automotive)</p>
              <p>[14:32:13] WRN: Brake fluid moisture content at 1.6%. Recommend check in 30 days.</p>
              <p>[14:32:15] INF: Polling MOTO-V3 sensor array. Cycle time: 4ms.</p>
              <p>[14:32:19] INF: Tire pressure sensors normalized. No deviation detected.</p>
              <p>[14:32:23] LOG: Snapshot saved to local storage vault.</p>
              <p>[14:32:30] ACT: Listening for incoming command sequences…</p>
            </div>
          </Panel>
        </div>
      </div>
    </Shell>
  );
}