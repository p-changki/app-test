"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  AssistantSubNav,
  type SubNavLink,
} from "@/components/layout/AssistantSubNav";
import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";
import type {
  Assessment,
  ClassRecord,
  WatchStudent,
} from "@/features/class-management/types";

type ClassListClientProps = {
  classRecords: ClassRecord[];
  levelOptions: readonly string[];
  dayOptions: readonly string[];
  statusOptions: readonly string[];
  navLinks: readonly SubNavLink[];
  activeHref: string;
  breadcrumbs?: readonly { label: string; href?: string }[];
};

export function ClassListClient({
  classRecords,
  levelOptions,
  dayOptions,
  statusOptions,
  navLinks,
  activeHref,
  breadcrumbs = [
    { label: "홈", href: "/dashboard" },
    { label: "시험/과제 관리", href: "/exam-dashboard" },
    { label: "수업 목록" },
  ],
}: ClassListClientProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClasses = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return classRecords.filter((record) => {
      const matchClass =
        selectedClassId === "all" ? true : record.id === selectedClassId;
      if (!matchClass) return false;
      if (!keyword) return true;
      const haystack = [
        record.name,
        record.teacher,
        record.assistant,
        record.subject,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(keyword);
    });
  }, [classRecords, searchTerm, selectedClassId]);

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
            {breadcrumbs.map((crumb, index) => (
              <li key={`${crumb.label}-${index}`}>
                {crumb.href ? (
                  <a className="hover:text-primary" href={crumb.href}>
                    {crumb.label}
                  </a>
                ) : (
                  <span className="font-medium text-slate-900 dark:text-white">
                    {crumb.label}
                  </span>
                )}
                {index < breadcrumbs.length - 1 ? <span>/</span> : null}
              </li>
            ))}
          </ol>
        </nav>
        <AssistantSubNav
          activeHref={activeHref}
          links={navLinks}
          className="mb-6"
        />

        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <h1
              className={cn(
                lexend.className,
                "text-3xl font-black text-slate-900 dark:text-white md:text-4xl"
              )}
            >
              수업 목록 & 편성 현황
            </h1>
            <p className="text-base text-slate-500 dark:text-slate-400">
              진행 중인 클래스와 신규 반 정보를 모아 보고 대기자·후속 조치를
              한눈에 관리하세요.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/schedule-management"
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-[var(--surface-background)] px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-[var(--surface-background)] dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <span className={iconClass("text-[18px]")}>calendar_month</span>
              스케줄 관리로 이동
            </Link>
          </div>
        </header>

        <ClassFilterBar
          classRecords={classRecords}
          selectedClassId={selectedClassId}
          onSelectClass={setSelectedClassId}
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
        />
        <OverviewSummary classRecords={classRecords} />
        <FilterPanel
          levelOptions={levelOptions}
          dayOptions={dayOptions}
          statusOptions={statusOptions}
        />
        <ClassList records={filteredClasses} />
      </main>
    </div>
  );
}

function ClassFilterBar({
  classRecords,
  selectedClassId,
  onSelectClass,
  searchTerm,
  onSearch,
}: {
  classRecords: ClassRecord[];
  selectedClassId: string;
  onSelectClass: (id: string) => void;
  searchTerm: string;
  onSearch: (value: string) => void;
}) {
  return (
    <section className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-[var(--surface-background)] p-4 shadow-sm dark:border-slate-700 dark:bg-[var(--surface-background)] md:flex-row md:items-center md:justify-between">
      <div className="flex w-full flex-col gap-2 md:w-auto">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
          클래스 선택
        </label>
        <select
          value={selectedClassId}
          onChange={(event) => onSelectClass(event.target.value)}
          className="rounded-lg border border-slate-300 bg-[var(--surface-background)] px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[var(--surface-background)] dark:text-white"
        >
          <option value="all">전체 클래스</option>
          {classRecords.map((record) => (
            <option key={record.id} value={record.id}>
              {record.name} · {record.teacher}
            </option>
          ))}
        </select>
      </div>
      <div className="flex w-full flex-col gap-2 md:w-72">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
          검색
        </label>
        <div className="relative">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="수업명 / 강사 / 과목 검색"
            className="w-full rounded-lg border border-slate-300 bg-[var(--surface-background)] py-2.5 pl-10 pr-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[var(--surface-background)] dark:text-white"
          />
          <span
            className={iconClass(
              "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            )}
          >
            search
          </span>
        </div>
      </div>
    </section>
  );
}

function OverviewSummary({ classRecords }: { classRecords: ClassRecord[] }) {
  const totalClasses = classRecords.length;
  const totalEnrolled = classRecords.reduce(
    (sum, record) => sum + record.enrolled,
    0
  );
  const totalCapacity = classRecords.reduce(
    (sum, record) => sum + record.capacity,
    0
  );
  const fillRate =
    totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;
  const upcomingAssessments = classRecords.filter(
    (record) => record.nextAssessment.date <= "2025-01-20"
  ).length;
  const waitlist = classRecords.reduce(
    (sum, record) => sum + (record.waitlist ?? 0),
    0
  );

  return (
    <section className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-[var(--surface-background)] p-4 shadow-sm dark:border-slate-700 dark:bg-[var(--surface-background)] md:grid-cols-4">
      <SummaryCard
        icon="class"
        label="총 클래스"
        value={`${totalClasses}개`}
        description="캠퍼스 전체"
      />
      <SummaryCard
        icon="groups"
        label="등록 인원"
        value={`${totalEnrolled}명`}
        description={`정원 대비 ${fillRate}%`}
      />
      <SummaryCard
        icon="rule"
        label="다가오는 평가"
        value={`${upcomingAssessments}건`}
        description="1주 이내"
      />
      <SummaryCard
        icon="hourglass_top"
        label="대기 인원"
        value={`${waitlist}명`}
        description="추가 개설 검토"
        status="alert"
      />
    </section>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  description,
  status,
}: {
  icon: string;
  label: string;
  value: string;
  description: string;
  status?: "alert";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-100 bg-[var(--surface-background)] p-4 text-slate-700 dark:border-slate-600 dark:bg-[var(--surface-background)] dark:text-slate-200",
        status === "alert" &&
          "border-amber-200 bg-amber-50/80 dark:bg-amber-500/10"
      )}
    >
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <span className={iconClass("text-base text-primary")}>{icon}</span>
        {label}
      </div>
      <p className="text-2xl font-black text-slate-900 dark:text-white">
        {value}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

function FilterPanel({
  levelOptions,
  dayOptions,
  statusOptions,
}: {
  levelOptions: readonly string[];
  dayOptions: readonly string[];
  statusOptions: readonly string[];
}) {
  return (
    <section className="mb-6 rounded-xl border border-slate-200 bg-[var(--surface-background)] p-5 shadow-sm dark:border-slate-700 dark:bg-[var(--surface-background)]">
      <div className="grid gap-4 md:grid-cols-4">
        <FilterSelect label="학년 구분" options={levelOptions} />
        <FilterSelect label="요일" options={dayOptions} />
        <FilterSelect label="상태" options={statusOptions} />
        <FilterSearch label="강사 검색" placeholder="강사 / 조교 이름" />
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

function FilterSearch({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <div className="relative">
        <input
          type="search"
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-200 bg-[var(--surface-background)] py-2.5 pl-10 pr-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[var(--surface-background)] dark:text-white"
        />
        <span
          className={iconClass(
            "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          )}
        >
          search
        </span>
      </div>
    </label>
  );
}

function ClassList({ records }: { records: ClassRecord[] }) {
  return (
    <section className="flex flex-col gap-6 pb-10">
      {records.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-[var(--surface-background)] p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-300">
          조건에 맞는 클래스가 없습니다.
        </div>
      ) : (
        records.map((record) => <ClassCard key={record.id} record={record} />)
      )}
    </section>
  );
}

function ClassCard({ record }: { record: ClassRecord }) {
  const fillRate = Math.round((record.enrolled / record.capacity) * 100);
  return (
    <article className="rounded-3xl border border-slate-200 bg-[var(--surface-background)] shadow-lg shadow-slate-200/40 dark:border-slate-700 dark:bg-[var(--surface-background)]">
      <header className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 dark:border-slate-700 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {record.level} · {record.subject}
          </p>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {record.name}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            담당 {record.teacher} · 조교 {record.assistant}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 text-sm lg:items-end">
          <StatusBadge status={record.status} />
          <div className="flex flex-wrap gap-2">
            {(record.focusTags ?? []).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>
      <div className="space-y-6 px-6 py-6">
        <div className="grid gap-4 rounded-2xl border border-slate-100 bg-[var(--surface-background)] p-4 dark:border-slate-700 dark:bg-[var(--surface-background)] md:grid-cols-4">
          <StatBlock
            label="수업 요일"
            value={record.schedule.days.join(", ")}
          />
          <StatBlock label="시간" value={record.schedule.time} />
          <StatBlock label="장소" value={record.schedule.location} />
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>정원 / 등록</span>
              <span>
                {record.enrolled} / {record.capacity}
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${fillRate}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              대기 {record.waitlist ?? 0}명
            </p>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <AlertCard
            startDate={record.startDate}
            alerts={record.alerts ?? []}
          />
          <AssessmentCard assessment={record.nextAssessment} />
        </div>
        <WatchStudentTable students={record.watchStudents ?? []} />
      </div>
      <footer className="flex flex-wrap items-center gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-700">
        <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">
          <span className={iconClass("text-[18px]")}>edit_calendar</span>
          일정 조정
        </button>
        <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">
          <span className={iconClass("text-[18px]")}>group_add</span>
          대기자 관리
        </button>
        <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">
          마지막 업데이트 · 오늘 14:30
        </span>
      </footer>
    </article>
  );
}

function StatusBadge({ status }: { status: ClassRecord["status"] }) {
  const style =
    status === "신규 개설"
      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      : status === "진행 중"
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
  const icon =
    status === "신규 개설"
      ? "sparkles"
      : status === "진행 중"
        ? "task_alt"
        : "priority_high";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
        style
      )}
    >
      <span className={iconClass("text-sm")}>{icon}</span>
      {status}
    </span>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--surface-background)] p-3 text-sm shadow-sm dark:bg-[var(--surface-background)]">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="text-lg font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function AlertCard({
  startDate,
  alerts,
}: {
  startDate: string;
  alerts?: string[];
}) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-[var(--surface-background)] p-5 shadow-sm dark:border-slate-700 dark:bg-[var(--surface-background)]">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
        <span className={iconClass("text-base text-primary")}>
          notifications
        </span>
        주요 알림
      </h3>
      <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
        개강일 {startDate}
      </p>
      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
        {(alerts ?? []).map((alert) => (
          <li
            key={alert}
            className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60"
          >
            <span className="mt-1 size-1.5 rounded-full bg-primary" />
            <span>{alert}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function AssessmentCard({ assessment }: { assessment: Assessment }) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-[var(--surface-background)] p-5 shadow-sm dark:border-slate-700 dark:bg-[var(--surface-background)]">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
        <span className={iconClass("text-base text-primary")}>event</span>
        다가오는 평가
      </h3>
      <p className="text-2xl font-black text-primary">{assessment.date}</p>
      <p className="text-sm font-semibold text-slate-900 dark:text-white">
        {assessment.title}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        유형: {assessment.type}
      </p>
    </section>
  );
}

function WatchStudentTable({ students = [] }: { students?: WatchStudent[] }) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-[var(--surface-background)] p-5 shadow-sm dark:border-slate-700 dark:bg-[var(--surface-background)]">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
        <span className={iconClass("text-base text-primary")}>
          person_search
        </span>
        모니터링 학생
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <tr>
              <th className="pb-2">학생</th>
              <th className="pb-2">이슈</th>
              <th className="pb-2">상태</th>
              <th className="pb-2 text-right">최근 점수</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {students.map((student) => (
              <tr key={student.name}>
                <td className="py-2 font-semibold text-slate-900 dark:text-white">
                  {student.name}
                </td>
                <td className="py-2 text-slate-600 dark:text-slate-300">
                  {student.issue}
                </td>
                <td className="py-2">
                  <StatusChip status={student.status} />
                </td>
                <td className="py-2 text-right font-semibold text-slate-900 dark:text-white">
                  {student.lastScore}점
                  <TrendIcon trend={student.trend} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function StatusChip({ status }: { status: WatchStudent["status"] }) {
  const map: Record<
    WatchStudent["status"],
    { label: string; className: string }
  > = {
    attendance: {
      label: "출결",
      className:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    },
    grade: {
      label: "성적",
      className:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    },
    behavior: {
      label: "생활",
      className:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    },
  };
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-[11px] font-semibold",
        map[status].className
      )}
    >
      {map[status].label}
    </span>
  );
}

function TrendIcon({ trend }: { trend: WatchStudent["trend"] }) {
  const icon =
    trend === "up"
      ? "trending_up"
      : trend === "down"
        ? "trending_down"
        : "drag_handle";
  const color =
    trend === "up"
      ? "text-emerald-500"
      : trend === "down"
        ? "text-rose-500"
        : "text-slate-400";
  return (
    <span className={cn(iconClass("text-base align-middle ml-1"), color)}>
      {icon}
    </span>
  );
}
