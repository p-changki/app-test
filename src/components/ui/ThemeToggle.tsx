"use client";

import { memo, useEffect, useState } from "react";

import { useTheme } from "@/components/providers/ThemeProvider";
import { iconClass } from "@/lib/icon-class";

const OPTIONS = [
  { value: "light", label: "라이트 모드", icon: "light_mode" },
  { value: "dark", label: "다크 모드", icon: "dark_mode" },
] as const;

export const ThemeToggle = memo(function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const effectiveTheme = mounted ? theme : "light";

  return (
    <div
      className="flex items-center rounded-full border border-slate-200 bg-white/80 p-1 text-xs font-semibold text-slate-500 shadow-sm dark:border-slate-600 dark:bg-surface-dark/80 dark:text-slate-300"
      role="group"
      aria-label="테마 전환"
    >
      {OPTIONS.map((option) => {
        const isActive = effectiveTheme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            aria-pressed={isActive}
            className={`flex items-center gap-1 rounded-full px-3 py-1 transition-colors ${
              isActive
                ? "bg-primary text-white dark:bg-white dark:text-slate-900"
                : "text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-white"
            }`}
          >
            <span className={iconClass("text-[16px]")}>{option.icon}</span>
            <span className="hidden sm:inline">{option.label}</span>
            <span className="sm:hidden">
              {option.value === "light" ? "라이트" : "다크"}
            </span>
          </button>
        );
      })}
    </div>
  );
});
