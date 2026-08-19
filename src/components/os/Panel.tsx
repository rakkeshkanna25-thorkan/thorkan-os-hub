import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  title,
  right,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("os-panel os-corner flex flex-col", className)}>
      {title ? (
        <header className="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
          <h2 className="os-label truncate text-primary/80">{title}</h2>
          {right ? <div className="shrink-0 text-[10px] text-muted-foreground">{right}</div> : null}
        </header>
      ) : null}
      <div className={cn("min-w-0 flex-1 p-3", bodyClassName)}>{children}</div>
    </section>
  );
}

export function Meter({
  label,
  value,
  suffix = "%",
  tone = "primary",
}: {
  label: string;
  value: number;
  suffix?: string;
  tone?: "primary" | "accent" | "warning" | "destructive";
}) {
  const toneBg = {
    primary: "bg-primary",
    accent: "bg-accent",
    warning: "bg-warning",
    destructive: "bg-destructive",
  }[tone];
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-2">
        <span className="os-label truncate">{label}</span>
        <span className="shrink-0 text-[10px] text-primary">
          {value.toFixed(1)}
          {suffix}
        </span>
      </div>
      <div className="mt-1 h-[3px] w-full bg-secondary">
        <div
          className={cn("h-full transition-all duration-700", toneBg)}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

export function Stat({
  label,
  value,
  sub,
  tone = "primary",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "primary" | "warning" | "destructive";
}) {
  const toneText = {
    primary: "text-primary",
    warning: "text-warning",
    destructive: "text-destructive",
  }[tone];
  return (
    <div className="os-panel os-corner min-w-0 p-3">
      <p className="os-label truncate">{label}</p>
      <p className={cn("os-glow-text mt-2 truncate text-2xl font-bold", toneText)}>{value}</p>
      {sub ? <p className="mt-1 truncate text-[10px] text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

export function Tag({
  children,
  tone = "primary",
}: {
  children: ReactNode;
  tone?: "primary" | "warning" | "destructive" | "muted";
}) {
  const cls = {
    primary: "border-primary/40 text-primary",
    warning: "border-warning/40 text-warning",
    destructive: "border-destructive/50 text-destructive",
    muted: "border-border text-muted-foreground",
  }[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border px-1.5 py-0.5 text-[9px] tracking-[0.15em] uppercase",
        cls
      )}
    >
      {children}
    </span>
  );
}

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle: string;
  right?: ReactNode;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
      <div className="min-w-0">
        <h1 className="os-glow-text truncate text-lg font-bold tracking-[0.18em] text-primary sm:text-xl">
          {title}
        </h1>
        <p className="os-label mt-1 truncate">{subtitle}</p>
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </header>
  );
}

export function CyberButton({
  children,
  onClick,
  tone = "primary",
  className,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: "primary" | "ghost" | "danger";
  className?: string;
  type?: "button" | "submit";
}) {
  const cls = {
    primary:
      "border-primary/60 bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-[0_0_18px_oklch(0.885_0.184_168/35%)]",
    ghost: "border-border text-muted-foreground hover:border-primary/50 hover:text-primary",
    danger: "border-destructive/60 bg-destructive/10 text-destructive hover:bg-destructive/25",
  }[tone];
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 border px-3 py-1.5 text-[10px] tracking-[0.18em] uppercase transition-all active:scale-[0.98]",
        cls,
        className
      )}
    >
      {children}
    </button>
  );
}