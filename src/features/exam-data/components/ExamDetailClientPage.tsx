"use client";

import Link from "next/link";
import { useMemo } from "react";

import { AssistantSubNav } from "@/components/layout/AssistantSubNav";
import { examSubNavLinks } from "@/constants/examSubNavLinks";
import { useExamStore } from "@/features/exam-data/examStore";
import type { RegisteredExam } from "@/types/exams";
import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

export function ExamDetailClientPage({ examId }: { examId: string }) {
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
              <li className="font-medium text-slate-900 dark:text-white">
                시험 상세
              </li>
            </ol>
          </nav>
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {exam.subject}
              </p>
              <h1
                className={cn(
                  lexend.className,
                  "text-2xl font-black text-slate-900 dark:text-white"
                )}
              >
                {exam.title}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                대상 반: {exam.targetClass} · 시험일 {exam.examDate}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <AssistantSubNav
                activeHref="/exam-dashboard"
                links={examSubNavLinks}
              />
              <Link
                href={`/exam-answer-entry/${exam.id}/edit`}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <span className={iconClass("text-[16px]")}>edit</span>
                수정하기
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-4 rounded-2xl border border-slate-200 bg-[var(--surface-background)] p-4 shadow-sm dark:border-slate-700 dark:bg-[var(--surface-background)] sm:grid-cols-2 lg:grid-cols-4">
          <DetailStat label="총 문항" value={`${exam.totalQuestions}개`} />
          <DetailStat label="총점" value={`${exam.totalScore}점`} />
          <DetailStat label="통과 기준" value={`${exam.passScore}점`} />
          <DetailStat label="상태" value={exam.status} />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-[var(--surface-background)] p-5 shadow-sm dark:border-slate-700">
          <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <span className={iconClass("text-primary")}>description</span>
            요약
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {exam.summary}
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-[var(--surface-background)] p-5 shadow-sm dark:border-slate-700">
          <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <span className={iconClass("text-primary")}>fact_check</span>
            후속 작업 메모
          </h2>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {exam.notes.map((note: string) => (
              <li
                key={note}
                className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60"
              >
                <span className="mt-1 size-1.5 rounded-full bg-primary" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-[var(--surface-background)] p-5 shadow-sm dark:border-slate-700">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <span className={iconClass("text-primary")}>quiz</span>
            문항 요약
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                <tr>
                  <th className="px-3 py-2 text-left">No.</th>
                  <th className="px-3 py-2 text-left">문항</th>
                  <th className="px-3 py-2 text-left">유형</th>
                  <th className="px-3 py-2 text-left">배점</th>
                  <th className="px-3 py-2 text-left">정답</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {exam.questions.map(
                  (question: RegisteredExam["questions"][number]) => (
                    <tr key={question.id}>
                      <td className="px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        {question.id}
                      </td>
                      <td className="px-3 py-2 text-sm text-slate-700 dark:text-slate-200">
                        {question.label}
                      </td>
                      <td className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {question.type}
                      </td>
                      <td className="px-3 py-2 text-sm text-slate-600 dark:text-slate-300">
                        {question.points}점
                      </td>
                      <td className="px-3 py-2 text-sm font-mono text-slate-900 dark:text-white">
                        {question.answer}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3 text-sm shadow-sm dark:border-slate-700">
      <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>
      <p className="text-lg font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}
