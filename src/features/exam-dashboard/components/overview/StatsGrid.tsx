import type { ExamStatCard } from "@/types/exams";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";
import { lexend } from "@/lib/fonts";

type StatsGridProps = {
  stats: ExamStatCard[];
};

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard key={stat.title} stat={stat} />
      ))}
    </section>
  );
}

function StatsCard({ stat }: { stat: ExamStatCard }) {
  if (stat.variant === "critical") {
    return (
      <div className="relative overflow-hidden rounded-xl border border-rose-200 bg-rose-50 p-6 shadow-md dark:border-rose-900/50 dark:bg-rose-900/10">
        <div className="absolute -right-4 -top-4 text-rose-200 opacity-40 dark:text-rose-800">
          <span className={iconClass("text-[100px]")}>cancel</span>
        </div>
        <div className="relative z-10">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold text-rose-700 dark:text-rose-300">
              {stat.title}
            </p>
            <span className="rounded-md bg-rose-200 p-1.5 text-rose-700 dark:bg-rose-500/40 dark:text-rose-200">
              <span className={iconClass("text-lg")}>priority_high</span>
            </span>
          </div>
          <div className="mb-1 flex items-end gap-2">
            <p className="text-3xl font-bold text-rose-700 dark:text-rose-300">
              {stat.value}
            </p>
            <p className="mb-1 text-xs font-medium text-rose-600 dark:text-rose-400">
              {stat.subtitle}
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              className="rounded bg-[var(--surface-background)] py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 dark:bg-[var(--surface-background)] dark:text-rose-300"
            >
              목록 보기
            </button>
            <button
              type="button"
              className="rounded bg-rose-600 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700"
            >
              재시험 배정
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-[var(--surface-background)] p-6 shadow-sm dark:border-slate-700 dark:bg-[var(--surface-background)]">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {stat.title}
          </p>
          {stat.icon && (
            <span className={cn("rounded-md p-1.5", stat.accentClass)}>
              <span className={iconClass("text-lg")}>{stat.icon}</span>
            </span>
          )}
        </div>
        <p
          className={cn(
            "text-3xl font-bold",
            stat.title === "평균 점수" ? lexend.className : undefined
          )}
        >
          {stat.value}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {stat.subtitle}
        </p>
      </div>
    </div>
  );
}
