import Link from "next/link";

import type { AssignmentStatus } from "@/features/dashboard/types";

type AssignmentStatusCardProps = {
  assignments: AssignmentStatus[];
};

export function AssignmentStatusCard({
  assignments,
}: AssignmentStatusCardProps) {
  return (
    <section className="flex flex-col rounded-xl border border-border-light bg-surface-light p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          최근 과제/시험 현황
        </h3>
        <Link href="#" className="text-sm text-primary hover:underline">
          더보기
        </Link>
      </div>
      <div className="flex flex-1 flex-col gap-5">
        {assignments.map((item) => (
          <div key={item.title}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {item.title}
              </span>
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-bold ${item.badge.className}`}
              >
                {item.badge.label}
              </span>
            </div>
            <div className="mb-1 flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full ${item.progressClass}`}
                  style={{ width: `${item.progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-medium text-slate-500">
                {item.progressLabel}
              </span>
            </div>
          </div>
        ))}
        <div className="mt-auto pt-2">
          <button className="w-full rounded-lg border border-border-light py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-border-dark dark:text-slate-400 dark:hover:bg-slate-800">
            새 과제 등록하기
          </button>
        </div>
      </div>
    </section>
  );
}
