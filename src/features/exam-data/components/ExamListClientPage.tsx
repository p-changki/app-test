"use client";

import Link from "next/link";

import { AssistantSubNav } from "@/components/layout/AssistantSubNav";
import { examSubNavLinks } from "@/constants/examSubNavLinks";
import { useExamStore } from "@/features/exam-data/examStore";
import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

export function ExamListClientPage() {
  const examRecords = useExamStore();
  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200"
      )}
    >
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4">
          <div>
            <nav
              aria-label="Breadcrumb"
              className="mb-3 flex text-xs text-slate-500 dark:text-slate-400"
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
                  시험지 목록
                </li>
              </ol>
            </nav>
            <h1
              className={cn(
                lexend.className,
                "text-3xl font-black text-slate-900 dark:text-white"
              )}
            >
              시험지 목록
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              등록된 시험지 목록을 확인하고 상태를 빠르게 리뷰하세요.
            </p>
          </div>
          <AssistantSubNav
            activeHref="/exam-answer-entry"
            links={examSubNavLinks}
          />
        </header>

        <section className="flex flex-col gap-4">
          {examRecords.map((record) => (
            <article
              key={record.id}
              className="rounded-2xl border border-slate-200 bg-[var(--surface-background)] p-4 shadow-sm dark:border-slate-700"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {record.subject}
                    </p>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {record.title}
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <span className={iconClass("text-[14px]")}>
                      calendar_today
                    </span>
                    {record.examDate}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  대상 반: {record.targetClass}
                </p>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3">
                <SimpleStat
                  label="총 문항"
                  value={`${record.totalQuestions}개`}
                />
                <SimpleStat label="총점" value={`${record.totalScore}점`} />
                <SimpleStat label="상태" value={record.status} />
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>등록일 {record.createdAt}</span>
                <Link
                  href={`/exam-answer-entry/${record.id}`}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <span className={iconClass("text-[14px]")}>visibility</span>
                  시험 상세
                </Link>
              </div>
            </article>
          ))}
          {examRecords.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              등록된 시험지가 없습니다. 새로운 시험을 등록해 주세요.
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

function SimpleStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
      <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>
      <p className="text-sm font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}
