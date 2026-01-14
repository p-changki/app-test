"use client";

import { useMemo } from "react";
import Link from "next/link";

import { AssistantSubNav } from "@/components/layout/AssistantSubNav";
import { examSubNavLinks } from "@/constants/examSubNavLinks";
import { examStats, tableFilters } from "@/data/exams";
import { studentEntities } from "@/data/students";
import { AssignmentsTableSection } from "@/features/exam-dashboard/components/overview/AssignmentsTableSection";
import { StatsGrid } from "@/features/exam-dashboard/components/overview/StatsGrid";
import { useExamStore } from "@/features/exam-data/examStore";
import { useExamResultStore } from "@/features/exam-grade-entry/examResultStore";
import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";
import type { AssignmentRow } from "@/types/exams";

export function ExamDashboardOverview() {
  const exams = useExamStore();
  const results = useExamResultStore((state) => state.results);
  const rows = useMemo<AssignmentRow[]>(() => {
    return exams.map((exam) => {
      const students = studentEntities.filter(
        (student) => student.classId === exam.classId
      );
      const examResults = results[exam.id] ?? {};
      const submittedCount = students.filter(
        (student) => !!examResults[student.id]
      ).length;
      const totalCount = students.length || 1;
      const progress = Math.round((submittedCount / totalCount) * 100);
      const isComplete = exam.status === "채점 완료";
      const icon = exam.subject.includes("독해") ? "menu_book" : "spellcheck";
      const iconClass = exam.subject.includes("독해")
        ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
        : "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400";

      return {
        id: exam.id,
        title: exam.title,
        subtitle: `${exam.examType} · ${exam.source}`,
        icon,
        iconClass,
        classLabel: exam.targetClass,
        dueDate: exam.createdAt.replace(/-/g, ". "),
        submitted: `${submittedCount}/${students.length}`,
        progress,
        status: {
          label: isComplete ? "채점 완료" : "진행 중",
          color: isComplete
            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
            : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
        },
        primaryAction: {
          label: "채점하기",
          variant: "primary",
          href: `/exam-grade-entry/${exam.id}`,
        },
      };
    });
  }, [exams, results]);
  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200"
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1
              className={cn(
                lexend.className,
                "text-3xl font-bold text-slate-900 dark:text-white"
              )}
            >
              시험 및 과제 관리
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              학생 평가를 생성, 채점 및 관리합니다.
            </p>
          </div>
        </header>
        <div className="flex justify-end gap-3">
          <AssistantSubNav
            activeHref="/exam-dashboard"
            links={examSubNavLinks}
            className="ml-auto"
          />
          <Link
            href="/exam-report-send"
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-white shadow-sm shadow-primary/30 transition hover:bg-[#1a6bbd]"
          >
            <span className={iconClass("text-lg")}>sms</span>
            성적표 발송
          </Link>
        </div>
        <StatsGrid stats={examStats} />
        <AssignmentsTableSection filters={tableFilters} rows={rows} />
      </div>
    </div>
  );
}
