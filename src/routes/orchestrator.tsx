import { createFileRoute } from "@tanstack/react-router";
import {
  Boxes,
  Code2,
  FileArchive,
  Play,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/os/Shell";
import { CyberButton, PageHeader, Panel, Tag } from "@/components/os/Panel";
import { PromptBar } from "@/components/os/PromptBar";
import { ExportButton } from "@/components/os/ExportButton";
import { MODULES } from "@/components/os/modules";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOsConfig, type Injection, type OsVars } from "@/lib/os-config";

export const Route = createFileRoute("/orchestrator")({
  head: () => ({
    meta: [
      { title: "AI Orchestrator — THORKAN OS" },
      {
        name: "description",
        content:
          "THORKAN-33 orchestrator: mount dev files and ZIP archives, toggle module frames, tune border glow and wallpapers, inspect live variables and compile injected code.",
      },
      { property: "og:title", content: "AI Orchestrator — THORKAN OS" },
      {
        property: "og:description",
        content:
          "Mount features, control themes and frames, inspect variables and run a live code sandbox.",
      },
    ],
  }),
  component: OrchestratorPage,
});

const ORIGINS = ["FIGMA", "STITCH", "LOVABLE", "LOCAL_DEV"] as const;

function AddMenu() {
  const { config, addAsset, removeAsset } = useOsConfig();
  const [origin, setOrigin] = useState<(typeof ORIGINS)[number]>("LOVABLE");
  const inputRef = useRef<HTMLInputElement>(null);

  const ingest = (files: FileList | null) => {
    if (!files?.length) return;
    Array.from(files).forEach((f) => {
      addAsset({
        id: `${f.name}-${Date.now()}-${Math.round(Math.random() * 1e4)}`,
        name: f.name,
        size: f.size,
        kind: f.name.split(".").pop()?.toUpperCase() ?? "BIN",
        origin,
        at: new Date().toISOString().slice(11, 19),
      });
    });
    toast.success("ASSET_MOUNTED", { description: `${files.length} payload(s) from ${origin}` });
  };

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
      <Panel title="ADD_MENU // FEATURE_MOUNT" right={<Upload className="h-3 w-3" />}>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {ORIGINS.map((o) => (
              <button
                key={o}
                onClick={() => setOrigin(o)}
                className={`border px-2 py-1 text-[9px] tracking-[0.16em] transition-colors ${
                  origin === o
                    ? "border-primary/60 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {o}
              </button>
            ))}
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              ingest(e.dataTransfer.files);
            }}
            onClick={() => inputRef.current?.click()}
            className="grid cursor-pointer place-items-center gap-2 border border-dashed border-primary/40 bg-primary/5 p-8 text-center transition-colors hover:bg-primary/10"
          >
            <FileArchive className="h-7 w-7 text-primary/70" />
            <p className="text-[11px] tracking-[0.16em] text-primary">DROP DEV FILES / ZIP / CHUNK</p>
            <p className="os-label">
              .zip .tsx .ts .jsx .css .json .md — mounts into the active workflow
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".zip,.tsx,.ts,.jsx,.js,.css,.json,.md,.txt,.svg,.png"
            className="hidden"
            onChange={(e) => ingest(e.target.files)}
          />

          <PromptBar
            placeholder="DESCRIBE FEATURE TO MOUNT FROM PAYLOAD..."
            multiline
            onSubmit={(v, ctx) =>
              toast.success("MOUNT_DIRECTIVE_QUEUED", { description: `[${ctx}] ${v.slice(0, 80)}` })
            }
          />
        </div>
      </Panel>

      <Panel title="MOUNTED_PAYLOADS" right={<Tag>{config.assets.length} OBJ</Tag>}>
        <div className="space-y-2">
          {config.assets.length === 0 ? (
            <p className="os-label">NO PAYLOADS MOUNTED</p>
          ) : (
            config.assets.map((a) => (
              <div key={a.id} className="flex items-center gap-2 border border-border p-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] text-foreground">{a.name}</p>
                  <p className="os-label truncate">
                    {a.kind} • {(a.size / 1024).toFixed(1)}KB • {a.origin} • {a.at}
                  </p>
                </div>
                <button
                  onClick={() => removeAsset(a.id)}
                  aria-label={`Unmount ${a.name}`}
                  className="shrink-0 border border-border p-1 text-destructive hover:border-destructive/60"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))
          )}
          <ExportButton
            className="w-full"
            label="EXPORT MOUNT MANIFEST"
            title="MOUNT_MANIFEST"
            module="AI_ORCHESTRATOR"
            rows={() =>
              config.assets.map((a) => ({
                NAME: a.name,
                KIND: a.kind,
                ORIGIN: a.origin,
                SIZE_KB: Number((a.size / 1024).toFixed(2)),
                MOUNTED_AT: a.at,
              }))
            }
            notes={["Generated by THORKAN-33 AI Orchestrator ADD_MENU handler."]}
          />
        </div>
      </Panel>
    </div>
  );
}

function SettingsTab() {
  const { config, setTheme, setFrame, isFrameOn, reset } = useOsConfig();
  const t = config.theme;

  return (
    <div className="grid gap-3 xl:grid-cols-[300px_minmax(0,1fr)]">
      <Panel title="FRAME_MANAGEMENT" right={<Boxes className="h-3 w-3" />}>
        <div className="space-y-1.5">
          {MODULES.map((m) => (
            <label
              key={m.id}
              className="flex items-center justify-between gap-2 border border-border px-2 py-1.5"
            >
              <span className="flex min-w-0 items-center gap-2">
                <m.icon className="h-3 w-3 shrink-0 text-primary/70" />
                <span className="truncate text-[10px] text-foreground">{m.label}</span>
              </span>
              <Switch
                checked={isFrameOn(m.id)}
                onCheckedChange={(v) => setFrame(m.id, Boolean(v))}
              />
            </label>
          ))}
        </div>
      </Panel>

      <div className="space-y-3">
        <Panel title="GRANULAR_VISUAL_CUSTOMIZATION" right={<SlidersHorizontal className="h-3 w-3" />}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div>
                <p className="os-label mb-1">BORDER_LINE_COLOR</p>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={t.borderColor}
                    onChange={(e) => setTheme({ borderColor: e.target.value })}
                    className="h-7 w-12 border border-border bg-transparent"
                  />
                  <input
                    value={t.borderColor}
                    onChange={(e) => setTheme({ borderColor: e.target.value })}
                    className="w-24 border border-input bg-background/60 px-2 py-1 text-[10px] text-foreground outline-none"
                  />
                  {["#00ffc4", "#10b981", "#38bdf8", "#f43f5e", "#f5d90a"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setTheme({ borderColor: c })}
                      aria-label={`Preset ${c}`}
                      style={{ background: c }}
                      className="h-5 w-5 border border-border"
                    />
                  ))}
                </div>
              </div>
              <SliderRow
                label="BORDER_GLOW_INTENSITY"
                value={t.glow}
                max={100}
                onChange={(v) => setTheme({ glow: v })}
              />
              <SliderRow
                label="BORDER_LINE_WIDTH"
                value={t.borderWidth}
                min={1}
                max={4}
                suffix="px"
                onChange={(v) => setTheme({ borderWidth: v })}
              />
              <SliderRow
                label="GRID_LINE_OPACITY"
                value={t.gridOpacity}
                max={30}
                onChange={(v) => setTheme({ gridOpacity: v })}
              />
              <SliderRow
                label="PANEL_BLUR"
                value={t.panelBlur}
                max={30}
                suffix="px"
                onChange={(v) => setTheme({ panelBlur: v })}
              />
            </div>

            <div className="space-y-3">
              <div>
                <p className="os-label mb-1">BACKGROUND_IMAGE / LIVE_WALLPAPER_URL</p>
                <input
                  value={t.wallpaper}
                  onChange={(e) => setTheme({ wallpaper: e.target.value })}
                  placeholder="https://... or /assets/wall.jpg"
                  className="w-full border border-input bg-background/60 px-2 py-1.5 text-[10px] text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
              <SliderRow
                label="WALLPAPER_OPACITY"
                value={t.wallpaperOpacity}
                max={100}
                onChange={(v) => setTheme({ wallpaperOpacity: v })}
              />
              <label className="flex items-center justify-between border border-border px-2 py-1.5">
                <span className="os-label">LIVE_WALLPAPER_DRIFT</span>
                <Switch
                  checked={t.wallpaperAnimated}
                  onCheckedChange={(v) => setTheme({ wallpaperAnimated: Boolean(v) })}
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <CyberButton tone="ghost" onClick={() => setTheme({ wallpaper: "" })}>
                  CLEAR WALLPAPER
                </CyberButton>
                <CyberButton tone="danger" onClick={reset}>
                  <RotateCcw className="mr-1 inline h-3 w-3" />
                  RESET SYSTEM THEME
                </CyberButton>
              </div>
              <div className="os-panel os-corner p-3">
                <p className="os-label">LIVE_PREVIEW</p>
                <p className="os-glow-text mt-1 text-sm text-primary">BORDER // GLOW // {t.glow}%</p>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  suffix = "%",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="os-label">{label}</span>
        <span className="text-[10px] text-primary">
          {value}
          {suffix}
        </span>
      </div>
      <Slider
        className="mt-2"
        min={min}
        max={max}
        step={1}
        value={[value]}
        onValueChange={(v) => onChange(v[0] ?? min)}
      />
    </div>
  );
}

function VariableInspector() {
  const { config, setVars } = useOsConfig();
  const entries = Object.entries(config.vars) as [keyof OsVars, string | number][];

  return (
    <Panel title="VARIABLE_INSPECTOR // LIVE_CONFIG" right={<Tag>{entries.length} KEYS</Tag>}>
      <div className="grid gap-2 md:grid-cols-2">
        {entries.map(([key, value]) => (
          <label key={String(key)} className="flex items-center gap-2 border border-border p-2">
            <span className="os-label w-40 shrink-0 truncate">{String(key)}</span>
            <input
              value={String(value)}
              onChange={(e) => {
                const next =
                  typeof value === "number" ? Number(e.target.value) || 0 : e.target.value;
                setVars({ [key]: next } as Partial<OsVars>);
              }}
              className="min-w-0 flex-1 border border-input bg-background/60 px-2 py-1 text-[10px] text-primary outline-none"
            />
          </label>
        ))}
      </div>
      <p className="os-label mt-3">
        VALUES PERSIST LOCALLY AND APPLY ACROSS EVERY MODULE WITHOUT A REBUILD.
      </p>
    </Panel>
  );
}

const SAMPLE = `// THORKAN sandbox — 'thorkan' API is injected
thorkan.log("scanning payload...");
thorkan.setVar("sector", "SECTOR_9");
thorkan.setTheme({ glow: 62 });
return { feature: "SECTOR_9_OVERLAY", mounted: true };`;

function Compiler() {
  const { config, setVars, setTheme, addInjection, removeInjection } = useOsConfig();
  const [code, setCode] = useState(SAMPLE);
  const [out, setOut] = useState<string[]>([]);

  const run = () => {
    const logs: string[] = [];
    const push = (...args: unknown[]) =>
      logs.push(args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" "));
    let status: Injection["status"] = "MOUNTED";
    try {
      const api = {
        log: push,
        config,
        setVar: (k: string, v: string | number) => setVars({ [k]: v } as Partial<OsVars>),
        setTheme,
      };
      // eslint-disable-next-line no-new-func
      const fn = new Function("thorkan", "console", `"use strict";\n${code}`);
      const result = fn(api, { log: push, warn: push, error: push, info: push });
      if (result !== undefined) push("RETURN:", result as never);
      push("COMPILE_OK // FEATURE INTEGRATED INTO ACTIVE WORKFLOW");
    } catch (err) {
      status = "FAILED";
      push(`COMPILE_ERROR: ${String(err)}`);
    }
    setOut(logs);
    addInjection({
      id: `inj-${Date.now()}`,
      name: code.split("\n")[0]?.slice(0, 42) || "SNIPPET",
      code,
      status,
      output: logs.join(" | ").slice(0, 400),
      at: new Date().toISOString().slice(11, 19),
    });
    if (status === "FAILED") toast.error("INJECTION_FAILED");
    else toast.success("CODE_COMPILED", { description: "Snippet mounted to workflow" });
  };

  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_340px]">
      <Panel title="CODE_COMPILER // INJECTOR_SANDBOX" right={<Code2 className="h-3 w-3" />}>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          rows={14}
          className="w-full resize-y border border-input bg-background/70 p-2 font-mono text-[10px] leading-relaxed text-accent outline-none"
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <CyberButton onClick={run}>
            <Play className="mr-1 inline h-3 w-3" />
            PARSE + COMPILE
          </CyberButton>
          <CyberButton tone="ghost" onClick={() => setOut([])}>
            CLEAR OUTPUT
          </CyberButton>
          <ExportButton
            label="EXPORT INJECTION LOG"
            title="INJECTION_LOG"
            module="CODE_COMPILER"
            rows={() =>
              config.injections.map((i) => ({
                TIME: i.at,
                NAME: i.name,
                STATUS: i.status,
                OUTPUT: i.output,
              }))
            }
          />
        </div>
        <pre className="mt-2 max-h-52 overflow-auto border border-border bg-background/70 p-2 font-mono text-[10px] text-primary">
          {out.length ? out.join("\n") : "> AWAITING COMPILE..."}
        </pre>
      </Panel>

      <Panel title="MOUNTED_INJECTIONS" right={<Sparkles className="h-3 w-3" />}>
        <div className="space-y-2">
          {config.injections.length === 0 ? (
            <p className="os-label">NO INJECTIONS IN STACK</p>
          ) : (
            config.injections.map((i) => (
              <div key={i.id} className="border border-border p-2">
                <div className="flex items-center justify-between gap-2">
                  <Tag tone={i.status === "FAILED" ? "destructive" : "primary"}>{i.status}</Tag>
                  <button
                    onClick={() => removeInjection(i.id)}
                    aria-label="Remove injection"
                    className="text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                <p className="mt-1 truncate text-[10px] text-foreground">{i.name}</p>
                <p className="os-label truncate">
                  {i.at} • {i.output}
                </p>
              </div>
            ))
          )}
        </div>
      </Panel>
    </div>
  );
}

function OrchestratorPage() {
  return (
    <Shell>
      <div className="space-y-4">
        <PageHeader
          title="THORKAN-33 // AI_ORCHESTRATOR"
          subtitle="SYS.ORCHESTRATOR // MOUNT · THEME · VARS · COMPILE"
          right={<Tag>ROOT_ACCESS</Tag>}
        />
        <Tabs defaultValue="add">
          <TabsList className="flex-wrap">
            <TabsTrigger value="add">ADD MENU</TabsTrigger>
            <TabsTrigger value="settings">SETTINGS &amp; THEME</TabsTrigger>
            <TabsTrigger value="vars">VARIABLES</TabsTrigger>
            <TabsTrigger value="compiler">COMPILER</TabsTrigger>
          </TabsList>
          <TabsContent value="add" className="mt-3">
            <AddMenu />
          </TabsContent>
          <TabsContent value="settings" className="mt-3">
            <SettingsTab />
          </TabsContent>
          <TabsContent value="vars" className="mt-3">
            <VariableInspector />
          </TabsContent>
          <TabsContent value="compiler" className="mt-3">
            <Compiler />
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
}