"use client";

import { useState } from "react";

import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

type DashboardTaskAssignmentModalProps = {
  buttonLabel?: string;
  icon?: string;
  variant?: "text" | "primary";
  className?: string;
};

export function DashboardTaskAssignmentModal({
  buttonLabel = "업무 추가",
  icon,
  variant = "text",
  className,
}: DashboardTaskAssignmentModalProps) {
  const [open, setOpen] = useState(false);
  const triggerIcon = icon ?? (variant === "primary" ? "add" : "add_circle");
  const triggerClassName =
    variant === "primary"
      ? "flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm shadow-primary/30 transition hover:bg-primary/90"
      : "flex items-center gap-1 rounded-lg text-sm font-medium text-primary transition hover:text-primary/80";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(triggerClassName, className)}
      >
        <span
          className={iconClass(
            variant === "primary" ? "text-[20px]" : "text-[16px]"
          )}
        >
          {triggerIcon}
        </span>
        {buttonLabel}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl dark:bg-[#1a2632] dark:text-white">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
                  <span className={iconClass("text-xl")}>assignment_add</span>
                </div>
                <div>
                  <p className="text-lg font-bold">새로운 강사 업무 지시</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    조교에게 전달할 업무를 입력하세요.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <span className={iconClass()}>close</span>
              </button>
            </header>
            <div className="custom-scrollbar flex max-h-[70vh] flex-col gap-5 overflow-y-auto p-6">
              <div className="rounded-lg border border-blue-100 bg-blue-50/80 p-3 text-xs text-blue-700 dark:border-blue-900/30 dark:bg-blue-900/10 dark:text-blue-300">
                새 업무를 등록하면 조교에게 알림이 전송됩니다. 긴급 업무일 경우
                우선순위를 “높음”으로 선택하세요.
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                    대상 조교
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-[#1f2a37] dark:text-white"
                    placeholder="예: 박지훈 조교"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                    상태
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-[#1f2a37] dark:text-white">
                    <option>진행 전 (할 일)</option>
                    <option>진행 중</option>
                    <option>긴급 요청</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  업무명
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-[#1f2a37] dark:text-white"
                  placeholder="예: 중간고사 성적 입력"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  상세 내용
                </label>
                <textarea
                  rows={4}
                  className="w-full resize-none rounded-lg border border-slate-300 px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-[#1f2a37] dark:text-white"
                  placeholder="업무에 대한 설명을 입력해주세요."
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                    마감 기한
                  </label>
                  <div className="relative">
                    <span
                      className={iconClass(
                        "absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400"
                      )}
                    >
                      calendar_today
                    </span>
                    <input
                      type="date"
                      className="w-full rounded-lg border border-slate-300 pl-10 pr-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-[#1f2a37] dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                    우선순위
                  </label>
                  <div className="flex gap-2">
                    {priorityOptions.map((priority) => (
                      <label
                        key={priority.label}
                        className="flex-1 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="dashboard-priority"
                          className="peer sr-only"
                          defaultChecked={priority.default}
                        />
                        <div
                          className={cn(
                            "rounded-lg border border-slate-200 py-2.5 text-center text-xs font-medium transition dark:border-slate-700",
                            priority.className
                          )}
                        >
                          {priority.label}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <footer className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/40">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                취소
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90">
                <span className={iconClass("text-[18px]")}>send</span>
                업무 지시 및 알림 전송
              </button>
            </footer>
          </div>
        </div>
      ) : null}
    </>
  );
}

const priorityOptions = [
  {
    label: "높음",
    className:
      "peer-checked:border-red-200 peer-checked:bg-red-50 peer-checked:text-red-700 dark:peer-checked:border-red-800 dark:peer-checked:bg-red-900/20 dark:peer-checked:text-red-400",
  },
  {
    label: "보통",
    className:
      "peer-checked:border-amber-200 peer-checked:bg-amber-50 peer-checked:text-amber-700 dark:peer-checked:border-amber-800 dark:peer-checked:bg-amber-900/20 dark:peer-checked:text-amber-400",
    default: true,
  },
  {
    label: "낮음",
    className:
      "peer-checked:border-blue-200 peer-checked:bg-blue-50 peer-checked:text-blue-700 dark:peer-checked:border-blue-800 dark:peer-checked:bg-blue-900/20 dark:peer-checked:text-blue-400",
  },
];
