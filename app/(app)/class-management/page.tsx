import type { Metadata } from "next";

import { AssistantSubNav } from "@/components/layout/AssistantSubNav";
import {
  calendarConfig,
  calendarWeekdays,
  classActions,
  classBreadcrumbs,
  classHeaderSummary,
  classNotesPlaceholder,
  quickCards,
  studentSummary,
  students,
  upcomingSessions,
} from "@/features/class-management/data";
import type { StudentRow } from "@/features/class-management/types";
import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

const classSubNavLinks = [
  { label: "수업 관리", href: "/class-management" },
  { label: "수업 개설", href: "/class-registration" },
] as const;

export const metadata: Metadata = {
  title: "강의실 관리 - Academix",
  description: "강의실 운영 현황을 실시간으로 관리하는 화면",
};

export default function ClassManagementPage() {
  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200"
      )}
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-end">
          <AssistantSubNav
            activeHref="/class-management"
            links={classSubNavLinks}
            className="ml-auto"
          />
        </div>
        <ClassHeader />
        <QuickCardGrid />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <StudentsCard />
          </div>
          <div className="flex flex-col gap-6">
            <CalendarCard />
            <UpcomingSessionsCard />
            <NotesCard />
          </div>
        </div>
      </div>
    </div>
  );
}

function ClassHeader() {
  return (
    <section className="rounded-2xl border border-border-dark bg-background-dark text-white shadow-sm">
      <div className="flex flex-col gap-4 px-6 py-5">
        <nav className="flex items-center gap-2 text-sm text-slate-300">
          {classBreadcrumbs.map((crumb, index) => (
            <span key={crumb.label} className="flex items-center gap-2">
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="transition-colors hover:text-white"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="font-medium text-white">{crumb.label}</span>
              )}
              {index < classBreadcrumbs.length - 1 && <span>/</span>}
            </span>
          ))}
        </nav>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h1
              className={cn(
                lexend.className,
                "text-3xl font-bold tracking-tight"
              )}
            >
              {classHeaderSummary.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <span>
                강의 ID:{" "}
                <span className="font-mono text-white">
                  {classHeaderSummary.code}
                </span>
              </span>
              <span className="size-1 rounded-full bg-slate-500" />
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
                {classHeaderSummary.statusLabel}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {classActions.map((action) => (
              <button
                key={action.label}
                type="button"
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors",
                  action.variant === "primary"
                    ? "bg-primary text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20"
                    : "border border-border-dark bg-surface-dark text-white hover:bg-[#323b46]"
                )}
              >
                <span className={iconClass("text-[20px]")}>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickCardGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {quickCards.map((card) => (
        <div
          key={card.id}
          className="relative flex flex-col gap-3 rounded-xl border border-border-dark bg-surface-dark p-5 text-white"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="rounded-lg bg-[#3b4754]/50 p-2">
              <span className={iconClass("text-xl")}>{card.icon}</span>
            </span>
            <div className="flex items-center gap-2">
              {card.highlight && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    card.highlight.variant === "success"
                      ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border border-slate-600 bg-[#111418] text-slate-300"
                  )}
                >
                  {card.highlight.label}
                </span>
              )}
              {card.actionLabel ? (
                <button
                  className="rounded border border-border-dark bg-background-dark px-2 py-1 text-xs font-medium text-slate-300 transition-colors hover:text-white"
                  type="button"
                >
                  {card.actionLabel}
                </button>
              ) : null}
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-300">{card.title}</p>
            <p className="mt-1 text-xl font-bold">{card.value}</p>
            {card.description ? (
              <p className="mt-1 text-xs text-slate-300">{card.description}</p>
            ) : null}
            {card.meta ? (
              <p
                className={cn(
                  "mt-1 text-xs",
                  card.highlight?.variant === "success"
                    ? "text-emerald-400"
                    : "text-slate-300"
                )}
              >
                {card.meta}
              </p>
            ) : null}
            {card.avatars ? (
              <div className="mt-2 flex -space-x-2">
                {card.avatars.map((avatar, index) => (
                  <div
                    key={`${card.id}-${index}`}
                    className="size-8 rounded-full border border-surface-dark bg-cover bg-center"
                    style={{ backgroundImage: `url("${avatar}")` }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function StudentsCard() {
  return (
    <section className="flex flex-col overflow-hidden rounded-xl border border-border-dark bg-surface-dark">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-dark px-5 py-4">
        <div>
          <h3 className="text-lg font-bold text-white">수강생 목록</h3>
          <p className="text-sm text-slate-300">
            {studentSummary.totalLabel} • {studentSummary.attendanceLabel}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <span
              className={cn(
                iconClass(
                  "absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                )
              )}
            >
              search
            </span>
            <input
              type="text"
              className="w-48 rounded-lg border border-border-dark bg-[#111418] py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="학생 검색..."
            />
          </div>
          <button
            type="button"
            className="rounded-lg border border-border-dark bg-[#111418] p-2 text-slate-300 transition hover:bg-[#1a1f26]"
          >
            <span className={iconClass("text-[20px]")}>filter_list</span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-white">
          <thead>
            <tr className="border-b border-border-dark bg-[#1e2329] text-xs uppercase tracking-wider text-slate-400">
              <th className="p-4">이름</th>
              <th className="p-4">상태</th>
              <th className="p-4">출석률</th>
              <th className="p-4">최근 성적</th>
              <th className="p-4 text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-dark">
            {students.map((student) => (
              <StudentRowItem key={student.id} student={student} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-border-dark bg-[#1e2329] px-5 py-3 text-xs text-slate-400">
        {studentSummary.totalLabel} 중 4명 표시
      </div>
    </section>
  );
}

function StudentRowItem({ student }: { student: StudentRow }) {
  return (
    <tr className="group transition-colors hover:bg-[#2c3540]">
      <td className="p-4">
        <div className="flex items-center gap-3">
          {student.avatarUrl ? (
            <div
              className="size-9 rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url("${student.avatarUrl}")` }}
            />
          ) : (
            <div className="flex size-9 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
              {student.initials}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-white">{student.name}</p>
            <p className="text-xs text-slate-400">ID: {student.studentId}</p>
          </div>
        </div>
      </td>
      <td className="p-4">
        <StatusBadge status={student.status} />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 rounded-full bg-[#111418]">
            <div
              className={cn(
                "h-full rounded-full",
                student.attendance >= 95
                  ? "bg-emerald-400"
                  : student.attendance >= 85
                    ? "bg-yellow-400"
                    : "bg-rose-400"
              )}
              style={{ width: `${student.attendance}%` }}
            />
          </div>
          <span className="text-sm font-medium">{student.attendance}%</span>
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-1 text-sm">
          <span className="font-bold">{student.score}</span>
          {student.scoreDelta ? (
            <span
              className={cn(
                "text-xs font-medium",
                student.scoreDelta.direction === "up"
                  ? "text-emerald-400"
                  : student.scoreDelta.direction === "down"
                    ? "text-rose-400"
                    : "text-slate-400"
              )}
            >
              {student.scoreDelta.direction === "up"
                ? `▲ ${student.scoreDelta.value}`
                : student.scoreDelta.direction === "down"
                  ? `▼ ${student.scoreDelta.value}`
                  : "--"}
            </span>
          ) : null}
        </div>
      </td>
      <td className="p-4 text-right">
        <button
          type="button"
          className="rounded p-1 text-slate-400 transition hover:bg-[#3b4754] hover:text-white"
          aria-label="학생 관리 더보기"
        >
          <span className={iconClass("text-[20px]")}>more_vert</span>
        </button>
      </td>
    </tr>
  );
}

function StatusBadge({ status }: { status: StudentRow["status"] }) {
  const baseClasses =
    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border";
  const variantClasses =
    status.variant === "danger"
      ? "border-rose-500/20 bg-rose-500/10 text-rose-400"
      : status.variant === "warning"
        ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
        : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  return (
    <span className={cn(baseClasses, variantClasses)}>{status.label}</span>
  );
}

function CalendarCard() {
  return (
    <section className="rounded-xl border border-border-dark bg-surface-dark p-5 text-white">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold">{calendarConfig.monthLabel}</h3>
        <div className="flex gap-2 text-slate-400">
          <button className="transition hover:text-white" aria-label="이전 달">
            <span className={iconClass("text-sm")}>chevron_left</span>
          </button>
          <button className="transition hover:text-white" aria-label="다음 달">
            <span className={iconClass("text-sm")}>chevron_right</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400">
        {calendarWeekdays.map((day) => (
          <span key={day} className="py-1 font-medium">
            {day}
          </span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1 text-sm">
        {calendarConfig.weeks.flat().map((day, index) => (
          <span
            key={`${day.label}-${index}`}
            className={cn(
              "py-2",
              day.variant === "muted" && "text-[#4b5a6b]",
              day.variant === "default" && "text-white",
              day.variant === "primary" &&
                "rounded-lg bg-primary/20 font-bold text-primary hover:bg-primary/30",
              day.variant === "success" &&
                "relative rounded-lg border border-emerald-500/50 bg-emerald-500/20 font-bold text-emerald-400"
            )}
          >
            {day.label}
            {day.variant === "success" && (
              <span className="absolute -bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-emerald-400" />
            )}
          </span>
        ))}
      </div>
    </section>
  );
}

function UpcomingSessionsCard() {
  return (
    <section className="rounded-xl border border-border-dark bg-surface-dark p-5 text-white">
      <h3 className="mb-4 text-base font-bold">다가오는 수업</h3>
      <div className="relative">
        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-border-dark" />
        <div className="flex flex-col gap-4">
          {upcomingSessions.map((session) => (
            <div key={session.id} className="flex gap-4">
              <div
                className={cn(
                  "size-10 rounded-full border flex items-center justify-center shrink-0",
                  session.accent === "primary"
                    ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                    : "border-border-dark bg-[#111418] text-slate-300"
                )}
              >
                <span className={iconClass("text-[20px]")}>
                  {session.accent === "primary"
                    ? "play_arrow"
                    : "calendar_today"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">{session.timeLabel}</p>
                <p className="text-xs text-slate-400">{session.topic}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="mt-4 text-left text-xs font-medium text-primary hover:underline"
      >
        전체 일정 보기
      </button>
    </section>
  );
}

function NotesCard() {
  return (
    <section className="rounded-xl border border-border-dark bg-surface-dark p-5">
      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
        강사 메모
      </label>
      <textarea
        className="h-24 w-full resize-none rounded-lg border border-border-dark bg-[#111418] p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
        placeholder={classNotesPlaceholder}
      />
    </section>
  );
}
