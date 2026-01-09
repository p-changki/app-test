"use client";

import Link from "next/link";

import type {
  PaginationItem,
  StudentRecord,
  StudentStatusOption,
  StudentTableSummary,
} from "@/features/student-management/types";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

const classBadgeStyles: Record<
  StudentRecord["classColor"],
  { wrapper: string; dot?: string; icon?: string }
> = {
  indigo: {
    wrapper:
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20",
    dot: "bg-indigo-500",
  },
  emerald: {
    wrapper:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  neutral: {
    wrapper:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
    dot: "bg-slate-400",
  },
  dashed: {
    wrapper:
      "border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 bg-transparent",
    icon: "add",
  },
};

const statusVariantClasses = {
  primary:
    "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20",
  neutral:
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
  warning:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20",
};

const attendanceClasses = {
  good: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  danger: "text-rose-600 dark:text-rose-400",
};

const statusOptions: StudentStatusOption[] = ["재원중", "휴원", "퇴원"];

const statusVariantMap: Record<
  StudentStatusOption,
  keyof typeof statusVariantClasses
> = {
  재원중: "primary",
  휴원: "warning",
  퇴원: "neutral",
};

type StudentTableProps = {
  students: StudentRecord[];
  tableSummary: StudentTableSummary;
  pagination: PaginationItem[];
  selectedStudentIds: string[];
  onToggleStudent: (studentId: string) => void;
  onToggleAll: () => void;
  studentStatuses: Record<string, StudentStatusOption>;
  onStatusChange: (studentId: string, status: StudentStatusOption) => void;
};

export function StudentTable({
  students,
  tableSummary,
  pagination,
  selectedStudentIds,
  onToggleStudent,
  onToggleAll,
  studentStatuses,
  onStatusChange,
}: StudentTableProps) {
  const allSelected =
    students.length > 0 && selectedStudentIds.length === students.length;

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-[var(--surface-background)] shadow-sm transition-colors dark:border-slate-800 dark:bg-[var(--surface-background)]">
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                <th className="w-12 p-4 text-center">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                    aria-label="전체 선택"
                    checked={allSelected}
                    onChange={onToggleAll}
                  />
                </th>
                <th className="p-4">학생 정보</th>
                <th className="p-4">현재 배정 반</th>
                <th className="p-4">학교/학년</th>
                <th className="p-4">연락처</th>
                <th className="p-4">성적/출결</th>
                <th className="p-4">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {students.map((student) => (
                <StudentRow
                  key={student.id}
                  student={student}
                  selected={selectedStudentIds.includes(student.id)}
                  onToggle={() => onToggleStudent(student.id)}
                  currentStatus={
                    studentStatuses[student.id] ??
                    (["재원중", "휴원", "퇴원"].includes(student.status.label)
                      ? (student.status.label as StudentStatusOption)
                      : "재원중")
                  }
                  onStatusChange={(status) =>
                    onStatusChange(student.id, status)
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="space-y-3 border-t border-slate-200 px-4 py-4 dark:border-slate-800 md:hidden">
        {students.map((student) => (
          <MobileStudentCard
            key={`${student.id}-mobile`}
            student={student}
            selected={selectedStudentIds.includes(student.id)}
            onToggle={() => onToggleStudent(student.id)}
            currentStatus={
              studentStatuses[student.id] ??
              (["재원중", "휴원", "퇴원"].includes(student.status.label)
                ? (student.status.label as StudentStatusOption)
                : "재원중")
            }
            onStatusChange={(status) => onStatusChange(student.id, status)}
          />
        ))}
      </div>
      <div className="flex flex-col gap-3 border-t border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 md:flex-row md:items-center md:justify-between">
        <p>
          총{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            {tableSummary.total}
          </span>
          명 중{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            {tableSummary.rangeLabel}
          </span>{" "}
          표시
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="이전 페이지"
          >
            <span className={iconClass("text-[20px]")}>chevron_left</span>
          </button>
          {pagination.map((item) =>
            item === "..." ? (
              <span key={item} className="px-2 text-slate-400">
                ...
              </span>
            ) : (
              <button
                key={item}
                type="button"
                className={cn(
                  "flex size-9 items-center justify-center rounded-lg text-sm font-medium transition",
                  item === "1"
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                )}
              >
                {item}
              </button>
            )
          )}
          <button
            type="button"
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="다음 페이지"
          >
            <span className={iconClass("text-[20px]")}>chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  );
}

function StudentRow({
  student,
  selected,
  onToggle,
  currentStatus,
  onStatusChange,
}: {
  student: StudentRecord;
  selected: boolean;
  onToggle: () => void;
  currentStatus: StudentStatusOption;
  onStatusChange: (status: StudentStatusOption) => void;
}) {
  const badgeStyle = classBadgeStyles[student.classColor];
  const statusVariant = statusVariantMap[currentStatus];

  return (
    <tr
      className={cn(
        "transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50",
        student.unassigned ? "bg-rose-50/40 dark:bg-rose-900/5" : undefined,
        selected ? "ring-1 ring-primary/50 dark:ring-primary/40" : undefined
      )}
    >
      <td className="p-4 text-center">
        <input
          type="checkbox"
          className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
          aria-label={`${student.name} 선택`}
          checked={selected}
          onChange={onToggle}
        />
      </td>
      <td className="p-4">
        <Link
          href={`/student-management/${student.id}`}
          className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          {student.avatarUrl ? (
            <div
              className="size-9 rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url("${student.avatarUrl}")` }}
              aria-hidden
            />
          ) : (
            <div className="flex size-9 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-600">
              {student.initials}
            </div>
          )}
          <div className="flex flex-col">
            <p className="text-slate-900 transition hover:text-primary dark:text-white">
              {student.name}
              {student.highlight && (
                <span className="ml-2 rounded border border-rose-200 bg-rose-50 px-1 text-[10px] font-semibold text-rose-500 dark:border-rose-500/40 dark:bg-rose-900/20 dark:text-rose-300">
                  {student.highlight.label}
                </span>
              )}
            </p>
            <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
              {student.studentId}
            </p>
          </div>
        </Link>
      </td>
      <td className="p-4">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium",
            badgeStyle.wrapper
          )}
        >
          {badgeStyle.icon ? (
            <span className={iconClass("text-[14px]")}>{badgeStyle.icon}</span>
          ) : badgeStyle.dot ? (
            <span className={cn("size-1.5 rounded-full", badgeStyle.dot)} />
          ) : null}
          {student.className}
        </span>
      </td>
      <td className="p-4 text-slate-600 dark:text-slate-400">
        {student.school}
      </td>
      <td className="p-4 text-slate-600 dark:text-slate-400">
        {student.contact}
      </td>
      <td className="p-4">
        {student.emptyPerformance ? (
          <span className="text-xs italic text-slate-400">
            {student.emptyPerformance}
          </span>
        ) : (
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-8 text-slate-500">출석</span>
              <span
                className={cn(
                  "font-semibold",
                  student.attendanceVariant
                    ? attendanceClasses[student.attendanceVariant]
                    : "text-slate-700 dark:text-slate-300"
                )}
              >
                {student.attendance}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 text-slate-500">평균</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {student.averageScore}점
              </span>
            </div>
          </div>
        )}
      </td>
      <td className="p-4">
        <label className="flex flex-col gap-1 text-xs text-slate-400">
          <span>상태</span>
          <select
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            value={currentStatus}
            onChange={(event) =>
              onStatusChange(event.target.value as StudentStatusOption)
            }
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <span
          className={cn(
            "mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
            statusVariantClasses[statusVariant]
          )}
        >
          {currentStatus}
        </span>
      </td>
    </tr>
  );
}

function MobileStudentCard({
  student,
  selected,
  onToggle,
  currentStatus,
  onStatusChange,
}: {
  student: StudentRecord;
  selected: boolean;
  onToggle: () => void;
  currentStatus: StudentStatusOption;
  onStatusChange: (status: StudentStatusOption) => void;
}) {
  const badgeStyle = classBadgeStyles[student.classColor];
  const statusVariant = statusVariantMap[currentStatus];

  return (
    <div
      className={cn(
        "rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300",
        student.unassigned ? "ring-1 ring-rose-200 dark:ring-rose-500/40" : "",
        selected ? "ring-1 ring-primary/50 dark:ring-primary/40" : ""
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/student-management/${student.id}`}
          className="flex flex-1 items-start gap-3"
        >
          {student.avatarUrl ? (
            <div
              className="size-10 rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url("${student.avatarUrl}")` }}
              aria-hidden
            />
          ) : (
            <div className="flex size-10 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-600">
              {student.initials}
            </div>
          )}
          <div className="flex flex-col">
            <p className="text-base font-semibold text-slate-900 dark:text-white">
              {student.name}
            </p>
            <p className="font-mono text-xs text-slate-500">
              {student.studentId}
            </p>
          </div>
        </Link>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="size-4 rounded border-slate-500 text-primary focus:ring-primary"
            checked={selected}
            onChange={onToggle}
            aria-label={`${student.name} 선택`}
          />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-semibold",
            badgeStyle.wrapper
          )}
        >
          {badgeStyle.icon ? (
            <span className={iconClass("text-[14px]")}>{badgeStyle.icon}</span>
          ) : badgeStyle.dot ? (
            <span className={cn("size-1.5 rounded-full", badgeStyle.dot)} />
          ) : null}
          {student.className || "미배정"}
        </span>
        <span>{student.school}</span>
        <span>{student.contact}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs">
        {student.emptyPerformance ? (
          <span className="italic text-slate-400">
            {student.emptyPerformance}
          </span>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">출석</span>
              <span
                className={cn(
                  "font-semibold",
                  student.attendanceVariant
                    ? attendanceClasses[student.attendanceVariant]
                    : "text-slate-700 dark:text-slate-200"
                )}
              >
                {student.attendance}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">평균</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {student.averageScore}점
              </span>
            </div>
          </>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-2 text-xs text-slate-500">
        <label className="flex flex-col gap-1 text-xs text-slate-400">
          <span>상태</span>
          <select
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            value={currentStatus}
            onChange={(event) =>
              onStatusChange(event.target.value as StudentStatusOption)
            }
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
            statusVariantClasses[statusVariant]
          )}
        >
          {currentStatus}
        </span>
      </div>
    </div>
  );
}
