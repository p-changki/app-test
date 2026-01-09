import type { Metadata } from "next";

import { AssistantSubNav } from "@/components/layout/AssistantSubNav";
import { examSubNavLinks } from "@/constants/examSubNavLinks";
import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

const stats = [
  {
    title: "채점 대기",
    value: "12",
    subtitle: "어제 대비 +3건",
    icon: "pending_actions",
    accentClass:
      "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
  },
  {
    title: "미통과/과락",
    value: "7",
    subtitle: "기준 점수 미달",
    variant: "critical",
  },
  {
    title: "평균 점수",
    value: "83.5",
    subtitle: "반 평균",
    icon: "analytics",
    accentClass:
      "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  },
  {
    title: "미제출",
    value: "4",
    subtitle: "조치 필요",
    icon: "warning",
    accentClass:
      "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400",
  },
];

const flaggedAssignments = [
  {
    id: "kim-minji",
    student: "김민지",
    assignment: "중간고사 수학 복습",
    scoreLabel: "45점 / 100점 (탈락)",
    timestamp: "2시간 전",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB-L5f1_DZ6tV7hATrR8Kjz-_ptOs-IDispvH5kLcpnDEOOwVOD5zN15O2hori-1qfW1c7rCadZpxcZgEmZmZRtMpdPj4ylKwiT0kpWK9fs_YWoSjnz4NCTDUOH_kdTrOaIPE1RtBf2srj0SQEsspnEdM_3oyYzNRlCbYrKCUPd35JqafcW5SDLphjJjRyBWump3kmZYi2qy4PWKbagmawFIw337MI4lnapoHBCX4jNCdv0fM7W5RRh-Wr9DNKqOZxolmHh7EHqAog",
    primaryAction: {
      label: "재시험 배정",
      icon: "restart_alt",
      variant: "primary",
    },
    secondaryIcon: "chat",
  },
  {
    id: "lee-junho",
    student: "이준호",
    assignment: "어휘 퀴즈 3",
    scoreLabel: "8점 / 20점 (부족)",
    timestamp: "5시간 전",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBIgS_bql83QxEK5omeza4pEBa8WRsZHgRSTfDPHWRP-W1t_RqfCDh0xTf1_GiPrYIzF_AMxspsUBNCYFWvyWkHF20-QAY1Tw8chDj42SmIImb0qyK4Y0B8zGjCD3ez2suPHSz03K6Dz0vFox3Im_HcnYGyNqL3XGomMUb90ZSWp9LuothegJrG-PorxWekAtUvLR8iM-Fzj6zvaxPz9t9-mfrRx2bJbRC_3joNulAM6IKlvU77Gft__BXf3YRle7xTob-Qa-WyFXs",
    primaryAction: {
      label: "보충 학습 지시",
      icon: "library_books",
      variant: "secondary",
    },
    secondaryIcon: "chat",
  },
  {
    id: "park-seoyeon",
    student: "박서연",
    assignment: "물리 실험 보고서",
    scoreLabel: "D 등급 (재작성)",
    timestamp: "1일 전",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCDeKPU5D_FbOsU2xcYz1ZGLwcHkHchHnvJP3yDjT9SGYBoIkVGj5M67d1R_hL2JveWDMVeKHpiUQbUvLLl7ihCdxhj0x-azh2oHSwzqtAuaHCUdR26U0KgXBB_yPDUG-nVBDiqqWv8EBcjNNEzNbj17Dh_6UzcZGhnkqwW7f9NQG4a1OrRjomSM_y29jBh-aRrC7FpUGEcw0tThh0KhfFCKJ30ZH0ybZQimCjjj8It94U4lZ2eEp7Q4vEtNbaAsVqydHAvTs_PYbY",
    primaryAction: { label: "면담 예약", icon: "event", variant: "ghost" },
    secondaryIcon: "send",
  },
];

const tableFilters = ["진행 중", "임시 저장", "채점 완료"];

const assignmentRows = [
  {
    id: "math-midterm",
    title: "중간고사 수학 복습",
    subtitle: "미적분 4-6장",
    icon: "calculate",
    iconClass:
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    classLabel: "고등 수학 A",
    dueDate: "2023. 10. 24",
    submitted: "25/30",
    progress: 83,
    status: {
      label: "진행 중",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    primaryAction: { label: "채점하기", variant: "primary" },
  },
  {
    id: "english-quiz",
    title: "어휘 퀴즈 3",
    subtitle: "영어 기초",
    icon: "menu_book",
    iconClass:
      "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
    classLabel: "영어 101",
    dueDate: "2023. 10. 25",
    submitted: "0/20",
    progress: 0,
    status: {
      label: "게시됨",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    },
    primaryAction: { label: "상세보기", variant: "muted" },
  },
  {
    id: "physics-report",
    title: "물리 실험 보고서",
    subtitle: "운동과 힘",
    icon: "science",
    iconClass:
      "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    classLabel: "과학 B",
    dueDate: "2023. 10. 20",
    submitted: "28/28",
    progress: 100,
    status: {
      label: "마감됨",
      color:
        "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400",
    },
    primaryAction: { label: "검토", variant: "primary" },
  },
  {
    id: "history-essay",
    title: "역사 에세이",
    subtitle: "산업 혁명",
    icon: "history_edu",
    iconClass:
      "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
    classLabel: "역사 101",
    dueDate: "2023. 11. 01",
    submitted: "초안",
    progress: 0,
    status: {
      label: "임시 저장",
      color:
        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    },
    primaryAction: { label: "수정", variant: "primary" },
  },
];

export const metadata: Metadata = {
  title: "시험 및 과제 관리 - EduTrack",
  description: "시험과 과제 현황을 점검하고 채점/재시험을 관리합니다.",
};

export default function ExamDashboardPage() {
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
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-white shadow-sm shadow-primary/30 transition hover:bg-[#1a6bbd]"
          >
            <span className={iconClass("text-lg")}>add</span>새 과제 만들기
          </button>
        </header>
        <div className="flex justify-end">
          <AssistantSubNav
            activeHref="/exam-dashboard"
            links={examSubNavLinks}
            className="ml-auto"
          />
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatsCard key={stat.title} stat={stat} />
          ))}
        </section>

        <FlaggedAssignments />

        <AssignmentsTable />
      </div>
    </div>
  );
}

function StatsCard({ stat }: { stat: (typeof stats)[number] }) {
  if (stat.variant === "critical") {
    return (
      <div className="relative overflow-hidden rounded-xl border border-rose-200 bg-rose-50 p-6 shadow-md dark:border-rose-900/50 dark:bg-rose-900/10">
        <div className="absolute -right-4 -top-4 text-rose-200 opacity-40 dark:text-rose-800">
          <span className={iconClass("text-[100px]")}>cancel</span>
        </div>
        <div className="relative z-10">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold text-rose-700 dark:text-rose-300">
              {stat.title}
            </p>
            <span className="rounded-md bg-rose-200 p-1.5 text-rose-700 dark:bg-rose-500/40 dark:text-rose-200">
              <span className={iconClass("text-lg")}>priority_high</span>
            </span>
          </div>
          <div className="mb-1 flex items-end gap-2">
            <p className="text-3xl font-bold text-rose-700 dark:text-rose-300">
              {stat.value}
            </p>
            <p className="mb-1 text-xs font-medium text-rose-600 dark:text-rose-400">
              {stat.subtitle}
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              className="rounded bg-white py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 dark:bg-surface-dark dark:text-rose-300"
            >
              목록 보기
            </button>
            <button
              type="button"
              className="rounded bg-rose-600 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700"
            >
              재시험 배정
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-surface-dark">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {stat.title}
          </p>
          {stat.icon && (
            <span className={cn("rounded-md p-1.5", stat.accentClass)}>
              <span className={iconClass("text-lg")}>{stat.icon}</span>
            </span>
          )}
        </div>
        <p
          className={cn(
            "text-3xl font-bold",
            stat.title === "평균 점수" ? lexend.className : undefined
          )}
        >
          {stat.value}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {stat.subtitle}
        </p>
      </div>
    </div>
  );
}

function FlaggedAssignments() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          <span className={cn(iconClass("text-rose-500"))}>error</span>
          확인 필요: 미통과 과제/시험
        </h3>
        <a
          href="#"
          className="flex items-center gap-1 text-sm text-slate-500 transition hover:text-primary dark:text-slate-400"
        >
          전체 보기 <span className={iconClass("text-sm")}>arrow_forward</span>
        </a>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {flaggedAssignments.map((assignment) => (
          <div
            key={assignment.id}
            className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-rose-900/50 dark:bg-surface-dark"
          >
            <div className="flex items-start gap-3">
              <div
                className="size-12 shrink-0 rounded-full border border-slate-100 bg-cover bg-center dark:border-slate-700"
                style={{ backgroundImage: `url("${assignment.avatar}")` }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between">
                  <p className="truncate text-base font-bold text-slate-900 dark:text-white">
                    {assignment.student}
                  </p>
                  <span className="rounded px-1.5 py-0.5 text-xs text-slate-400">
                    {assignment.timestamp}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">
                  {assignment.assignment}
                </p>
                <span className="mt-2 inline-block rounded border border-rose-100 bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-600 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400">
                  {assignment.scoreLabel}
                </span>
              </div>
            </div>
            <div className="flex gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <button
                type="button"
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition",
                  assignment.primaryAction.variant === "primary"
                    ? "bg-rose-600 text-white hover:bg-rose-700"
                    : assignment.primaryAction.variant === "secondary"
                      ? "border border-rose-200 bg-white text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:bg-surface-dark dark:text-rose-300 dark:hover:bg-slate-800"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-surface-dark dark:text-slate-300"
                )}
              >
                <span className={iconClass("text-lg")}>
                  {assignment.primaryAction.icon}
                </span>
                {assignment.primaryAction.label}
              </button>
              <button
                type="button"
                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <span className={iconClass()}>{assignment.secondaryIcon}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AssignmentsTable() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-fit rounded-lg bg-slate-200 p-1 dark:bg-slate-800">
          {tableFilters.map((filter, index) => (
            <button
              key={filter}
              type="button"
              className={cn(
                "rounded-md px-4 py-1.5 text-sm font-medium transition",
                index === 0
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
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
              className="block w-full rounded-lg border-none bg-white py-2 pl-10 pr-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-surface-dark dark:text-white"
            />
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-surface-dark dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span className={iconClass("text-lg")}>filter_list</span>
            필터
          </button>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-surface-dark">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  과제명
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  반
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  마감일
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  제출률
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
              {assignmentRows.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
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
                    <SubmissionProgress
                      submitted={row.submitted}
                      progress={row.progress}
                    />
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
                    <button
                      type="button"
                      className="rounded p-1 text-slate-400 transition hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      <span className={iconClass("text-xl")}>more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
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
              className="rounded border border-slate-300 bg-white px-3 py-1 text-sm text-slate-500 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
            >
              이전
            </button>
            <button
              type="button"
              className="rounded border border-slate-300 bg-white px-3 py-1 text-sm text-slate-500 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SubmissionProgress({
  submitted,
  progress,
}: {
  submitted: string;
  progress: number;
}) {
  return (
    <div className="w-full max-w-[160px]">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-slate-600 dark:text-slate-400">{submitted}</span>
        <span
          className={cn(
            progress === 100
              ? "text-green-600"
              : progress === 0
                ? "text-slate-400"
                : "text-primary",
            "font-medium"
          )}
        >
          {progress}%
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={cn(
            "h-1.5 rounded-full",
            progress === 100
              ? "bg-green-500"
              : progress === 0
                ? "bg-slate-300 dark:bg-slate-600"
                : "bg-primary"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
