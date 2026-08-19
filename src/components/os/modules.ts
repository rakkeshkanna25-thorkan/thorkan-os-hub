import {
  Activity,
  BrainCircuit,
  CalendarCheck,
  FileText,
  Gamepad2,
  Gauge,
  Home,
  LineChart,
  ListChecks,
  Network,
  Shield,
  Terminal,
} from "lucide-react";

export type OsModule = {
  id: string;
  index: string;
  to: string;
  label: string;
  code: string;
  badge: string;
  icon: typeof Home;
  blurb: string;
};

export const MODULES: OsModule[] = [
  {
    id: "home",
    index: "01",
    to: "/hub",
    label: "HOME",
    code: "SEC.NETWORK_CORE",
    badge: "ENCR_SHA256",
    icon: Home,
    blurb: "Command central grid",
  },
  {
    id: "cyber",
    index: "01",
    to: "/cybersecurity",
    label: "CYBERSECURITY GRID",
    code: "SEC.NETWORK_CORE",
    badge: "ENCR_SHA256",
    icon: Shield,
    blurb: "Intrusion map + recon terminal",
  },
  {
    id: "research",
    index: "02",
    to: "/research",
    label: "RESEARCH MATRIX",
    code: "LAB.INTEL_RESEARCH",
    badge: "DOC_VECTOR_DB",
    icon: FileText,
    blurb: "Source vault + synthesis terminal",
  },
  {
    id: "ai",
    index: "03",
    to: "/ai-feed",
    label: "AI NEWS & METRICS",
    code: "FEED.AI_CREATION",
    badge: "GEN_LAYER_4",
    icon: BrainCircuit,
    blurb: "Model leaderboard + scraper health",
  },
  {
    id: "vehicle",
    index: "04",
    to: "/vehicle",
    label: "VEHICLE TELEMETRY",
    code: "DIAG.SMART_VEHICLE",
    badge: "EV_STATE: 82%",
    icon: Gauge,
    blurb: "Normalized drivetrain diagnostics",
  },
  {
    id: "analytics",
    index: "05",
    to: "/analytics",
    label: "ANALYTICS HUB",
    code: "METRIC.SAAS_FINANCE",
    badge: "MRR: $42.5K",
    icon: LineChart,
    blurb: "Financial matrix + equity vectors",
  },
  {
    id: "automation",
    index: "06",
    to: "/home-automation",
    label: "HOME AUTOMATION",
    code: "SYS.HOME_AUTOMATION",
    badge: "LOC_01",
    icon: Activity,
    blurb: "Power grid, perimeter, climate",
  },
  {
    id: "game",
    index: "07",
    to: "/game-center",
    label: "GAME CENTER",
    code: "TEL.ESPORTS_HUB",
    badge: "LIVE_PONG",
    icon: Gamepad2,
    blurb: "Squad vectors + patch feed",
  },
  {
    id: "personal",
    index: "08",
    to: "/personal",
    label: "PERSONAL UPDATES",
    code: "CORE.PERSONAL_UPDATES",
    badge: "SYNC_GSHEETS",
    icon: ListChecks,
    blurb: "Intelligence briefing + goals",
  },
  {
    id: "habit",
    index: "09",
    to: "/habits",
    label: "HABIT TRACKER",
    code: "SYS.HABIT_TRACKER",
    badge: "LOC_01",
    icon: CalendarCheck,
    blurb: "Habit matrix + focus timer",
  },
  {
    id: "rules",
    index: "10",
    to: "/rules",
    label: "RULE ENGINE BUILDER",
    code: "RULE.ENGINE_BUILDER",
    badge: "LOC_01",
    icon: Network,
    blurb: "Visual node orchestration",
  },
];

export const GRID_MODULES = MODULES.filter((m) => m.id !== "home");

export const SECTOR_LINKS = [
  "GOOGLE",
  "GEMINI",
  "WIKIPEDIA",
  "SCREENER",
  "HACKER_GPT",
  "GROKW",
  "CLAUDE",
  "N8N",
  "PYWARE",
];

export const TERMINAL_ICON = Terminal;