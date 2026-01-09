"use client";

import { useState } from "react";

import { lexend } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

import type { RetestRequest } from "@/app/(app)/exam-retest-proposals/page";

export function RetestAcceptButton({ request }: { request: RetestRequest }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark"
      >
        <span className={iconClass("text-sm", true)}>check</span>
        수락
      </button>
      {open ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="hidden lg:flex h-[80vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border-light bg-white text-[#0d141b] shadow-2xl">
            <header className="flex items-center justify-between border-b border-border-light bg-gray-50 px-6 py-4">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  재시험 일정 관리
                </p>
                <h3 className="text-lg font-bold text-slate-900">
                  예약 가능한 시간 확인
                </h3>
              </div>
              <button
                type="button"
                className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                <span className={iconClass()}>close</span>
              </button>
            </header>
            <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
              <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
                <div>
                  <h4 className="text-2xl font-black text-slate-900">
                    재시험 일정 관리
                  </h4>
                  <p className="text-sm text-slate-500">
                    {request.name} 학생의 재시험 일정을 확정하기 전에 남은
                    슬롯을 확인하세요.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    {
                      label: "미통과 학생",
                      value: "12명",
                      helper: "+2명 (오늘)",
                      color: "text-red-500",
                      icon: "warning",
                    },
                    {
                      label: "예약 대기",
                      value: "5명",
                      helper: "예약 필요",
                      color: "text-orange-500",
                      icon: "schedule",
                    },
                    {
                      label: "금일 예정 재시험",
                      value: "3건",
                      helper: "진행중",
                      color: "text-primary",
                      icon: "event_available",
                    },
                  ].map((card) => (
                    <div
                      key={card.label}
                      className="rounded-xl border border-border-light bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-slate-500">
                          {card.label}
                        </p>
                        <span className={cn(iconClass(), card.color)}>
                          {card.icon}
                        </span>
                      </div>
                      <div className="mt-2 flex items-end gap-2">
                        <p
                          className={cn(
                            lexend.className,
                            "text-2xl font-bold text-slate-900"
                          )}
                        >
                          {card.value}
                        </p>
                        <p className={cn("text-xs font-medium", card.color)}>
                          {card.helper}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-border-light bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-border-light pb-3">
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        선택된 일정
                      </p>
                      <p className="text-lg font-bold text-primary">
                        {request.preferredTime}
                      </p>
                      <p className="text-sm text-slate-600">
                        {request.location}
                      </p>
                    </div>
                    <button className="flex items-center gap-1 rounded-lg border border-border-light px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                      <span className={iconClass("text-sm")}>filter_list</span>
                      슬롯 필터
                    </button>
                  </div>
                  <div className="mt-3 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        과목
                      </p>
                      <p className="mt-1 font-bold text-slate-900">
                        {request.subject}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        담당 강사
                      </p>
                      <p className="mt-1 font-semibold">{request.teacher}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs font-semibold text-slate-500">
                        학생 제안 사유
                      </p>
                      <p className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                        “{request.reason}”
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[1px] bg-border-light lg:h-auto lg:w-px" />
              <div className="w-full max-w-md overflow-y-auto border-t border-border-light bg-white p-6 lg:border-t-0">
                <div className="rounded-xl border border-border-light bg-slate-50 p-4 text-sm shadow-sm">
                  <p className="text-xs font-medium text-slate-500">
                    예약 확인
                  </p>
                  <p className="mt-1 text-base font-bold text-slate-900">
                    {request.subject}
                  </p>
                  <div className="mt-3 space-y-2">
                    <DetailRow label="학생" value={request.name} />
                    <DetailRow
                      label="일시"
                      value={request.preferredTime}
                      valueClass="text-primary"
                    />
                    <DetailRow label="장소" value={request.location} />
                    <DetailRow label="담당 강사" value={request.teacher} />
                  </div>
                </div>
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700">
                  <span className={iconClass("text-primary text-sm")}>
                    info
                  </span>
                  <p>
                    예약 확정 시 담당 강사에게 알림이 발송되며, 재예약은 시험
                    시작 1시간 전까지만 가능합니다.
                  </p>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    className="flex-1 rounded-lg border border-border-light px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    onClick={() => setOpen(false)}
                  >
                    취소
                  </button>
                  <button className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark">
                    예약 확정
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border-light bg-white text-[#0d141b] shadow-2xl lg:hidden">
            <header className="flex items-center justify-between border-b border-border-light bg-gray-50 px-4 py-3">
              <h3 className="text-lg font-bold text-slate-900">
                {request.name} 재시험 예약
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
              >
                <span className={iconClass()}>close</span>
              </button>
            </header>
            <div className="space-y-4 p-4 text-sm text-slate-600">
              <DetailRow label="과목" value={request.subject} />
              <DetailRow
                label="일시"
                value={request.preferredTime}
                valueClass="text-primary"
              />
              <DetailRow label="장소" value={request.location} />
              <DetailRow label="담당 강사" value={request.teacher} />
              <div className="rounded-lg border border-border-light bg-slate-50 p-3 text-xs text-slate-500">
                “{request.reason}”
              </div>
            </div>
            <div className="flex gap-3 border-t border-border-light bg-gray-50 p-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-lg border border-border-light px-4 py-2 text-sm font-semibold text-slate-700"
              >
                취소
              </button>
              <button className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark">
                예약 확정
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function DetailRow({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <span className={cn("text-sm font-semibold text-slate-900", valueClass)}>
        {value}
      </span>
    </div>
  );
}
