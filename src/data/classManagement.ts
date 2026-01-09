import { classEntities } from "@/data/classes";
import type { ClassRecord } from "@/features/class-management/types";

const uniqueLevels = Array.from(
  new Set(classEntities.map((klass) => klass.level))
).sort();

const uniqueDayGroups = Array.from(
  new Set(classEntities.map((klass) => klass.schedule.days.join(", ")))
).sort();

const uniqueStatuses = Array.from(
  new Set(classEntities.map((klass) => klass.status))
).sort();

export const classManagementRecords: ClassRecord[] = classEntities;

export const classLevelOptions: readonly string[] = [
  "전체 학년",
  ...uniqueLevels,
];

export const classDayOptions: readonly string[] = [
  "전체 요일",
  ...uniqueDayGroups,
];

export const classStatusOptions: readonly string[] = [
  "전체 상태",
  ...uniqueStatuses,
];
