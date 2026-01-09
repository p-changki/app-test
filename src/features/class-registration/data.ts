import type { SubNavLink } from "@/components/layout/AssistantSubNav";
import {
  classRegistrationAudienceTags,
  classRegistrationClassrooms,
  classRegistrationScheduleSlots,
  classRegistrationSubjectOptions,
} from "@/data/classRegistration";

export const registrationBreadcrumbs = [
  { label: "홈", href: "/dashboard" },
  { label: "수업 관리", href: "/class-management" },
  { label: "수업 개설" },
] as const;

export const classRegistrationNavLinks: readonly SubNavLink[] = [
  { label: "수업 관리", href: "/class-management" },
  { label: "수업 개설", href: "/class-registration" },
];

export const subjectOptions = classRegistrationSubjectOptions;
export const audienceTags = classRegistrationAudienceTags;
export const classroomOptions = classRegistrationClassrooms;
export const scheduleSlots = classRegistrationScheduleSlots;
