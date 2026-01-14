import type { SubNavLink } from "@/components/layout/AssistantSubNav";

export const examSubNavLinks: readonly SubNavLink[] = [
  { label: "시험 관리", href: "/exam-dashboard" },
  { label: "시험 등록/수정", href: "/exam-management" },
  { label: "성적 입력", href: "/exam-grade-entry/eng-reading-basic-20" },
  { label: "클리닉", href: "/exam-remedial-targets" },
] as const;
