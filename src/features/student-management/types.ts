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

export type StudentTableSummary = {
  total: number;
  rangeLabel: string;
};

export type PaginationItem = string;
