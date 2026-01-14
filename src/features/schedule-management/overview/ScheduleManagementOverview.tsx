"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  calendarDays as baseCalendarDays,
  filterOptions,
  upcomingSchedules,
} from "@/features/schedule-management/overview/data";
import { classEntities } from "@/data/classes";
import type {
  CalendarDay,
  CalendarEvent,
  CalendarEventVariant,
} from "@/features/schedule-management/overview/types";
import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

export function ScheduleManagementOverview() {
  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200"
      )}
    >
      <div className="flex h-[calc(100vh-var(--app-header))] flex-col lg:h-[unset]">
        <PageBody />
      </div>
    </div>
  );
}

function PageBody() {
  const [isTimetableOpen, setIsTimetableOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [calendarDays, setCalendarDays] = useState(baseCalendarDays);

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <header className="border-b border-transparent px-6 py-4 md:px-10 md:py-6">
        <nav className="mb-4 flex items-center gap-2 text-sm">
          <Link
            className="font-medium text-slate-500 hover:text-primary dark:text-slate-400"
            href="/dashboard"
          >
            홈
          </Link>
          <span className="text-slate-400">/</span>
          <span className="font-medium text-slate-900 dark:text-slate-100">
            스케줄 관리
          </span>
        </nav>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <h2
              className={cn(
                lexend.className,
                "text-3xl font-black text-slate-900 dark:text-white md:text-4xl"
              )}
            >
              스케줄 관리
            </h2>
            <p className="text-base text-slate-500 dark:text-slate-400">
              수업, 시험, 상담 일정을 한눈에 확인하세요.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-[#1a2632] dark:text-slate-200"
              onClick={() => setIsScheduleOpen(true)}
            >
              <span className={iconClass("text-[18px]")}>event_available</span>
              일정 생성
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-[#1a2632] dark:text-slate-200"
              onClick={() => setIsTimetableOpen(true)}
            >
              <span className={iconClass("text-[18px]")}>grid_view</span>
              시간표 보기
            </button>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-auto px-4 pb-8 pt-0 md:px-10">
        <div className="flex h-full flex-col gap-6 xl:flex-row">
          <CalendarCard
            days={calendarDays}
            onSelectEvent={(event) => setSelectedEvent(event)}
          />
          <RightSidebar />
        </div>
      </div>
      {isTimetableOpen ? (
        <TimetableModal onClose={() => setIsTimetableOpen(false)} />
      ) : null}
      {isScheduleOpen ? (
        <ScheduleCreateModal
          onClose={() => setIsScheduleOpen(false)}
          onCreate={(payload) => {
            setCalendarDays((prev) =>
              prev.map((day) => {
                if (day.month !== "current" || day.date !== payload.date) {
                  return day;
                }
                const nextEvents = day.events ? [...day.events] : [];
                nextEvents.unshift({
                  id: payload.id,
                  label: payload.label,
                  variant: payload.variant,
                  title: payload.title,
                  date: payload.fullDate,
                  time: payload.time,
                  location: payload.location,
                  content: payload.content,
                });
                return { ...day, events: nextEvents };
              })
            );
            setIsScheduleOpen(false);
          }}
        />
      ) : null}
      {selectedEvent ? (
        <ScheduleDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      ) : null}
    </main>
  );
}

function CalendarCard({
  days,
  onSelectEvent,
}: {
  days: CalendarDay[];
  onSelectEvent: (event: CalendarEvent) => void;
}) {
  return (
    <section className="flex min-h-[560px] flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#1a2632] sm:min-h-[680px] lg:min-h-[800px]">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-4 dark:border-slate-800 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex items-center gap-4">
          <button className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
            <span className={iconClass()}>chevron_left</span>
          </button>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            2023년 10월
          </h3>
          <button className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
            <span className={iconClass()}>chevron_right</span>
          </button>
          <button className="rounded border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
            오늘
          </button>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto rounded-lg bg-slate-100 p-1 text-sm dark:bg-slate-800">
          {["월별", "주별", "일별"].map((label, index) => (
            <button
              key={label}
              className={cn(
                "rounded px-4 py-1.5 font-medium transition",
                index === 0
                  ? "bg-white text-slate-900 shadow-sm dark:bg-[#1a2632] dark:text-white"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              )}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-xs font-semibold dark:border-slate-800 dark:bg-slate-800/50 sm:text-sm">
            {["일", "월", "화", "수", "목", "금", "토"].map((label, index) => (
              <div
                key={label}
                className={cn(
                  "py-3 text-center",
                  index === 0 && "text-red-500",
                  index === 6 && "text-blue-500 dark:text-blue-300",
                  index !== 0 &&
                    index !== 6 &&
                    "text-slate-600 dark:text-slate-300"
                )}
              >
                {label}
              </div>
            ))}
          </div>
          <div className="grid flex-1 grid-cols-7 gap-px border-b border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800">
            {days.map((day, index) => (
              <div
                key={`${day.month}-${day.date}-${index}`}
                className="flex min-h-[100px] flex-col gap-1 bg-white p-2 dark:bg-[#1a2632] sm:min-h-[120px]"
              >
                <DayNumber day={day} />
                {day.events?.map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "rounded border-l-2 px-2 py-1",
                      eventStyles[event.variant].wrapper
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectEvent(event)}
                      className={cn(
                        "w-full text-left text-xs font-bold",
                        eventStyles[event.variant].text
                      )}
                    >
                      {event.label}
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DayNumber({ day }: { day: CalendarDay }) {
  const baseClass = cn(
    "text-sm font-medium",
    day.month === "prev" || day.month === "next"
      ? "text-slate-400 dark:text-slate-600"
      : day.weekday === 0
        ? "text-red-500 dark:text-red-400"
        : day.weekday === 6
          ? "text-blue-500 dark:text-blue-400"
          : "text-slate-700 dark:text-slate-300"
  );

  if (day.isToday) {
    return (
      <div className="flex size-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-md shadow-primary/30">
        {day.date}
      </div>
    );
  }

  return <span className={baseClass}>{day.date}</span>;
}

function RightSidebar() {
  return (
    <div className="flex w-full shrink-0 flex-col gap-6 xl:w-80">
      <FilterCard />
      <UpcomingList />
    </div>
  );
}

function TimetableModal({ onClose }: { onClose: () => void }) {
  const timeSlots = useMemo(
    () => [
      "11:00 - 12:00",
      "12:00 - 13:00",
      "13:00 - 14:00",
      "14:00 - 15:00",
      "15:00 - 16:00",
      "16:00 - 17:00",
      "17:00 - 18:00",
      "18:00 - 19:00",
      "19:00 - 20:00",
      "20:00 - 21:00",
      "21:00 - 22:00",
      "22:00 - 23:00",
    ],
    []
  );

  const dayOrder = ["월", "화", "수", "목", "금", "토"];

  const blocks = classEntities.map((klass, index) => {
    const day = klass.schedule.days[0] ?? "월";
    const startHour = parseInt(klass.schedule.time.split(":")[0], 10);
    const endHour = parseInt(klass.schedule.time.split("-")[1], 10);
    const topIndex = Math.max(startHour - 11, 0);
    const height = Math.max(endHour - startHour, 1);
    const colorPalette = [
      "bg-[#ffd166]",
      "bg-[#a5b4fc]",
      "bg-[#fbcfe8]",
      "bg-[#bae6fd]",
      "bg-[#fde68a]",
      "bg-[#86efac]",
    ];
    return {
      id: klass.id,
      day,
      topIndex,
      height,
      label: klass.name,
      color: colorPalette[index % colorPalette.length],
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#1a2632]">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <div>
            <p className="text-xs font-semibold text-slate-400">시간표</p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              개설된 강의 시간표
            </h3>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={onClose}
            aria-label="시간표 모달 닫기"
          >
            <span className={iconClass("text-[20px]")}>close</span>
          </button>
        </div>
        <div className="overflow-x-auto bg-[#f9fafb] p-4 dark:bg-[#0f1720]">
          <div className="min-w-[880px] overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#111827]">
            <div className="bg-[#f9c5d1] px-6 py-4 text-center">
              <p className="text-lg font-bold text-slate-700">
                모티브에듀 서하늘영어
              </p>
              <p className="text-2xl font-black text-slate-800">
                2025 1학기 시간표
              </p>
            </div>
            <div className="grid grid-cols-[120px_repeat(6,1fr)] border-t border-slate-200 text-center text-sm font-semibold text-slate-600">
              <div className="bg-[#f9c5d1] py-3">시간</div>
              {dayOrder.map((day) => (
                <div key={day} className="bg-[#f9c5d1] py-3">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-[120px_repeat(6,1fr)] border-t border-slate-200">
              <div className="flex flex-col border-r border-slate-200 text-xs text-slate-500">
                {timeSlots.map((slot) => (
                  <div
                    key={slot}
                    className="flex h-16 items-center justify-center border-b border-slate-200 bg-white"
                  >
                    {slot}
                  </div>
                ))}
              </div>
              {dayOrder.map((day) => (
                <div key={day} className="relative border-r border-slate-200">
                  {timeSlots.map((slot) => (
                    <div
                      key={`${day}-${slot}`}
                      className="h-16 border-b border-slate-200 bg-white"
                    />
                  ))}
                  {blocks
                    .filter((block) => block.day === day)
                    .map((block) => (
                      <div
                        key={block.id}
                        className={cn(
                          "absolute left-2 right-2 rounded-xl px-2 py-2 text-xs font-semibold text-slate-700 shadow-sm",
                          block.color
                        )}
                        style={{
                          top: `${block.topIndex * 64 + 8}px`,
                          height: `${block.height * 64 - 12}px`,
                        }}
                      >
                        {block.label}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScheduleCreateModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (payload: {
    id: string;
    date: number;
    fullDate: string;
    title: string;
    label: string;
    variant: CalendarEventVariant;
    time: string;
    location: string;
    content: string;
  }) => void;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("");
  const [variant, setVariant] = useState<CalendarEventVariant>("exam");
  const [content, setContent] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const dayNumber = Number(date.split("-")[2]);
    const trimmedTitle = title.trim();
    const baseLabel = trimmedTitle || "새 일정";
    const timeLabel = time ? `${time} ` : "";
    onCreate({
      id: `schedule-${Date.now().toString(36)}`,
      date: dayNumber,
      fullDate: date,
      title: baseLabel,
      label: `${timeLabel}${baseLabel}`,
      variant,
      time,
      location: "",
      content,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#1a2632]">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              일정 등록
            </p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              일정 생성
            </h3>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={onClose}
            aria-label="일정 생성 모달 닫기"
          >
            <span className={iconClass("text-[20px]")}>close</span>
          </button>
        </div>
        <form className="space-y-4 px-6 py-6" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              일정 제목
            </span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="예: 수학 모의고사"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-[#111418] dark:text-white"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                일정 날짜 (현재 달력 기준)
              </span>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-[#111418] dark:text-white"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                시간
              </span>
              <input
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-[#111418] dark:text-white"
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                일정 분류
              </span>
              <select
                value={variant}
                onChange={(event) =>
                  setVariant(event.target.value as CalendarEventVariant)
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-[#111418] dark:text-white"
              >
                <option value="exam">시험</option>
                <option value="assignment">클리닉</option>
                <option value="counsel">기타</option>
              </select>
            </label>
          </div>
          <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              일정 내용
            </span>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="예: 모의고사 대비 특강 진행"
              className="min-h-[90px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-[#111418] dark:text-white"
            />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              onClick={onClose}
            >
              취소
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ScheduleDetailModal({
  event,
  onClose,
}: {
  event: CalendarEvent;
  onClose: () => void;
}) {
  const title = event.title ?? event.label;
  const dateLabel = event.date ?? "날짜 미정";
  const timeLabel = event.time || "시간 미정";
  const locationLabel = event.location || "장소 미정";
  const contentLabel = event.content || "등록된 내용이 없습니다.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#1a2632]">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              일정 상세
            </p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={onClose}
            aria-label="일정 상세 모달 닫기"
          >
            <span className={iconClass("text-[20px]")}>close</span>
          </button>
        </div>
        <div className="space-y-4 px-6 py-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span
              className={cn(
                "rounded-full px-3 py-1",
                eventStyles[event.variant].wrapper
              )}
            >
              {variantLabels[event.variant]}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
              {dateLabel}
            </span>
          </div>
          <div className="grid gap-3 text-sm text-slate-700 dark:text-slate-200">
            <div className="flex items-center gap-2">
              <span className={iconClass("text-[18px] text-slate-400")}>
                schedule
              </span>
              <span>{timeLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={iconClass("text-[18px] text-slate-400")}>
                place
              </span>
              <span>{locationLabel}</span>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-[#111418] dark:text-slate-300">
              {contentLabel}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
              onClick={onClose}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterCard() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#1a2632]">
      <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
        일정 필터
      </h3>
      <div className="flex flex-col gap-2">
        {filterOptions.map((filter) => (
          <label
            key={filter.label}
            className="flex cursor-pointer items-center justify-between rounded-lg p-2 transition hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className={cn("size-2 rounded-full", filter.color)} />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {filter.label}
              </span>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
          </label>
        ))}
      </div>
    </section>
  );
}

function UpcomingList() {
  return (
    <section className="flex flex-1 flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#1a2632]">
      <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">
        다가오는 일정 (오늘)
      </h3>
      <div className="flex flex-1 flex-col gap-4">
        {upcomingSchedules.map((schedule, index) => (
          <div
            key={schedule.title}
            className={cn("flex gap-3", index === 1 && "opacity-70")}
          >
            <div
              className={cn(
                "flex min-w-[50px] flex-col items-center rounded-lg p-2",
                schedule.variant === "primary"
                  ? "bg-blue-50 dark:bg-blue-900/20"
                  : "bg-slate-50 dark:bg-slate-800"
              )}
            >
              <span
                className={cn(
                  "text-xs font-bold",
                  schedule.variant === "primary"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-500"
                )}
              >
                {schedule.monthLabel}
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {schedule.dateLabel}
              </span>
            </div>
            <div className="flex flex-col pt-0.5">
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {schedule.title}
              </p>
              <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                {schedule.time}
              </p>
              <div className="flex items-center gap-1">
                <div
                  className={cn(
                    "size-1.5 rounded-full",
                    schedule.variant === "primary"
                      ? "bg-blue-500"
                      : "bg-slate-400"
                  )}
                />
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  {schedule.location}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 flex w-full items-center justify-center gap-1 py-2 text-xs font-medium text-slate-500 hover:text-primary">
        <span>전체 일정 보기</span>
        <span className={iconClass("text-[14px]")}>arrow_forward</span>
      </button>
    </section>
  );
}

const eventStyles: Record<
  CalendarEventVariant,
  { wrapper: string; text: string }
> = {
  class: {
    wrapper: "border-primary bg-blue-100 dark:bg-blue-900/40",
    text: "text-blue-700 dark:text-blue-300",
  },
  assignment: {
    wrapper: "border-emerald-500 bg-emerald-100 dark:bg-emerald-900/40",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  exam: {
    wrapper: "border-rose-500 bg-rose-100 dark:bg-rose-900/40",
    text: "text-rose-700 dark:text-rose-300",
  },
  counsel: {
    wrapper: "border-amber-500 bg-amber-100 dark:bg-amber-900/40",
    text: "text-amber-800 dark:text-amber-300",
  },
};

const variantLabels: Record<CalendarEventVariant, string> = {
  class: "수업",
  exam: "시험",
  assignment: "클리닉",
  counsel: "기타",
};
