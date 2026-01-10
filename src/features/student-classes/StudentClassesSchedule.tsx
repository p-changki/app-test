"use client";

import { useMemo, useState } from "react";

import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

type ScheduleEvent = {
  id: string;
  term: string;
  date: string; // YYYY-MM-DD
  subject: string;
  title: string;
  start: string;
  end: string;
  location: string;
  teacher: string;
  accent: "purple" | "blue" | "green";
  notes?: string;
};

type RetestSchedule = {
  id: string;
  subject: string;
  title: string;
  date: string;
  time: string;
  location: string;
  teacher: string;
  status?: "pending" | "approved";
};

const scheduleEvents: ScheduleEvent[] = [
  {
    id: "math-mon",
    term: "2024년 1학기",
    date: "2024-03-11",
    subject: "수학",
    title: "고등 수학 심화",
    start: "16:00",
    end: "17:30",
    location: "101호",
    teacher: "김철수 T",
    accent: "purple",
    notes: "오답 노트 지참",
  },
  {
    id: "eng-mon",
    term: "2024년 1학기",
    date: "2024-03-11",
    subject: "영어",
    title: "수능 영어 독해",
    start: "18:00",
    end: "19:00",
    location: "202호",
    teacher: "박영희 T",
    accent: "blue",
  },
  {
    id: "math-wed",
    term: "2024년 1학기",
    date: "2024-03-13",
    subject: "수학",
    title: "고등 수학 심화",
    start: "16:00",
    end: "17:30",
    location: "101호",
    teacher: "김철수 T",
    accent: "purple",
    notes: "오늘의 과제: p142 ~ p145",
  },
  {
    id: "science-fri",
    term: "2024년 1학기",
    date: "2024-03-15",
    subject: "과학",
    title: "통합 과학 실험",
    start: "17:00",
    end: "18:30",
    location: "실험실 3",
    teacher: "최과학 T",
    accent: "green",
  },
  {
    id: "camp-sun",
    term: "2024년 1학기",
    date: "2024-03-17",
    subject: "과학",
    title: "주말 과학 캠프",
    start: "13:00",
    end: "15:30",
    location: "제2실험실",
    teacher: "최과학 T",
    accent: "green",
  },
  {
    id: "eng-legacy",
    term: "2023년 2학기",
    date: "2023-10-10",
    subject: "영어",
    title: "수능 독해 스터디",
    start: "18:30",
    end: "20:00",
    location: "201호",
    teacher: "박영희 T",
    accent: "blue",
  },
];

const retestSchedules: RetestSchedule[] = [
  {
    id: "retest-math",
    subject: "수학",
    title: "수학 2단원 재시험",
    date: "2024-03-18",
    time: "18:00 - 19:30",
    location: "재시험실 1",
    teacher: "김철수 T",
    status: "pending",
  },
  {
    id: "retest-eng",
    subject: "영어",
    title: "영어 독해 재시험",
    date: "2024-03-20",
    time: "17:00 - 18:00",
    location: "202호",
    teacher: "박영희 T",
    status: "pending",
  },
  {
    id: "retest-sci",
    subject: "과학",
    title: "물리 실험 재시험",
    date: "2024-03-21",
    time: "19:00 - 20:30",
    location: "실험실 3",
    teacher: "최과학 T",
    status: "pending",
  },
];

const acceptedRetests: RetestSchedule[] = [
  {
    id: "retest-approved-math",
    subject: "수학",
    title: "수학 심화 재시험 (승인)",
    date: "2024-03-12",
    time: "19:00 - 20:30",
    location: "재시험실 2",
    teacher: "김철수 T",
    status: "approved",
  },
];

const allRetestSchedules: RetestSchedule[] = [
  ...retestSchedules,
  ...acceptedRetests,
];

const subjectOptions = ["전체", "수학", "영어", "과학", "국어"];
const hourHeight = 96;
const startHour = 13;

const availableYears = Array.from(
  new Set(scheduleEvents.map((event) => new Date(event.date).getFullYear()))
).sort((a, b) => a - b);

export function StudentClassesSchedule() {
  const initialDate = scheduleEvents[0]?.date
    ? new Date(scheduleEvents[0].date)
    : new Date();
  const initialWeekStart = getStartOfWeek(initialDate);

  const [subjectFilter, setSubjectFilter] = useState("전체");
  const [selectedEventId, setSelectedEventId] = useState(
    scheduleEvents[0]?.id ?? ""
  );
  const [detailEventId, setDetailEventId] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState(initialWeekStart);
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [selectedDay, setSelectedDay] = useState<Date>(initialWeekStart);
  const [retestModalId, setRetestModalId] = useState<string | null>(null);
  const [retestListOpen, setRetestListOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(initialDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    initialDate.getMonth() + 1
  );

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  }, [weekStart]);

  const filteredByWeek = useMemo(() => {
    return scheduleEvents.filter((event) =>
      isWithinWeek(new Date(event.date), weekStart)
    );
  }, [weekStart]);

  const filteredEvents = useMemo(() => {
    if (subjectFilter === "전체") return filteredByWeek;
    return filteredByWeek.filter((event) => event.subject === subjectFilter);
  }, [filteredByWeek, subjectFilter]);

  const activeEventId = useMemo(() => {
    if (filteredEvents.some((event) => event.id === selectedEventId)) {
      return selectedEventId;
    }
    return filteredEvents[0]?.id ?? "";
  }, [filteredEvents, selectedEventId]);

  const selectedEvent =
    filteredEvents.find((event) => event.id === activeEventId) ??
    filteredEvents[0] ??
    null;
  const detailEvent =
    filteredEvents.find((event) => event.id === detailEventId) ??
    scheduleEvents.find((event) => event.id === detailEventId) ??
    null;

  const upcomingEvents = useMemo(() => {
    return filteredEvents
      .map((event) => ({
        ...event,
        sortValue: new Date(`${event.date}T${event.start}:00`).getTime(),
      }))
      .sort((a, b) => a.sortValue - b.sortValue)
      .slice(0, 3);
  }, [filteredEvents]);

  const today = new Date();
  const highlightDate =
    viewMode === "day"
      ? selectedDay
      : isWithinWeek(today, weekStart)
        ? today
        : null;

  const getMonthsForYear = (year: number) => {
    const months = scheduleEvents
      .filter((event) => new Date(event.date).getFullYear() === year)
      .map((event) => new Date(event.date).getMonth() + 1);
    return Array.from(new Set(months)).sort((a, b) => a - b);
  };

  const monthsForYear = useMemo(() => {
    return getMonthsForYear(selectedYear);
  }, [selectedYear]);

  const syncWeekStart = (nextWeekStart: Date, nextSelectedDay?: Date) => {
    setWeekStart(nextWeekStart);
    if (nextSelectedDay) {
      setSelectedDay(nextSelectedDay);
      return;
    }
    setSelectedDay((prev) =>
      isWithinWeek(prev, nextWeekStart) ? prev : nextWeekStart
    );
  };

  const handleYearChange = (year: number) => {
    const months = getMonthsForYear(year);
    const nextMonth =
      months.length > 0 && months.includes(selectedMonth)
        ? selectedMonth
        : (months[0] ?? selectedMonth);
    setSelectedYear(year);
    setSelectedMonth(nextMonth);
    const baseDate = new Date(year, nextMonth - 1, 1);
    syncWeekStart(getStartOfWeek(baseDate), baseDate);
  };

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    const baseDate = new Date(selectedYear, month - 1, 1);
    syncWeekStart(getStartOfWeek(baseDate), baseDate);
  };

  const dailyClasses = useMemo(() => {
    return filteredEvents
      .filter((event) => isSameDay(new Date(event.date), selectedDay))
      .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
  }, [filteredEvents, selectedDay]);
  const dailyRetests = useMemo(() => {
    return allRetestSchedules
      .filter((schedule) => isSameDay(new Date(schedule.date), selectedDay))
      .sort(
        (a, b) =>
          timeToMinutes(getTimeRange(a.time).start) -
          timeToMinutes(getTimeRange(b.time).start)
      );
  }, [selectedDay]);

  const selectedRetest = retestModalId
    ? (allRetestSchedules.find((schedule) => schedule.id === retestModalId) ??
      null)
    : null;

  return (
    <div
      className={cn(
        notoSansKr.className,
        "min-h-screen bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors"
      )}
    >
      <div className="flex h-screen w-full flex-col">
        <header className="border-b border-[var(--surface-border)] bg-[var(--surface-panel)] px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1
                className={cn(
                  lexend.className,
                  "text-2xl font-bold text-[color:var(--surface-text)] sm:text-3xl"
                )}
              >
                나의 수업 시간표
              </h1>
              <p className="text-sm text-[color:var(--surface-text-muted)]">
                {formatWeekRange(weekStart)} • {selectedYear}년 {selectedMonth}
                월
              </p>
            </div>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <main className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            <section className="rounded-2xl border border-[color:var(--surface-border)] bg-[var(--surface-panel)] p-4 shadow-sm">
              <div className="flex flex-col gap-6 xl:flex-row">
                <div className="flex-1">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap items-center gap-4">
                      <label className="relative min-w-[140px]">
                        <select
                          className="w-full appearance-none rounded-lg border border-[color:var(--surface-border)] bg-[var(--surface-background)] py-2.5 pl-4 pr-10 text-sm font-medium text-[color:var(--surface-text)] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                          value={selectedYear}
                          onChange={(event) =>
                            handleYearChange(Number(event.target.value))
                          }
                        >
                          {availableYears.map((year) => (
                            <option key={year} value={year}>
                              {year}년
                            </option>
                          ))}
                        </select>
                        <span
                          className={iconClass(
                            "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-base text-[color:var(--surface-text-muted)]"
                          )}
                        >
                          expand_more
                        </span>
                      </label>
                      <label className="relative min-w-[120px]">
                        <select
                          className="w-full appearance-none rounded-lg border border-[color:var(--surface-border)] bg-[var(--surface-background)] py-2.5 pl-4 pr-10 text-sm font-medium text-[color:var(--surface-text)] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                          value={selectedMonth}
                          onChange={(event) =>
                            handleMonthChange(Number(event.target.value))
                          }
                        >
                          {(monthsForYear.length > 0
                            ? monthsForYear
                            : [selectedMonth]
                          ).map((month) => (
                            <option
                              key={`${selectedYear}-${month}`}
                              value={month}
                            >
                              {month}월
                            </option>
                          ))}
                        </select>
                        <span
                          className={iconClass(
                            "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-base text-[color:var(--surface-text-muted)]"
                          )}
                        >
                          expand_more
                        </span>
                      </label>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex rounded-lg bg-[color:var(--surface-background)] p-1 text-sm font-semibold">
                          <button
                            className={cn(
                              "rounded-md px-4 py-1.5 transition",
                              viewMode === "week"
                                ? "bg-[var(--surface-panel)] text-primary shadow-sm"
                                : "text-[color:var(--surface-text-muted)] hover:text-primary"
                            )}
                            type="button"
                            onClick={() => {
                              setViewMode("week");
                              setRetestListOpen(false);
                            }}
                          >
                            주간 캘린더
                          </button>
                          <button
                            className={cn(
                              "rounded-md px-4 py-1.5 transition",
                              viewMode === "day"
                                ? "bg-[var(--surface-panel)] text-primary shadow-sm"
                                : "text-[color:var(--surface-text-muted)] hover:text-primary"
                            )}
                            type="button"
                            onClick={() => setViewMode("day")}
                          >
                            일간 리스트
                          </button>
                        </div>
                        <button
                          type="button"
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                            retestListOpen
                              ? "border-transparent bg-primary text-white shadow"
                              : "border-[color:var(--surface-border)] text-primary hover:border-primary/40"
                          )}
                          onClick={() => setRetestListOpen(true)}
                        >
                          <span className={iconClass("text-xs")}>
                            history_edu
                          </span>
                          재시험 일정
                          <span className={iconClass("text-xs")}>
                            {retestListOpen ? "expand_less" : "expand_more"}
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-[color:var(--surface-background)] px-3 py-1.5 text-sm font-semibold">
                      <button
                        type="button"
                        className="flex size-8 items-center justify-center rounded-full hover:bg-[var(--surface-panel)]"
                        onClick={() => syncWeekStart(addDays(weekStart, -7))}
                      >
                        <span
                          className={iconClass(
                            "text-base text-[color:var(--surface-text-muted)]"
                          )}
                        >
                          chevron_left
                        </span>
                      </button>
                      <span className="min-w-[140px] text-center text-[color:var(--surface-text)]">
                        {formatWeekRange(weekStart)}
                      </span>
                      <button
                        type="button"
                        className="flex size-8 items-center justify-center rounded-full hover:bg-[var(--surface-panel)]"
                        onClick={() => syncWeekStart(addDays(weekStart, 7))}
                      >
                        <span
                          className={iconClass(
                            "text-base text-[color:var(--surface-text-muted)]"
                          )}
                        >
                          chevron_right
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {subjectOptions.map((subject) => {
                      const isActive = subjectFilter === subject;
                      return (
                        <button
                          key={subject}
                          type="button"
                          className={cn(
                            "rounded-full border px-4 py-1.5 text-sm font-medium transition",
                            isActive
                              ? "border-transparent bg-[color:var(--surface-text)] text-white shadow"
                              : "border-[color:var(--surface-border)] bg-[var(--surface-panel)] text-[color:var(--surface-text-muted)] hover:border-primary hover:text-primary"
                          )}
                          onClick={() => setSubjectFilter(subject)}
                        >
                          {subject}
                        </button>
                      );
                    })}
                  </div>
                  {viewMode === "day" ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {weekDays.map((date) => {
                        const isActive = isSameDay(date, selectedDay);
                        return (
                          <button
                            key={`day-chip-${date.toISOString()}`}
                            type="button"
                            className={cn(
                              "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                              isActive
                                ? "border-transparent bg-primary text-white shadow"
                                : "border-[color:var(--surface-border)] text-[color:var(--surface-text-muted)] hover:text-primary"
                            )}
                            onClick={() => setSelectedDay(date)}
                          >
                            {`${date.getMonth() + 1}/${date.getDate()} ${weekdayLabel(date)}`}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-6 lg:flex-row">
              {viewMode === "week" ? (
                <div className="flex-1 rounded-2xl border border-[color:var(--surface-border)] bg-[var(--surface-panel)] shadow-sm">
                  <div className="flex flex-col gap-1 border-b border-[color:var(--surface-border)] p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase text-[color:var(--surface-text-muted)]">
                        주간 캘린더
                      </p>
                      <p className="text-lg font-bold text-[color:var(--surface-text)]">
                        {formatWeekRange(weekStart)}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-[color:var(--surface-text-muted)]">
                      {filteredEvents.length > 0
                        ? `${filteredEvents.length}개의 수업`
                        : "수업 일정 없음"}
                    </span>
                  </div>
                  <div className="grid grid-cols-[60px_repeat(7,1fr)] divide-x divide-[color:var(--surface-border)] border-b border-[color:var(--surface-border)] bg-[color:var(--surface-background)]">
                    <div className="p-3" />
                    {weekDays.map((date) => {
                      const isActiveDay = highlightDate
                        ? isSameDay(date, highlightDate)
                        : false;
                      return (
                        <div
                          key={date.toISOString()}
                          className={cn(
                            "p-3 text-center",
                            isActiveDay && "bg-primary/5 dark:bg-primary/10"
                          )}
                        >
                          <span
                            className={cn(
                              "block text-xs font-semibold uppercase",
                              isActiveDay
                                ? "text-primary"
                                : "text-[color:var(--surface-text-muted)]"
                            )}
                          >
                            {weekdayLabel(date)}
                          </span>
                          {isActiveDay ? (
                            <div className="mx-auto mt-1 flex size-8 items-center justify-center rounded-full bg-primary text-base font-bold text-white shadow">
                              {date.getDate()}
                            </div>
                          ) : (
                            <span className="block text-lg font-bold text-[color:var(--surface-text)]">
                              {date.getDate()}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-[60px_repeat(7,1fr)] divide-x divide-[color:var(--surface-border)]">
                    <div>
                      {Array.from({ length: timeSlots.length }, (_, index) => (
                        <div
                          key={`slot-${index}`}
                          className="flex h-[96px] items-start justify-center border-b border-[color:var(--surface-border)] pt-2 text-xs font-medium text-[color:var(--surface-text-muted)]"
                        >
                          {timeSlots[index]}
                        </div>
                      ))}
                    </div>
                    {weekDays.map((date) => {
                      const classEvents = filteredEvents.filter((event) =>
                        isSameDay(new Date(event.date), date)
                      );
                      const retestEvents = allRetestSchedules.filter(
                        (schedule) => isSameDay(new Date(schedule.date), date)
                      );
                      return (
                        <div
                          key={`day-${date.toISOString()}`}
                          className="relative border-b border-[color:var(--surface-border)]"
                          style={{
                            minHeight: `${timeSlots.length * hourHeight}px`,
                          }}
                        >
                          {Array.from(
                            { length: timeSlots.length },
                            (_, index) => (
                              <div
                                key={`grid-${index}`}
                                className="pointer-events-none h-[96px] border-b border-dashed border-[color:var(--surface-border)]"
                              />
                            )
                          )}
                          {classEvents.map((event) => {
                            const { top, height } = computePlacement(
                              event.start,
                              event.end
                            );
                            return (
                              <button
                                key={event.id}
                                type="button"
                                style={{ top, height }}
                                className={cn(
                                  "absolute left-1 right-1 rounded border-l-4 p-3 text-left shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                  getEventClasses(event.accent),
                                  event.id === activeEventId &&
                                    "ring-2 ring-primary/30"
                                )}
                                onClick={() => setSelectedEventId(event.id)}
                              >
                                <span className="rounded px-1.5 py-0.5 text-xs font-semibold">
                                  {event.subject}
                                </span>
                                <p className="mt-1 text-sm font-bold">
                                  {event.title}
                                </p>
                                <div className="mt-2 space-y-1 text-xs text-[color:var(--surface-text-muted)]">
                                  <ScheduleItem
                                    icon="schedule"
                                    label={`${event.start} - ${event.end}`}
                                  />
                                  <ScheduleItem
                                    icon="meeting_room"
                                    label={event.location}
                                  />
                                  <ScheduleItem
                                    icon="person"
                                    label={event.teacher}
                                  />
                                </div>
                              </button>
                            );
                          })}
                          {retestEvents.map((schedule) => {
                            const { start, end } = getTimeRange(schedule.time);
                            const { top, height } = computePlacement(
                              start,
                              end
                            );
                            const isApproved = schedule.status === "approved";
                            const colorBase = isApproved
                              ? "border-green-500 bg-green-50 text-green-900 hover:border-green-600 focus-visible:ring-green-300 dark:bg-green-900/20"
                              : "border-red-500 bg-red-50 text-red-900 hover:border-red-600 focus-visible:ring-red-300 dark:bg-red-900/20";
                            const chipColor = isApproved
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700";
                            return (
                              <button
                                key={`retest-${schedule.id}`}
                                type="button"
                                style={{ top, height }}
                                className={cn(
                                  "absolute left-1 right-1 rounded border-l-4 p-3 text-left shadow-sm transition focus-visible:outline-none focus-visible:ring-2",
                                  colorBase
                                )}
                                onClick={() => setRetestModalId(schedule.id)}
                              >
                                <span
                                  className={cn(
                                    "rounded px-1.5 py-0.5 text-xs font-semibold",
                                    chipColor
                                  )}
                                >
                                  {isApproved ? "승인된 재시험" : "재시험"}
                                </span>
                                <p className="mt-1 text-sm font-bold">
                                  {schedule.title}
                                </p>
                                <div className="mt-2 space-y-1 text-xs opacity-80">
                                  <ScheduleItem
                                    icon="schedule"
                                    label={schedule.time}
                                  />
                                  <ScheduleItem
                                    icon="meeting_room"
                                    label={schedule.location}
                                  />
                                </div>
                              </button>
                            );
                          })}
                          {classEvents.length === 0 &&
                          retestEvents.length === 0 ? (
                            <div className="absolute inset-0 flex items-center justify-center text-xs text-[color:var(--surface-text-muted)]">
                              일정 없음
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex-1 rounded-2xl border border-[color:var(--surface-border)] bg-[var(--surface-panel)] shadow-sm">
                  <div className="flex flex-col gap-3 border-b border-[color:var(--surface-border)] p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase text-[color:var(--surface-text-muted)]">
                        일간 리스트
                      </p>
                      <p className="text-lg font-bold text-[color:var(--surface-text)]">
                        {formatDisplayDate(selectedDay)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:items-end">
                      <span className="text-sm font-medium text-[color:var(--surface-text-muted)]">
                        수업 {dailyClasses.length}개 · 재시험{" "}
                        {dailyRetests.length}개
                      </span>
                    </div>
                  </div>
                  <div className="divide-y divide-[color:var(--surface-border)]">
                    {dailyClasses.length === 0 && dailyRetests.length === 0 ? (
                      <p className="px-6 py-10 text-center text-sm text-[color:var(--surface-text-muted)]">
                        선택한 날짜에 예정된 일정이 없습니다.
                      </p>
                    ) : (
                      <>
                        {dailyClasses.map((event) => (
                          <button
                            key={`daily-${event.id}`}
                            type="button"
                            className="flex w-full flex-col gap-2 px-6 py-4 text-left transition hover:bg-[color:var(--surface-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                            onClick={() => setSelectedEventId(event.id)}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                {event.subject}
                              </span>
                              <span className="text-xs font-medium text-[color:var(--surface-text-muted)]">
                                {selectedYear}년 {selectedMonth}월
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-[color:var(--surface-text)]">
                              {event.title}
                            </h4>
                            <div className="flex flex-wrap gap-4 text-sm text-[color:var(--surface-text-muted)]">
                              <ScheduleItem
                                icon="schedule"
                                label={`${event.start} - ${event.end}`}
                              />
                              <ScheduleItem
                                icon="meeting_room"
                                label={event.location}
                              />
                              <ScheduleItem
                                icon="person"
                                label={event.teacher}
                              />
                            </div>
                          </button>
                        ))}
                        {dailyRetests.length > 0 ? (
                          <div className="bg-[color:var(--surface-background)] px-6 py-4">
                            <p className="mb-3 text-xs font-semibold uppercase text-red-600">
                              재시험
                            </p>
                            <div className="space-y-3">
                              {dailyRetests.map((schedule) => {
                                const isApproved =
                                  schedule.status === "approved";
                                const borderColor = isApproved
                                  ? "border-green-200"
                                  : "border-red-200";
                                const textColor = isApproved
                                  ? "text-green-900"
                                  : "text-red-900";
                                const ringColor = isApproved
                                  ? "focus-visible:ring-green-300"
                                  : "focus-visible:ring-red-300";
                                const badgeColor = isApproved
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700";
                                return (
                                  <button
                                    key={`daily-retest-${schedule.id}`}
                                    type="button"
                                    className={cn(
                                      "flex w-full flex-col rounded-xl border bg-white px-4 py-3 text-left text-sm shadow-sm transition hover:border-opacity-70 focus-visible:outline-none",
                                      borderColor,
                                      textColor,
                                      ringColor
                                    )}
                                    onClick={() =>
                                      setRetestModalId(schedule.id)
                                    }
                                  >
                                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                                      <span className="font-semibold">
                                        {schedule.subject}
                                      </span>
                                      <span
                                        className={cn(
                                          "rounded px-2 py-0.5 text-[10px] font-bold",
                                          badgeColor
                                        )}
                                      >
                                        {isApproved ? "승인됨" : "신청 가능"}
                                      </span>
                                    </div>
                                    <h4 className="text-base font-bold">
                                      {schedule.title}
                                    </h4>
                                    <div className="mt-2 flex flex-wrap gap-4 text-xs opacity-80">
                                      <ScheduleItem
                                        icon="schedule"
                                        label={schedule.time}
                                      />
                                      <ScheduleItem
                                        icon="meeting_room"
                                        label={schedule.location}
                                      />
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
              )}
              <aside className="w-full rounded-2xl border border-[color:var(--surface-border)] bg-[var(--surface-panel)] p-6 shadow-sm lg:w-80">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">상세 정보</h3>
                  <button
                    type="button"
                    className="text-[color:var(--surface-text-muted)] hover:text-primary"
                  >
                    <span className={iconClass()}>more_horiz</span>
                  </button>
                </div>
                {selectedEvent ? (
                  <div className="mt-4 space-y-4">
                    <div className="rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface-background)] p-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex size-10 items-center justify-center rounded-xl text-[20px]",
                            getEventBadge(selectedEvent.accent)
                          )}
                        >
                          <span className={iconClass()}>calendar_month</span>
                        </span>
                        <div>
                          <p className="text-xs font-medium text-[color:var(--surface-text-muted)]">
                            {selectedEvent.subject}
                          </p>
                          <p className="text-base font-bold">
                            {selectedEvent.title}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-3 text-sm">
                        <DetailRow
                          icon="event"
                          label={`${selectedEvent.date} (${weekdayLabel(new Date(selectedEvent.date))})`}
                        />
                        <DetailRow
                          icon="schedule"
                          label={`${selectedEvent.start} - ${selectedEvent.end}`}
                        />
                        <DetailRow
                          icon="meeting_room"
                          label={selectedEvent.location}
                        />
                        <DetailRow
                          icon="person"
                          label={selectedEvent.teacher}
                        />
                        {selectedEvent.notes ? (
                          <DetailRow
                            icon="assignment"
                            label={selectedEvent.notes}
                          />
                        ) : null}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="w-full rounded-lg border border-[color:var(--surface-border)] bg-[var(--surface-panel)] py-2 text-sm font-semibold text-[color:var(--surface-text)] transition hover:bg-[color:var(--surface-border)]/30"
                      onClick={() => setDetailEventId(selectedEvent.id)}
                    >
                      상세 페이지 이동
                    </button>
                  </div>
                ) : (
                  <p className="mt-6 text-sm text-[color:var(--surface-text-muted)]">
                    조건에 맞는 수업이 없습니다.
                  </p>
                )}
                <div className="mt-8 space-y-4">
                  <h4 className="text-sm font-bold">다가오는 일정</h4>
                  {upcomingEvents.length === 0 ? (
                    <p className="text-xs text-[color:var(--surface-text-muted)]">
                      예정된 수업이 없습니다.
                    </p>
                  ) : (
                    upcomingEvents.map((event) => (
                      <button
                        key={`upcoming-${event.id}`}
                        type="button"
                        className="flex w-full items-center gap-3 rounded-xl border border-transparent p-3 text-left transition hover:border-[color:var(--surface-border)]"
                        onClick={() => setSelectedEventId(event.id)}
                      >
                        <div className="flex flex-col items-center justify-center rounded-lg bg-[color:var(--surface-background)] px-3 py-2 text-xs font-semibold">
                          <span>{weekdayLabel(new Date(event.date))}</span>
                          <span className="text-sm">{event.start}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold">{event.title}</p>
                          <p className="text-xs text-[color:var(--surface-text-muted)]">
                            {event.location} · {event.teacher}
                          </p>
                        </div>
                        <span
                          className={iconClass(
                            "text-[color:var(--surface-text-muted)]"
                          )}
                        >
                          chevron_right
                        </span>
                      </button>
                    ))
                  )}
                </div>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold">승인된 재시험</h4>
                    <span className="text-[11px] font-semibold text-[color:var(--surface-text-muted)]">
                      {acceptedRetests.length}개
                    </span>
                  </div>
                  {acceptedRetests.length === 0 ? (
                    <p className="text-xs text-[color:var(--surface-text-muted)]">
                      승인된 재시험 일정이 없습니다.
                    </p>
                  ) : (
                    acceptedRetests.map((schedule) => (
                      <div
                        key={`approved-${schedule.id}`}
                        className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-900 shadow-sm dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-100"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span>{schedule.subject}</span>
                          <span className="text-green-600 dark:text-green-300">
                            승인 완료
                          </span>
                        </div>
                        <p className="mt-1 text-base font-bold">
                          {schedule.title}
                        </p>
                        <div className="mt-2 space-y-1 text-xs">
                          <ScheduleItem icon="event" label={schedule.date} />
                          <ScheduleItem icon="schedule" label={schedule.time} />
                          <ScheduleItem
                            icon="meeting_room"
                            label={schedule.location}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </aside>
            </section>
          </main>
        </div>
      </div>
      {detailEvent ? (
        <ClassDetailModal
          event={detailEvent}
          onClose={() => setDetailEventId(null)}
        />
      ) : null}
      {retestListOpen ? (
        <RetestListModal
          schedules={allRetestSchedules}
          onSelect={(id) => {
            setRetestModalId(id);
            setRetestListOpen(false);
          }}
          onClose={() => setRetestListOpen(false)}
        />
      ) : null}
      {selectedRetest ? (
        <RetestApplyModal
          schedule={selectedRetest}
          onClose={() => setRetestModalId(null)}
        />
      ) : null}
    </div>
  );
}

const timeSlots = [
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

function parseTime(time: string) {
  const [hours, minutes] = time
    .split(":")
    .map((value) => Number.parseInt(value, 10));
  return { hours, minutes };
}

function computePlacement(start: string, end: string) {
  const startTime = parseTime(start);
  const endTime = parseTime(end);
  const top =
    (startTime.hours - startHour + startTime.minutes / 60) * hourHeight;
  const height =
    (endTime.hours -
      startTime.hours +
      (endTime.minutes - startTime.minutes) / 60) *
    hourHeight;
  return { top, height };
}

function timeToMinutes(time: string) {
  const { hours, minutes } = parseTime(time);
  return hours * 60 + minutes;
}

function getTimeRange(range: string) {
  const [startRaw, endRaw] = range.split(" - ").map((value) => value.trim());
  return { start: startRaw ?? "00:00", end: endRaw ?? "00:00" };
}

function getEventClasses(accent: ScheduleEvent["accent"]) {
  const accents: Record<ScheduleEvent["accent"], string> = {
    purple:
      "border-purple-500 bg-purple-50 text-purple-900 dark:bg-purple-900/20",
    blue: "border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-900/20",
    green: "border-green-500 bg-green-50 text-green-900 dark:bg-green-900/20",
  };
  return accents[accent] ?? "border-primary bg-primary/10";
}

function getEventBadge(accent: ScheduleEvent["accent"]) {
  const badges: Record<ScheduleEvent["accent"], string> = {
    purple:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300",
    green:
      "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-300",
  };
  return badges[accent] ?? "bg-primary/10 text-primary";
}

function ScheduleItem({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-1 text-xs text-[color:var(--surface-text-muted)]">
      <span className={iconClass("text-[14px]")}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function DetailRow({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-[color:var(--surface-text)]">
      <span
        className={iconClass(
          "text-[18px] text-[color:var(--surface-text-muted)]"
        )}
      >
        {icon}
      </span>
      <span>{label}</span>
    </div>
  );
}

function ClassDetailModal({
  event,
  onClose,
}: {
  event: ScheduleEvent;
  onClose: () => void;
}) {
  const date = new Date(event.date);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
      <div className="w-full max-w-lg rounded-2xl border border-[color:var(--surface-border)] bg-[var(--surface-panel)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[color:var(--surface-border)] px-6 py-4">
          <div>
            <p className="text-xs font-semibold text-[color:var(--surface-text-muted)]">
              {event.subject}
            </p>
            <h3 className="text-xl font-bold text-[color:var(--surface-text)]">
              {event.title}
            </h3>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-[color:var(--surface-text-muted)] transition hover:bg-[color:var(--surface-border)]/30"
            aria-label="수업 상세 모달 닫기"
            onClick={onClose}
          >
            <span className={iconClass("text-lg")}>close</span>
          </button>
        </div>
        <div className="space-y-4 px-6 py-6 text-sm">
          <DetailRow
            icon="calendar_today"
            label={`${event.date} (${weekdayLabel(date)})`}
          />
          <DetailRow icon="schedule" label={`${event.start} - ${event.end}`} />
          <DetailRow icon="meeting_room" label={event.location} />
          <DetailRow icon="person" label={event.teacher} />
          {event.notes ? (
            <DetailRow icon="assignment" label={event.notes} />
          ) : null}
        </div>
        <div className="border-t border-[color:var(--surface-border)] px-6 py-4 text-right">
          <button
            type="button"
            className="rounded-lg border border-[color:var(--surface-border)] px-4 py-2 text-sm font-semibold text-[color:var(--surface-text)] transition hover:bg-[color:var(--surface-border)]/30"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

function RetestListModal({
  schedules,
  onSelect,
  onClose,
}: {
  schedules: RetestSchedule[];
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4 py-8">
      <div className="w-full max-w-2xl rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface-panel)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[color:var(--surface-border)] px-6 py-4">
          <div>
            <p className="text-xs font-semibold text-[color:var(--surface-text-muted)]">
              재시험 일정
            </p>
            <h3 className="text-lg font-bold text-[color:var(--surface-text)]">
              총 {schedules.length}개의 재시험
            </h3>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-[color:var(--surface-text-muted)] transition hover:bg-[color:var(--surface-border)]/30"
            onClick={onClose}
            aria-label="재시험 목록 닫기"
          >
            <span className={iconClass("text-lg")}>close</span>
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
          <div className="space-y-3">
            {schedules.map((schedule) => {
              const isApproved = schedule.status === "approved";
              const statusLabel = isApproved ? "승인됨" : "신청 가능";
              const statusClasses = isApproved
                ? "bg-green-100 text-green-700"
                : "bg-primary/10 text-primary";
              return (
                <button
                  key={`modal-retest-${schedule.id}`}
                  type="button"
                  className="flex w-full flex-col gap-2 rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface-background)] px-4 py-4 text-left transition hover:border-primary/40 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  onClick={() => onSelect(schedule.id)}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-[color:var(--surface-panel)] px-2.5 py-0.5 text-[color:var(--surface-text)]">
                      {schedule.subject}
                    </span>
                    <span
                      className={cn(
                        "rounded px-2 py-0.5 text-[10px] font-bold",
                        statusClasses
                      )}
                    >
                      {statusLabel}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[color:var(--surface-text)]">
                    {schedule.title}
                  </p>
                  <div className="grid gap-2 text-xs text-[color:var(--surface-text-muted)] sm:grid-cols-2">
                    <ScheduleItem icon="event" label={schedule.date} />
                    <ScheduleItem icon="schedule" label={schedule.time} />
                    <ScheduleItem
                      icon="meeting_room"
                      label={schedule.location}
                    />
                    <ScheduleItem icon="person" label={schedule.teacher} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function RetestApplyModal({
  schedule,
  onClose,
}: {
  schedule: RetestSchedule;
  onClose: () => void;
}) {
  const [preferredSchedule, setPreferredSchedule] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitted) return;
    setConfirmOpen(true);
  };

  const finalizeSubmission = () => {
    setSubmitted(true);
    setConfirmOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
      <div className="w-full max-w-xl rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface-panel)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[color:var(--surface-border)] px-6 py-4">
          <div>
            <p className="text-xs font-semibold text-[color:var(--surface-text-muted)]">
              {schedule.subject} 재시험
            </p>
            <h3 className="text-xl font-bold text-[color:var(--surface-text)]">
              {schedule.title}
            </h3>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-[color:var(--surface-text-muted)] transition hover:bg-[color:var(--surface-border)]/30"
            aria-label="재시험 일정 모달 닫기"
            onClick={onClose}
          >
            <span className={iconClass("text-lg")}>close</span>
          </button>
        </div>
        <form className="space-y-5 px-6 py-6" onSubmit={handleSubmit}>
          <div className="grid gap-3 text-sm text-[color:var(--surface-text)] sm:grid-cols-2">
            <DetailRow icon="event" label={schedule.date} />
            <DetailRow icon="schedule" label={schedule.time} />
            <DetailRow icon="meeting_room" label={schedule.location} />
            <DetailRow icon="person" label={schedule.teacher} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[color:var(--surface-text)]">
              희망 일정 (날짜 / 시간)
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-[color:var(--surface-border)] bg-[var(--surface-background)] px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
              placeholder="예: 3월 22일 오후 7시"
              value={preferredSchedule}
              onChange={(event) => setPreferredSchedule(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[color:var(--surface-text)]">
              요청 사항
            </label>
            <textarea
              className="h-24 w-full rounded-lg border border-[color:var(--surface-border)] bg-[var(--surface-background)] px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
              placeholder="재시험 신청 사유나 요청 사항을 간단히 작성해주세요."
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>
          {submitted ? (
            <p className="rounded-lg bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-300">
              재시험 신청이 접수되었습니다. 담당 선생님이 확인 후 연락 드릴
              예정입니다.
            </p>
          ) : null}
          <div className="flex flex-col gap-3 border-t border-[color:var(--surface-border)] pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="rounded-lg border border-[color:var(--surface-border)] px-4 py-2 text-sm font-semibold text-[color:var(--surface-text)] transition hover:bg-[color:var(--surface-border)]/30"
              onClick={onClose}
            >
              닫기
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 disabled:opacity-50"
              disabled={submitted}
            >
              {submitted ? "신청 완료" : "재시험 신청"}
            </button>
          </div>
        </form>
        {confirmOpen ? (
          <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface-panel)] p-6 shadow-xl">
              <p className="text-sm font-semibold text-[color:var(--surface-text)]">
                신청을 클릭하면 신청반려시 요청을 재요청할 수 있습니다.
              </p>
              <p className="mt-2 text-xs text-[color:var(--surface-text-muted)]">
                위 내용을 확인하셨다면 확인을 눌러 재시험 신청을 완료해주세요.
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-[color:var(--surface-border)] px-4 py-1.5 text-sm font-semibold text-[color:var(--surface-text)] transition hover:bg-[color:var(--surface-border)]/30"
                  onClick={() => setConfirmOpen(false)}
                >
                  취소
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
                  onClick={finalizeSubmission}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getStartOfWeek(date: Date) {
  const result = new Date(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day; // ensure Monday start
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

function isWithinWeek(date: Date, weekStart: Date) {
  const start = new Date(weekStart);
  const end = addDays(start, 7);
  return date >= start && date < end;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatWeekRange(weekStart: Date) {
  const end = addDays(weekStart, 6);
  return `${weekStart.getMonth() + 1}월 ${weekStart.getDate()}일 - ${end.getMonth() + 1}월 ${end.getDate()}일`;
}

function weekdayLabel(date: Date) {
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return labels[date.getDay()] ?? "";
}

function formatDisplayDate(date: Date) {
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${dayNames[date.getDay()]})`;
}
