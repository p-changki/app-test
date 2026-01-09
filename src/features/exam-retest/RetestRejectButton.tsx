"use client";

import { useState } from "react";

import type { RetestRequest } from "@/features/exam-retest/types";
import { iconClass } from "@/lib/icon-class";

export function RetestRejectButton({ request }: { request: RetestRequest }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "rejected">("idle");

  const handleConfirm = () => {
    setStatus("rejected");
    setOpen(false);
  };

  const buttonLabel = status === "rejected" ? "거절 완료" : "거절";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={status === "rejected"}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-red-100 disabled:bg-red-50 disabled:text-red-300 dark:border-red-900/40 dark:text-red-300 dark:hover:bg-red-900/20 dark:disabled:border-red-900/20 dark:disabled:bg-red-950/40 dark:disabled:text-red-700"
      >
        <span className={iconClass("text-sm")}>
          {status === "rejected" ? "check" : "close"}
        </span>
        {buttonLabel}
      </button>
      {open ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border-light bg-white text-[#0d141b] shadow-2xl dark:border-border-dark dark:bg-surface-dark dark:text-white">
            <header className="flex items-center justify-between border-b border-border-light bg-gray-50 px-5 py-4 dark:border-border-dark dark:bg-surface-dark/70">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  재시험 거절
                </p>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {request.name} 학생 제안을 거절하시겠습니까?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="거절 모달 닫기"
              >
                <span className={iconClass()}>close</span>
              </button>
            </header>
            <div className="space-y-4 px-5 py-5 text-sm text-slate-700 dark:text-slate-200">
              <div className="rounded-xl border border-border-light bg-slate-50 p-4 dark:border-border-dark dark:bg-surface-dark/60">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  제안 정보
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                  {request.subject}
                </p>
                <p className="text-xs text-slate-500">
                  {request.preferredTime}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-300">
                  거절 사유 (학생에게 안내됩니다)
                </label>
                <textarea
                  className="min-h-[90px] rounded-lg border border-border-light bg-white p-3 text-sm text-slate-800 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-200 dark:border-border-dark dark:bg-surface-dark dark:text-white"
                  placeholder="예: 제안하신 기간에는 재시험 배정이 어려워 이번 회차에는 진행이 어렵습니다."
                />
              </div>
              <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200">
                거절 후 자동으로 학생/학부모에게 사유가 안내됩니다. 필요 시 연락
                메모에 기록해 주세요.
              </p>
            </div>
            <div className="flex gap-3 border-t border-border-light bg-gray-50 px-5 py-4 dark:border-border-dark dark:bg-surface-dark/70">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-lg border border-border-light px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-border-dark dark:text-slate-200 dark:hover:bg-surface-dark"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-600"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
