"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { AssignmentRow } from "@/types/exams";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";
import { removeExams } from "@/features/exam-data/examStore";
import { useExamResultStore } from "@/features/exam-grade-entry/examResultStore";

type AssignmentsTableSectionProps = {
  filters: string[];
  rows: AssignmentRow[];
};

export function AssignmentsTableSection({
  filters,
  rows,
}: AssignmentsTableSectionProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const clearExam = useExamResultStore((state) => state.clearExam);

  const selectableRows = useMemo(() => rows.map((row) => row.id), [rows]);
  const allSelected =
    selectedIds.length > 0 && selectedIds.length === selectableRows.length;
  const anySelected = selectedIds.length > 0;

  const toggleAll = (checked: boolean) => {
    setSelectedIds(checked ? selectableRows : []);
  };

  const toggleOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((value) => value !== id)
    );
  };

  const handleDelete = () => {
    if (!anySelected) return;
    removeExams(selectedIds);
    selectedIds.forEach((id) => clearExam(id));
    setSelectedIds([]);
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-fit rounded-lg bg-slate-200 p-1 dark:bg-slate-800">
          {filters.map((filter, index) => (
            <button
              key={filter}
              type="button"
              className={cn(
                "rounded-md px-4 py-1.5 text-sm font-medium transition",
                index === 0
                  ? "bg-[var(--surface-background)] text-slate-900 shadow-sm dark:bg-[var(--surface-background)] dark:text-white"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:justify-end">
          <div className="group relative w-full md:w-64">
            <span
              className={cn(
                iconClass(
                  "absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"
                )
              )}
            >
              search
            </span>
            <input
              type="text"
              placeholder="과제 검색..."
              className="block w-full rounded-lg border-none bg-[var(--surface-background)] py-2 pl-10 pr-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-[var(--surface-background)] dark:text-white"
            />
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-[var(--surface-background)] px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-[var(--surface-background)] dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span className={iconClass("text-lg")}>filter_list</span>
            필터
          </button>
          <button
            type="button"
            disabled={!anySelected}
            onClick={handleDelete}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold shadow-sm transition",
              anySelected
                ? "bg-rose-500 text-white hover:bg-rose-600"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            )}
          >
            <span className={iconClass("text-lg")}>delete</span>
            선택 삭제
          </button>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-[var(--surface-background)] shadow-sm dark:border-slate-700 dark:bg-[var(--surface-background)]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-800"
                    checked={allSelected}
                    onChange={(event) => toggleAll(event.target.checked)}
                    aria-label="모두 선택"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  과제명
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  반
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  등록일
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  상태
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-800"
                      checked={selectedIds.includes(row.id)}
                      onChange={(event) =>
                        toggleOne(row.id, event.target.checked)
                      }
                      aria-label={`${row.title} 선택`}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div
                        className={cn(
                          "flex size-10 items-center justify-center rounded-lg",
                          row.iconClass
                        )}
                      >
                        <span className={iconClass()}>{row.icon}</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {row.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {row.subtitle}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                      {row.classLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {row.dueDate}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        row.status.color
                      )}
                    >
                      <span className="mr-1.5 size-1.5 rounded-full bg-current" />
                      {row.status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    {row.primaryAction.href ? (
                      <Link
                        href={row.primaryAction.href}
                        className={cn(
                          "mr-3 text-sm font-semibold",
                          row.primaryAction.variant === "primary"
                            ? "text-primary hover:text-[#1a6bbd]"
                            : "text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        )}
                      >
                        {row.primaryAction.label}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className={cn(
                          "mr-3 text-sm font-semibold",
                          row.primaryAction.variant === "primary"
                            ? "text-primary hover:text-[#1a6bbd]"
                            : "text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        )}
                      >
                        {row.primaryAction.label}
                      </button>
                    )}
                    <button
                      type="button"
                      className="rounded p-1 text-slate-400 transition hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      <span className={iconClass("text-xl")}>more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
                  >
                    등록된 시험이 없습니다.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
          <p>
            전체 <span className="font-semibold">12</span>개 중{" "}
            <span className="font-semibold">1-4</span> 표시
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded border border-slate-300 bg-[var(--surface-background)] px-3 py-1 text-sm text-slate-500 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-[var(--surface-background)] dark:text-slate-300"
            >
              이전
            </button>
            <button
              type="button"
              className="rounded border border-slate-300 bg-[var(--surface-background)] px-3 py-1 text-sm text-slate-500 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-[var(--surface-background)] dark:text-slate-300"
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
