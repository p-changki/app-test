"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";
import {
  removeTasks,
  updateTaskStatus,
  useTaskStore,
  type TaskRecord,
} from "@/features/dashboard/taskStore";

const priorityStyles: Record<string, string> = {
  높음: "bg-rose-100 text-rose-600",
  보통: "bg-blue-100 text-blue-600",
  낮음: "bg-slate-100 text-slate-500",
};

const statusStyles: Record<string, string> = {
  "진행 중": "bg-blue-100 text-blue-600",
  완료: "bg-emerald-100 text-emerald-600",
};

export function AssistantTaskListPage() {
  const tasks = useTaskStore();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);

  const activeSelectedIds = useMemo(
    () => selectedIds.filter((id) => tasks.some((task) => task.id === id)),
    [selectedIds, tasks]
  );

  const allSelected =
    tasks.length > 0 && activeSelectedIds.length === tasks.length;
  const selectedCount = activeSelectedIds.length;
  const totalCount = tasks.length;
  const displayCount = Math.min(totalCount, 5);
  const detailTask = tasks.find((row) => row.id === detailTaskId) ?? null;
  const progressCount = tasks.filter(
    (task) => task.status === "진행 중"
  ).length;
  const doneCount = tasks.filter((task) => task.status === "완료").length;

  const summaryCards = [
    {
      label: "전체 업무",
      value: `${totalCount}`,
      delta: "+12%",
      icon: "calendar_month",
      tone: "text-emerald-600",
    },
    {
      label: "진행 중",
      value: `${progressCount}`,
      delta: "+5%",
      icon: "pending_actions",
      tone: "text-blue-600",
    },
    {
      label: "완료",
      value: `${doneCount}`,
      delta: "-2%",
      icon: "check_circle",
      tone: "text-emerald-600",
    },
  ];

  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : tasks.map((row) => row.id));
  };

  const toggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const deleteSelected = () => {
    if (selectedIds.length === 0) return;
    removeTasks(activeSelectedIds);
    setSelectedIds([]);
  };

  const updateStatus = (taskId: string, status: "진행 중" | "완료") => {
    updateTaskStatus(taskId, status);
  };

  const deleteLabel = useMemo(
    () => (selectedCount > 0 ? `선택 삭제 (${selectedCount})` : "선택 삭제"),
    [selectedCount]
  );

  return (
    <div
      className={cn(
        notoSansKr.className,
        "min-h-screen bg-[var(--surface-background)] text-[color:var(--surface-text)]"
      )}
    >
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <Link href="/assistant-management" className="hover:text-primary">
                조교 관리
              </Link>
              <span className={iconClass("text-[16px]")}>chevron_right</span>
              <span className="font-semibold text-slate-900">
                업무 지시 내역
              </span>
            </div>
            <h1
              className={cn(
                lexend.className,
                "text-3xl font-black text-slate-900 dark:text-white"
              )}
            >
              업무 지시 내역 관리
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              조교에게 배정된 업무를 모니터링하고 진행 현황을 관리하세요.
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#1c2936]"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-500">
                  {card.label}
                </p>
                <span className={iconClass("text-slate-400")}>{card.icon}</span>
              </div>
              <div className="mt-3 flex items-end gap-2">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {card.value}
                </p>
                <span className={cn("text-xs font-semibold", card.tone)}>
                  {card.delta}
                </span>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#1c2936]">
          <div className="flex flex-wrap items-center gap-3">
            <label className="relative flex min-w-[220px] flex-1 items-center">
              <span
                className={iconClass(
                  "absolute left-3 text-slate-400 text-[18px]"
                )}
              >
                search
              </span>
              <input
                type="text"
                placeholder="업무 제목 또는 조교 이름으로 검색"
                className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </label>
            {[
              "전체 담당자",
              "상태: 전체",
              "우선순위: 전체",
              "기간: 최근 1개월",
            ].map((label) => (
              <button
                key={label}
                type="button"
                className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:text-slate-900 dark:bg-slate-900 dark:text-slate-300"
              >
                {label}
                <span className={iconClass("text-[16px]")}>expand_more</span>
              </button>
            ))}
            <button
              type="button"
              onClick={deleteSelected}
              disabled={selectedCount === 0}
              className={cn(
                "ml-auto flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-300 dark:hover:bg-rose-900/30"
              )}
            >
              <span className={iconClass("text-[16px]")}>delete</span>
              {deleteLabel}
            </button>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#1c2936]">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
              <tr>
                <th className="w-12 px-5 py-4">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                    aria-label="전체 선택"
                  />
                </th>
                <th className="px-5 py-4">업무 제목</th>
                <th className="px-5 py-4">담당 조교</th>
                <th className="px-5 py-4">지시 일자</th>
                <th className="px-5 py-4">우선순위</th>
                <th className="px-5 py-4">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="cursor-pointer transition hover:bg-slate-50/70 dark:hover:bg-slate-800/50"
                  onClick={() => setDetailTaskId(task.id)}
                >
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(task.id)}
                      onChange={() => toggleRow(task.id)}
                      onClick={(event) => event.stopPropagation()}
                      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                      aria-label={`${task.title} 선택`}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {task.title}
                      </span>
                      <span className="text-xs text-slate-500">
                        {task.subTitle}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-700 dark:text-slate-200">
                    {task.ta}
                  </td>
                  <td className="px-5 py-4 text-slate-500">{task.issuedAt}</td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-semibold",
                        priorityStyles[task.priority]
                      )}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-semibold",
                        statusStyles[task.status]
                      )}
                    >
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4 text-xs text-slate-500 dark:border-slate-800">
            <span>
              총 {totalCount}건 중 1 - {displayCount} 표시
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-400 dark:border-slate-700"
              >
                <span className={iconClass("text-[16px]")}>chevron_left</span>
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded bg-primary text-sm font-bold text-white"
              >
                1
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-sm font-semibold text-slate-600 dark:border-slate-700"
              >
                2
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-sm font-semibold text-slate-600 dark:border-slate-700"
              >
                3
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-400 dark:border-slate-700"
              >
                <span className={iconClass("text-[16px]")}>chevron_right</span>
              </button>
            </div>
          </div>
        </section>
        {detailTask ? (
          <TaskDetailModal
            task={detailTask}
            onClose={() => setDetailTaskId(null)}
            onUpdateStatus={(status) => updateStatus(detailTask.id, status)}
          />
        ) : null}
      </main>
    </div>
  );
}

function TaskDetailModal({
  task,
  onClose,
  onUpdateStatus,
}: {
  task: TaskRecord;
  onClose: () => void;
  onUpdateStatus: (status: "진행 중" | "완료") => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#1c2936]">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <span className={iconClass("text-[20px]")}>
                assignment_turned_in
              </span>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                업무 상세 정보
              </p>
              <p className="text-xs text-slate-500">
                지시 일자 · {task.issuedAt}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
            aria-label="업무 상세 모달 닫기"
          >
            <span className={iconClass()}>close</span>
          </button>
        </div>
        <div className="custom-scrollbar max-h-[70vh] space-y-6 overflow-y-auto px-6 py-6">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-bold",
                  priorityStyles[task.priority]
                )}
              >
                {task.priority === "높음" ? "긴급" : `${task.priority} 우선`}
              </span>
              <span className="text-slate-500">{task.subTitle}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {task.title}
            </h2>
          </div>
          <div className="grid gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-[#0f172a] sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                담당 조교
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {task.ta}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                지시 일자
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {task.issuedAt}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              업무 내용
            </p>
            <div className="mt-2 rounded-xl border border-slate-100 bg-white p-4 text-sm leading-relaxed text-slate-600 shadow-sm dark:border-slate-700 dark:bg-[#1f2735] dark:text-slate-300">
              {task.description}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              첨부파일
            </p>
            <div className="mt-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
              연결된 첨부파일이 없습니다.
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-bold text-slate-900 dark:text-white">
              상태 업데이트
            </p>
            <div className="flex flex-wrap gap-2">
              {(["진행 중", "완료"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  className={cn(
                    "flex-1 min-w-[120px] rounded-lg border px-3 py-2 text-sm font-medium transition",
                    status === "진행 중"
                      ? "border-blue-500/30 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100 dark:border-blue-500/40 dark:bg-blue-900/30 dark:text-blue-200"
                      : "border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                  )}
                  onClick={() => onUpdateStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
        <footer className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-[#151f28]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            닫기
          </button>
        </footer>
      </div>
    </div>
  );
}
