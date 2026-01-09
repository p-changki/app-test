import { classEntities } from "@/data/classes";
import { examDefinitions } from "@/data/exams";
import { studentEntities } from "@/data/students";
import type { RetestRequest } from "@/features/exam-retest/types";

const palette = [
  "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300",
  "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300",
  "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300",
];

const statusBadge =
  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";

const lowScoreStudents = studentEntities.filter(
  (student) => (student.averageScore ?? 100) < 90
);

const buildPreferredTime = (index: number) => {
  const baseDay = 20 + index * 2;
  const hour = 15 + index;
  return `2025년 01월 ${baseDay}일 (${["수", "목", "금"][index % 3]}) ${hour}:00`;
};

export const retestSummaryCards = [
  {
    label: "처리 대기 중",
    value: `${lowScoreStudents.length}건`,
    helper: "처리 필요",
    icon: "pending_actions",
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    label: "오늘 수락된 일정",
    value: `${Math.max(1, Math.ceil(lowScoreStudents.length / 2))}건`,
    helper: "예약 확정",
    icon: "event_available",
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    label: "시간 조정 요청",
    value: `${Math.max(1, lowScoreStudents.length - 1)}건`,
    helper: "답변 대기",
    icon: "edit_calendar",
    color: "text-primary",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
] as const;

export const retestRequests: readonly RetestRequest[] = lowScoreStudents
  .slice(0, 3)
  .map((student, index) => {
    const klass = classEntities.find((item) => item.id === student.classId);
    const exam =
      examDefinitions.find((item) => item.classId === student.classId) ??
      examDefinitions[0];
    return {
      id: student.id,
      name: student.name,
      badgeColor: palette[index % palette.length],
      statusLabel: "미통과",
      statusColor: statusBadge,
      classLabel: klass?.name ?? "공통 수업",
      proposedAt: `2025.01.${(18 + index).toString().padStart(2, "0")} 10:3${
        index
      }`,
      subject: `${exam.subject} (${exam.title})`,
      preferredTime: buildPreferredTime(index),
      reason: `${exam.title} 재응시를 ${student.status ?? "재원중"} 상태에서 요청했습니다. 최근 점수 ${
        student.averageScore ?? "미입력"
      }점`,
      location: klass?.schedule.location ?? "본관 1층",
      teacher: klass?.teacher ?? "담당 강사",
    };
  });
