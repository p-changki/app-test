import type {
  ExamDefinition,
  ExamQuestion,
  ExamStatus,
} from "@/types/entities";

export type { ExamDefinition, ExamQuestion, ExamStatus };

export type RegisteredExam = ExamDefinition;

export type ExamStatCard = {
  title: string;
  value: string;
  subtitle: string;
  icon?: string;
  accentClass?: string;
  variant?: "critical";
  href?: string;
};

export type FlaggedAssignmentActionVariant = "primary" | "secondary" | "ghost";

export type FlaggedAssignmentAction = {
  label: string;
  icon: string;
  variant: FlaggedAssignmentActionVariant;
};

export type FlaggedAssignment = {
  id: string;
  student: string;
  assignment: string;
  scoreLabel: string;
  timestamp: string;
  avatar: string;
  primaryAction: FlaggedAssignmentAction;
  secondaryIcon: string;
};

export type AssignmentStatus = {
  label: string;
  color: string;
};

export type AssignmentPrimaryActionVariant = "primary" | "muted";

export type AssignmentPrimaryAction = {
  label: string;
  variant: AssignmentPrimaryActionVariant;
  href?: string;
};

export type AssignmentRow = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  iconClass: string;
  classLabel: string;
  dueDate: string;
  submitted: string;
  progress: number;
  status: AssignmentStatus;
  primaryAction: AssignmentPrimaryAction;
};

export type ExamGradeRow = {
  id: number;
  name: string;
  phone: string;
  initials: string;
  badgeClass: string;
  attendance: "출석" | "지각" | "결석" | "병결";
  score?: number;
  rank?: number;
  memo?: string;
};

export type ReportClassOption = {
  id: string;
  name: string;
};

export type ReportStudent = {
  id: string;
  name: string;
  classId: string;
  classLabel: string;
  examName: string;
  examType: string;
  testDate: string;
  roundLabel: string;
  score: number;
  rank: number;
  avg: number;
  attendance: string;
  nextLesson: string;
  assignments: string[];
};

export type ReportTemplate = {
  id: string;
  name: string;
  description: string;
};

export type RemedialSummaryStat = {
  title: string;
  value: string;
  suffix: string;
  trend: string;
  trendClass: string;
  icon: string;
  iconClass: string;
};

export type TodayRetestStudent = {
  id: string;
  name: string;
  classLabel: string;
  examName: string;
  schedule: string;
  status: string;
};

export type UnscheduledStudent = {
  id: string;
  name: string;
  classLabel: string;
  examName: string;
  missingDate: string;
  contactStatus: string;
};

export type RemedialStudent = {
  id: string;
  name: string;
  classLabel: string;
  initials: string;
  badgeClass: string;
  examName: string;
  score: number;
  cutline: number;
  failDate: string;
  status: {
    label: string;
    badgeClass: string;
    dotClass: string;
  };
};
