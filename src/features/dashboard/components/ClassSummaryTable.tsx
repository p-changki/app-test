import type { ClassSummary } from "@/features/dashboard/types";
import { iconClass } from "@/lib/icon-class";

type ClassSummaryTableProps = {
  classes: ClassSummary[];
};

export function ClassSummaryTable({ classes }: ClassSummaryTableProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-border-light bg-surface-light shadow-sm dark:border-border-dark dark:bg-surface-dark">
      <div className="flex items-center justify-between border-b border-border-light p-5 dark:border-border-dark">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          담당 클래스 요약
        </h3>
        <button className="text-slate-400 transition hover:text-primary">
          <span className={iconClass()}>more_horiz</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th className="px-5 py-3 font-medium">클래스명</th>
              <th className="px-5 py-3 font-medium">수업 시간</th>
              <th className="px-5 py-3 text-right font-medium">인원</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {classes.map((clazz) => (
              <tr
                key={clazz.name}
                className="transition hover:bg-slate-50 dark:hover:bg-white/5"
              >
                <td className="px-5 py-3 font-medium text-slate-900 dark:text-white">
                  {clazz.name}
                </td>
                <td className="px-5 py-3 text-slate-500">{clazz.schedule}</td>
                <td className="px-5 py-3 text-right text-slate-600 dark:text-slate-300">
                  {clazz.studentCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
