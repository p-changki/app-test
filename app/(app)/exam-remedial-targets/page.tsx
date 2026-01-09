import type { Metadata } from "next";

import { AssistantSubNav } from "@/components/layout/AssistantSubNav";
import { examSubNavLinks } from "@/constants/examSubNavLinks";
import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

type SummaryStat = {
  title: string;
  value: string;
  suffix: string;
  trend: string;
  trendClass: string;
  icon: string;
  iconClass: string;
};

const summaryStats: SummaryStat[] = [
  {
    title: "전체 재시험 대상자",
    value: "42",
    suffix: "명",
    trend: "+3%",
    trendClass: "text-green-600 bg-green-50",
    icon: "groups",
    iconClass:
      "text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-800",
  },
  {
    title: "미예약 학생",
    value: "12",
    suffix: "명",
    trend: "-2%",
    trendClass: "text-red-600 bg-red-50",
    icon: "event_busy",
    iconClass: "text-red-600 bg-red-50 dark:bg-red-900/30",
  },
  {
    title: "제안 검토 중",
    value: "8",
    suffix: "명",
    trend: "+1%",
    trendClass: "text-green-600 bg-green-50",
    icon: "pending_actions",
    iconClass: "text-orange-500 bg-orange-50 dark:bg-orange-900/30",
  },
  {
    title: "오늘 재시험 예정",
    value: "15",
    suffix: "명",
    trend: "-5%",
    trendClass: "text-red-600 bg-red-50",
    icon: "today",
    iconClass: "text-blue-600 bg-blue-50 dark:bg-blue-900/30",
  },
];

const classFilterOptions = [
  "전체 학급",
  "수학 A반 (심화)",
  "수학 B반 (기초)",
  "영어 C반",
] as const;
const examFilterOptions = [
  "모든 시험",
  "주간 테스트 (11/20)",
  "단원 평가 (미적분)",
] as const;
const statusFilterOptions = [
  "전체 상태",
  "미예약",
  "알림 발송 완료",
  "예약 완료",
  "제안 검토 중",
] as const;

type StudentRow = {
  id: string;
  name: string;
  classLabel: string;
  initials: string;
  badgeClass: string;
  examName: string;
  score: number;
  cutline: number;
  failDate: string;
  status: { label: string; badgeClass: string; dotClass: string };
  actions: { icon: string; label: string }[];
};

const studentRows: StudentRow[] = [
  {
    id: "kim-chulsoo",
    name: "김철수",
    classLabel: "수학 A반 (심화)",
    initials: "김A",
    badgeClass: "bg-slate-200 text-slate-600",
    examName: "주간 테스트 (삼각함수)",
    score: 55,
    cutline: 70,
    failDate: "2023.11.20",
    status: {
      label: "미예약",
      badgeClass:
        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      dotClass: "bg-red-500",
    },
    actions: [
      { icon: "notifications_active", label: "독려 알림 발송" },
      { icon: "event_available", label: "일정 수동 배정" },
      { icon: "visibility", label: "시험 결과 보기" },
    ],
  },
  {
    id: "lee-yeonghui",
    name: "이영희",
    classLabel: "수학 A반 (심화)",
    initials: "이B",
    badgeClass: "bg-blue-100 text-blue-600",
    examName: "주간 테스트 (삼각함수)",
    score: 62,
    cutline: 70,
    failDate: "2023.11.20",
    status: {
      label: "예약 완료",
      badgeClass:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      dotClass: "bg-blue-500",
    },
    actions: [
      { icon: "forward_to_inbox", label: "알림 재발송" },
      { icon: "edit_calendar", label: "일정 수정" },
      { icon: "visibility", label: "시험 결과 보기" },
    ],
  },
  {
    id: "park-jimin",
    name: "박지민",
    classLabel: "수학 B반 (기초)",
    initials: "박C",
    badgeClass: "bg-orange-100 text-orange-600",
    examName: "단원평가 (방정식)",
    score: 48,
    cutline: 60,
    failDate: "2023.11.19",
    status: {
      label: "제안 검토 중",
      badgeClass:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      dotClass: "bg-orange-500",
    },
    actions: [
      { icon: "contact_phone", label: "학부모 연락" },
      { icon: "check_circle", label: "제안 수락" },
      { icon: "visibility", label: "시험 결과 보기" },
    ],
  },
  {
    id: "choi-hyunwoo",
    name: "최현우",
    classLabel: "수학 B반 (기초)",
    initials: "최D",
    badgeClass: "bg-slate-200 text-slate-600",
    examName: "단원평가 (방정식)",
    score: 52,
    cutline: 60,
    failDate: "2023.11.19",
    status: {
      label: "알림 발송 완료",
      badgeClass:
        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
      dotClass: "bg-slate-500",
    },
    actions: [
      { icon: "forward_to_inbox", label: "알림 재발송" },
      { icon: "event_available", label: "일정 수동 배정" },
      { icon: "visibility", label: "시험 결과 보기" },
    ],
  },
];

export const metadata: Metadata = {
  title: "재시험 대상자 관리 - EduTrack",
  description: "기준 점수 미달 학생의 재시험 예약 상태를 관리하는 화면",
};

export default function ExamRemedialTargetsPage() {
  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200"
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex text-sm text-slate-500 dark:text-slate-400"
        >
          <ol className="flex items-center gap-2">
            <li>
              <a className="hover:text-primary" href="/dashboard">
                홈
              </a>
            </li>
            <li>/</li>
            <li>
              <a className="hover:text-primary" href="/exam-dashboard">
                시험 관리
              </a>
            </li>
            <li>/</li>
            <li className="font-medium text-slate-900 dark:text-white">
              재시험 대상자 관리
            </li>
          </ol>
        </nav>

        <AssistantSubNav
          activeHref="/exam-remedial-targets"
          links={examSubNavLinks}
          className="max-w-full"
        />

        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1
              className={cn(
                lexend.className,
                "text-3xl font-black text-slate-900 dark:text-white"
              )}
            >
              재시험 대상자 관리
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              기준 점수 미달 학생들의 재시험 예약 및 현황을 관리합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <span className={iconClass("text-lg")}>download</span>
              명단 다운로드
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90">
              <span className={iconClass("text-lg", true)}>campaign</span>
              알림 일괄 발송
            </button>
          </div>
        </header>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {summaryStats.map((stat) => (
            <article
              key={stat.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className={cn("rounded-lg p-2", stat.iconClass)}>
                  <span
                    className={iconClass(
                      "text-xl",
                      stat.icon === "hourglass_empty"
                    )}
                  >
                    {stat.icon}
                  </span>
                </div>
                <span
                  className={cn(
                    "rounded px-2 py-1 text-xs font-bold",
                    stat.trendClass
                  )}
                >
                  {stat.trend}
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {stat.title}
              </p>
              <p className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {stat.value}
                </span>
                <span className="text-lg font-medium text-slate-400">
                  {stat.suffix}
                </span>
              </p>
            </article>
          ))}
        </section>

        <section className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <FilterSelect label="학급" options={classFilterOptions} />
          <FilterSelect label="시험" options={examFilterOptions} />
          <FilterSelect label="상태" options={statusFilterOptions} />
          <div className="ml-auto flex items-center gap-2">
            <button className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              <span className={iconClass("text-xl")}>filter_list</span>
            </button>
            <button className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              <span className={iconClass("text-xl")}>refresh</span>
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-auto">
            <table className="min-w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                  <th className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-800"
                    />
                  </th>
                  <th className="px-6 py-4">학생 정보</th>
                  <th className="px-6 py-4">미통과 시험명</th>
                  <th className="px-6 py-4">점수 / 컷</th>
                  <th className="px-6 py-4">미통과 일자</th>
                  <th className="px-6 py-4">진행 상태</th>
                  <th className="px-6 py-4 text-right">관리 액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
                {studentRows.map((row) => (
                  <StudentRow key={row.id} row={row} />
                ))}
              </tbody>
            </table>
          </div>
          <footer className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/50">
            <p>
              전체 42명 중{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                1-10
              </span>{" "}
              표시
            </p>
            <div className="flex gap-1">
              <button className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-500 transition hover:bg-white dark:border-slate-700 dark:hover:bg-slate-800">
                <span className={iconClass("text-lg")}>chevron_left</span>
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded bg-primary text-sm font-bold text-white shadow-sm">
                1
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-500 transition hover:bg-white dark:border-slate-700 dark:hover:bg-slate-800">
                2
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-500 transition hover:bg-white dark:border-slate-700 dark:hover:bg-slate-800">
                3
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-500 transition hover:bg-white dark:border-slate-700 dark:hover:bg-slate-800">
                <span className={iconClass("text-lg")}>chevron_right</span>
              </button>
            </div>
          </footer>
        </section>
      </div>
    </div>
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
    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
      {label}:
      <select
        defaultValue={options[0]}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function StudentRow({ row }: { row: StudentRow }) {
  return (
    <tr className="transition hover:bg-slate-50 dark:hover:bg-slate-800/30">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          className="rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-800"
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
              row.badgeClass
            )}
          >
            {row.initials}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {row.name}
            </p>
            <p className="text-xs text-slate-500">{row.classLabel}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
        {row.examName}
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-black text-red-500">{row.score}</span>
        <span className="text-xs text-slate-400"> / {row.cutline}</span>
      </td>
      <td className="px-6 py-4 text-sm text-slate-500">{row.failDate}</td>
      <td className="px-6 py-4">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold",
            row.status.badgeClass
          )}
        >
          <span
            className={cn("h-1.5 w-1.5 rounded-full", row.status.dotClass)}
          />
          {row.status.label}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2">
          {row.actions.map((action) => (
            <button
              key={action.label}
              className="rounded p-1.5 text-slate-400 transition hover:bg-primary/10 hover:text-primary"
              title={action.label}
            >
              <span className={iconClass("text-xl")}>{action.icon}</span>
              <span className="sr-only">{action.label}</span>
            </button>
          ))}
        </div>
      </td>
    </tr>
  );
}
