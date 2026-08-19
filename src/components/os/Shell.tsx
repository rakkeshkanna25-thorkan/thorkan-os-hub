import { Link, useRouterState } from "@tanstack/react-router";
import { Cpu, HardDrive, Menu, Monitor, Search, Signal, Smartphone, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useClock, useLocalStorage, useTelemetry } from "@/lib/os-hooks";
import { MODULES, SECTOR_LINKS } from "./modules";

function TopBar({
  onToggleNav,
  navOpen,
  mobileFrame,
  setMobileFrame,
}: {
  onToggleNav: () => void;
  navOpen: boolean;
  mobileFrame: boolean;
  setMobileFrame: (v: boolean) => void;
}) {
  const now = useClock();
  const cpu = useTelemetry(38, 8);
  const ram = useTelemetry(61, 6);
  const net = useTelemetry(74, 10);
  const [query, setQuery] = useState("");

  return (
    <header className="os-panel sticky top-0 z-40 flex items-center gap-3 border-x-0 border-t-0 px-3 py-2">
      <button
        onClick={onToggleNav}
        aria-label="Toggle navigation"
        className="shrink-0 border border-border p-1.5 text-primary transition-colors hover:border-primary/60 lg:hidden"
      >
        {navOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
      </button>

      <div className="flex min-w-0 items-center gap-3">
        <Link
          to="/"
          className="os-glow-text shrink-0 text-[11px] font-bold tracking-[0.16em] text-primary"
        >
          THORKAN OS <span className="text-muted-foreground">// BOOTLOADER_v1.000</span>
        </Link>
        <span className="hidden text-[10px] text-muted-foreground md:inline">|</span>
        <span className="hidden truncate text-[10px] text-accent md:inline">
          HEALTH_INDEX: 0.9984_NOMINAL
        </span>
      </div>

      <div className="ml-auto flex min-w-0 items-center gap-2">
        <label className="hidden min-w-0 items-center gap-2 border border-input bg-background/60 px-2 py-1 md:flex">
          <Search className="h-3 w-3 shrink-0 text-primary/70" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="QUERY_MATRIX..."
            className="w-32 min-w-0 bg-transparent text-[10px] tracking-[0.12em] text-foreground outline-none placeholder:text-muted-foreground lg:w-48"
          />
        </label>

        <span className="shrink-0 text-[11px] tracking-[0.12em] text-primary tabular-nums">
          {now ? now.toISOString().slice(11, 19) : "00:00:00"}_UTC
        </span>

        <div className="hidden shrink-0 items-center gap-3 text-[9px] text-muted-foreground xl:flex">
          <span className="flex items-center gap-1">
            <Cpu className="h-3 w-3 text-primary" />
            {cpu.toFixed(0)}%
          </span>
          <span className="flex items-center gap-1">
            <HardDrive className="h-3 w-3 text-primary" />
            {ram.toFixed(0)}%
          </span>
          <span className="flex items-center gap-1">
            <Signal className="h-3 w-3 text-primary" />
            {net.toFixed(0)}%
          </span>
        </div>

        <div className="flex shrink-0 items-center border border-border">
          <button
            aria-label="Desktop view"
            onClick={() => setMobileFrame(false)}
            className={cn(
              "p-1.5 transition-colors",
              !mobileFrame ? "bg-primary/15 text-primary" : "text-muted-foreground"
            )}
          >
            <Monitor className="h-3.5 w-3.5" />
          </button>
          <button
            aria-label="Mobile view"
            onClick={() => setMobileFrame(true)}
            className={cn(
              "p-1.5 transition-colors",
              mobileFrame ? "bg-primary/15 text-primary" : "text-muted-foreground"
            )}
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function SideNav({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav
      className={cn(
        "os-panel z-30 w-56 shrink-0 border-y-0 border-l-0 p-2 lg:block",
        open
          ? "fixed inset-y-0 left-0 top-[41px] block overflow-y-auto lg:static lg:top-0"
          : "hidden"
      )}
    >
      <div className="mb-3 flex items-center gap-2 border border-border p-2">
        <div className="grid h-7 w-7 shrink-0 place-items-center border border-primary/50 text-[10px] text-primary">
          T
        </div>
        <div className="min-w-0">
          <p className="truncate text-[11px] font-bold tracking-[0.14em] text-primary">
            THORKAN-33
          </p>
          <p className="os-label truncate">AI ORCHESTRATOR</p>
        </div>
      </div>
      <ul className="space-y-0.5">
        {MODULES.map((m) => {
          const active = pathname === m.to;
          return (
            <li key={m.id}>
              <Link
                to={m.to}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-2 border-l-2 px-2 py-1.5 text-[10px] tracking-[0.14em] transition-colors",
                  active
                    ? "border-primary bg-sidebar-accent text-primary"
                    : "border-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
              >
                <m.icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{m.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 border border-border p-2">
        <p className="os-label">EXECUTE_COMMAND</p>
        <p className="mt-1 text-[9px] text-primary/70">CALENDAR_APP_LAUNCHER</p>
      </div>
    </nav>
  );
}

function FooterTicker() {
  const items = [...SECTOR_LINKS, ...SECTOR_LINKS];
  return (
    <footer className="os-panel z-30 flex items-center gap-4 overflow-hidden border-x-0 border-b-0 px-3 py-1.5">
      <span className="shrink-0 text-[9px] tracking-[0.16em] text-primary">
        COMMAND_MATRIX_OS // SECTOR_7
      </span>
      <div className="relative min-w-0 flex-1 overflow-hidden">
        <div className="flex w-max animate-marquee gap-6">
          {items.map((s, i) => (
            <a
              key={`${s}-${i}`}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-[9px] tracking-[0.16em] text-muted-foreground transition-colors hover:text-primary"
            >
              {s}
            </a>
          ))}
        </div>
      </div>
      <span className="hidden shrink-0 text-[9px] text-muted-foreground sm:inline">
        • LAT: 40.7128 • LNG: -74.0060
      </span>
    </footer>
  );
}

export function Shell({ children, showNav = true }: { children: ReactNode; showNav?: boolean }) {
  const [navOpen, setNavOpen] = useState(false);
  const [mobileFrame, setMobileFrame] = useLocalStorage("thorkan.viewport", false);

  return (
    <div className="os-grid-bg flex min-h-screen flex-col bg-background">
      <TopBar
        navOpen={navOpen}
        onToggleNav={() => setNavOpen((v) => !v)}
        mobileFrame={mobileFrame}
        setMobileFrame={setMobileFrame}
      />
      <div className="flex min-h-0 flex-1">
        {showNav ? <SideNav open={navOpen} onNavigate={() => setNavOpen(false)} /> : null}
        <main className="min-w-0 flex-1 p-3 sm:p-4">
          <div
            className={cn(
              "mx-auto min-w-0",
              mobileFrame ? "max-w-[420px] border border-primary/30 p-2" : "max-w-[1600px]"
            )}
          >
            {children}
          </div>
        </main>
      </div>
      <FooterTicker />
    </div>
  );
}