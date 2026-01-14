"use client";

import { useEffect, useState } from "react";

import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

export function RemedialHeaderActions() {
  const [disabled, setDisabled] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (
        event as CustomEvent<{
          disabled: boolean;
          count: number;
        }>
      ).detail;
      if (detail) {
        setDisabled(detail.disabled);
        setCount(detail.count);
      }
    };
    window.addEventListener("remedial-sendstate", handler);
    return () => window.removeEventListener("remedial-sendstate", handler);
  }, []);

  const handleSend = () => {
    window.dispatchEvent(new CustomEvent("remedial-request-send"));
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={handleSend}
        disabled={disabled}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold shadow-lg shadow-primary/20 transition",
          disabled
            ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-600"
            : "border border-primary/40 bg-primary text-white hover:bg-primary/90 dark:border-primary/40"
        )}
      >
        <span className={iconClass("text-lg")}>campaign</span>
        알림 발송
        {count > 0 ? (
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
            {count}명
          </span>
        ) : null}
      </button>
    </div>
  );
}
