export type CalendarEventVariant = "class" | "assignment" | "exam" | "counsel";

export type CalendarEvent = {
  label: string;
  variant: CalendarEventVariant;
};

export type CalendarDay = {
  date: number;
  month: "prev" | "current" | "next";
  weekday: number;
  events?: CalendarEvent[];
  isToday?: boolean;
};

export type MiniCalendarDay = {
  label: string;
  state?: "muted" | "saturday" | "sunday" | "today";
  dot?: "assignment" | "counsel" | "exam";
};

export type FilterOption = {
  label: string;
  color: string;
};

export type UpcomingSchedule = {
  title: string;
  time: string;
  location: string;
  dateLabel: string;
  monthLabel: string;
  variant: "primary" | "muted";
};
