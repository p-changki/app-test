"use client";

import type { FormEvent, ReactNode } from "react";
import { useState } from "react";

import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";
import { addTasks, createTaskRecord } from "@/features/dashboard/taskStore";

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
  const [priority, setPriority] = useState<"높음" | "보통" | "낮음">("보통");
  const firstAssistant = assistants[0];
  const hasMultipleRecipients = assistants.length > 1;
  const canOpen = assistants.length > 0 && !disabled;

  const recipientLabel = hasMultipleRecipients
    ? `${assistants.length}명의 조교`
    : firstAssistant
      ? `${firstAssistant.name} 조교`
      : "선택된 조교";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (assistants.length === 0) {
      setOpen(false);
      return;
    }
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const subTitle = String(formData.get("summary") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const assigner = String(formData.get("assigner") ?? "강사 담당자").trim();
    const issuedAt = String(formData.get("issuedAt") ?? "").trim();

    const records = assistants.map((assistant) =>
      createTaskRecord({
        title: title || "신규 업무",
        subTitle: subTitle || "업무 요약",
        description: description || "업무 상세 내용이 없습니다.",
        ta: assistant.name,
        assigner,
        issuedAt,
        priority,
      })
    );

    addTasks(records);
    event.currentTarget.reset();
    setPriority("보통");
    setOpen(false);
  };

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
          <div className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-slate-800 dark:bg-[#1c2936] dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
                  <span className={iconClass("text-xl")}>assignment_add</span>
                </div>
                <div>
                  <p className="text-lg font-bold">새 업무 지시 등록</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {recipientLabel}에게 업무가 전송됩니다.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <span className={iconClass()}>close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="custom-scrollbar flex max-h-[75vh] flex-col gap-6 overflow-y-auto px-6 py-6">
                <div className="rounded-lg border border-blue-100 bg-blue-50/80 p-3 text-xs text-blue-700 dark:border-blue-900/30 dark:bg-blue-900/10 dark:text-blue-300">
                  업무 지시는 상세 모달 기준으로 저장되며 조교에게 즉시
                  전달됩니다.
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    대상 조교
                  </p>
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
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      지시자
                    </span>
                    <input
                      type="text"
                      name="assigner"
                      defaultValue="강사 담당자"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-[#111418] dark:text-white"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      업무명
                    </span>
                    <input
                      type="text"
                      name="title"
                      placeholder="예: 중등 2학년 1학기 기말고사 채점"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-[#111418] dark:text-white"
                    />
                  </label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      업무 분류/요약
                    </span>
                    <input
                      type="text"
                      name="summary"
                      placeholder="예: 고3 수능 기출 - 25문항"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-[#111418] dark:text-white"
                    />
                  </label>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      우선순위
                    </p>
                    <div className="flex gap-2">
                      {(["높음", "보통", "낮음"] as const).map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setPriority(level)}
                          className={cn(
                            "flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition",
                            priority === level
                              ? "border-primary/40 bg-primary/10 text-primary"
                              : "border-slate-200 text-slate-500 hover:border-primary/40 hover:text-slate-800 dark:border-slate-700 dark:text-slate-300"
                          )}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      지시 일자
                    </span>
                    <input
                      type="date"
                      name="issuedAt"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-[#111418] dark:text-white"
                    />
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    업무 내용
                  </label>
                  <textarea
                    rows={4}
                    name="description"
                    className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-[#111418] dark:text-white"
                    placeholder="업무에 대한 상세한 내용을 입력해주세요."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    첨부파일
                  </label>
                  <label className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-xs font-medium text-slate-500 transition hover:border-primary/50 hover:text-slate-700 dark:border-slate-700 dark:bg-[#111418] dark:text-slate-400">
                    파일 첨부 (PDF/JPG/PNG)
                    <input type="file" className="hidden" />
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/40">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
                >
                  <span className={iconClass("text-[18px]")}>send</span>
                  지시 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
