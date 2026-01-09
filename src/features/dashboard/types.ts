export type DashboardNavLink = {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
};

export type SidebarFooterLink = DashboardNavLink & {
  intent?: "danger";
};

export type QuickAction = {
  title: string;
  description: string;
  href: string;
  icon: string;
  accentClass: string;
};

export type MetricCard = {
  label: string;
  value: string;
  icon: string;
  deltaLabel: string;
  deltaState: "increase" | "decrease";
  accentClass: string;
};

export type PerformanceSummary = {
  subject: string;
  description: string;
  averageScore: string;
  changeLabel: string;
  changeState: "increase" | "decrease";
};

export type AssignmentStatus = {
  title: string;
  badge: {
    label: string;
    className: string;
  };
  progressLabel: string;
  progressPercent: number;
  progressClass: string;
};

export type ClassSummary = {
  name: string;
  schedule: string;
  studentCount: string;
};

export type AttendanceBreakdown = {
  label: string;
  percent: number;
  colorClass: string;
};

export type AttendanceSummary = {
  attended: number;
  total: number;
  dateLabel: string;
  breakdown: AttendanceBreakdown[];
};

export type FocusStudent = {
  id: string;
  name: string;
  group: string;
  statusLabel: string;
  statusClass: string;
  initials: string;
};

export type Announcement = {
  id: string;
  title: string;
  category: string;
  categoryClass: string;
  timestamp: string;
};

export type ProfileSummary = {
  name: string;
  title: string;
  avatarUrl: string;
};

export type DashboardTaskAttachment = {
  name: string;
  size: string;
  icon?: string;
};

export type DashboardTaskRow = {
  title: string;
  subTitle: string;
  icon: string;
  ta: string;
  avatar: string;
  due: string;
  progress: number;
  status: string;
  statusVariant: "primary" | "neutral" | "success";
  priority: "높음" | "보통" | "낮음";
  issuedAt: string;
  assigner: string;
  assignerAvatar: string;
  dueDateTime: string;
  description: string;
  attachments?: DashboardTaskAttachment[];
};
