"use client";

import Link from "next/link";
import { useMemo } from "react";

import { AssistantSubNav } from "@/components/layout/AssistantSubNav";
import { examSubNavLinks } from "@/constants/examSubNavLinks";
import { ExamEditForm } from "@/features/exam-data/components/ExamEditForm";
import { useExamStore } from "@/features/exam-data/examStore";
import type { RegisteredExam } from "@/types/exams";
import { lexend, notoSansKr } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export function ExamEditClientPage({ examId }: { examId: string }) {
  const selector = useMemo(
    () => (records: RegisteredExam[]) =>
      records.find((exam) => exam.id === examId),
    [examId]
  );
  const exam = useExamStore(selector);

  if (!exam) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        존재하지 않는 시험입니다.
      </div>
    );
  }

  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200"
      )}
    >
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="space-y-3">
          <nav
            aria-label="Breadcrumb"
            className="flex text-xs text-slate-500 dark:text-slate-400"
          >
            <ol className="flex items-center gap-1">
              <li>
                <Link className="hover:text-primary" href="/dashboard">
                  홈
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link className="hover:text-primary" href="/exam-dashboard">
                  시험/과제 관리
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link className="hover:text-primary" href="/exam-answer-entry">
                  시험지 목록
                </Link>
              </li>
              <li>/</li>
              <li className="font-medium text-slate-900 dark:text-white">
                시험 수정
              </li>
            </ol>
          </nav>
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <h1
                className={cn(
                  lexend.className,
                  "text-2xl font-black text-slate-900 dark:text-white"
                )}
              >
                {exam.title} 수정
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                시험 정보와 문항 설정을 업데이트할 수 있습니다.
              </p>
            </div>
            <AssistantSubNav
              activeHref="/exam-answer-entry"
              links={examSubNavLinks}
            />
          </div>
        </header>

        <ExamEditForm exam={exam} />
      </main>
    </div>
  );
}
