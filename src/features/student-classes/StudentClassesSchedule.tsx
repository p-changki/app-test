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

type ExamSchedule = {
  id: string;
  subject: string;
  title: string;
  date: string;
  time: string;
  location: string;
  teacher: string;
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

const examSchedules: ExamSchedule[] = [
  {
    id: "exam-mid-math",
    subject: "수학",
    title: "중간고사 (함수 단원)",
    date: "2024-03-14",
    time: "19:00 - 20:30",
    location: "301호",
    teacher: "김철수 T",
  },
  {
    id: "exam-eng",
    subject: "영어",
    title: "독해 평가 테스트",
    date: "2024-03-19",
    time: "18:00 - 19:00",
    location: "202호",
    teacher: "박영희 T",
  },
  {
    id: "exam-sci",
    subject: "과학",
    title: "실험 보고서 평가",
    date: "2024-03-22",
    time: "17:30 - 19:00",
    location: "실험실 3",
    teacher: "최과학 T",
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
    title: "수학 심화 재시험",
    date: "2024-03-12",
    time: "19:00 - 20:30",
    location: "재시험실 2",
    teacher: "김철수 T",
    status: "approved",
  },
];

export const allRetestSchedules: RetestSchedule[] = [
  ...retestSchedules,
  ...acceptedRetests,
];

const subjectOptions = ["전체", "수학", "영어", "과학", "국어"];
const hourHeight = 72;
const startHour = 11;

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
  const [weekStart, setWeekStart] = useState(initialWeekStart);
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [selectedDay, setSelectedDay] = useState<Date>(initialWeekStart);
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

  const upcomingExams = useMemo(() => {
    return examSchedules
      .map((schedule) => ({
        ...schedule,
        sortValue: new Date(
          `${schedule.date}T${getTimeRange(schedule.time).start}:00`
        ).getTime(),
      }))
      .sort((a, b) => a.sortValue - b.sortValue)
      .slice(0, 3);
  }, []);

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

  const dailyExams = useMemo(() => {
    return examSchedules
      .filter((schedule) => isSameDay(new Date(schedule.date), selectedDay))
      .sort(
        (a, b) =>
          timeToMinutes(getTimeRange(a.time).start) -
          timeToMinutes(getTimeRange(b.time).start)
      );
  }, [selectedDay]);
  const dailyRetests = useMemo(() => {
    return allRetestSchedules
      .filter((schedule) => isSameDay(new Date(schedule.date), selectedDay))
      .sort(
        (a, b) =>
          timeToMinutes(getTimeRange(a.time).start) -
          timeToMinutes(getTimeRange(b.time).start)
      );
  }, [selectedDay]);

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
                수업 스케줄
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
                        수업 시간표
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
                  <div className="grid grid-cols-[60px_repeat(7,1fr)] divide-x divide-[color:var(--surface-border)] border-b border-[color:var(--surface-border)] bg-[#f7c6cf] text-slate-900 dark:bg-[#2b1f2b] dark:text-slate-100">
                    <div className="p-3" />
                    {weekDays.map((date) => (
                      <div key={date.toISOString()} className="p-3 text-center">
                        <span className="block text-sm font-bold">
                          {weekdayLabel(date)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-[60px_repeat(7,1fr)] divide-x divide-[color:var(--surface-border)]">
                    <div>
                      {Array.from({ length: timeSlots.length }, (_, index) => (
                        <div
                          key={`slot-${index}`}
                          className="flex h-[72px] items-start justify-center border-b border-[color:var(--surface-border)] pt-2 text-xs font-medium text-[color:var(--surface-text-muted)]"
                        >
                          {timeSlots[index]}
                        </div>
                      ))}
                    </div>
                    {weekDays.map((date) => {
                      const classEvents = filteredEvents.filter((event) =>
                        isSameDay(new Date(event.date), date)
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
                                className="pointer-events-none h-[72px] border-b border-[color:var(--surface-border)]"
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
                          {classEvents.length === 0 ? (
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
                        시험 {dailyExams.length}개 · 재시험{" "}
                        {dailyRetests.length}개
                      </span>
                    </div>
                  </div>
                  <div className="divide-y divide-[color:var(--surface-border)]">
                    {dailyExams.length === 0 && dailyRetests.length === 0 ? (
                      <p className="px-6 py-10 text-center text-sm text-[color:var(--surface-text-muted)]">
                        선택한 날짜에 예정된 일정이 없습니다.
                      </p>
                    ) : (
                      <>
                        {dailyExams.map((schedule) => (
                          <div
                            key={`daily-exam-${schedule.id}`}
                            className="flex w-full flex-col gap-2 px-6 py-4 text-left"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                                시험
                              </span>
                              <span className="text-xs font-medium text-[color:var(--surface-text-muted)]">
                                {selectedYear}년 {selectedMonth}월
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-[color:var(--surface-text)]">
                              {schedule.title}
                            </h4>
                            <div className="flex flex-wrap gap-4 text-sm text-[color:var(--surface-text-muted)]">
                              <ScheduleItem
                                icon="schedule"
                                label={schedule.time}
                              />
                              <ScheduleItem
                                icon="meeting_room"
                                label={schedule.location}
                              />
                              <ScheduleItem
                                icon="person"
                                label={schedule.teacher}
                              />
                            </div>
                          </div>
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
                                  <div
                                    key={`daily-retest-${schedule.id}`}
                                    className={cn(
                                      "flex w-full flex-col rounded-xl border bg-white px-4 py-3 text-left text-sm shadow-sm transition hover:border-opacity-70",
                                      borderColor,
                                      textColor,
                                      ringColor
                                    )}
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
                                        {isApproved ? "클리닉" : "재시험"}
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
                                  </div>
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
                  <h3 className="text-lg font-bold">시험 일정</h3>
                  <span className="text-[11px] font-semibold text-[color:var(--surface-text-muted)]">
                    {examSchedules.length}개
                  </span>
                </div>
                {upcomingExams.length === 0 ? (
                  <p className="mt-4 text-xs text-[color:var(--surface-text-muted)]">
                    예정된 시험이 없습니다.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {upcomingExams.map((schedule) => (
                      <div
                        key={`upcoming-exam-${schedule.id}`}
                        className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 shadow-sm dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-100"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span>{schedule.subject}</span>
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                            시험
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
                    ))}
                  </div>
                )}
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold">재시험 일정</h4>
                    <span className="text-[11px] font-semibold text-[color:var(--surface-text-muted)]">
                      {retestSchedules.length}개
                    </span>
                  </div>
                  {retestSchedules.length === 0 ? (
                    <p className="text-xs text-[color:var(--surface-text-muted)]">
                      재시험 일정이 없습니다.
                    </p>
                  ) : (
                    retestSchedules.map((schedule) => (
                      <div
                        key={`retest-card-${schedule.id}`}
                        className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 shadow-sm dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-100"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span>{schedule.subject}</span>
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-900/40 dark:text-red-200">
                            재시험
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
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold">클리닉</h4>
                    <span className="text-[11px] font-semibold text-[color:var(--surface-text-muted)]">
                      {acceptedRetests.length}개
                    </span>
                  </div>
                  {acceptedRetests.length === 0 ? (
                    <p className="text-xs text-[color:var(--surface-text-muted)]">
                      클리닉 일정이 없습니다.
                    </p>
                  ) : (
                    acceptedRetests.map((schedule) => (
                      <div
                        key={`approved-${schedule.id}`}
                        className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-900 shadow-sm dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-100"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span>{schedule.subject}</span>
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
      {retestListOpen ? (
        <RetestListModal
          schedules={allRetestSchedules}
          onClose={() => setRetestListOpen(false)}
        />
      ) : null}
    </div>
  );
}

const timeSlots = Array.from({ length: 12 }, (_, index) => {
  const start = 11 + index;
  const end = start + 1;
  return `${start}:00 - ${end}:00`;
});

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

function ScheduleItem({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-1 text-xs text-[color:var(--surface-text-muted)]">
      <span className={iconClass("text-[14px]")}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

export function RetestListModal({
  schedules,
  onClose,
}: {
  schedules: RetestSchedule[];
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
              const statusLabel = isApproved ? "클리닉" : "재시험";
              const statusClasses = isApproved
                ? "bg-green-100 text-green-700"
                : "bg-primary/10 text-primary";
              return (
                <div
                  key={`modal-retest-${schedule.id}`}
                  className="flex w-full flex-col gap-2 rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface-background)] px-4 py-4 text-left transition hover:border-primary/40 hover:shadow"
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
                </div>
              );
            })}
          </div>
        </div>
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
  const labels = ["일", "월", "화", "수", "목", "금", "토"];
  return labels[date.getDay()] ?? "";
}

function formatDisplayDate(date: Date) {
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${dayNames[date.getDay()]})`;
}
