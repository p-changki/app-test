import type { MetricCard } from "@/features/dashboard/types";
import { iconClass } from "@/lib/icon-class";

type MetricsGridProps = {
  metrics: MetricCard[];
};

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <article
          key={metric.label}
          className="rounded-xl border border-border-light bg-surface-light p-6 shadow-sm transition hover:shadow-md dark:border-border-dark dark:bg-surface-dark"
        >
          <div className="mb-4 flex items-start justify-between">
            <div
              className={`rounded-lg p-2 ${metric.accentClass} flex items-center justify-center`}
            >
              <span className={iconClass()}>{metric.icon}</span>
            </div>
            <span
              className={`rounded px-2 py-1 text-xs font-bold ${
                metric.deltaState === "increase"
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
                  : "bg-red-50 text-red-500 dark:bg-red-900/20"
              }`}
            >
              {metric.deltaLabel}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {metric.label}
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {metric.value}
          </p>
        </article>
      ))}
    </div>
  );
}
