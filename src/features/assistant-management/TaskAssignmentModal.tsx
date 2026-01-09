"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

type AssistantRecipient = {
  id?: string;
  name: string;
  phone?: string;
  role?: string;
  statusLabel?: string;
};

type TaskAssignmentModalProps = {
  assistants: AssistantRecipient[];
  triggerClassName?: string;
  triggerContent?: ReactNode;
  disabled?: boolean;
};

export function TaskAssignmentModal({
  assistants,
  triggerClassName,
  triggerContent,
  disabled = false,
}: TaskAssignmentModalProps) {
  const [open, setOpen] = useState(false);
  const firstAssistant = assistants[0];
  const hasMultipleRecipients = assistants.length > 1;
  const canOpen = assistants.length > 0 && !disabled;

  const recipientLabel = hasMultipleRecipients
    ? `${assistants.length}명의 조교`
    : firstAssistant
      ? `${firstAssistant.name} 조교`
      : "선택된 조교";

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (canOpen) {
            setOpen(true);
          }
        }}
        disabled={!canOpen}
        className={cn(
          "flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70",
          triggerClassName
        )}
      >
        {triggerContent ?? (
          <>
            <span className={iconClass("text-[18px]")}>add_task</span>
            업무 지시
          </>
        )}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl ring-1 ring-black/5 dark:bg-[#1a2632] dark:text-white dark:ring-white/10">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
                  <span className={iconClass("text-xl")}>assignment_add</span>
                </div>
                <div>
                  <p className="text-lg font-bold">새로운 업무 지시</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {recipientLabel}에게 전송됩니다.
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
            </div>
            <div className="custom-scrollbar flex max-h-[75vh] flex-col gap-6 overflow-y-auto px-6 py-6">
              <div className="rounded-lg border border-blue-100 bg-blue-50/80 p-3 text-xs text-blue-700 dark:border-blue-900/30 dark:bg-blue-900/10 dark:text-blue-300">
                <span className="inline-flex items-center gap-1 font-bold">
                  <span className={iconClass("text-sm")}>
                    notifications_active
                  </span>
                  알림 발송 안내
                </span>
                <p className="mt-1">
                  업무 지시 완료 시 해당 조교에게 즉시 알림이 발송됩니다. <br />
                  <span className="opacity-80">
                    새로운 업무가 지시되었습니다: [업무명] - [기한]
                  </span>
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                    대상 조교
                  </label>
                  {hasMultipleRecipients ? (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        선정된 조교 ({assistants.length}명)
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {assistants.map((assistant) => (
                          <span
                            key={assistant.id ?? assistant.name}
                            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                          >
                            <span className="size-4 rounded-full bg-primary/20 text-[10px] font-bold uppercase">
                              {assistant.name.slice(0, 1)}
                            </span>
                            {assistant.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800">
                      <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {firstAssistant?.name.slice(0, 1)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {firstAssistant?.name}
                        </p>
                        {firstAssistant?.phone ? (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {firstAssistant.phone}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                    상태
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-[#1f2a37] dark:text-white">
                    <option>진행 전 (할 일)</option>
                    <option>진행 중</option>
                    <option>긴급 요청</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  업무명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-[#1f2a37] dark:text-white"
                  placeholder="예: 중등 2학년 1학기 기말고사 채점"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  상세 내용
                </label>
                <textarea
                  rows={4}
                  className="w-full resize-none rounded-lg border border-slate-300 px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-[#1f2a37] dark:text-white"
                  placeholder="업무에 대한 상세한 내용을 입력해주세요."
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  파일 첨부
                </label>
                <div className="cursor-pointer rounded-lg border-2 border-dashed border-slate-300 p-4 text-center transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50">
                  <span className={iconClass("text-3xl text-slate-400")}>
                    cloud_upload
                  </span>
                  <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                    클릭하거나 파일을 드래그하세요
                  </p>
                  <p className="text-xs text-slate-400">
                    PDF, DOCX, JPG (최대 10MB)
                  </p>
                </div>
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
                          name="priority"
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
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/40">
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
            </div>
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
      "bg-red-50 text-red-600 peer-checked:bg-red-500 peer-checked:text-white dark:bg-red-900/20 dark:text-red-200 peer-checked:dark:bg-red-600",
    default: true,
  },
  {
    label: "보통",
    className:
      "bg-slate-50 text-slate-600 peer-checked:bg-slate-600 peer-checked:text-white dark:bg-slate-800 dark:text-slate-300 peer-checked:dark:bg-slate-500",
  },
  {
    label: "낮음",
    className:
      "bg-emerald-50 text-emerald-600 peer-checked:bg-emerald-500 peer-checked:text-white dark:bg-emerald-900/20 dark:text-emerald-200 peer-checked:dark:bg-emerald-600",
  },
];
