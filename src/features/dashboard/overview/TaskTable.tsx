"use client";

import { useMemo, useState } from "react";

import { assistantEntities } from "@/data/assistants";
import type { TaskRecord } from "@/features/dashboard/taskStore";
import { updateTaskStatus, useTaskStore } from "@/features/dashboard/taskStore";
import { TaskDetailModal } from "@/features/dashboard/components/TaskDetailModal";
import { iconClass } from "@/lib/icon-class";
import { StatusBadge } from "@/features/dashboard/overview/StatusBadge";

type TaskTableProps = {
  tasks?: TaskRecord[];
};

export function TaskTable({ tasks }: TaskTableProps) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const storeTasks = useTaskStore();
  const taskList = useMemo(
    () => (storeTasks.length ? storeTasks : (tasks ?? [])),
    [storeTasks, tasks]
  );
  const activeTa = assistantEntities[0]?.name ?? taskList[0]?.ta;
  const visibleTasks = useMemo(() => {
    if (!activeTa) return taskList;
    const filtered = taskList.filter((task) => task.ta === activeTa);
    return filtered.length ? filtered : taskList;
  }, [activeTa, taskList]);

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#1a2632]">
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className={iconClass("text-purple-500")}>checklist</span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            강사 업무 지시 내역
          </h3>
        </div>
        <button
          type="button"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-[#1a2632] dark:text-slate-200 dark:hover:bg-slate-800"
          onClick={() => setIsHistoryOpen(true)}
        >
          업무내역
        </button>
      </header>
      <DesktopTaskTable
        tasks={visibleTasks}
        onStatusChange={updateTaskStatus}
      />
      <MobileTaskList tasks={visibleTasks} onStatusChange={updateTaskStatus} />
      {isHistoryOpen ? (
        <TaskHistoryModal
          tasks={visibleTasks}
          onClose={() => setIsHistoryOpen(false)}
          onStatusChange={updateTaskStatus}
        />
      ) : null}
    </section>
  );
}

function DesktopTaskTable({
  tasks = [],
  onStatusChange,
}: TaskTableProps & {
  onStatusChange: (taskId: string, status: "진행 중" | "완료") => void;
}) {
  return (
    <div className="hidden md:block">
      <div className="custom-scrollbar overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-[#131d27] dark:text-slate-400">
              <th className="w-1/3 px-6 py-3">지시 업무명</th>
              <th className="px-6 py-3">대상 조교</th>
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
                  <TaskDetailModal
                    task={row}
                    onStatusChange={(status) => onStatusChange(row.id, status)}
                  >
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

function MobileTaskList({
  tasks = [],
  onStatusChange,
}: TaskTableProps & {
  onStatusChange: (taskId: string, status: "진행 중" | "완료") => void;
}) {
  return (
    <div className="space-y-3 px-4 py-4 md:hidden">
      {tasks.map((row) => (
        <TaskDetailModal
          key={`${row.title}-mobile`}
          task={row}
          onStatusChange={(status) => onStatusChange(row.id, status)}
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

function TaskHistoryModal({
  tasks,
  onClose,
  onStatusChange,
}: {
  tasks: TaskRecord[];
  onClose: () => void;
  onStatusChange: (taskId: string, status: "진행 중" | "완료") => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#1a2632]">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              강사 지시 업무 목록
            </p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              업무 내역
            </h3>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={onClose}
            aria-label="업무 내역 모달 닫기"
          >
            <span className={iconClass("text-lg")}>close</span>
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskDetailModal
                key={`${task.title}-history`}
                task={task}
                onStatusChange={(status) => onStatusChange(task.id, status)}
                triggerClassName="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-left transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/40"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {task.title}
                    </p>
                    <p className="text-xs text-slate-500">{task.subTitle}</p>
                  </div>
                  <StatusBadge
                    label={task.status}
                    variant={task.statusVariant}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-300">
                  <span>대상 조교: {task.ta}</span>
                  <span>진행률: {task.progress}%</span>
                </div>
              </TaskDetailModal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
