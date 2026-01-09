import Link from "next/link";

import { AssistantSubNav } from "@/components/layout/AssistantSubNav";
import { examSubNavLinks } from "@/constants/examSubNavLinks";
import { RemedialHeaderActions } from "@/features/exam-remedial-targets/RemedialHeaderActions";
import { RemedialSummaryStats } from "@/features/exam-remedial-targets/RemedialSummaryStats";
import { RemedialTargetsClient } from "@/features/exam-remedial-targets/RemedialTargetsClient";
import {
  classFilterOptions,
  examFilterOptions,
  remedialStudents,
  remedialSummaryStats,
  statusFilterOptions,
  todayRetestStudents,
  unscheduledStudents,
} from "@/data/exams";
import { lexend, notoSansKr } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export function RemedialTargetsOverview() {
  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200"
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumbs />
        <AssistantSubNav
          activeHref="/exam-remedial-targets"
          links={examSubNavLinks}
          className="max-w-full"
        />
        <PageHeader />
        <RemedialSummaryStats
          stats={remedialSummaryStats}
          todayList={todayRetestStudents}
          unscheduledList={unscheduledStudents}
        />
        <RemedialTargetsClient
          classOptions={classFilterOptions}
          examOptions={examFilterOptions}
          statusOptions={statusFilterOptions}
          students={remedialStudents}
        />
      </div>
    </div>
  );
}

function Breadcrumbs() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex text-sm text-slate-500 dark:text-slate-400"
    >
      <ol className="flex items-center gap-2">
        <li>
          <Link className="hover:text-primary" href="/dashboard">
            홈
          </Link>
        </li>
        <li>/</li>
        <li>
          <Link className="hover:text-primary" href="/exam-dashboard">
            시험 관리
          </Link>
        </li>
        <li>/</li>
        <li className="font-medium text-slate-900 dark:text-white">
          재시험 대상자 관리
        </li>
      </ol>
    </nav>
  );
}

function PageHeader() {
  return (
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
      <RemedialHeaderActions />
    </header>
  );
}
