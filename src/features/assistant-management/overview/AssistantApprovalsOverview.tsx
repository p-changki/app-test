"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  stageTabs,
  applicants,
  type StageCategory,
  type Applicant,
} from "@/features/assistant-management/overview/data";
import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

export function AssistantApprovalsOverview() {
  const [activeStage, setActiveStage] = useState<StageCategory>("pending");
  const filteredApplicants = useMemo(
    () => applicants.filter((applicant) => applicant.stage === activeStage),
    [activeStage]
  );

  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-background-light text-slate-900 transition-colors duration-200 dark:bg-background-dark dark:text-slate-100"
      )}
    >
      <div className="flex h-screen w-full overflow-hidden">
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 py-6 md:px-10">
            <div className="mx-auto flex w-full max-w-[1024px] flex-col gap-6 pb-16">
              <PageHeader />
              <StageTabs
                activeStage={activeStage}
                onChangeStage={setActiveStage}
              />
              <ApplicantsSection applicantList={filteredApplicants} />
              <RejectionPanel />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <section className="space-y-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#1a2632]">
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span>설정</span>
        <span className={iconClass("text-xs")}>chevron_right</span>
        <span>사용자 관리</span>
        <span className={iconClass("text-xs")}>chevron_right</span>
        <span className="font-semibold text-primary">조교 승인</span>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            className={cn(
              lexend.className,
              "text-3xl font-bold text-slate-900 dark:text-white"
            )}
          >
            조교 가입 승인
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            승인 대기 중인 조교들의 정보를 확인하고 처리하세요.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="flex w-full gap-2 sm:w-auto">
            <NavButton href="/assistant-management" fullWidth>
              조교 관리
            </NavButton>
            <NavButton href="/assistant-approvals" fullWidth isActive>
              조교 승인
            </NavButton>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700">
              <span className={iconClass("text-base")}>link</span>
              가입 링크 복사
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function StageTabs({
  activeStage,
  onChangeStage,
}: {
  activeStage: StageCategory;
  onChangeStage: (stage: StageCategory) => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#1a2632] sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          신청 현황
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          승인 단계별로 신청서를 필터링할 수 있습니다.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {stageTabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => onChangeStage(tab.stage)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
              activeStage === tab.stage
                ? "bg-primary text-white shadow-sm shadow-blue-200 dark:shadow-none"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            )}
            type="button"
          >
            {tab.label}
            <span className="ml-2 rounded-full bg-white/30 px-1.5 py-0.5 text-[11px]">
              {tab.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ApplicantsSection({ applicantList }: { applicantList: Applicant[] }) {
  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#1a2632]">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
          조교 가입 신청 목록
        </h4>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          정렬
          <select className="rounded-lg border border-slate-200 bg-transparent px-3 py-1.5 text-xs font-semibold text-slate-600 focus:outline-none dark:border-slate-600 dark:text-slate-300">
            <option>최신순</option>
            <option>오래된순</option>
            <option>이름순</option>
          </select>
        </div>
      </div>
      <div className="space-y-6">
        {applicantList.map((applicant) => (
          <ApplicantCard
            key={`${applicant.name}-${applicant.appliedAt}`}
            applicant={applicant}
          />
        ))}
      </div>
    </section>
  );
}

function ApplicantCard({
  applicant,
}: {
  applicant: (typeof applicants)[number];
}) {
  const badgeClass =
    applicant.badgeColor === "amber"
      ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300"
      : applicant.badgeColor === "blue"
        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
        : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300";

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 transition-colors dark:border-slate-700 dark:bg-slate-800/30 md:flex-row md:items-start",
        applicant.highlight &&
          "border-l-4 border-l-red-500 bg-white dark:border-l-red-500 dark:bg-slate-900/40"
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex size-14 items-center justify-center rounded-full text-xl font-bold",
            badgeClass
          )}
        >
          {applicant.name[0]}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h5 className="text-lg font-bold text-slate-900 dark:text-white">
              {applicant.name}
            </h5>
            <span className="rounded-full border border-amber-200 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:border-amber-800 dark:text-amber-300">
              승인 대기
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {applicant.phone} · {applicant.email}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            신청일: {applicant.appliedAt}
          </p>
        </div>
      </div>
      <div className="hidden border-l border-slate-200 dark:border-slate-700 md:block" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoRow label="담당 강사" value={applicant.instructor} />
          <InfoRow label="지원 역할" value={applicant.role} />
        </div>
        <div className="flex gap-2">
          <button className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
            승인
          </button>
          <button className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
            반려
          </button>
        </div>
      </div>
    </article>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-200">
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      <p className="font-medium text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function RejectionPanel() {
  return (
    <section className="rounded-xl border border-slate-200 bg-gradient-to-r from-red-50 to-white p-5 text-sm shadow-sm dark:border-slate-700 dark:from-red-900/30 dark:to-slate-900">
      <div className="flex items-start gap-3">
        <span className={iconClass("text-red-500")}>report</span>
        <div className="space-y-2">
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            반려 처리 가이드
          </h4>
          <ul className="list-disc.pl-5 space-y-1 text-slate-600 dark:text-slate-300">
            <li>반려 시 사유를 입력하면 자동으로 신청자에게 안내됩니다.</li>
            <li>동일 사유 반복 시 해당 역할에 대한 공지를 검토하세요.</li>
            <li>필요 시 조교 팀 리더에게 escalate 할 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function NavButton({
  href,
  children,
  isActive = false,
  fullWidth = false,
}: {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  fullWidth?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition",
        fullWidth && "flex-1",
        isActive
          ? "bg-primary text-white shadow-md shadow-blue-200 dark:shadow-none"
          : "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200.dark:hover:bg-slate-700"
      )}
    >
      {children}
    </Link>
  );
}
