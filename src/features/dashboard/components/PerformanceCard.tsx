import type { PerformanceSummary } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

type PerformanceCardProps = {
  summary: PerformanceSummary;
};

export function PerformanceCard({ summary }: PerformanceCardProps) {
  return (
    <section className="rounded-xl border border-border-light bg-surface-light p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {summary.subject}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {summary.description}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {summary.averageScore}
          </p>
          <p
            className={cn(
              "text-sm font-medium",
              summary.changeState === "increase"
                ? "text-emerald-600"
                : "text-red-500"
            )}
          >
            {summary.changeLabel}
          </p>
        </div>
      </div>
      <div className="relative aspect-[21/9] w-full">
        <svg
          viewBox="0 0 478 150"
          className="h-full w-full"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="trendGradient"
              x1="239"
              y1="0"
              x2="239"
              y2="150"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#2b8cee" stopOpacity="0.2" />
              <stop offset="1" stopColor="#2b8cee" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H0V109Z"
            fill="url(#trendGradient)"
          />
          <path
            d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
            stroke="#2b8cee"
            strokeWidth={3}
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="mt-4 flex justify-between px-2 text-xs font-medium text-slate-400">
        {["1주차", "2주차", "3주차", "4주차", "5주차", "6주차"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </section>
  );
}
