import type { TodayClassSession } from "@/features/dashboard/types";
import { iconClass } from "@/lib/icon-class";

type TodayClassesCardProps = {
  sessions: TodayClassSession[];
};

export function TodayClassesCard({ sessions }: TodayClassesCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#1a2632]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
          <span className={iconClass("text-slate-500")}>event_note</span>
          조교 담당 당일 수업
        </h3>
        <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          10월 25일
        </span>
      </div>
      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.title}
            className="flex rounded-lg border border-slate-100 p-3 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50"
          >
            <div className="mr-3 flex w-14 flex-shrink-0 flex-col items-center border-r border-slate-100 pr-3 text-center text-slate-500 dark:border-slate-700">
              <span className="text-xs font-medium">시작</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {session.time}
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {session.title}
              </p>
              <p className="text-xs text-slate-500">{session.room}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
