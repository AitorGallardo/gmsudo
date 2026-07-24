"use client";

import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface Command {
  label: string;
  hint: string;
  run: () => void;
}

const SUDO = "sudo";

export const Eggs = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const typedRef = useRef("");
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();
  const inputRef = useRef<HTMLInputElement>(null);

  const say = useCallback((message: string) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const commands: Command[] = [
    { label: "Toggle theme", hint: theme === "dark" ? "let there be light" : "back to the dark", run: () => setTheme(theme === "dark" ? "light" : "dark") },
    { label: "XSaved", hint: "project", run: () => router.push("/projects/xsaved") },
    { label: "XSaved for iOS", hint: "project", run: () => router.push("/projects/xsaved-ios") },
    { label: "XSaved for Mac", hint: "project", run: () => router.push("/projects/xsaved-mac") },
    { label: "TabKnight", hint: "project — where ⌘K comes from", run: () => router.push("/projects/tabknight") },
    { label: "Copy email", hint: "aitorgamu@gmail.com", run: () => navigator.clipboard?.writeText("aitorgamu@gmail.com").then(() => say("email copied ✓")) },
    { label: "Say hi on X", hint: "@gmsudo", run: () => window.open("https://x.com/gmsudo", "_blank") },
    { label: "GitHub", hint: "AitorGallardo", run: () => window.open("https://github.com/aitorgallardo", "_blank") },
  ];

  const matches = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery("");
        setIndex(0);
        return;
      }

      if (open) return;

      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      if (/^[a-z]$/.test(e.key)) {
        typedRef.current = (typedRef.current + e.key).slice(-SUDO.length);
        if (typedRef.current === SUDO) {
          typedRef.current = "";
          say("gmsudo: permission granted. you found it ✓");
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, say]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <>
      {open && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismiss duplicates the Escape handler below
        <div className="fade-in fixed inset-0 z-50 flex items-start justify-center bg-black-a6 pt-[18vh]" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-md overflow-hidden rounded-large border border-border bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
              if (e.key === "ArrowDown") setIndex((i) => Math.min(i + 1, matches.length - 1));
              if (e.key === "ArrowUp") setIndex((i) => Math.max(i - 1, 0));
              if (e.key === "Enter" && matches[index]) {
                setOpen(false);
                matches[index].run();
              }
            }}
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIndex(0);
              }}
              placeholder="Where to?"
              className="w-full border-border border-b bg-transparent px-4 py-3 outline-none placeholder:text-muted"
            />
            <ul className="max-h-72 overflow-y-auto py-1">
              {matches.length === 0 && <li className="px-4 py-3 text-muted">nothing here — yet</li>}
              {matches.map((command, i) => (
                <li key={command.label}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      command.run();
                    }}
                    onMouseEnter={() => setIndex(i)}
                    className={`flex w-full items-center justify-between px-4 py-2 text-left transition-colors ${i === index ? "bg-gray-a3" : ""}`}
                  >
                    <span>{command.label}</span>
                    <span className="text-muted text-small">{command.hint}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {toast && (
        <output className="-translate-x-1/2 fade-in fixed bottom-8 left-1/2 z-50 block rounded-[8px] border border-border bg-background px-3.5 py-2 font-mono text-small shadow-lg">
          {toast}
        </output>
      )}
    </>
  );
};
