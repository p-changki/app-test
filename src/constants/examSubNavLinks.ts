import type { SubNavLink } from "@/components/layout/AssistantSubNav";

export const examSubNavLinks: readonly SubNavLink[] = [
  { label: "시험 관리", href: "/exam-dashboard" },
  { label: "시험 등록", href: "/exam-management" },
  { label: "성적 입력", href: "/exam-grade-entry" },
  { label: "정답지 등록", href: "/exam-answer-entry" },
  { label: "재시험 대상자", href: "/exam-remedial-targets" },
  { label: "재시험 제안", href: "/exam-retest-proposals" },
] as const;
