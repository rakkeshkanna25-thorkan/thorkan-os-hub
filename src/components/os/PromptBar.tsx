import { ChevronDown, CornerDownLeft, Terminal } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PROMPT_CONTEXTS, useOsConfig, type PromptContextId } from "@/lib/os-config";

/**
 * Unified OS prompt bar. Every command input in THORKAN OS uses this so the
 * source context (Terminal / Local Model / API Key / …) is always switchable.
 */
export function PromptBar({
  placeholder = "ENTER_COMMAND...",
  onSubmit,
  prefix,
  multiline = false,
  className,
  autoFocus = false,
  showHint = true,
}: {
  placeholder?: string;
  onSubmit?: (value: string, context: PromptContextId) => void;
  prefix?: ReactNode;
  multiline?: boolean;
  className?: string;
  autoFocus?: boolean;
  showHint?: boolean;
}) {
  const { config } = useOsConfig();
  const [ctxId, setCtxId] = useState<PromptContextId>(config.vars.defaultPromptContext);
  const [value, setValue] = useState("");
  const active = PROMPT_CONTEXTS.find((c) => c.id === ctxId) ?? PROMPT_CONTEXTS[0];

  const send = () => {
    if (!value.trim()) return;
    onSubmit?.(value.trim(), ctxId);
    setValue("");
  };

  return (
    <div className={cn("min-w-0", className)}>
      <div className="flex min-w-0 items-stretch border border-input bg-background/60">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex shrink-0 items-center gap-1 border-r border-input px-2 py-1.5 text-[9px] tracking-[0.14em] text-primary transition-colors hover:bg-primary/10">
            <Terminal className="h-3 w-3" />
            <span className="hidden sm:inline">{active.label}</span>
            <ChevronDown className="h-3 w-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel className="os-label">INPUT_CONTEXT</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {PROMPT_CONTEXTS.map((c) => (
              <DropdownMenuItem
                key={c.id}
                onClick={() => setCtxId(c.id)}
                className={cn(
                  "flex-col items-start gap-0 text-[10px] tracking-[0.12em]",
                  c.id === ctxId && "text-primary"
                )}
              >
                <span>{c.label}</span>
                <span className="text-[9px] text-muted-foreground">{c.hint}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {prefix ? (
          <span className="flex shrink-0 items-center pl-2 text-[10px] text-primary">{prefix}</span>
        ) : null}

        {multiline ? (
          <textarea
            autoFocus={autoFocus}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="min-w-0 flex-1 resize-none bg-transparent px-2 py-1.5 text-[10px] tracking-[0.1em] text-foreground outline-none placeholder:text-muted-foreground"
          />
        ) : (
          <input
            autoFocus={autoFocus}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                send();
              }
            }}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-[10px] tracking-[0.1em] text-foreground outline-none placeholder:text-muted-foreground"
          />
        )}

        <button
          type="button"
          onClick={send}
          aria-label="Submit prompt"
          className="shrink-0 border-l border-input px-2 text-primary transition-colors hover:bg-primary/15"
        >
          <CornerDownLeft className="h-3 w-3" />
        </button>
      </div>
      {showHint ? <p className="os-label mt-1 truncate">SRC: {active.hint}</p> : null}
    </div>
  );
}