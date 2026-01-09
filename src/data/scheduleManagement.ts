import { classEntities } from "@/data/classes";
import type {
  CalendarDay,
  CalendarEvent,
  FilterOption,
  MiniCalendarDay,
  UpcomingSchedule,
} from "@/features/schedule-management/overview/types";

const baseCalendarDays: CalendarDay[] = [
  { date: 29, month: "prev", weekday: 0 },
  { date: 30, month: "prev", weekday: 1 },
  { date: 1, month: "current", weekday: 2 },
  { date: 2, month: "current", weekday: 3 },
  { date: 3, month: "current", weekday: 4 },
  { date: 4, month: "current", weekday: 5 },
  { date: 5, month: "current", weekday: 6 },
  { date: 6, month: "current", weekday: 0 },
  { date: 7, month: "current", weekday: 1 },
  { date: 8, month: "current", weekday: 2 },
  { date: 9, month: "current", weekday: 3 },
  { date: 10, month: "current", weekday: 4, isToday: true },
  { date: 11, month: "current", weekday: 5 },
  { date: 12, month: "current", weekday: 6 },
  { date: 13, month: "current", weekday: 0 },
  { date: 14, month: "current", weekday: 1 },
  { date: 15, month: "current", weekday: 2 },
  { date: 16, month: "current", weekday: 3 },
  { date: 17, month: "current", weekday: 4 },
  { date: 18, month: "current", weekday: 5 },
  { date: 19, month: "current", weekday: 6 },
  { date: 20, month: "current", weekday: 0 },
  { date: 21, month: "current", weekday: 1 },
  { date: 22, month: "current", weekday: 2 },
  { date: 23, month: "current", weekday: 3 },
  { date: 24, month: "current", weekday: 4 },
  { date: 25, month: "current", weekday: 5 },
  { date: 26, month: "current", weekday: 6 },
  { date: 27, month: "current", weekday: 0 },
  { date: 28, month: "current", weekday: 1 },
  { date: 29, month: "current", weekday: 2 },
  { date: 30, month: "current", weekday: 3 },
  { date: 31, month: "current", weekday: 4 },
  { date: 1, month: "next", weekday: 5 },
  { date: 2, month: "next", weekday: 6 },
];

const weekdayMap: Record<string, number> = {
  일: 0,
  월: 1,
  화: 2,
  수: 3,
  목: 4,
  금: 5,
  토: 6,
};

type DerivedEvent = CalendarEvent & { targetWeekday?: number };

const derivedEvents: DerivedEvent[] = classEntities.flatMap((klass) => {
  const startLabel = klass.schedule.time.split("-")[0].trim();
  const classEvents = klass.schedule.days.map<DerivedEvent>((dayLabel) => ({
    label: `${startLabel} ${klass.name}`,
    variant: "class",
    targetWeekday: weekdayMap[dayLabel] ?? undefined,
  }));

  const assessmentEvent: DerivedEvent | null = klass.nextAssessment
    ? {
        label: `${klass.nextAssessment.title}`,
        variant: klass.nextAssessment.type.includes("과제")
          ? "assignment"
          : "exam",
      }
    : null;

  return assessmentEvent ? [...classEvents, assessmentEvent] : classEvents;
});

const weekdayQueues = new Map<number, DerivedEvent[]>();
const floatingQueue: DerivedEvent[] = [];

derivedEvents.forEach((event) => {
  if (
    typeof event.targetWeekday === "number" &&
    !Number.isNaN(event.targetWeekday)
  ) {
    const queue = weekdayQueues.get(event.targetWeekday) ?? [];
    queue.push(event);
    weekdayQueues.set(event.targetWeekday, queue);
  } else {
    floatingQueue.push(event);
  }
});

const pickEventsForDay = (weekday: number): CalendarEvent[] => {
  const queue = weekdayQueues.get(weekday);
  if (queue && queue.length > 0) {
    return queue.splice(0, 2).map(stripWeekdayField);
  }
  if (floatingQueue.length > 0) {
    return floatingQueue.splice(0, 1).map(stripWeekdayField);
  }
  return [];
};

export const calendarDays: CalendarDay[] = baseCalendarDays.map((day) => {
  if (day.month !== "current") {
    return day;
  }
  const events = pickEventsForDay(day.weekday);
  return events.length > 0 ? { ...day, events } : day;
});

const stateFromDay = (day: CalendarDay): MiniCalendarDay["state"] => {
  if (day.month !== "current") {
    return "muted";
  }
  if (day.isToday) {
    return "today";
  }
  if (day.weekday === 5) {
    return "saturday";
  }
  if (day.weekday === 6) {
    return "sunday";
  }
  return undefined;
};

const dotFromEvents = (events?: CalendarEvent[]): MiniCalendarDay["dot"] => {
  if (!events || events.length === 0) {
    return undefined;
  }
  if (events.some((event) => event.variant === "exam")) {
    return "exam";
  }
  if (events.some((event) => event.variant === "assignment")) {
    return "assignment";
  }
  if (events.some((event) => event.variant === "counsel")) {
    return "counsel";
  }
  return undefined;
};

export const miniCalendarDays: MiniCalendarDay[] = calendarDays
  .slice(0, 14)
  .map((day) => ({
    label: `${day.date}`,
    state: stateFromDay(day),
    dot: dotFromEvents(day.events),
  }));

export const filterOptions: FilterOption[] = [
  { label: "수업", color: "bg-blue-500" },
  { label: "시험", color: "bg-rose-500" },
  { label: "과제", color: "bg-emerald-500" },
  { label: "상담", color: "bg-amber-500" },
];

const formatDateParts = (isoDate: string | undefined) => {
  if (!isoDate) {
    return { monthLabel: "진행", dateLabel: "-" };
  }
  const [, month, day] = isoDate.split("-");
  return {
    monthLabel: `${Number(month)}월`,
    dateLabel: `${Number(day)}`,
  };
};

function stripWeekdayField(event: DerivedEvent): CalendarEvent {
  const rest = { ...event };
  delete (rest as { targetWeekday?: number }).targetWeekday;
  return rest;
}

export const upcomingSchedules: UpcomingSchedule[] = classEntities
  .slice(0, 2)
  .map((klass, index) => {
    const { dateLabel, monthLabel } = formatDateParts(
      klass.nextAssessment?.date
    );
    return {
      title: klass.nextAssessment?.title ?? `${klass.name} 진도 점검`,
      time: klass.schedule.time,
      location: klass.schedule.location,
      dateLabel,
      monthLabel,
      variant: index === 0 ? "primary" : "muted",
    };
  });
