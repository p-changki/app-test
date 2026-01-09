"use client";

import { memo, useEffect, useState } from "react";

import { useTheme } from "@/components/providers/ThemeProvider";
import { iconClass } from "@/lib/icon-class";

export const ThemeToggle = memo(function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const effectiveTheme = mounted ? theme : "light";
  const isDark = effectiveTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";
  const icon = isDark ? "light_mode" : "dark_mode";
  const label = isDark ? "라이트 모드로 전환" : "다크 모드로 전환";

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setTheme(nextTheme)}
      className="flex size-9 items-center justify-center rounded-full border border-[color:var(--surface-border)] bg-white text-slate-600 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200"
    >
      <span className={iconClass("text-[18px]")}>{icon}</span>
    </button>
  );
});
