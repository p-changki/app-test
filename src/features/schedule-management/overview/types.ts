export type CalendarEventVariant = "class" | "assignment" | "exam" | "counsel";

export type CalendarEvent = {
  id: string;
  label: string;
  variant: CalendarEventVariant;
  title?: string;
  date?: string;
  time?: string;
  location?: string;
  content?: string;
};

export type CalendarDay = {
  date: number;
  month: "prev" | "current" | "next";
  weekday: number;
  events?: CalendarEvent[];
  isToday?: boolean;
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
