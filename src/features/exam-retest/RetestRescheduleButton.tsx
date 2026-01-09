"use client";

import { useState } from "react";

import type { RetestRequest } from "@/features/exam-retest/types";
import { iconClass } from "@/lib/icon-class";

export function RetestRescheduleButton({
  request,
}: {
  request: RetestRequest;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-border-light px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        <span className={iconClass("text-sm")}>edit_calendar</span>
        시간 조정
      </button>
      {open ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border-light bg-white text-[#0d141b] shadow-2xl">
            <header className="flex items-center justify-between border-b border-border-light bg-gray-50 px-6 py-4">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  시간 조정 제안
                </p>
                <h3 className="text-lg font-bold text-slate-900">
                  {request.name} 학생에게 전송
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100"
              >
                <span className={iconClass()}>close</span>
              </button>
            </header>
            <div className="space-y-4 p-6 text-sm">
              <div className="rounded-xl border border-border-light bg-slate-50 p-4">
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold text-slate-500">
                    현재 제안
                  </p>
                  <p className="text-sm font-bold text-primary">
                    {request.preferredTime}
                  </p>
                  <p className="text-xs text-slate-500">{request.subject}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500">
                  조정 사유 및 제안 내용
                </label>
                <textarea
                  className="h-32 w-full resize-none rounded-lg border border-border-light bg-slate-50 p-3 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="예: 제안하신 시간에는 강의실 배정이 어려워 17시 30분으로 조정 제안드립니다."
                />
                <div className="flex items-start gap-2 rounded-lg border border-border-light bg-blue-50 p-3 text-xs text-blue-700">
                  <span className={iconClass("text-sm text-primary")}>sms</span>
                  입력한 메시지는 학생에게 알림톡으로 발송되며, 학생이 확인 후
                  수락해야 일정이 확정됩니다.
                </div>
              </div>
              <div className="grid gap-3 text-sm">
                <div>
                  <label className="text-xs font-bold text-slate-500">
                    대체 가능한 시간
                  </label>
                  <select className="mt-1 w-full rounded-lg border border-border-light bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>2023년 10월 25일 (수) 17:30</option>
                    <option>2023년 10월 25일 (수) 18:30</option>
                    <option>2023년 10월 26일 (목) 16:00</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">
                    강의실/담당자
                  </label>
                  <div className="mt-1 flex items-center gap-2 rounded-lg border border-border-light px-3 py-2 text-sm">
                    <span className={iconClass("text-slate-400")}>
                      meeting_room
                    </span>
                    <span>{request.location}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 border-t border-border-light bg-gray-50 px-6 py-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-lg border border-border-light px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                취소
              </button>
              <button className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark">
                조정 제안 보내기
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
