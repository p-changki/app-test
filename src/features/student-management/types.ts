export type StudentBreadcrumb = {
  label: string;
  href?: string;
};

export type ClassChip = {
  id: string;
  label?: string;
  count?: number;
  color?: "primary" | "indigo" | "emerald" | "rose";
  icon?: string;
  variant?: "all" | "unassigned";
  active?: boolean;
  isDivider?: boolean;
  isAddButton?: boolean;
};

export type HeaderAction = {
  id: string;
  label: string;
  icon: string;
  variant: "secondary" | "primary";
};

export type FilterSelect = {
  id: string;
  placeholder: string;
  options: Array<{ label: string; value: string }>;
};

export type StudentStatusVariant = "primary" | "neutral" | "warning";

export type StudentRecord = {
  id: string;
  name: string;
  studentId: string;
  classId?: string;
  avatarUrl?: string;
  initials?: string;
  className: string;
  classColor: "indigo" | "emerald" | "neutral" | "dashed";
  school: string;
  contact: string;
  attendance?: number;
  attendanceVariant?: "good" | "warning" | "danger";
  averageScore?: number;
  averageVariant?: "good" | "neutral";
  status: {
    label: string;
    variant: StudentStatusVariant;
  };
  actionLabel: string;
  highlight?: {
    label: string;
    variant: "new";
  };
  unassigned?: boolean;
  emptyPerformance?: string;
};

export type StudentStatusOption = "재원중" | "휴원" | "퇴원";

export type StudentTableSummary = {
  total: number;
  rangeLabel: string;
};

export type PaginationItem = string;

export type StudentContact = {
  label: string;
  icon: string;
  value: string;
};

export type StudentMetric = {
  label: string;
  value: string;
  icon: string;
  meta?: string;
  variant?: "positive" | "warning";
};

export type StudentSubject = {
  icon: string;
  title: string;
  description: string;
  score: number;
};

export type AttendanceHeatmapEntry = {
  day: number;
  variant: "attendance" | "late" | "absent" | "none";
};

export type CounselingLog = {
  title: string;
  date: string;
  description: string;
  variant: "primary" | "secondary";
};

export type StudentDetail = {
  id: string;
  name: string;
  status: string;
  school: string;
  grade: string;
  studentId: string;
  heroAvatar: string;
  contacts: StudentContact[];
  metrics: StudentMetric[];
  subjects: StudentSubject[];
  attendanceHeatmap: AttendanceHeatmapEntry[];
  memoPlaceholder: string;
  counselingLogs: CounselingLog[];
};

export type StudentEditProfile = Pick<
  StudentDetail,
  "id" | "name" | "school" | "grade" | "status" | "contacts"
>;
