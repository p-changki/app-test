import type { Metadata } from "next";
import Link from "next/link";

import {
  classChips,
  classSection,
  filterSelects,
  headerActions,
  pageSummary,
  pagination,
  studentBreadcrumbs,
  studentRecords,
  tableSummary,
} from "@/features/student-management/data";
import type {
  ClassChip,
  StudentRecord,
} from "@/features/student-management/types";
import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "학생 관리 - EduTrack",
  description: "학급별 학생을 조회하고 배정/알림을 관리하는 화면",
};

const chipColorClasses: Record<
  NonNullable<ClassChip["color"]>,
  { border: string; text: string; dot: string }
> = {
  primary: {
    border:
      "ring-1 ring-primary ring-offset-1 dark:ring-offset-background-dark",
    text: "text-white",
    dot: "bg-white/20",
  },
  indigo: {
    border:
      "border border-slate-200 dark:border-slate-700 hover:border-indigo-500",
    text: "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400",
    dot: "bg-indigo-500",
  },
  emerald: {
    border:
      "border border-slate-200 dark:border-slate-700 hover:border-emerald-500",
    text: "text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400",
    dot: "bg-emerald-500",
  },
  rose: {
    border:
      "border border-slate-200 dark:border-slate-700 hover:border-rose-500",
    text: "text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400",
    dot: "bg-rose-500",
  },
};

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

export default function StudentManagementPage() {
  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200"
      )}
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumbs />
        <ClassSelector />
        <div className="flex flex-col gap-6">
          <PageSummary />
          <ActionButtons />
          <FilterPanel />
          <StudentTable />
        </div>
        <footer className="text-center text-xs text-slate-400 dark:text-slate-600">
          © 2024 에듀 매니저. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

function Breadcrumbs() {
  return (
    <nav className="flex items-center text-sm text-slate-500 dark:text-slate-400">
      {studentBreadcrumbs.map((crumb, index) => (
        <span key={crumb.label} className="flex items-center">
          {crumb.href ? (
            <a
              href={crumb.href}
              className="text-slate-600 transition-colors hover:text-primary dark:text-slate-300 dark:hover:text-primary"
            >
              {crumb.label}
            </a>
          ) : (
            <span className="font-medium text-slate-900 dark:text-white">
              {crumb.label}
            </span>
          )}
          {index < studentBreadcrumbs.length - 1 && (
            <span className="mx-2 text-slate-300 dark:text-slate-600">/</span>
          )}
        </span>
      ))}
    </nav>
  );
}

function ClassSelector() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-surface-dark sm:p-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <span className={cn(iconClass("text-primary"))}>school</span>
            {classSection.title}
          </h3>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <span className={iconClass("text-[18px]")}>settings</span>
            {classSection.actionLabel}
          </button>
        </div>
        <div className="custom-scrollbar -mx-2 flex items-center gap-2 overflow-x-auto px-2 pb-2">
          {classChips.map((chip) => {
            if (chip.isDivider) {
              return (
                <span
                  key={chip.id}
                  className="mx-1 hidden h-6 w-px flex-shrink-0 bg-slate-300 dark:bg-slate-700 sm:block"
                />
              );
            }
            if (chip.isAddButton) {
              return (
                <button
                  key={chip.id}
                  type="button"
                  className="flex size-9 flex-shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-300 text-slate-400 transition hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-slate-600 dark:text-slate-500 dark:hover:text-primary"
                  title="새 학급 추가"
                >
                  <span className={iconClass()}>add</span>
                </button>
              );
            }
            if (!chip.label) {
              return null;
            }
            const colorClasses = chip.color
              ? chipColorClasses[chip.color]
              : undefined;
            const baseClasses =
              "flex flex-shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors";
            let variantClass =
              "border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";

            if (chip.variant === "all") {
              variantClass =
                "bg-primary text-white shadow-sm shadow-primary/30 " +
                colorClasses?.border;
            } else if (chip.variant === "unassigned") {
              variantClass =
                "border border-slate-200 bg-white text-slate-600 hover:border-rose-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";
            } else if (colorClasses) {
              variantClass = colorClasses.border + " " + colorClasses.text;
            }

            return (
              <button
                key={chip.id}
                type="button"
                className={cn(baseClasses, variantClass)}
              >
                {chip.icon ? (
                  <span
                    className={iconClass("text-[18px]", chip.variant === "all")}
                  >
                    {chip.icon}
                  </span>
                ) : colorClasses?.dot ? (
                  <span
                    className={cn("size-2 rounded-full", colorClasses.dot)}
                  />
                ) : null}
                <span>{chip.label}</span>
                {typeof chip.count === "number" && (
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      chip.variant === "all"
                        ? "rounded bg-white/20 px-1.5 py-0.5 text-white"
                        : "text-slate-400 group-hover:text-inherit"
                    )}
                  >
                    {chip.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PageSummary() {
  return (
    <div className="flex flex-col gap-2">
      <h1
        className={cn(
          lexend.className,
          "text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl"
        )}
      >
        {pageSummary.title}
      </h1>
      <p className="text-slate-500 dark:text-slate-400">
        {pageSummary.description}
      </p>
    </div>
  );
}

function ActionButtons() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {headerActions.map((action) => (
        <button
          key={action.id}
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
            action.variant === "primary"
              ? "bg-primary text-white shadow-sm shadow-primary/30 hover:bg-[#1a6bbd]"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          )}
        >
          <span className={iconClass("text-[18px]")}>{action.icon}</span>
          <span className="hidden sm:inline">{action.label}</span>
          <span className="sm:hidden">{action.label.replace(" ", "")}</span>
        </button>
      ))}
    </div>
  );
}

function FilterPanel() {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-surface-dark lg:flex-row lg:items-center lg:justify-between">
      <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
        <div className="relative w-full sm:w-64">
          <span
            className={cn(
              iconClass(
                "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              )
            )}
          >
            search
          </span>
          <input
            type="text"
            placeholder="이름, ID, 전화번호 검색"
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>
        {filterSelects.map((select) => (
          <select
            key={select.id}
            className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 pr-8 text-sm text-slate-700 outline-none transition focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            defaultValue=""
          >
            <option value="">{select.placeholder}</option>
            {select.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}
      </div>
      <div className="flex items-center gap-2 self-end lg:self-auto">
        <button
          type="button"
          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          초기화
        </button>
        <button
          type="button"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1a6bbd]"
        >
          적용
        </button>
      </div>
    </section>
  );
}

function StudentTable() {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-surface-dark">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
              <th className="w-12 p-4 text-center">
                <input
                  type="checkbox"
                  className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                  aria-label="전체 선택"
                />
              </th>
              <th className="p-4">학생 정보</th>
              <th className="p-4">현재 배정 반</th>
              <th className="p-4">학교/학년</th>
              <th className="p-4">연락처</th>
              <th className="p-4">성적/출결</th>
              <th className="p-4">상태</th>
              <th className="p-4 text-right">반 배정</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {studentRecords.map((student) => (
              <StudentRow key={student.id} student={student} />
            ))}
          </tbody>
        </table>
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

function StudentRow({ student }: { student: StudentRecord }) {
  const badgeStyle = classBadgeStyles[student.classColor];
  return (
    <tr
      className={cn(
        "transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50",
        student.unassigned ? "bg-rose-50/40 dark:bg-rose-900/5" : undefined
      )}
    >
      <td className="p-4 text-center">
        <input
          type="checkbox"
          className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
          aria-label={`${student.name} 선택`}
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
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
            statusVariantClasses[student.status.variant]
          )}
        >
          {student.status.label}
        </span>
      </td>
      <td className="p-4 text-right">
        <button
          type="button"
          className={cn(
            "rounded border px-3 py-1.5 text-xs font-semibold transition",
            student.unassigned
              ? "border-primary bg-primary text-white shadow-sm hover:bg-[#1a6bbd]"
              : "border-slate-200 text-slate-600 hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300 dark:hover:text-primary"
          )}
        >
          {student.actionLabel}
        </button>
      </td>
    </tr>
  );
}
