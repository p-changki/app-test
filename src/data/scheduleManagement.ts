import { classEntities } from "@/data/classes";
import type {
  CalendarDay,
  CalendarEvent,
  FilterOption,
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

const scheduleMockEvents: Array<{
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  content: string;
  variant: CalendarEvent["variant"];
}> = [
  {
    id: "schedule-001",
    title: "영어 듣기 클리닉",
    date: "2023-10-08",
    time: "18:00",
    location: "2관 304호",
    content: "재시험 대비 듣기 유형 집중 보강",
    variant: "assignment",
  },
  {
    id: "schedule-002",
    title: "중간고사 모의시험",
    date: "2023-10-12",
    time: "19:30",
    location: "본관 2층",
    content: "범위: 교재 3-4과 + 워크북",
    variant: "exam",
  },
  {
    id: "schedule-003",
    title: "학부모 상담",
    date: "2023-10-18",
    time: "14:00",
    location: "상담실 1",
    content: "최근 성적 추이 및 학습 계획 공유",
    variant: "counsel",
  },
  {
    id: "schedule-004",
    title: "클리닉 보충 수업",
    date: "2023-10-24",
    time: "17:00",
    location: "2관 201호",
    content: "오답 유형별 미니 테스트 포함",
    variant: "assignment",
  },
];

const scheduleEventMap = scheduleMockEvents.reduce((acc, event) => {
  const day = Number(event.date.split("-")[2]);
  const events = acc.get(day) ?? [];
  events.push({
    id: event.id,
    label: `${event.time} ${event.title} (${event.location})`,
    variant: event.variant,
    title: event.title,
    date: event.date,
    time: event.time,
    location: event.location,
    content: event.content,
  });
  acc.set(day, events);
  return acc;
}, new Map<number, CalendarEvent[]>());

export const calendarDays: CalendarDay[] = baseCalendarDays.map((day) => {
  if (day.month !== "current") {
    return day;
  }
  const events = scheduleEventMap.get(day.date);
  return events && events.length > 0 ? { ...day, events } : day;
});

export const filterOptions: FilterOption[] = [
  { label: "시험", color: "bg-rose-500" },
  { label: "클리닉", color: "bg-emerald-500" },
  { label: "기타", color: "bg-amber-500" },
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
