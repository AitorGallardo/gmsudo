"use client";

import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Tone = "prompt" | "out" | "accent";

interface Line {
  id: number;
  tone: Tone;
  text: string;
}

const sections: Record<string, string[]> = {
  work: ["apartool", "freelance", "2shapes"],
  projects: ["xsaved", "tabknight"],
  lab: ["xsaved-mcp", "xsaved-rag", "xsaved-topics", "megaport-network-visualizer"],
  earlier: ["bbbookmarks"],
};

type Target = { kind: "internal"; path: string } | { kind: "external"; url: string };

const openTargets: Record<string, Target> = {
  xsaved: { kind: "internal", path: "/projects/xsaved" },
  tabknight: { kind: "internal", path: "/projects/tabknight" },
  bbbookmarks: { kind: "internal", path: "/projects/bbbookmarks" },
  x: { kind: "external", url: "https://x.com/gmsudo" },
  github: { kind: "external", url: "https://github.com/aitorgallardo" },
  cv: { kind: "external", url: `${basePath}/documents/cv.pdf` },
};

const HELP: string[] = [
  "help    — this list",
  "whoami  — who's behind this",
  "ls      — list sections (try: ls projects)",
  "open    — open <xsaved|tabknight|bbbookmarks|x|github|cv>",
  "theme   — toggle light / dark",
  "sudo    — with great power…",
  "clear   — clear the screen",
  "exit    — close",
];

export const Terminal = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIndex, setHistIndex] = useState<number | null>(null);

  const idRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  const nextId = () => {
    idRef.current += 1;
    return idRef.current;
  };

  const make = (tone: Tone, text: string): Line => ({
    id: nextId(),
    tone,
    text,
  });

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onOpen = () => {
      restoreRef.current = document.activeElement as HTMLElement | null;
      idRef.current = 1;
      setLines([{ id: 1, tone: "out", text: "gmsudo shell — type help" }]);
      setInput("");
      setHistory([]);
      setHistIndex(null);
      setOpen(true);
    };
    window.addEventListener("gmsudo:terminal", onOpen);
    return () => window.removeEventListener("gmsudo:terminal", onOpen);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else {
      restoreRef.current?.focus?.();
    }
  }, [open]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run to pin the scrollback to the bottom whenever it grows
  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, open]);

  const run = (raw: string) => {
    const echo = make("prompt", `$ ${raw}`);
    const trimmed = raw.trim();

    if (!trimmed) {
      setLines((prev) => [...prev, echo]);
      return;
    }

    const [cmd, ...args] = trimmed.split(/\s+/);
    const name = cmd.toLowerCase();
    const out: Line[] = [];
    const push = (tone: Tone, text: string) => out.push(make(tone, text));

    switch (name) {
      case "help":
        for (const line of HELP) push("out", line);
        break;
      case "whoami":
        push("out", "aitor gallardo — full-stack & ai engineer. @gmsudo.");
        break;
      case "ls": {
        const section = args[0]?.toLowerCase();
        if (!section) {
          push("out", "work/  projects/  lab/  earlier/");
        } else if (sections[section]) {
          push("out", sections[section].join("  "));
        } else {
          push("out", `ls: no such section: ${section}`);
        }
        break;
      }
      case "open": {
        const key = args[0]?.toLowerCase();
        const target = key ? openTargets[key] : undefined;
        if (!key) {
          push("out", "usage: open <xsaved|tabknight|bbbookmarks|x|github|cv>");
        } else if (!target) {
          push("out", `open: not found: ${key} (try: ${Object.keys(openTargets).join(", ")})`);
        } else if (target.kind === "internal") {
          setLines((prev) => [...prev, echo, make("out", `opening ${key}…`)]);
          setOpen(false);
          router.push(target.path);
          return;
        } else {
          window.open(target.url, "_blank", "noopener,noreferrer");
          push("out", `opening ${key}…`);
        }
        break;
      }
      case "theme": {
        const nextTheme = theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        push("out", `theme → ${nextTheme}`);
        break;
      }
      case "sudo": {
        const rest = args.join(" ").toLowerCase();
        if (!rest) {
          push("out", "usage: sudo <command>");
        } else if (rest === "make me a sandwich") {
          push("out", "okay.");
        } else {
          push("accent", "permission granted ✓");
        }
        break;
      }
      case "clear":
        setLines([]);
        return;
      case "exit":
        setLines((prev) => [...prev, echo]);
        setOpen(false);
        return;
      default:
        push("out", `command not found: ${cmd} (try help)`);
    }

    setLines((prev) => [...prev, echo, ...out]);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = input;
    if (raw.trim()) {
      setHistory((prev) => [...prev, raw]);
    }
    setHistIndex(null);
    setInput("");
    run(raw);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const next = histIndex === null ? history.length - 1 : Math.max(0, histIndex - 1);
      setHistIndex(next);
      setInput(history[next]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIndex === null) return;
      const next = histIndex + 1;
      if (next >= history.length) {
        setHistIndex(null);
        setInput("");
      } else {
        setHistIndex(next);
        setInput(history[next]);
      }
    }
  };

  if (!open) return null;

  return (
    <>
      <button type="button" aria-hidden tabIndex={-1} onClick={close} className="fixed inset-0 z-40 cursor-default" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Terminal"
        className="fade-in fixed inset-x-0 bottom-0 z-50 flex max-h-[70vh] flex-col rounded-t-large border border-border bg-background font-mono text-small shadow-2xl sm:inset-x-auto sm:top-20 sm:bottom-auto sm:left-6 sm:w-[360px] sm:rounded-large"
      >
        <div className="flex items-center justify-between border-border border-b px-3 py-2">
          <span className="text-muted">aitor@gmsudo:~</span>
          <button type="button" onClick={close} aria-label="Close terminal" className="text-muted transition-colors hover:text-foreground">
            ×
          </button>
        </div>

        <div ref={scrollRef} className="max-h-[40vh] flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {lines.map((line) => (
            <p key={line.id} className={line.tone === "out" ? "whitespace-pre-wrap text-muted" : "whitespace-pre-wrap text-accent"}>
              {line.text}
            </p>
          ))}
        </div>

        <form onSubmit={onSubmit} className="flex items-center gap-2 border-border border-t px-3 py-2">
          <span className="text-accent">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Terminal input"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted"
          />
        </form>
      </div>
    </>
  );
};
