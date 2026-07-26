"use client";

import type React from "react";

import { cn } from "@/lib/cn";

import { Moon, Sun } from "lucide-react";
import { ThemeProvider, useTheme } from "next-themes";
import { useEffect, useState } from "react";

// iOS colours its status bar / chrome from <meta name="theme-color">. The static
// pair in layout.tsx keys off prefers-color-scheme, which is right until the user
// picks a theme that disagrees with the OS. This keeps a media-less theme-color
// meta (which always matches, so it wins as the last-declared tag) in sync with
// the *resolved* theme, so the bar never mismatches the page background.
const BG = { dark: "#111111", light: "#fcfcfc" } as const;

const ThemeColorSync = () => {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const color = BG[resolvedTheme === "light" ? "light" : "dark"];
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]:not([media])');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", color);
  }, [resolvedTheme]);

  return null;
};

export const AppThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const buttons = [
    // {
    //   label: "system",
    //   icon: <Monitor width={13} />,
    //   active: theme === "system",
    // },
    { label: "dark", icon: <Moon width={13} />, active: theme === "dark" },
    { label: "light", icon: <Sun width={13} />, active: theme === "light" },
  ];

  return (
    <span className="flex w-fit items-center gap-0.5 overflow-hidden rounded-[6px] bg-gray-2 p-[2px]">
      {buttons.map(({ label, icon, active }) => (
        <button
          type="button"
          key={label}
          onClick={() => setTheme(label)}
          aria-label={`Switch to ${label} theme`}
          aria-pressed={active}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-[4px] transition-all hover:opacity-50",
            "max-sm:h-[44px] max-sm:w-[44px] max-sm:rounded-[6px] max-sm:[&_svg]:h-[18px] max-sm:[&_svg]:w-[18px]",
            active ? "bg-gray-4 text-foreground" : "",
          )}
        >
          {icon}
        </button>
      ))}
    </span>
  );
};

export const AppThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ThemeProvider enableSystem={true} attribute="class" storageKey="theme" defaultTheme="dark">
      <ThemeColorSync />
      {children}
    </ThemeProvider>
  );
};
