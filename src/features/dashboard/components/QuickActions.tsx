import Link from "next/link";

import type { QuickAction } from "@/features/dashboard/types";
import { iconClass } from "@/lib/icon-class";

type QuickActionsProps = {
  actions: QuickAction[];
};

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.title}
          href={action.href}
          className="group flex items-center gap-4 rounded-xl border border-border-light bg-surface-light p-4 text-left shadow-sm transition hover:shadow-md dark:border-border-dark dark:bg-surface-dark"
        >
          <div
            className={`size-12 rounded-lg ${action.accentClass} flex items-center justify-center transition-transform group-hover:scale-110`}
          >
            <span className={iconClass("text-[20px]")}>{action.icon}</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {action.title}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {action.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
