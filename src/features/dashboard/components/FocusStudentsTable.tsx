import Link from "next/link";

import type { FocusStudent } from "@/features/dashboard/types";
import { iconClass } from "@/lib/icon-class";

type FocusStudentsTableProps = {
  students: FocusStudent[];
};

export function FocusStudentsTable({ students }: FocusStudentsTableProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-border-light bg-surface-light shadow-sm dark:border-border-dark dark:bg-surface-dark">
      <div className="flex items-center justify-between border-b border-border-light p-5 dark:border-border-dark">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            집중 관리 학생
          </h3>
          <div className="group relative flex justify-center">
            <span
              className={`${iconClass("text-sm text-slate-400")} cursor-help`}
            >
              info
            </span>
            <span className="pointer-events-none absolute bottom-full mb-2 w-max rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
              성적 하락폭이 크거나 결석이 잦은 학생입니다.
            </span>
          </div>
        </div>
        <Link href="#" className="text-sm text-primary hover:underline">
          전체보기
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th className="px-5 py-3 font-medium">학생명</th>
              <th className="px-5 py-3 font-medium">상태</th>
              <th className="px-5 py-3 text-right font-medium">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {students.map((student) => (
              <tr
                key={student.id}
                className="transition hover:bg-slate-50 dark:hover:bg-white/5"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-white">
                      {student.initials}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {student.name}
                      </p>
                      <p className="text-xs text-slate-500">{student.group}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${student.statusClass}`}
                  >
                    {student.statusLabel}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="p-1 text-slate-500 transition hover:text-primary">
                    <span className={iconClass("text-[20px]")}>sms</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
