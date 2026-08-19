import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const PROMPT_CONTEXTS = [
  { id: "terminal", label: "TERMINAL", hint: "Local shell // sector_7 relay" },
  { id: "local-model", label: "LOCAL MODEL", hint: "THORKAN-33 on-device weights" },
  { id: "api-key", label: "API KEY", hint: "Remote gateway // bearer auth" },
  { id: "vector-db", label: "VECTOR DB", hint: "Semantic recall over doc vault" },
  { id: "web-relay", label: "WEB RELAY", hint: "Outbound scraper channel" },
] as const;

export type PromptContextId = (typeof PROMPT_CONTEXTS)[number]["id"];

export type OsTheme = {
  borderColor: string;
  glow: number;
  borderWidth: number;
  gridOpacity: number;
  panelBlur: number;
  wallpaper: string;
  wallpaperOpacity: number;
  wallpaperAnimated: boolean;
};

export type OsVars = {
  appTitle: string;
  buildTag: string;
  operator: string;
  sector: string;
  tickerSpeed: number;
  telemetryInterval: number;
  healthIndex: number;
  defaultPromptContext: PromptContextId;
};

export type Injection = {
  id: string;
  name: string;
  code: string;
  status: "MOUNTED" | "FAILED" | "IDLE";
  output: string;
  at: string;
};

export type MountedAsset = {
  id: string;
  name: string;
  size: number;
  kind: string;
  origin: string;
  at: string;
};

export type OsConfig = {
  theme: OsTheme;
  vars: OsVars;
  frames: Record<string, boolean>;
  injections: Injection[];
  assets: MountedAsset[];
};

export const DEFAULT_CONFIG: OsConfig = {
  theme: {
    borderColor: "#00ffc4",
    glow: 35,
    borderWidth: 1,
    gridOpacity: 6,
    panelBlur: 10,
    wallpaper: "",
    wallpaperOpacity: 25,
    wallpaperAnimated: false,
  },
  vars: {
    appTitle: "THORKAN OS",
    buildTag: "BOOTLOADER_v1.000",
    operator: "THORKAN-33",
    sector: "SECTOR_7",
    tickerSpeed: 38,
    telemetryInterval: 1800,
    healthIndex: 0.9984,
    defaultPromptContext: "terminal",
  },
  frames: {},
  injections: [],
  assets: [],
};

const STORAGE_KEY = "thorkan.os.config";

type Ctx = {
  config: OsConfig;
  setTheme: (patch: Partial<OsTheme>) => void;
  setVars: (patch: Partial<OsVars>) => void;
  setFrame: (id: string, on: boolean) => void;
  isFrameOn: (id: string) => boolean;
  addInjection: (i: Injection) => void;
  removeInjection: (id: string) => void;
  addAsset: (a: MountedAsset) => void;
  removeAsset: (id: string) => void;
  reset: () => void;
};

const OsConfigContext = createContext<Ctx | null>(null);

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean.padEnd(6, "0").slice(0, 6);
  const num = Number.parseInt(full, 16);
  if (Number.isNaN(num)) return { r: 0, g: 255, b: 196 };
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function OsConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<OsConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<OsConfig>;
        setConfig({
          theme: { ...DEFAULT_CONFIG.theme, ...(parsed.theme ?? {}) },
          vars: { ...DEFAULT_CONFIG.vars, ...(parsed.vars ?? {}) },
          frames: { ...(parsed.frames ?? {}) },
          injections: parsed.injections ?? [],
          assets: parsed.assets ?? [],
        });
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      /* ignore */
    }
    const { theme } = config;
    const root = document.documentElement;
    root.style.setProperty("--border", rgba(theme.borderColor, 0.18 + theme.glow / 400));
    root.style.setProperty("--input", rgba(theme.borderColor, 0.22 + theme.glow / 400));
    root.style.setProperty("--ring", rgba(theme.borderColor, 0.55));
    root.style.setProperty("--glow-primary", `0 0 ${18 + theme.glow / 3}px ${rgba(theme.borderColor, theme.glow / 100)}`);
    root.style.setProperty(
      "--glow-soft",
      `0 0 ${30 + theme.glow}px ${rgba(theme.borderColor, theme.glow / 320)}`
    );
    root.style.setProperty("--grid-line", rgba(theme.borderColor, theme.gridOpacity / 100));
    root.style.setProperty("--os-border-width", `${theme.borderWidth}px`);
    root.style.setProperty("--os-panel-blur", `${theme.panelBlur}px`);
    root.style.setProperty("--os-wallpaper", theme.wallpaper ? `url("${theme.wallpaper}")` : "none");
    root.style.setProperty("--os-wallpaper-opacity", String(theme.wallpaperOpacity / 100));
  }, [config]);

  const value = useMemo<Ctx>(() => {
    return {
      config,
      setTheme: (patch) => setConfig((c) => ({ ...c, theme: { ...c.theme, ...patch } })),
      setVars: (patch) => setConfig((c) => ({ ...c, vars: { ...c.vars, ...patch } })),
      setFrame: (id, on) => setConfig((c) => ({ ...c, frames: { ...c.frames, [id]: on } })),
      isFrameOn: (id) => config.frames[id] !== false,
      addInjection: (i) => setConfig((c) => ({ ...c, injections: [i, ...c.injections].slice(0, 30) })),
      removeInjection: (id) =>
        setConfig((c) => ({ ...c, injections: c.injections.filter((i) => i.id !== id) })),
      addAsset: (a) => setConfig((c) => ({ ...c, assets: [a, ...c.assets].slice(0, 40) })),
      removeAsset: (id) => setConfig((c) => ({ ...c, assets: c.assets.filter((a) => a.id !== id) })),
      reset: () => setConfig(DEFAULT_CONFIG),
    };
  }, [config]);

  return <OsConfigContext.Provider value={value}>{children}</OsConfigContext.Provider>;
}

export function useOsConfig() {
  const ctx = useContext(OsConfigContext);
  if (!ctx) throw new Error("useOsConfig must be used inside OsConfigProvider");
  return ctx;
}

/** Wallpaper layer, rendered behind the shell. */
export function useWallpaperStyle() {
  const { config } = useOsConfig();
  return useCallback(() => config.theme, [config.theme]);
}