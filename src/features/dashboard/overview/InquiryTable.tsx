import type { InquiryRow } from "@/features/dashboard/types";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/features/dashboard/overview/StatusBadge";

type InquiryTableProps = {
  rows: InquiryRow[];
};

export function InquiryTable({ rows }: InquiryTableProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#1a2632]">
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className={iconClass("text-primary")}>forum</span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            최근 문의 요청 사항 (학생/학부모)
          </h3>
        </div>
        <a
          href="#"
          className="text-sm font-medium text-primary hover:text-primary/80"
        >
          전체보기
        </a>
      </header>
      <DesktopTable rows={rows} />
      <MobileList rows={rows} />
    </section>
  );
}

function DesktopTable({ rows }: InquiryTableProps) {
  return (
    <div className="hidden md:block">
      <div className="custom-scrollbar overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-[#131d27] dark:text-slate-400">
              <th className="px-6 py-3">구분</th>
              <th className="px-6 py-3">이름</th>
              <th className="w-2/5 px-6 py-3">문의 내용</th>
              <th className="px-6 py-3">등록일</th>
              <th className="px-6 py-3 text-right">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {rows.map((row) => (
              <tr
                key={`${row.name}-${row.date}`}
                className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      row.type === "학생"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
                    )}
                  >
                    {row.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                  {row.name}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                  {row.message}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                  {row.date}
                </td>
                <td className="px-6 py-4 text-right">
                  <StatusBadge label={row.status} variant={row.statusVariant} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MobileList({ rows }: InquiryTableProps) {
  return (
    <div className="space-y-3 px-4 py-4 md:hidden">
      {rows.map((row) => (
        <div
          key={`${row.name}-${row.date}-mobile`}
          className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-sm text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold",
                row.type === "학생"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200"
                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
              )}
            >
              {row.type}
            </span>
            <span>{row.date}</span>
          </div>
          <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white">
            {row.name}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {row.message}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">상태</span>
            <StatusBadge label={row.status} variant={row.statusVariant} />
          </div>
        </div>
      ))}
    </div>
  );
}
