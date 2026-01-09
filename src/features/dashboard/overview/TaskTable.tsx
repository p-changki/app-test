import type { DashboardTaskRow } from "@/features/dashboard/types";
import { DashboardTaskAssignmentModal } from "@/features/dashboard/TaskAssignmentModal";
import { TaskDetailModal } from "@/features/dashboard/components/TaskDetailModal";
import { iconClass } from "@/lib/icon-class";
import { StatusBadge } from "@/features/dashboard/overview/StatusBadge";

type TaskTableProps = {
  tasks: DashboardTaskRow[];
};

export function TaskTable({ tasks }: TaskTableProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#1a2632]">
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className={iconClass("text-purple-500")}>checklist</span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            강사 업무 지시 내역
          </h3>
        </div>
        <DashboardTaskAssignmentModal buttonLabel="+ 업무 추가" icon="add" />
      </header>
      <DesktopTaskTable tasks={tasks} />
      <MobileTaskList tasks={tasks} />
    </section>
  );
}

function DesktopTaskTable({ tasks }: TaskTableProps) {
  return (
    <div className="hidden md:block">
      <div className="custom-scrollbar overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-[#131d27] dark:text-slate-400">
              <th className="w-1/3 px-6 py-3">지시 업무명</th>
              <th className="px-6 py-3">대상 조교</th>
              <th className="px-6 py-3">기한 (D-Day)</th>
              <th className="px-6 py-3">진행률</th>
              <th className="px-6 py-3 text-right">진행 상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {tasks.map((row) => (
              <tr
                key={row.title}
                className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <td className="px-6 py-4">
                  <TaskDetailModal task={row}>
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-300">
                        <span className={iconClass("text-[18px]")}>
                          {row.icon}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {row.title}
                        </p>
                        <p className="text-xs text-slate-500">{row.subTitle}</p>
                      </div>
                    </div>
                  </TaskDetailModal>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="size-6 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${row.avatar})` }}
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {row.ta}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                  {row.due}
                </td>
                <td className="px-6 py-4">
                  <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${row.progress}%` }}
                    />
                  </div>
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

function MobileTaskList({ tasks }: TaskTableProps) {
  return (
    <div className="space-y-3 px-4 py-4 md:hidden">
      {tasks.map((row) => (
        <TaskDetailModal
          key={`${row.title}-mobile`}
          task={row}
          triggerClassName="rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-left shadow-sm dark:border-slate-700 dark:bg-slate-900/40"
        >
          <div className="flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                <span className={iconClass("text-[20px]")}>{row.icon}</span>
              </div>
              <div>
                <p className="text-base font-semibold text-slate-900 dark:text-white">
                  {row.title}
                </p>
                <p className="text-xs text-slate-500">{row.subTitle}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <div
                  className="size-6 rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${row.avatar})` }}
                />
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {row.ta}
                </span>
              </div>
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {row.due}
              </span>
            </div>
            <div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${row.progress}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                진행률 {row.progress}%
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">상태</span>
              <StatusBadge label={row.status} variant={row.statusVariant} />
            </div>
          </div>
        </TaskDetailModal>
      ))}
    </div>
  );
}
