import { createFileRoute } from "@tanstack/react-router";
import { Radar, ShieldCheck, ShieldOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Shell } from "@/components/os/Shell";
import { CyberButton, PageHeader, Panel, Stat, Tag } from "@/components/os/Panel";
import { useLocalStorage, useTelemetry } from "@/lib/os-hooks";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/cybersecurity")({
  head: () => ({
    meta: [
      { title: "Cybersecurity Grid — THORKAN OS" },
      {
        name: "description",
        content:
          "Network recon dashboard with DEFCON status, global intrusion map, firewall controls and an interactive port-scanner terminal.",
      },
      { property: "og:title", content: "Cybersecurity Grid — THORKAN OS" },
      {
        property: "og:description",
        content: "Live intrusion telemetry, threat logs and a simulated nmap terminal.",
      },
    ],
  }),
  component: CyberPage,
});

const THREAT_LOGS = [
  ["SQL INJECTION ATTEMPT", "SRC: 185.23.10.222 -> DST: web_srv_01", "Action: BLOCK / DROP", "14:22:07"],
  ["SSH LOGIN SUCCESSFUL", "USER: admin from 10.0.0.52", "Action: AUTH_OK", "14:21:45"],
  ["ABNORMAL EGRESS TRAFFIC", "Volume: 2.4 GB to Unk_Endpoint", "Action: ALERT / THROTTLE", "14:20:12"],
  ["PORT SCAN DETECTED", "SRC: 202.44.21.11 -> ALL_HOSTS", "Action: BLACKLIST_IP", "14:19:56"],
  ["SYSTEM UPDATE APPLIED", "Patch KB-1092-X deployed", "Action: COMMIT", "14:15:02"],
];

function respond(cmd: string): string[] {
  const c = cmd.trim();
  if (!c) return [];
  if (c === "help")
    return ["[SYS] AVAILABLE: nmap <host>, ping <host>, whoami, netstat, clear, defcon"];
  if (c.startsWith("nmap"))
    return [
      `Starting Nmap 7.92 ( https://nmap.org ) at ${new Date().toISOString().slice(0, 19)}`,
      `Nmap scan report for ${c.split(" ").pop()}`,
      "Host is up (0.00015s latency).",
      "PORT     STATE   SERVICE",
      "22/tcp   open    ssh",
      "80/tcp   open    http",
      "443/tcp  open    https",
      "3306/tcp filtered mysql",
      "Nmap done: 1 IP address (1 host up) scanned in 1.42 seconds",
    ];
  if (c.startsWith("ping"))
    return [`PING ${c.split(" ")[1] ?? "10.0.0.1"}: 56 data bytes`, "64 bytes: icmp_seq=0 ttl=59 time=12.4 ms"];
  if (c === "whoami") return ["operator_33 // clearance LEVEL_999"];
  if (c === "netstat")
    return ["Proto Local           Foreign         State", "tcp   10.0.0.52:22    185.23.10.9   ESTABLISHED"];
  if (c === "defcon") return ["[+] CURRENT THREAT POSTURE: DEFCON 2"];
  return [`command not found: ${c}`];
}

function Terminal() {
  const [history, setHistory] = useLocalStorage<string[]>("thorkan.terminal", [
    "[SYSTEM] Initialization sequence complete...",
    "[SYSTEM] Connecting to gateway 10.0.0.1... SUCCESS",
    "[SYSTEM] Type 'help' for the command matrix.",
  ]);
  const [input, setInput] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight });
  }, [history]);

  return (
    <Panel
      title="LIVE PORT SCANNER TERMINAL"
      right={<span className="text-primary">● SCANNING…</span>}
      className="min-h-[320px]"
    >
      <div
        ref={boxRef}
        className="h-52 overflow-y-auto bg-background/60 p-2 font-mono text-[10px] leading-relaxed text-accent"
      >
        {history.map((line, i) => (
          <p key={i} className={line.startsWith("$") ? "text-primary" : undefined}>
            {line}
          </p>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          if (input.trim() === "clear") {
            setHistory([]);
            setInput("");
            return;
          }
          setHistory((h) => [...h, `$ ${input}`, ...respond(input)]);
          setInput("");
        }}
        className="mt-2 flex items-center gap-2 border border-input px-2 py-1.5"
      >
        <span className="text-primary">$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="nmap -sV 192.168.1.1"
          className="min-w-0 flex-1 bg-transparent font-mono text-[11px] text-foreground outline-none placeholder:text-muted-foreground"
        />
        <CyberButton type="submit">RUN</CyberButton>
      </form>
    </Panel>
  );
}

function CyberPage() {
  const latency = useTelemetry(12.4, 2);
  const nodes = useTelemetry(1402, 30);
  const throughput = useTelemetry(4.2, 0.5);
  const [dpi, setDpi] = useState(true);
  const [tunnel, setTunnel] = useState(true);
  const [proxy, setProxy] = useState(false);

  return (
    <Shell>
      <div className="space-y-4">
        <PageHeader
          title="CYBERSECURITY GRID"
          subtitle="NETWORK RECON // SEC.NETWORK_CORE"
          right={<Tag tone="destructive">CRITICAL</Tag>}
        />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="THREAT LEVEL" value="DEFCON 2" sub="Intrusion attempts up 42%" tone="destructive" />
          <Stat label="NETWORK LATENCY" value={`${latency.toFixed(1)}ms`} sub="Nominal state active" />
          <Stat label="ENCRYPTED NODES" value={nodes.toFixed(0)} sub="98.2% security coverage" />
          <Stat label="DATA THROUGHPUT" value={`${throughput.toFixed(1)} GB/s`} sub="Egress monitoring enabled" />
        </div>

        <div className="grid gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Panel
            title="GLOBAL INTRUSION MAP"
            right={
              <span className="flex gap-3">
                <span className="text-primary">● SOURCE</span>
                <span className="text-destructive">● TARGET</span>
              </span>
            }
          >
            <div className="os-grid-bg relative h-64 overflow-hidden border border-border bg-background/50">
              <Radar className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 animate-spin-slow text-primary/20" />
              {[
                [22, 30],
                [48, 55],
                [70, 28],
                [80, 66],
                [35, 74],
              ].map(([x, y], i) => (
                <span
                  key={i}
                  className="absolute h-2 w-2 animate-pulse-ring rounded-full bg-primary shadow-[0_0_12px_oklch(0.885_0.184_168/70%)]"
                  style={{ left: `${x}%`, top: `${y}%` }}
                />
              ))}
              <div className="absolute top-2 left-2 border border-border bg-background/80 p-2 text-[9px] text-muted-foreground">
                <p className="text-primary">ACTIVE THREATS</p>
                <p>IP 192.168.1.42:SGP-1</p>
                <p>IP 45.12.99.19:VOS-4</p>
                <p>IP 210.51.255.9:ED-2</p>
              </div>
            </div>
          </Panel>

          <Panel title="FIREWALL STATUS">
            <div className="space-y-2">
              {[
                ["DEEP PACKET INSPECTION", dpi, setDpi, "ACTIVE"] as const,
                ["ENCRYPTED TUNNEL", tunnel, setTunnel, "STABLE"] as const,
                ["PROXY FILTERING", proxy, setProxy, "DISABLED"] as const,
              ].map(([label, val, set, state]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 border border-border px-2 py-2"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    {val ? (
                      <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
                    ) : (
                      <ShieldOff className="h-3.5 w-3.5 shrink-0 text-destructive" />
                    )}
                    <div className="min-w-0">
                      <p className="os-label truncate">{label}</p>
                      <p className={val ? "text-[10px] text-primary" : "text-[10px] text-destructive"}>
                        {val ? state : "DISABLED"}
                      </p>
                    </div>
                  </div>
                  <Switch checked={val} onCheckedChange={set} />
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="grid gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Terminal />
          <Panel title="THREAT LOGS" right="AUTO-REFRESH 2S">
            <ul className="max-h-72 space-y-2 overflow-y-auto">
              {THREAT_LOGS.map(([title, src, action, time]) => (
                <li key={title} className="border-l-2 border-primary/50 pl-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-[10px] text-primary">{title}</p>
                    <span className="shrink-0 text-[9px] text-muted-foreground">{time}</span>
                  </div>
                  <p className="truncate text-[9px] text-muted-foreground">{src}</p>
                  <p className="text-[9px] text-warning">{action}</p>
                </li>
              ))}
            </ul>
            <CyberButton className="mt-3 w-full">EXPORT SECURITY REPORT</CyberButton>
          </Panel>
        </div>
      </div>
    </Shell>
  );
}