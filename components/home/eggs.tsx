"use client";

import { Play } from "@/components/home/play";
import { Terminal } from "@/components/home/terminal";

import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface Command {
  label: string;
  hint: string;
  run: () => void;
}

const SUDO = "sudo";
const LISTBOX_ID = "palette-listbox";
const optionId = (i: number) => `palette-option-${i}`;

export const Eggs = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const typedRef = useRef("");
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  const say = useCallback((message: string) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const commands: Command[] = [
    {
      label: "Toggle theme",
      hint: theme === "dark" ? "let there be light" : "back to the dark",
      run: () => setTheme(theme === "dark" ? "light" : "dark"),
    },
    // Home-only: play mode detaches the page's rows into a physics pile.
    ...(pathname === "/"
      ? [
          {
            label: "Play with the page",
            hint: "loosen things up",
            run: () => {
              if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                say("reduced motion is on — keeping things still");
                return;
              }
              window.dispatchEvent(new CustomEvent("gmsudo:play"));
            },
          },
        ]
      : []),
    {
      label: "XSaved",
      hint: "project",
      run: () => router.push("/projects/xsaved"),
    },
    {
      label: "XSaved for iOS",
      hint: "project",
      run: () => router.push("/projects/xsaved-ios"),
    },
    {
      label: "XSaved for Mac",
      hint: "project",
      run: () => router.push("/projects/xsaved-mac"),
    },
    {
      label: "TabKnight",
      hint: "project — where ⌘K comes from",
      run: () => router.push("/projects/tabknight"),
    },
    {
      label: "Copy email",
      hint: "aitorgamu@gmail.com",
      run: () => navigator.clipboard?.writeText("aitorgamu@gmail.com").then(() => say("email copied ✓")),
    },
    {
      label: "Say hi on X",
      hint: "@gmsudo",
      run: () => window.open("https://x.com/gmsudo", "_blank"),
    },
    {
      label: "GitHub",
      hint: "AitorGallardo",
      run: () => window.open("https://github.com/aitorgallardo", "_blank"),
    },
  ];

  const matches = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  const openPalette = useCallback(() => {
    restoreRef.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setIndex(0);
    setOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) {
          setOpen(false);
        } else {
          openPalette();
        }
        return;
      }

      if (open) return;

      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      if (/^[a-z]$/.test(e.key)) {
        typedRef.current = (typedRef.current + e.key).slice(-SUDO.length);
        if (typedRef.current === SUDO) {
          typedRef.current = "";
          say("gmsudo: permission granted ✓");
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, say, openPalette]);

  useEffect(() => {
    const onTrigger = () => openPalette();
    window.addEventListener("gmsudo:palette", onTrigger);
    return () => window.removeEventListener("gmsudo:palette", onTrigger);
  }, [openPalette]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else {
      restoreRef.current?.focus?.();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const active = listRef.current?.querySelector<HTMLElement>(`[data-index="${index}"]`);
    active?.scrollIntoView({ block: "nearest" });
  }, [index, open]);

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, matches.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
      return;
    }
    // Focus stays pinned to the input, so Tab drives the selection like the
    // arrows do — cycling the active option and keeping focus inside the dialog.
    if (e.key === "Tab") {
      e.preventDefault();
      if (matches.length === 0) return;
      setIndex((i) => (e.shiftKey ? (i - 1 + matches.length) % matches.length : (i + 1) % matches.length));
      return;
    }
    if (e.key === "Enter" && matches[index]) {
      e.preventDefault();
      setOpen(false);
      matches[index].run();
    }
  };

  return (
    <>
      {open && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismiss duplicates the Escape handler on the input
        <div
          className="fade-in fixed inset-0 z-50 flex items-start justify-center bg-black-a6 pt-[18vh]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="w-full max-w-md overflow-hidden rounded-large border border-border bg-background shadow-2xl"
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIndex(0);
              }}
              onKeyDown={onInputKeyDown}
              placeholder="Where to?"
              aria-label="Command palette search"
              role="combobox"
              aria-expanded="true"
              aria-controls={LISTBOX_ID}
              aria-activedescendant={matches[index] ? optionId(index) : undefined}
              className="w-full border-border border-b bg-transparent px-4 py-3 outline-none placeholder:text-muted"
            />
            <div ref={listRef} id={LISTBOX_ID} role="listbox" aria-label="Commands" tabIndex={-1} className="max-h-72 overflow-y-auto py-1 outline-none">
              {matches.length === 0 && <p className="px-4 py-3 text-muted">nothing here — yet</p>}
              {matches.map((command, i) => (
                <button
                  key={command.label}
                  type="button"
                  id={optionId(i)}
                  role="option"
                  aria-selected={i === index}
                  data-index={i}
                  tabIndex={-1}
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
              ))}
            </div>
          </div>
        </div>
      )}

      {toast && (
        <output className="-translate-x-1/2 fade-in fixed bottom-8 left-1/2 z-50 block rounded-[8px] border border-border bg-background px-3.5 py-2 font-mono text-small shadow-lg">
          {toast}
        </output>
      )}

      <Terminal />
      <Play />
    </>
  );
};
