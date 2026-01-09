import Link from "next/link";

import {
  calendarDays,
  filterOptions,
  miniCalendarDays,
  upcomingSchedules,
} from "@/features/schedule-management/overview/data";
import type {
  CalendarDay,
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
        </div>
      </header>
      <div className="flex-1 overflow-auto px-4 pb-8 pt-0 md:px-10">
        <div className="flex h-full flex-col gap-6 xl:flex-row">
          <CalendarCard />
          <RightSidebar />
        </div>
      </div>
    </main>
  );
}

function CalendarCard() {
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
            {calendarDays.map((day, index) => (
              <div
                key={`${day.month}-${day.date}-${index}`}
                className="flex min-h-[100px] flex-col gap-1 bg-white p-2 dark:bg-[#1a2632] sm:min-h-[120px]"
              >
                <DayNumber day={day} />
                {day.events?.map((event) => (
                  <div
                    key={event.label}
                    className={cn(
                      "rounded border-l-2 px-2 py-1",
                      eventStyles[event.variant].wrapper
                    )}
                  >
                    <p
                      className={cn(
                        "text-xs font-bold",
                        eventStyles[event.variant].text
                      )}
                    >
                      {event.label}
                    </p>
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
      <MiniCalendar />
      <FilterCard />
      <UpcomingList />
    </div>
  );
}

function MiniCalendar() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#1a2632]">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-lg font-bold text-slate-900 dark:text-white">
          2023년 10월
        </span>
        <div className="flex gap-2">
          <button className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
            <span className={iconClass("text-[20px]")}>chevron_left</span>
          </button>
          <button className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
            <span className={iconClass("text-[20px]")}>chevron_right</span>
          </button>
        </div>
      </div>
      <div className="mb-2 grid grid-cols-7 gap-y-3 text-center text-xs">
        {["일", "월", "화", "수", "목", "금", "토"].map((label, index) => (
          <span
            key={label}
            className={cn(
              "font-medium",
              index === 0 && "text-red-500",
              index === 6 && "text-blue-500 dark:text-blue-300",
              index !== 0 && index !== 6 && "text-slate-500 dark:text-slate-400"
            )}
          >
            {label}
          </span>
        ))}
        {miniCalendarDays.map((day) => (
          <span
            key={day.label}
            className={cn(
              "mx-auto flex h-6 w-6 items-center justify-center rounded-full cursor-pointer",
              day.state === "muted" && "text-slate-300 dark:text-slate-600",
              day.state === "saturday" && "text-blue-500 dark:text-blue-400",
              day.state === "sunday" && "text-red-500 dark:text-red-400",
              day.state === "today" &&
                "bg-primary text-white shadow-md shadow-primary/30",
              !day.state &&
                "text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700"
            )}
          >
            {day.label}
            {day.dot && (
              <span
                className={cn(
                  "absolute bottom-1 block h-1 w-1 rounded-full",
                  day.dot === "assignment" && "bg-emerald-500",
                  day.dot === "counsel" && "bg-amber-500",
                  day.dot === "exam" && "bg-rose-500"
                )}
              />
            )}
          </span>
        ))}
      </div>
    </section>
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
