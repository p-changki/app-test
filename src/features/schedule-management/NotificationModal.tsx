"use client";

import { useState } from "react";

import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

export function NotificationModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-slate-700 bg-[#1a2632] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#232f3d]"
      >
        <span className={iconClass("text-[20px]")}>campaign</span>
        알림 발송
      </button>
      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 shadow-2xl backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            className="flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#3b4754] bg-[#1e2329] text-white"
          >
            <header className="flex items-center justify-between border-b border-[#3b4754] bg-[#232930] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                  <span className={iconClass()}>campaign</span>
                </div>
                <div>
                  <p className="text-lg font-bold">수업 알림 발송 설정</p>
                  <p className="text-xs text-[#9dabb9]">
                    학생 + 학부모에게 동시에 안내 메시지를 보냅니다.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-[#9dabb9] transition hover:bg-[#3b4754] hover:text-white"
              >
                <span className={iconClass()}>close</span>
              </button>
            </header>
            <div className="custom-scrollbar flex max-h-[70vh] flex-col gap-6 overflow-y-auto px-6 py-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#9dabb9] uppercase">
                    발송 채널
                  </label>
                  <div className="flex flex-col gap-2">
                    {channelOptions.map((option) => (
                      <label
                        key={option.label}
                        className="flex items-center gap-3 rounded-lg border border-[#3b4754] bg-[#111418] p-3 hover:border-emerald-500/50"
                      >
                        <input
                          name="channel"
                          type="radio"
                          defaultChecked={option.value === "kakao"}
                          className="size-4 border-[#3b4754] bg-[#111418] text-emerald-500 focus:ring-emerald-500"
                        />
                        <span className="text-sm font-medium text-white">
                          {option.label}
                        </span>
                        <span
                          className={cn(
                            iconClass("ml-auto text-[18px]"),
                            option.iconColor
                          )}
                        >
                          {option.icon}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#9dabb9] uppercase">
                    발송 대상
                  </label>
                  <div className="flex h-full flex-col gap-3 rounded-lg border border-[#3b4754] bg-[#111418] p-3">
                    <select className="rounded border border-[#3b4754] bg-[#1e2329] px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500">
                      <option>전체 (학생 + 학부모)</option>
                      <option>학생만</option>
                      <option>학부모만</option>
                    </select>
                    <div className="mt-auto flex items-center gap-2 text-xs text-[#9dabb9]">
                      <span
                        className={iconClass("text-emerald-400 text-[18px]")}
                      >
                        group
                      </span>
                      수신 예상:{" "}
                      <span className="text-white font-bold">36명</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-end justify-between">
                  <label className="text-xs font-bold text-[#9dabb9] uppercase">
                    메시지 내용
                  </label>
                  <div className="flex gap-1">
                    {["수업명", "시간", "학생명"].map((keyword) => (
                      <button
                        key={keyword}
                        type="button"
                        className="rounded bg-[#3b4754] px-2 py-0.5 text-[10px] text-white transition hover:bg-emerald-600"
                      >
                        + {keyword}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-[#3b4754] bg-[#111418] p-3 focus-within:ring-1 focus-within:ring-emerald-500">
                  <textarea
                    className="custom-scrollbar h-32 w-full resize-none bg-transparent text-sm text-white placeholder:text-[#9dabb9] focus:outline-none"
                    defaultValue={`[Academix] 수업 알림
안녕하세요 {학생명}님,
오늘 {시간}에 '{수업명}' 수업이 예정되어 있습니다. 
304호 강의실로 늦지 않게 와주세요.
* 문의: 02-1234-5678`}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#9dabb9] uppercase">
                    발송 시간 설정
                  </label>
                  <select className="rounded-lg border border-[#3b4754] bg-[#111418] px-3 py-2.5 text-sm focus:ring-1 focus:ring-emerald-500">
                    {[
                      "수업 시작 1시간 전 (추천)",
                      "수업 시작 30분 전",
                      "수업 시작 24시간 전",
                      "지금 즉시 발송",
                    ].map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-3 rounded-lg border border-[#3b4754]/70 bg-[#2b323b]/50 p-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded bg-[#3b4754] p-1.5">
                      <span className={iconClass("text-white text-[18px]")}>
                        update
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">자동 발송 설정</p>
                      <p className="text-xs text-[#9dabb9]">
                        매 수업마다 위 설정대로 알림을 자동으로 보냅니다.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="h-5 w-9 rounded-full border border-[#3b4754] bg-[#111418] transition peer-checked:bg-emerald-500">
                      <span className="absolute left-1 top-[6px] size-3 rounded-full bg-[#9dabb9] transition peer-checked:translate-x-4 peer-checked:bg-white" />
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <footer className="flex items-center justify-end gap-3 border-t border-[#3b4754] bg-[#232930] px-6 py-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-[#9dabb9] transition hover:bg-[#3b4754] hover:text-white"
              >
                취소
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600">
                <span className={iconClass("text-[18px]")}>send</span>
                알림 예약하기
              </button>
            </footer>
          </div>
        </div>
      ) : null}
    </>
  );
}

const channelOptions = [
  {
    label: "카카오톡",
    value: "kakao",
    icon: "chat_bubble",
    iconColor: "text-yellow-400",
  },
  {
    label: "SMS (문자)",
    value: "sms",
    icon: "sms",
    iconColor: "text-[#9dabb9]",
  },
];
