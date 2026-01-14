import { classEntities } from "@/data/classes";
import { studentEntities } from "@/data/students";
import type { ClassEntity, StudentEntity } from "@/types/entities";

import type {
  ClassChip,
  FilterSelect,
  HeaderAction,
  PaginationItem,
  StudentBreadcrumb,
  StudentRecord,
  StudentStatusOption,
} from "./types";

const classLookup = new Map(classEntities.map((klass) => [klass.id, klass]));

const derivedStudentRecords = studentEntities
  .map((student) => mapStudentEntityToRecord(student))
  .sort((a, b) => a.name.localeCompare(b.name, "ko"));

const studentsByClassId = derivedStudentRecords.reduce<
  Record<string, StudentRecord[]>
>((acc, record) => {
  const key = record.classId ?? "unassigned";
  if (!acc[key]) {
    acc[key] = [];
  }
  acc[key]?.push(record);
  return acc;
}, {});

const unassignedRecords = studentsByClassId.unassigned ?? [];

const dynamicClassChips: ClassChip[] = classEntities.map((klass) => ({
  id: klass.id,
  label: klass.name,
  count: studentsByClassId[klass.id]?.length ?? 0,
  color: getClassChipColor(klass.subject),
}));

export const studentBreadcrumbs: StudentBreadcrumb[] = [
  { label: "홈", href: "/dashboard" },
  { label: "학생 관리" },
];

export const classSection = {
  title: "수업 선택",
  actionLabel: "수업 관리 설정",
};

export const classChips: ClassChip[] = [
  {
    id: "all",
    label: "전체 수업",
    count: derivedStudentRecords.length,
    color: "primary",
    icon: "folder_shared",
    variant: "all",
    active: true,
  },
  ...(dynamicClassChips.length > 0
    ? [{ id: "divider-1", isDivider: true } satisfies ClassChip]
    : []),
  ...dynamicClassChips,
  ...(unassignedRecords.length > 0
    ? [
        { id: "divider-unassigned", isDivider: true } satisfies ClassChip,
        {
          id: "unassigned",
          label: "신규/미배정",
          count: unassignedRecords.length,
          color: "rose",
          icon: "help_outline",
          variant: "unassigned",
        } satisfies ClassChip,
      ]
    : []),
  { id: "add-class", isAddButton: true },
];

export const pageSummary = {
  title: "전체 학생 관리",
  description: `총 ${derivedStudentRecords.length}명의 학생 정보를 관리하고 있습니다.`,
};

export const headerActions: HeaderAction[] = [
  {
    id: "bulk-transfer",
    label: "수업 변경",
    icon: "swap_horiz",
    variant: "secondary",
  },
  { id: "send-alert", label: "알림 발송", icon: "send", variant: "secondary" },
  {
    id: "add-student",
    label: "학생 등록",
    icon: "person_add",
    variant: "primary",
  },
];

export const filterSelects: FilterSelect[] = [
  {
    id: "grade",
    placeholder: "학년 전체",
    options: [
      { label: "고등학교 1학년", value: "h1" },
      { label: "고등학교 2학년", value: "h2" },
      { label: "고등학교 3학년", value: "h3" },
    ],
  },
  {
    id: "status",
    placeholder: "상태 전체",
    options: [
      { label: "재원중", value: "active" },
      { label: "휴원", value: "pause" },
      { label: "퇴원", value: "grad" },
    ],
  },
];

export const classStudentMap: Record<string, StudentRecord[]> = {
  all: derivedStudentRecords,
};

classEntities.forEach((klass) => {
  classStudentMap[klass.id] = studentsByClassId[klass.id] ?? [];
});

if (unassignedRecords.length > 0) {
  classStudentMap.unassigned = unassignedRecords;
}

export const studentRecords = derivedStudentRecords;

export const defaultClassId = "all";

export const pagination: PaginationItem[] = ["1", "2", "3", "...", "12"];

function mapStudentEntityToRecord(student: StudentEntity): StudentRecord {
  const classInfo = student.classId
    ? classLookup.get(student.classId)
    : undefined;
  const className = classInfo?.name ?? "미배정";
  const subject = classInfo?.subject ?? "";
  const statusLabel: StudentStatusOption = student.status ?? "재원중";
  const attendanceVariant = getAttendanceVariant(student.attendance);
  const averageVariant = getAverageVariant(student.averageScore);
  const isUnassigned = !classInfo;

  return {
    id: student.id,
    name: student.name,
    studentId: student.studentId,
    classId: student.classId,
    registeredAt: student.registeredAt,
    avatarUrl: student.avatarUrl,
    initials: student.initials ?? deriveInitials(student.name),
    className,
    classColor: isUnassigned
      ? "dashed"
      : (getStudentClassColor(subject) ?? "neutral"),
    school: buildSchoolLabel(student),
    grade: student.gradeLabel,
    contact: student.phone ?? student.contacts?.[0]?.value ?? "연락처 미등록",
    attendance: student.attendance,
    attendanceVariant,
    averageScore: student.averageScore,
    averageVariant,
    status: {
      label: statusLabel,
      variant: getStatusVariant(statusLabel),
    },
    actionLabel: isUnassigned ? "반 배정" : "수업 변경",
    unassigned: isUnassigned || undefined,
    emptyPerformance: isUnassigned ? "데이터 없음" : undefined,
    highlight: isUnassigned
      ? {
          label: "신규",
          variant: "new",
        }
      : undefined,
  };
}

function buildSchoolLabel(student: StudentEntity) {
  if (!student.school && !student.gradeLabel) {
    return "학교/학년 정보 없음";
  }
  if (!student.school) {
    return student.gradeLabel ?? "학년 정보 없음";
  }
  if (!student.gradeLabel) {
    return student.school;
  }
  return `${student.school} (${student.gradeLabel})`;
}

function getAttendanceVariant(value?: number) {
  if (typeof value !== "number") {
    return undefined;
  }
  if (value >= 90) {
    return "good";
  }
  if (value >= 80) {
    return "warning";
  }
  return "danger";
}

function getAverageVariant(value?: number) {
  if (typeof value !== "number") {
    return undefined;
  }
  return value >= 90 ? "good" : "neutral";
}

function getStatusVariant(label: StudentStatusOption) {
  switch (label) {
    case "휴원":
      return "warning";
    case "퇴원":
      return "neutral";
    default:
      return "primary";
  }
}

function getClassChipColor(
  subject: ClassEntity["subject"]
): ClassChip["color"] {
  if (subject.includes("수학")) {
    return "indigo";
  }
  if (subject.includes("영어")) {
    return "emerald";
  }
  if (subject.includes("과학")) {
    return "rose";
  }
  return "primary";
}

function getStudentClassColor(
  subject?: ClassEntity["subject"]
): StudentRecord["classColor"] {
  if (!subject) {
    return "neutral";
  }
  if (subject.includes("수학")) {
    return "indigo";
  }
  if (subject.includes("영어")) {
    return "emerald";
  }
  return "neutral";
}

function deriveInitials(name: string) {
  if (!name) {
    return "ST";
  }
  const trimmed = name.trim();
  if (trimmed.length <= 2) {
    return trimmed;
  }
  return trimmed
    .split(" ")
    .map((segment) => segment[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
