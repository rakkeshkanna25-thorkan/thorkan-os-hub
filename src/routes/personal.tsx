import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Target } from "lucide-react";
import { Shell } from "@/components/os/Shell";
import { CyberButton, PageHeader, Panel, Tag } from "@/components/os/Panel";
import { useLocalStorage } from "@/lib/os-hooks";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export const Route = createFileRoute("/personal")({
  head: () => ({
    meta: [
      { title: "Personal Updates — THORKAN OS" },
      {
        name: "description",
        content:
          "Intelligence briefing and mission command: strategic goals, tactical tasks, mapping archives and neural load metrics.",
      },
      { property: "og:title", content: "Personal Updates — THORKAN OS" },
      {
        property: "og:description",
        content: "Strategic goal tracking and educational mission command console.",
      },
    ],
  }),
  component: PersonalPage,
});

type Task = { id: string; label: string; done: boolean };

const DEFAULT_GOALS: Task[] = [
  { id: "g1", label: "Advanced Cert. Mastery", done: true },
  { id: "g2", label: "Research Publication v1.0", done: false },
  { id: "g3", label: "Neural Net Optimization", done: false },
];

const DEFAULT_TASKS: Task[] = [
  { id: "t1", label: "Weekly Briefing", done: true },
  { id: "t2", label: "Lab Phase 4", done: false },
  { id: "t3", label: "Signal Review", done: false },
];

function TaskList({
  items,
  onToggle,
  onAdd,
}: {
  items: Task[];
  onToggle: (id: string) => void;
  onAdd: (label: string) => void;
}) {
  const [draft, setDraft] = useState("");
  return (
    <div className="space-y-2">
      {items.map((t) => (
        <label
          key={t.id}
          className="flex items-center gap-2 border border-border px-2 py-1.5 text-[10px]"
        >
          <Checkbox checked={t.done} onCheckedChange={() => onToggle(t.id)} />
          <span className={t.done ? "truncate text-primary line-through" : "truncate text-foreground"}>
            {t.label}
          </span>
        </label>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim()) return;
          onAdd(draft.trim());
          setDraft("");
        }}
        className="flex gap-2"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="NEW_OBJECTIVE…"
          className="min-w-0 flex-1 border border-input bg-background/60 px-2 py-1.5 text-[10px] outline-none placeholder:text-muted-foreground"
        />
        <CyberButton type="submit">ADD</CyberButton>
      </form>
    </div>
  );
}

function PersonalPage() {
  const [goals, setGoals] = useLocalStorage<Task[]>("thorkan.goals", DEFAULT_GOALS);
  const [tasks, setTasks] = useLocalStorage<Task[]>("thorkan.tasks", DEFAULT_TASKS);
  const pct = Math.round((goals.filter((g) => g.done).length / Math.max(1, goals.length)) * 100);

  return (
    <Shell>
      <div className="space-y-4">
        <PageHeader
          title="INTELLIGENCE BRIEFING"
          subtitle="EDUCATIONAL MISSION COMMAND"
          right={
            <span className="flex gap-2">
              <Tag>MISSION IN PROGRESS: QUANTUM THEORY</Tag>
              <Tag tone="muted">EFFICIENCY: {pct}%</Tag>
            </span>
          }
        />

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["MAPPING_01", "Class Notes", "Access tactical archive of lecture intel and pedagogical data."],
            ["MAPPING_02", "Homework Notes", "Deployment status for all outstanding deliverables and field reports."],
            ["COMMAND_OP", "Create Schedule", "Optimize daily operational tempo and resource allocation."],
          ].map(([code, title, body], i) => (
            <div
              key={code}
              className={`os-panel os-corner p-3 ${i === 2 ? "os-panel-active" : ""}`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="os-label">{code}</p>
                <CalendarDays className="h-3 w-3 text-primary" />
              </div>
              <p className="mt-2 text-center text-[11px] text-primary">{title}</p>
              <p className="mt-2 text-center text-[10px] leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-3 xl:grid-cols-2">
          <Panel title="STRATEGIC GOALS (LT)" right={<Target className="h-3 w-3" />}>
            <TaskList
              items={goals}
              onToggle={(id) =>
                setGoals((g) => g.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
              }
              onAdd={(label) =>
                setGoals((g) => [...g, { id: crypto.randomUUID(), label, done: false }])
              }
            />
            <div className="mt-3">
              <div className="flex items-baseline justify-between">
                <span className="os-label">COMPLETION INDEX</span>
                <span className="text-[10px] text-primary">{pct}%</span>
              </div>
              <div className="mt-1 h-[3px] bg-secondary">
                <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </Panel>

          <Panel title="TACTICAL TASKS (ST)">
            <TaskList
              items={tasks}
              onToggle={(id) =>
                setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)))
              }
              onAdd={(label) =>
                setTasks((t) => [...t, { id: crypto.randomUUID(), label, done: false }])
              }
            />
          </Panel>
        </div>

        <Panel title="NEURAL_LOAD_METRICS" right="SYNC_EXTERNAL">
          <div className="flex h-24 items-end gap-1">
            {Array.from({ length: 48 }, (_, i) => (
              <span
                key={i}
                className="flex-1 bg-primary/60"
                style={{ height: `${25 + Math.abs(Math.sin(i / 3)) * 70}%` }}
              />
            ))}
          </div>
        </Panel>
      </div>
    </Shell>
  );
}