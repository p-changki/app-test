import { iconClass } from "@/lib/icon-class";

type DashboardHeaderProps = {
  searchPlaceholder: string;
  primaryAction: string;
};

export function DashboardHeader({
  searchPlaceholder,
  primaryAction,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-transparent bg-background-light px-8 dark:bg-background-dark">
      <div className="relative w-full max-w-md">
        <span
          className={iconClass(
            "absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400"
          )}
        >
          search
        </span>
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full rounded-full border border-border-light bg-white py-2 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-primary/50 dark:border-border-dark dark:bg-surface-dark dark:text-white"
        />
      </div>
      <div className="ml-6 flex items-center gap-4">
        <button className="relative rounded-full p-2 text-slate-600 transition hover:bg-white dark:text-slate-400 dark:hover:bg-surface-dark">
          <span className={iconClass()}>notifications</span>
          <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-background-light bg-red-500 dark:border-background-dark" />
        </button>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-600">
          <span className={iconClass("text-[18px]")}>add</span>
          <span>{primaryAction}</span>
        </button>
      </div>
    </header>
  );
}
