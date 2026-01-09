import type { SubNavLink } from "@/components/layout/AssistantSubNav";

export const classSubNavLinks: readonly SubNavLink[] = [
  { label: "수업 관리", href: "/class-management" },
  { label: "수업 개설", href: "/class-registration" },
] as const;
