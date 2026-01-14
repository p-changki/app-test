"use client";

import { useState, type ReactNode } from "react";

import type { DashboardTaskRow } from "@/features/dashboard/types";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

type TaskDetailModalProps = {
  task: DashboardTaskRow;
  onStatusChange?: (status: "진행 중" | "완료") => void;
  triggerClassName?: string;
  children: ReactNode;
};

const priorityBadgeStyles: Record<DashboardTaskRow["priority"], string> = {
  높음: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  보통: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  낮음: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
};

export function TaskDetailModal({
  task,
  onStatusChange,
  children,
  triggerClassName,
}: TaskDetailModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "w-full bg-transparent text-left transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#1a2632]",
          triggerClassName
        )}
      >
        {children}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white text-slate-900 shadow-2xl dark:border-slate-800 dark:bg-[#1a2632] dark:text-white">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <span className={iconClass("text-2xl")}>
                    assignment_turned_in
                  </span>
                </div>
                <div>
                  <p className="text-lg font-bold">업무 상세 정보</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {task.issuedAt}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                aria-label="닫기"
              >
                <span className={iconClass()}>close</span>
              </button>
            </header>
            <div className="custom-scrollbar max-h-[75vh] space-y-6 overflow-y-auto px-6 py-6">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-bold",
                      priorityBadgeStyles[task.priority]
                    )}
                  >
                    {task.priority === "높음"
                      ? "긴급"
                      : `${task.priority} 우선`}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {task.subTitle}
                  </span>
                </div>
                <h2 className="text-2xl font-bold leading-snug text-slate-900 dark:text-white">
                  {task.title}
                </h2>
              </div>
              <div className="grid gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-[#0f172a] sm:grid-cols-2">
                <InfoItem label="담당자">
                  <div className="flex items-center gap-2">
                    <div
                      className="size-8 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${task.avatar})` }}
                      aria-hidden
                    />
                    <span className="font-semibold">{task.ta}</span>
                  </div>
                </InfoItem>
                <InfoItem label="지시자">
                  <div className="flex items-center gap-2">
                    <div
                      className="size-8 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${task.assignerAvatar})` }}
                      aria-hidden
                    />
                    <span className="font-semibold">{task.assigner}</span>
                  </div>
                </InfoItem>
                <InfoItem label="우선순위">
                  <div className="flex items-center gap-1 font-semibold">
                    <span className={iconClass("text-[18px] text-slate-400")}>
                      flag
                    </span>
                    {task.priority}
                  </div>
                </InfoItem>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  업무 내용
                </p>
                <div className="mt-2 rounded-xl border border-slate-100 bg-white p-4 text-sm leading-relaxed text-slate-600 shadow-sm dark:border-slate-700 dark:bg-[#1f2735] dark:text-slate-300">
                  {task.description}
                </div>
              </div>
              {task.attachments?.length ? (
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    첨부파일
                  </p>
                  <div className="mt-3 flex flex-col gap-2">
                    {task.attachments.map((attachment) => (
                      <button
                        key={attachment.name}
                        type="button"
                        className="flex w-full items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 text-left text-sm text-slate-700 transition hover:border-primary hover:bg-primary/5 dark:border-slate-700 dark:text-slate-200 dark:hover:border-primary/60"
                      >
                        <span
                          className={iconClass("text-[20px] text-slate-400")}
                        >
                          {attachment.icon ?? "attach_file"}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium">{attachment.name}</p>
                          <p className="text-xs text-slate-500">
                            {attachment.size}
                          </p>
                        </div>
                        <span
                          className={iconClass("text-[18px] text-slate-400")}
                        >
                          download
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              <div>
                <p className="mb-2 text-sm font-bold text-slate-900 dark:text-white">
                  상태 업데이트
                </p>
                <div className="flex flex-wrap gap-2">
                  {statusButtons.map((status) => (
                    <button
                      key={status.value}
                      type="button"
                      className={cn(
                        "flex-1 min-w-[120px] rounded-lg border px-3 py-2 text-sm font-medium transition",
                        status.className
                      )}
                      onClick={() =>
                        onStatusChange?.(
                          status.value === "done" ? "완료" : "진행 중"
                        )
                      }
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <footer className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-[#151f28]">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                닫기
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90">
                <span className={iconClass("text-[18px]")}>save</span>
                변경사항 저장
              </button>
            </footer>
          </div>
        </div>
      ) : null}
    </>
  );
}

function InfoItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <div className="text-sm text-slate-800 dark:text-slate-200">
        {children}
      </div>
    </div>
  );
}

const statusButtons = [
  {
    label: "진행 중",
    value: "progress",
    className:
      "border-blue-500/30 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100 dark:border-blue-500/40 dark:bg-blue-900/30 dark:text-blue-200",
  },
  {
    label: "완료",
    value: "done",
    className:
      "border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300",
  },
];
