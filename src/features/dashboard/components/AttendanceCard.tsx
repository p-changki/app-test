import Link from "next/link";

import type { AttendanceSummary } from "@/features/dashboard/types";

type AttendanceCardProps = {
  summary: AttendanceSummary;
};

export function AttendanceCard({ summary }: AttendanceCardProps) {
  return (
    <section className="flex flex-col rounded-xl border border-border-light bg-surface-light p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark">
      <div>
        <div className="mb-1 flex items-start justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            오늘의 출결 현황
          </h3>
          <Link
            href="#"
            className="text-sm font-medium text-primary hover:underline"
          >
            자세히
          </Link>
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            출석 {summary.attended}명
          </p>
          <span className="text-sm text-slate-500">/ {summary.total}명</span>
        </div>
        <p className="mt-1 text-xs text-slate-400">{summary.dateLabel}</p>
      </div>
      <div className="mt-6 space-y-4">
        {summary.breakdown.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="w-8 text-sm font-bold text-slate-600 dark:text-slate-300">
              {item.label}
            </span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full ${item.colorClass}`}
                style={{ width: `${item.percent}%` }}
              />
            </div>
            <span className="w-8 text-right text-sm font-medium text-slate-500">
              {item.percent}%
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
