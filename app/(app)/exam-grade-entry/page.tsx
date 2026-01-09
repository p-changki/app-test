import type { Metadata } from "next";

import { AssistantSubNav } from "@/components/layout/AssistantSubNav";
import { examSubNavLinks } from "@/constants/examSubNavLinks";
import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

const classOptions = [
  "고2 수학 A반 (평일 18:00)",
  "고2 수학 B반 (주말 10:00)",
  "고3 수능 대비반 (평일 20:00)",
] as const;

const assessmentOptions = [
  "10월 4주차 주간 테스트",
  "10월 3주차 주간 테스트",
  "중간고사 대비 모의고사",
  "9월 모의고사 (교육청)",
] as const;

type GradeRow = {
  id: number;
  name: string;
  phone: string;
  initials: string;
  badgeClass: string;
  attendance: "출석" | "지각" | "결석" | "병결";
  score?: number;
  rank?: number;
  memo?: string;
};

const gradeRows: GradeRow[] = [
  {
    id: 1,
    name: "김지민",
    phone: "010-1234-5678",
    initials: "김",
    badgeClass:
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    attendance: "출석",
    score: 96,
    rank: 1,
    memo: "계산 실수 주의 필요",
  },
  {
    id: 2,
    name: "이도윤",
    phone: "010-9876-5432",
    initials: "이",
    badgeClass:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    attendance: "출석",
    score: 88,
    rank: 5,
  },
  {
    id: 3,
    name: "박서연",
    phone: "010-4567-8901",
    initials: "박",
    badgeClass:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    attendance: "지각",
    score: 75,
    rank: 12,
    memo: "30분 지각, 재시험 예정",
  },
  {
    id: 4,
    name: "최준호",
    phone: "010-2222-3333",
    initials: "최",
    badgeClass:
      "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600",
    attendance: "결석",
    score: 0,
    memo: "무단 결석",
  },
  {
    id: 5,
    name: "강수민",
    phone: "010-5555-7777",
    initials: "강",
    badgeClass:
      "bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-300 border-orange-200 dark:border-orange-800",
    attendance: "출석",
  },
];

export const metadata: Metadata = {
  title: "성적 입력 - EduTrack",
  description: "클래스별 시험 및 과제 점수를 입력하고 관리하는 화면",
};

export default function ExamGradeEntryPage() {
  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200"
      )}
    >
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex text-sm text-slate-500 dark:text-slate-400"
        >
          <ol className="flex items-center space-x-2">
            <li>
              <a className="hover:text-primary" href="/dashboard">
                홈
              </a>
            </li>
            <li>
              <span>/</span>
            </li>
            <li>
              <a className="hover:text-primary" href="/exam-dashboard">
                시험/과제 관리
              </a>
            </li>
            <li>
              <span>/</span>
            </li>
            <li className="font-medium text-slate-900 dark:text-white">
              성적 입력
            </li>
          </ol>
        </nav>
        <AssistantSubNav
          activeHref="/exam-grade-entry"
          links={examSubNavLinks}
          className="mb-6"
        />
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
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-surface-dark dark:text-slate-300 dark:hover:bg-slate-800">
              <span className={iconClass("text-[18px]")}>download</span>
              템플릿 다운로드
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-surface-dark dark:text-slate-300 dark:hover:bg-slate-800">
              <span className={iconClass("text-[18px]")}>upload_file</span>
              엑셀 일괄 업로드
            </button>
          </div>
        </header>

        <FilterPanel />
        <GradeTable />
      </main>
    </div>
  );
}

function FilterPanel() {
  return (
    <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-surface-dark">
      <div className="grid gap-4 md:grid-cols-4">
        <FilterSelect label="클래스 선택" options={classOptions} />
        <FilterSelect label="시험/과제명" options={assessmentOptions} />
        <FilterInput label="시행 일자" type="date" defaultValue="2023-10-25" />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
            만점 기준
          </label>
          <div className="relative">
            <input
              type="number"
              defaultValue={100}
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pr-10 text-right text-sm font-bold text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              점
            </span>
          </div>
        </div>
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

function GradeTable() {
  return (
    <section className="flex flex-1 flex-col rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-surface-dark">
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
              className="w-48 rounded-md border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
          <button className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
            <span className={iconClass("text-[20px]")}>restart_alt</span>
          </button>
        </div>
      </header>
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
          <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-surface-dark">
            {gradeRows.map((row) => (
              <tr
                key={row.id}
                className="transition hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
              >
                <td className="px-4 py-4 text-center text-slate-400">
                  {row.id}
                </td>
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
                    className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-emerald-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
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
                      "w-full rounded-md border border-slate-200 bg-white py-1.5 px-3 text-right font-bold text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white",
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
                    className="w-full rounded-md border border-transparent bg-transparent py-1.5 px-3 text-xs text-slate-600 transition focus:border-primary focus:bg-white focus:outline-none dark:text-slate-300 dark:focus:bg-slate-900"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="sticky bottom-0 flex items-center gap-3 border-t border-slate-200 bg-white px-5 py-4 text-sm text-slate-500 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] dark:border-slate-700 dark:bg-surface-dark dark:text-slate-300">
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
    </section>
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
