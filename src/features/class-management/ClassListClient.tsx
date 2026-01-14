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
  navLinks: readonly SubNavLink[];
  activeHref: string;
  breadcrumbs?: readonly { label: string; href?: string }[];
};

const mockExamDrafts = [
  {
    id: "exam-01",
    title: "2025 1학기 중간고사 · 수학 II",
    subject: "수학 II",
    updatedAt: "2025-12-18",
    status: "작성 중",
  },
  {
    id: "exam-02",
    title: "6월 모의평가 대비 실전 테스트",
    subject: "수학 I",
    updatedAt: "2025-12-20",
    status: "검토 요청",
  },
  {
    id: "exam-03",
    title: "단원별 실력 점검 (확률과 통계)",
    subject: "확률과 통계",
    updatedAt: "2025-12-24",
    status: "완료",
  },
];

const mockExamSheets = [
  {
    id: "sheet-01",
    name: "수학 II 기말 대비 문제지",
    updatedAt: "2025-12-21",
    pages: 12,
  },
  {
    id: "sheet-02",
    name: "6월 모의평가 실전 문제지",
    updatedAt: "2025-12-23",
    pages: 8,
  },
  {
    id: "sheet-03",
    name: "수학 I 단원평가 문제지",
    updatedAt: "2025-12-27",
    pages: 10,
  },
];

const mockRegistrationDetails: Record<
  string,
  {
    description: string;
    students: Array<{
      name: string;
      phone: string;
      school: string;
      grade: string;
      parentPhone: string;
    }>;
  }
> = {
  "class-a-2025-01": {
    description: "심화 개념과 실전 문제풀이를 병행하는 상위권 대상 수업입니다.",
    students: [
      {
        name: "김민준",
        phone: "010-1234-5678",
        school: "서울고",
        grade: "고2",
        parentPhone: "010-9876-5432",
      },
      {
        name: "박서연",
        phone: "010-9999-1212",
        school: "서울여고",
        grade: "고2",
        parentPhone: "010-2222-3333",
      },
    ],
  },
  "class-b-2025-01": {
    description: "모의고사 대비 집중 클리닉과 약점 보완 과정을 진행합니다.",
    students: [
      {
        name: "최하나",
        phone: "010-2222-3333",
        school: "대전여고",
        grade: "고3",
        parentPhone: "010-3333-4444",
      },
    ],
  },
  "class-c-2025-01": {
    description: "기초 개념부터 심화까지 단계별 커리큘럼으로 구성합니다.",
    students: [
      {
        name: "문채운",
        phone: "010-5555-6666",
        school: "세종고",
        grade: "고1",
        parentPhone: "010-7777-8888",
      },
    ],
  },
};

export function ClassListClient({
  classRecords,
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
  // upcomingAssessments / waitlist removed per UI request

  return (
    <section className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-[var(--surface-background)] p-4 shadow-sm dark:border-slate-700 dark:bg-[var(--surface-background)] md:grid-cols-2">
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

function ClassList({ records }: { records: ClassRecord[] }) {
  const [detailRecord, setDetailRecord] = useState<ClassRecord | null>(null);

  return (
    <section className="flex flex-col gap-6 pb-10">
      {records.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-[var(--surface-background)] p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-300">
          조건에 맞는 클래스가 없습니다.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {records.map((record) => (
            <PreviewClassCard
              key={record.id}
              record={record}
              onOpenDetail={() => setDetailRecord(record)}
            />
          ))}
        </div>
      )}
      {detailRecord ? (
        <ClassExamDetailModal
          record={detailRecord}
          onClose={() => setDetailRecord(null)}
        />
      ) : null}
    </section>
  );
}

function PreviewClassCard({
  record,
  onOpenDetail,
}: {
  record: ClassRecord;
  onOpenDetail: () => void;
}) {
  const filledLabel = `${record.enrolled}/${record.capacity}`;
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-[var(--surface-background)] shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 dark:border-slate-700 dark:bg-[var(--surface-background)]">
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-[#1c2732] dark:via-[#1f2b38] dark:to-[#121922]">
        <span className="absolute left-3 top-3 rounded bg-white/90 px-2 py-1 text-xs font-bold text-slate-900 shadow-sm dark:bg-black/60 dark:text-white">
          <StatusBadge status={record.status} />
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-primary p-1.5 text-white shadow-lg">
          <span className={iconClass("text-[16px]")}>bookmark</span>
        </span>
      </div>
      <div className="space-y-3 px-4 pb-4 pt-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-primary">
            {record.subject} • {record.level}
          </span>
          <span className="flex items-center gap-1">
            <span className={iconClass("text-[14px]")}>group</span>
            {filledLabel}
          </span>
        </div>
        <div>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            {record.name}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            담당 조교 {record.assistant}
          </p>
        </div>
        <div className="space-y-1 text-sm text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-2">
            <span className={iconClass("text-[16px]")}>schedule</span>
            {record.schedule.days.join(", ")} · {record.schedule.time}
          </span>
          <span className="flex items-center gap-2">
            <span className={iconClass("text-[16px]")}>location_on</span>
            {record.schedule.location}
          </span>
        </div>
        <button
          type="button"
          className="mt-2 w-full rounded-lg bg-slate-100 py-2 text-sm font-bold text-slate-900 transition hover:bg-primary hover:text-white dark:bg-slate-700 dark:text-white"
          onClick={onOpenDetail}
        >
          상세 보기
        </button>
      </div>
    </article>
  );
}

function ClassExamDetailModal({
  record,
  onClose,
}: {
  record: ClassRecord;
  onClose: () => void;
}) {
  const registration =
    mockRegistrationDetails[record.id] ??
    ({
      description: "등록된 수업 상세 설명이 없습니다.",
      students: [],
    } as const);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#1a2632]">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              시험 관리
            </p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {record.name} · 시험 제작/시험지 목록
            </h3>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={onClose}
            aria-label="모달 닫기"
          >
            <span className={iconClass("text-[20px]")}>close</span>
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-[#111418]">
              <h4 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                수업 개설 상세 정보
              </h4>
              <div className="grid gap-3 md:grid-cols-2">
                <DetailItem label="수업명" value={record.name} />
                <DetailItem
                  label="과목 / 학년"
                  value={`${record.subject} · ${record.level}`}
                />
                <DetailItem label="수업 상태" value={record.status} />
                <DetailItem label="개강일" value={record.startDate} />
                <DetailItem label="담당 조교" value={record.assistant} />
                <DetailItem
                  label="정원/등록"
                  value={`${record.enrolled} / ${record.capacity}`}
                />
                <DetailItem
                  label="시간표"
                  value={`${record.schedule.days.join(", ")} · ${
                    record.schedule.time
                  }`}
                />
                <DetailItem label="강의실" value={record.schedule.location} />
              </div>
              <div className="mt-4 rounded-lg border border-dashed border-slate-200 p-3 text-sm text-slate-600 dark:border-slate-600 dark:text-slate-300">
                {registration.description}
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  등록 학생 ({registration.students.length}명)
                </p>
                {registration.students.length === 0 ? (
                  <p className="mt-2 text-xs text-slate-400">
                    등록된 학생이 없습니다.
                  </p>
                ) : (
                  <div className="mt-2 grid gap-2 md:grid-cols-2">
                    {registration.students.map((student) => (
                      <div
                        key={`${record.id}-${student.name}`}
                        className="rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600 dark:border-slate-600 dark:bg-[#0c1219] dark:text-slate-300"
                      >
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {student.name}
                        </p>
                        <p>
                          {student.school} · {student.grade}
                        </p>
                        <p>학생: {student.phone}</p>
                        <p>학부모: {student.parentPhone}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <div className="grid gap-6">
              <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-[#111418]">
                <h4 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                  시험지 목록
                </h4>
                <div className="space-y-3">
                  {mockExamSheets.map((sheet) => (
                    <div
                      key={sheet.id}
                      className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-600 dark:bg-[#0c1219]"
                    >
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {sheet.name}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>수정 {sheet.updatedAt}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                        <span>{sheet.pages}p</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-[#111418]">
                <h4 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                  시험 제작 초안
                </h4>
                <div className="space-y-3">
                  {mockExamDrafts.map((draft) => (
                    <div
                      key={draft.id}
                      className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-600 dark:bg-[#0c1219]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {draft.title}
                        </p>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {draft.status}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>{draft.subject}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                        <span>수정 {draft.updatedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-[#111418]">
                <h4 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                  시험 운영 요약
                </h4>
                <div className="grid gap-3 sm:grid-cols-3">
                  <StatBlock label="정원" value={`${record.capacity}명`} />
                  <StatBlock label="등록" value={`${record.enrolled}명`} />
                  <StatBlock label="대기" value={`${record.waitlist ?? 0}명`} />
                </div>
              </section>

              <div className="grid gap-6 lg:grid-cols-2">
                <AlertCard
                  startDate={record.startDate}
                  alerts={record.alerts}
                />
                <AssessmentCard assessment={record.nextAssessment} />
              </div>

              <WatchStudentTable students={record.watchStudents} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-600 dark:border-slate-600 dark:bg-[#0c1219] dark:text-slate-300">
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
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
