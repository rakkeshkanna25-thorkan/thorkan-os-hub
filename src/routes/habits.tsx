import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Flame, Pause, Play, RotateCcw, Timer } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Shell } from "@/components/os/Shell";
import { CyberButton, Meter, PageHeader, Panel, Stat, Tag } from "@/components/os/Panel";
import { useInterval, useLocalStorage } from "@/lib/os-hooks";

export const Route = createFileRoute("/habits")({
  head: () => ({
    meta: [
      { title: "Habit Tracker — THORKAN OS" },
      {
        name: "description",
        content:
          "Habit consistency matrix, monthly progress analytics and a Pomodoro focus timer inside the THORKAN OS terminal.",
      },
      { property: "og:title", content: "Habit Tracker — THORKAN OS" },
      {
        property: "og:description",
        content: "Track streaks on a heatmap grid and run focus cycles on the operations console.",
      },
    ],
  }),
  component: HabitsPage,
});

const HABITS = [
  { id: "train", label: "PHYSICAL_TRAINING", seed: 3 },
  { id: "code", label: "CODE_DEPLOY", seed: 5 },
  { id: "read", label: "INTEL_READING", seed: 7 },
  { id: "sleep", label: "SLEEP_CYCLE", seed: 11 },
  { id: "focus", label: "DEEP_FOCUS", seed: 13 },
] as const;

const WEEKS = 18;

/** Deterministic pseudo-random 0..3 intensity, stable across SSR + client. */
function intensity(seed: number, cell: number) {
  const n = Math.sin(seed * 12.9898 + cell * 78.233) * 43758.5453;
  const f = n - Math.floor(n);
  if (f > 0.82) return 3;
  if (f > 0.58) return 2;
  if (f > 0.32) return 1;
  return 0;
}

const CELL_TONE = [
  "bg-secondary",
  "bg-primary/25",
  "bg-primary/55",
  "bg-primary shadow-[0_0_8px_oklch(0.885_0.184_168/45%)]",
];

function Heatmap({ seed }: { seed: number }) {
  return (
    <div className="flex gap-[3px] overflow-x-auto pb-1">
      {Array.from({ length: WEEKS }, (_, w) => (
        <div key={w} className="flex flex-col gap-[3px]">
          {Array.from({ length: 7 }, (_, d) => {
            const lvl = intensity(seed, w * 7 + d);
            return (
              <span
                key={d}
                title={`W${w + 1}/D${d + 1} — LVL_${lvl}`}
                className={`h-[9px] w-[9px] shrink-0 ${CELL_TONE[lvl]}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function monthlySeries() {
  return Array.from({ length: 12 }, (_, i) => ({
    m: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][i],
    rate: 48 + Math.round(Math.abs(Math.sin(i / 1.7)) * 44),
    streak: 4 + Math.round(Math.abs(Math.cos(i / 2.1)) * 22),
  }));
}

const MODES = {
  focus: { label: "FOCUS_CYCLE", secs: 25 * 60 },
  short: { label: "SHORT_REST", secs: 5 * 60 },
  long: { label: "LONG_REST", secs: 15 * 60 },
} as const;
type Mode = keyof typeof MODES;

function Pomodoro() {
  const [mode, setMode] = useState<Mode>("focus");
  const [left, setLeft] = useState(MODES.focus.secs);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useLocalStorage("thorkan.pomodoro.cycles", 0);

  useInterval(
    () => {
      setLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          if (mode === "focus") setCycles((c) => c + 1);
          return 0;
        }
        return s - 1;
      });
    },
    running ? 1000 : null
  );

  const total = MODES[mode].secs;
  const pct = ((total - left) / total) * 100;
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const R = 62;
  const circ = 2 * Math.PI * R;

  const pick = (m: Mode) => {
    setMode(m);
    setLeft(MODES[m].secs);
    setRunning(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        {(Object.keys(MODES) as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => pick(m)}
            className={`border px-2 py-1 text-[9px] tracking-[0.15em] uppercase transition-colors ${
              m === mode
                ? "border-primary/60 bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:text-primary"
            }`}
          >
            {MODES[m].label}
          </button>
        ))}
      </div>

      <div className="relative h-[168px] w-[168px]">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
          <circle cx="80" cy="80" r={R} fill="none" stroke="var(--secondary)" strokeWidth="4" />
          <circle
            cx="80"
            cy="80"
            r={R}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="4"
            strokeDasharray={circ}
            strokeDashoffset={circ - (circ * pct) / 100}
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="os-glow-text text-3xl font-bold text-primary tabular-nums">
            {mm}:{ss}
          </span>
          <span className="os-label mt-1">{running ? "ENGAGED" : "STANDBY"}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <CyberButton onClick={() => setRunning((r) => !r)}>
          {running ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          {running ? "HALT" : "ENGAGE"}
        </CyberButton>
        <CyberButton tone="ghost" onClick={() => pick(mode)}>
          <RotateCcw className="h-3 w-3" />
          RESET
        </CyberButton>
      </div>

      <p className="os-label">CYCLES_LOGGED :: {String(cycles).padStart(3, "0")}</p>
    </div>
  );
}

function HabitsPage() {
  const series = useMemo(monthlySeries, []);
  const [active, setActive] = useLocalStorage<string[]>(
    "thorkan.habits.today",
    ["code", "read"]
  );

  const toggle = (id: string) =>
    setActive((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const completion = Math.round((active.length / HABITS.length) * 100);

  return (
    <Shell>
      <div className="space-y-4">
        <PageHeader
          title="HABIT TRACKER"
          subtitle="SYS.HABIT_TRACKER // CONSISTENCY_MATRIX v2.4"
          right={<Tag>SYNC_LOC_01</Tag>}
        />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="TODAY_COMPLETION" value={`${completion}%`} sub={`${active.length}/${HABITS.length} routines`} />
          <Stat label="ACTIVE_STREAK" value="27d" sub="longest: 41d" />
          <Stat label="MONTHLY_RATE" value="82.4%" sub="+6.1% vs prior" />
          <Stat label="MISSED_SLOTS" value="04" tone="warning" sub="last 30 cycles" />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Panel title="CONSISTENCY HEATMAP // 126 CYCLES" right="LVL 0—3">
            <div className="space-y-3">
              {HABITS.map((h) => (
                <div key={h.id} className="min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => toggle(h.id)}
                      className={`os-label truncate transition-colors ${
                        active.includes(h.id) ? "text-primary" : "hover:text-primary"
                      }`}
                    >
                      {active.includes(h.id) ? "[x] " : "[ ] "}
                      {h.label}
                    </button>
                    <span className="shrink-0 text-[9px] text-muted-foreground">
                      STREAK {8 + h.seed}d
                    </span>
                  </div>
                  <div className="mt-1">
                    <Heatmap seed={h.seed} />
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 border-t border-border pt-2">
                <span className="os-label">INTENSITY</span>
                {CELL_TONE.map((c, i) => (
                  <span key={i} className={`h-[9px] w-[9px] ${c}`} />
                ))}
              </div>
            </div>
          </Panel>

          <Panel title="POMODORO FOCUS TIMER" right={<Timer className="h-3 w-3" />}>
            <Pomodoro />
          </Panel>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Panel title="MONTHLY PROGRESS ANALYTICS" right="COMPLETION_RATE %">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                  <defs>
                    <linearGradient id="habitFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" />
                  <XAxis
                    dataKey="m"
                    stroke="var(--muted-foreground)"
                    tick={{ fontSize: 9 }}
                    tickLine={false}
                  />
                  <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 9 }} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      fontSize: 10,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    isAnimationActive={false}
                    stroke="var(--primary)"
                    strokeWidth={1.5}
                    fill="url(#habitFill)"
                  />
                  <Area
                    type="monotone"
                    dataKey="streak"
                    isAnimationActive={false}
                    stroke="var(--chart-4)"
                    strokeWidth={1}
                    fill="none"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="ROUTINE LOAD DISTRIBUTION" right={<Flame className="h-3 w-3" />}>
            <div className="space-y-3">
              {HABITS.map((h, i) => (
                <Meter
                  key={h.id}
                  label={h.label}
                  value={54 + h.seed * 3 + i}
                  tone={i === 3 ? "warning" : "primary"}
                />
              ))}
              <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
                &gt; ANALYSIS: consistency degrades on SLEEP_CYCLE during high-load deploy windows.
                Recommend shifting DEEP_FOCUS blocks earlier by 90 minutes.
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </Shell>
  );
}