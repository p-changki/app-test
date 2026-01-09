import type { ClassEntity } from "@/types/entities";

export type Breadcrumb = {
  label: string;
  href?: string;
};

export type ClassHeaderSummary = {
  title: string;
  code: string;
  statusLabel: string;
};

export type ClassAction = {
  label: string;
  icon: string;
  variant: "default" | "primary";
};

export type ClassQuickCard = {
  id: string;
  icon: string;
  title: string;
  value: string;
  description?: string;
  actionLabel?: string;
  avatars?: string[];
  meta?: string;
  highlight?: {
    label: string;
    variant: "success" | "info";
  };
};

export type StudentSummary = {
  totalLabel: string;
  attendanceLabel: string;
};

export type StudentRow = {
  id: string;
  name: string;
  studentId: string;
  avatarUrl?: string;
  initials?: string;
  status: {
    label: string;
    variant: "default" | "warning" | "danger";
  };
  attendance: number;
  score: number;
  scoreDelta?: {
    direction: "up" | "down" | "flat";
    value?: number;
  };
};

export type CalendarDay = {
  label: string;
  variant: "muted" | "default" | "primary" | "success";
};

export type CalendarConfig = {
  monthLabel: string;
  weeks: CalendarDay[][];
};

export type UpcomingSession = {
  id: string;
  timeLabel: string;
  topic: string;
  description: string;
  accent?: "primary" | "default" | "success";
};

export type Assessment = {
  title: string;
  date: string;
  type: string;
};

export type WatchStudent = NonNullable<ClassEntity["watchStudents"]>[number];

export type ClassRecord = ClassEntity;
