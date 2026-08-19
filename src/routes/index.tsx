import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { Shell } from "@/components/os/Shell";
import { CyberButton, Meter, Panel, Tag } from "@/components/os/Panel";
import { useTelemetry } from "@/lib/os-hooks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "THORKAN OS // BOOTLOADER_v1.000 — Initiate System" },
      {
        name: "description",
        content:
          "Boot the THORKAN-33 orchestrator: daemon diagnostics, crypto sequence validation and live hardware telemetry in a cyberpunk terminal OS.",
      },
      { property: "og:title", content: "THORKAN OS // BOOTLOADER_v1.000" },
      {
        property: "og:description",
        content: "Cyberpunk operations console: boot sequence, diagnostics and live telemetry.",
      },
    ],
  }),
  component: BootScreen,
});

const DAEMONS = [
  ["NODE_01", "SYS.LINK_OK [200]"],
  ["NODE_02", "FIREWALL_ARMED // ACTIVE"],
  ["NODE_03", "KERNEL_LOAD_100% // SUCCESS"],
  ["NODE_04", "MEMORY_FLUSH_COMPLETE"],
  ["NODE_05", "SECURE_ROOT_HANDSHAKE"],
  ["NODE_06", "RUNNING_RANSOM_WARE_Shadow Brokers"],
  ["NODE_07", "US_National_Security_Agency_(NSA)"],
];

const BOOT_LOGS = [
  "> MOUNTING /dev/matrix0 ... OK",
  "> ENTROPY POOL SEEDED (4096 bit)",
  "> LOADING SECTOR_7 ROUTING TABLE",
  "> ENCRYPTED HANDSHAKE READY",
  "> BIOMETRIC SIGNATURE CACHED",
  "> AWAITING OPERATOR CONFIRMATION",
];

function BootScreen() {
  const navigate = useNavigate();
  const [booting, setBooting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(2);

  const uplink = useTelemetry(99, 1);
  const buffer = useTelemetry(98, 2);
  const entropy = useTelemetry(94, 3);
  const ram = useTelemetry(88, 6);
  const gpu = useTelemetry(76, 8);
  const npu = useTelemetry(64, 9);
  const cpu = useTelemetry(41, 10);
  const swap = useTelemetry(22, 6);

  useEffect(() => {
    if (!booting) return;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(id);
          return 100;
        }
        return p + 4;
      });
      setLogIndex((i) => Math.min(BOOT_LOGS.length, i + 1));
    }, 60);
    return () => clearInterval(id);
  }, [booting]);

  useEffect(() => {
    if (progress < 100) return undefined;
    const id = setTimeout(() => navigate({ to: "/hub" }), 420);
    return () => clearTimeout(id);
  }, [progress, navigate]);

  return (
    <Shell showNav={false}>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="border-l-2 border-primary pl-3">
            <p className="text-[11px] tracking-[0.2em] text-muted-foreground">
              SYSTEM_DAEMON_STATUS
            </p>
            <p className="os-glow-text text-sm tracking-[0.2em] text-primary">DIAGNOSTICS</p>
          </div>
          <ul className="space-y-2">
            {DAEMONS.map(([node, msg]) => (
              <li key={node} className="border-b border-border/60 pb-1.5">
                <p className="os-label">{node}</p>
                <p className="truncate text-[11px] text-accent">{msg}</p>
              </li>
            ))}
          </ul>
          <p className="flex items-center gap-2 text-[10px] text-warning">
            <AlertTriangle className="h-3 w-3 shrink-0" /> EXT_COMMS_RESTRICTED
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 py-6">
          <button
            onClick={() => setBooting(true)}
            className="os-corner group relative grid h-64 w-64 place-items-center border border-primary/40 sm:h-80 sm:w-80"
            aria-label="Initiate system"
          >
            <span className="absolute inset-4 animate-spin-slow rounded-full border border-dashed border-primary/40" />
            <span className="absolute inset-8 animate-spin-reverse rounded-full border border-primary/25" />
            <span className="absolute inset-12 animate-pulse-ring rounded-full border border-primary/60 shadow-[0_0_60px_oklch(0.885_0.184_168/25%)]" />
            <span className="absolute inset-16 rounded-full bg-primary/5" />
            <span className="relative text-center">
              <span className="os-glow-text block text-base tracking-[0.28em] text-primary transition-transform group-hover:scale-105 sm:text-lg">
                {booting ? "BOOTING" : "INITIATE"}
              </span>
              <span className="os-glow-text block text-base tracking-[0.28em] text-primary sm:text-lg">
                SYSTEM
              </span>
              <span className="mx-auto mt-2 block h-[2px] w-10 bg-primary/70" />
              {booting ? (
                <span className="mt-2 block text-[10px] text-accent tabular-nums">
                  {progress}% // LOADING
                </span>
              ) : null}
            </span>
          </button>
          <Panel title="BOOT_SEQUENCE_LOGS" className="w-full max-w-md" right={`${progress}%`}>
            <div className="space-y-2">
              <Meter label="NETWORK_STABILITY" value={Math.min(100, 60 + progress * 0.4)} />
              <Meter label="DATA_MATRIX_BUFFER" value={Math.min(100, 40 + progress * 0.6)} />
              <Meter label="SECURITY_LAYER" value={Math.min(100, 30 + progress * 0.7)} />
              <div className="mt-2 max-h-28 space-y-1 overflow-y-auto font-mono text-[10px] text-muted-foreground">
                {BOOT_LOGS.slice(0, logIndex).map((l) => (
                  <p key={l} className={l.includes("READY") ? "text-primary" : undefined}>
                    {l}
                  </p>
                ))}
              </div>
            </div>
          </Panel>
          <CyberButton onClick={() => navigate({ to: "/hub" })} tone="ghost">
            SKIP_TO_COMMAND_GRID
          </CyberButton>
        </div>

        <div className="space-y-4">
          <div className="text-right">
            <p className="text-[11px] tracking-[0.2em] text-muted-foreground">CRYPTO_SEQUENCE</p>
            <p className="mt-2 text-[9px] text-accent">0x9F2E...DE44 VALIDATED</p>
            <p className="text-[9px] text-accent">RSA_4096_SHA256_ACTIVE</p>
            <p className="text-[9px] text-accent">ECDSA_P256_VERIFIED</p>
          </div>
          <div className="space-y-2">
            <Meter label="UPLINK_STABILITY" value={uplink} />
            <Meter label="ENCRYPTION_BUFFER" value={buffer} />
            <Meter label="ENTROPY_COLLECTOR" value={entropy} />
            <Meter label="RAM" value={ram} />
            <Meter label="GPU" value={gpu} />
            <Meter label="NPU" value={npu} />
            <Meter label="CPU" value={cpu} tone="accent" />
            <Meter label="SWAP" value={swap} tone="warning" />
          </div>
          <div className="border-r-2 border-primary pr-3 text-right">
            <p className="os-label">OPERATIONAL_LEVEL</p>
            <p className="os-glow-text text-sm tracking-[0.2em] text-primary">LEVEL_999</p>
          </div>
          <div className="os-panel os-corner space-y-1 p-3">
            <p className="flex items-center gap-2 text-[10px] text-warning">
              <Lock className="h-3 w-3 shrink-0" /> SECURITY_PROTOCOL_NOTICE
            </p>
            <p className="text-[9px] leading-relaxed text-muted-foreground">
              NOTICE: UNAUTHORIZED SYSTEM COPIES ARE STRICTLY MONITORED. BIOMETRIC SIGNATURES AND IP
              TRACING ARE ACTIVE. PROCEED WITH AUTHORIZED CREDENTIALS ONLY.
            </p>
            <div className="flex flex-wrap gap-1 pt-1">
              <Tag>SECURE_CELL</Tag>
              <Tag tone="warning">TRACE_ON</Tag>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
