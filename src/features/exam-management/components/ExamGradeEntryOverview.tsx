import Link from "next/link";

import { AssistantSubNav } from "@/components/layout/AssistantSubNav";
import { examSubNavLinks } from "@/constants/examSubNavLinks";
import {
  assessmentOptions,
  gradeEntryClassOptions,
  gradeRows,
} from "@/data/exams";
import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

export function ExamGradeEntryOverview() {
  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200"
      )}
    >
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumbs />
        <AssistantSubNav
          activeHref="/exam-grade-entry"
          links={examSubNavLinks}
          className="mb-6"
        />
        <HeaderSection />
        <FilterPanel />
        <GradeTable />
      </main>
    </div>
  );
}

function Breadcrumbs() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4 flex text-sm text-slate-500 dark:text-slate-400"
    >
      <ol className="flex items-center space-x-2">
        <li>
          <Link className="hover:text-primary" href="/dashboard">
            홈
          </Link>
        </li>
        <li>
          <span>/</span>
        </li>
        <li>
          <Link className="hover:text-primary" href="/exam-dashboard">
            시험/과제 관리
          </Link>
        </li>
        <li>
          <span>/</span>
        </li>
        <li className="font-medium text-slate-900 dark:text-white">
          성적 입력
        </li>
      </ol>
    </nav>
  );
}

function HeaderSection() {
  return (
    <header className="mb-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
      <div className="space-y-2">
        <h1
          className={cn(
            lexend.className,
            "text-3xl font-black text-slate-900 dark:text-white md:text-4xl"
          )}
        >
          성적 입력/수정
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400">
          클래스별 시험 및 과제 점수를 입력하고 관리하세요.
        </p>
      </div>
      <div className="flex gap-2">
        <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-[var(--surface-background)] px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-[var(--surface-background)] dark:text-slate-300 dark:hover:bg-slate-800">
          <span className={iconClass("text-[18px]")}>download</span>
          템플릿 다운로드
        </button>
        <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-[var(--surface-background)] px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-[var(--surface-background)] dark:text-slate-300 dark:hover:bg-slate-800">
          <span className={iconClass("text-[18px]")}>upload_file</span>
          엑셀 일괄 업로드
        </button>
      </div>
    </header>
  );
}

function FilterPanel() {
  return (
    <section className="mb-6 rounded-xl border border-slate-200 bg-[var(--surface-background)] p-5 shadow-sm dark:border-slate-700 dark:bg-[var(--surface-background)]">
      <div className="grid gap-4 md:grid-cols-4">
        <FilterSelect label="클래스 선택" options={gradeEntryClassOptions} />
        <FilterSelect label="시험/과제명" options={assessmentOptions} />
        <FilterInput label="시행 일자" type="date" defaultValue="2023-10-25" />
        <MaxScoreInput />
      </div>
    </section>
  );
}

function FilterSelect({
  label,
  options,
}: {
  label: string;
  options: readonly string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
        {label}
      </label>
      <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white">
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function FilterInput({
  label,
  type,
  defaultValue,
}: {
  label: string;
  type: string;
  defaultValue?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
        {label}
      </label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
      />
    </div>
  );
}

function MaxScoreInput() {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
        만점 기준
      </label>
      <div className="relative">
        <input
          type="number"
          defaultValue={100}
          className="w-full rounded-lg border border-slate-200 bg-[var(--surface-background)] py-2.5 pr-10 text-right text-sm font-bold text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[var(--surface-background)] dark:text-white"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          점
        </span>
      </div>
    </div>
  );
}

function GradeTable() {
  return (
    <section className="flex flex-1 flex-col rounded-xl border border-slate-200 bg-[var(--surface-background)] shadow-sm dark:border-slate-700 dark:bg-[var(--surface-background)]">
      <GradeTableHeader />
      <GradeTableBody />
      <GradeTableFooter />
    </section>
  );
}

function GradeTableHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-5 py-3 dark:border-slate-700">
      <div className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <SummaryItem label="전체" value="24명" />
        <div className="hidden h-4 w-px bg-slate-200 dark:bg-slate-700 sm:block" />
        <SummaryItem label="입력 완료" value="18명" accent />
        <div className="hidden h-4 w-px bg-slate-200 dark:bg-slate-700 sm:block" />
        <SummaryItem label="평균" value="78.5점" />
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <span
            className={iconClass(
              "pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-slate-400"
            )}
          >
            search
          </span>
          <input
            type="search"
            placeholder="이름으로 검색"
            className="w-48 rounded-md border border-slate-200 bg-[var(--surface-background)] py-1.5 pl-9 pr-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[var(--surface-background)] dark:text-white"
          />
        </div>
        <button className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
          <span className={iconClass("text-[20px]")}>restart_alt</span>
        </button>
      </div>
    </header>
  );
}

function GradeTableBody() {
  return (
    <div className="custom-scrollbar flex-1 overflow-auto">
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 shadow-sm dark:bg-slate-800/80 dark:text-slate-400">
          <tr>
            <th className="w-14 px-4 py-3 text-center">No</th>
            <th className="px-4 py-3 text-left">학생 정보</th>
            <th className="w-40 px-4 py-3 text-left">응시 상태</th>
            <th className="w-32 px-4 py-3 text-left">점수</th>
            <th className="w-24 px-4 py-3 text-center">석차</th>
            <th className="px-4 py-3 text-left">비고 / 피드백</th>
          </tr>
        </thead>
        <tbody className="divide-y.divide-slate-100 bg-[var(--surface-background)] dark:divide-slate-800 dark:bg-[var(--surface-background)]">
          {gradeRows.map((row) => (
            <tr
              key={row.id}
              className="transition hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
            >
              <td className="px-4 py-4 text-center text-slate-400">{row.id}</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "size-9 rounded-full border text-xs font-bold",
                      row.badgeClass
                    )}
                  >
                    <span className="flex h-full items-center justify-center">
                      {row.initials}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {row.name}
                    </p>
                    <p className="text-xs text-slate-400">{row.phone}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <select
                  defaultValue={row.attendance}
                  className="w-full rounded-md border border-slate-200 bg-[var(--surface-background)] px-2 py-1.5 text-xs font-semibold text-emerald-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[var(--surface-background)] dark:text-white"
                >
                  <option value="출석">출석</option>
                  <option value="지각">지각</option>
                  <option value="결석">결석</option>
                  <option value="병결">병결</option>
                </select>
              </td>
              <td className="px-4 py-4">
                <input
                  type="number"
                  defaultValue={row.score ?? undefined}
                  placeholder="-"
                  className={cn(
                    "w-full rounded-md border border-slate-200 bg-[var(--surface-background)] py-1.5 px-3 text-right font-bold text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[var(--surface-background)] dark:text-white",
                    row.attendance === "결석" &&
                      "bg-slate-100 text-slate-400 dark:bg-slate-800"
                  )}
                  disabled={row.attendance === "결석"}
                />
              </td>
              <td className="px-4 py-4 text-center font-bold text-slate-600 dark:text-slate-300">
                {row.rank ?? "-"}
              </td>
              <td className="px-4 py-4">
                <input
                  type="text"
                  defaultValue={row.memo}
                  placeholder="메모 입력..."
                  className="w-full rounded-md border border-transparent bg-transparent py-1.5 px-3 text-xs text-slate-600 transition focus:border-primary focus:bg-[var(--surface-background)] focus:outline-none dark:text-slate-300 dark:focus:bg-[var(--surface-background)]"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GradeTableFooter() {
  return (
    <footer className="sticky bottom-0 flex items-center gap-3 border-t border-slate-200 bg-[var(--surface-background)] px-5 py-4 text-sm text-slate-500 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] dark:border-slate-700 dark:bg-[var(--surface-background)] dark:text-slate-300">
      <span className="mr-auto flex items-center gap-2 text-xs">
        <span className="size-2 rounded-full bg-emerald-500" />
        마지막 자동 저장: 오늘 14:30
      </span>
      <button className="rounded-lg border border-slate-200 px-5 py-2 font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
        취소
      </button>
      <button className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 font-bold text-white shadow-sm transition hover:bg-blue-600">
        <span className={iconClass("text-[18px]")}>save</span>
        저장하기
      </button>
    </footer>
  );
}

function SummaryItem({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <span
      className={cn(
        "flex items-center gap-2",
        accent ? "text-primary" : "text-slate-500 dark:text-slate-400"
      )}
    >
      {label}
      <span className="text-sm font-bold text-slate-900 dark:text-white">
        {value}
      </span>
    </span>
  );
}
