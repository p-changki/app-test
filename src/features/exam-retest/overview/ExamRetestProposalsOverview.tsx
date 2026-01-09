import Link from "next/link";

import { AssistantSubNav } from "@/components/layout/AssistantSubNav";
import { examSubNavLinks } from "@/constants/examSubNavLinks";
import { RetestAcceptButton } from "@/features/exam-retest/RetestAcceptButton";
import { RetestRejectButton } from "@/features/exam-retest/RetestRejectButton";
import { RetestRescheduleButton } from "@/features/exam-retest/RetestRescheduleButton";
import type { RetestRequest } from "@/features/exam-retest/types";
import {
  retestRequests,
  retestSummaryCards,
} from "@/features/exam-retest/overview/data";
import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

export function ExamRetestProposalsOverview() {
  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-background-light text-slate-900 transition-colors duration-200 dark:bg-background-dark dark:text-white"
      )}
    >
      <div className="flex h-screen flex-col">
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-12">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6">
            <PageIntro />
            <SummaryCards />
            <RequestToolbar />
            <section className="space-y-4">
              {retestRequests.map((request) => (
                <ProposalCard key={request.id} request={request} />
              ))}
            </section>
            <InfoBanner />
          </div>
        </main>
      </div>
    </div>
  );
}

function PageIntro() {
  return (
    <div className="space-y-4">
      <AssistantSubNav
        activeHref="/exam-retest-proposals"
        links={examSubNavLinks}
      />
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Link className="font-medium hover:text-primary" href="/dashboard">
          홈
        </Link>
        <span>/</span>
        <Link className="font-medium hover:text-primary" href="/exam-dashboard">
          시험 관리
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-900 dark:text-white">
          재시험 제안 관리
        </span>
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h2
            className={cn(
              lexend.className,
              "text-3xl font-black leading-tight text-slate-900 dark:text-white md:text-4xl"
            )}
          >
            재시험 제안 관리
          </h2>
          <p className="text-base text-slate-500 dark:text-slate-400">
            학생들이 직접 제안한 재시험 일정을 검토하고 승인하세요. 수락, 거절
            또는 시간 조정을 통해 일정이 확정됩니다.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-border-light bg-surface-light px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-border-dark dark:bg-surface-dark dark:text-slate-200 dark:hover:bg-slate-800">
            <span className={iconClass("text-[18px]")}>history</span>
            처리 내역
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {retestSummaryCards.map((card) => (
        <div
          key={card.label}
          className="flex flex-col gap-2 rounded-xl border border-border-light bg-surface-light p-6 shadow-sm dark:border-border-dark dark:bg-surface-dark"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {card.label}
            </p>
            <span className={cn("rounded-md p-1", card.bg)}>
              <span className={cn(iconClass(), card.color)}>{card.icon}</span>
            </span>
          </div>
          <div className="flex items-end gap-2">
            <p
              className={cn(
                lexend.className,
                "text-3xl font-bold text-slate-900 dark:text-white"
              )}
            >
              {card.value}
            </p>
            <p className={cn("text-sm font-medium", card.color)}>
              {card.helper}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function RequestToolbar() {
  return (
    <div className="flex flex-col gap-3 border-b border-border-light pb-1 dark:border-border-dark md:flex-row md:items-center md:justify-between">
      <div className="flex gap-4 text-sm font-semibold">
        {["대기중 (8)", "처리 완료 (15)", "전체 보기"].map((tab, index) => (
          <button
            key={tab}
            className={cn(
              "px-1 py-3",
              index === 0
                ? "border-b-2 border-primary text-primary"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            )}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <span
            className={cn(
              iconClass(
                "absolute left-2.5 top-1/2 -translate-y-1/2 text-lg text-slate-400"
              )
            )}
          >
            search
          </span>
          <input
            type="text"
            placeholder="이름 또는 과목 검색"
            className="rounded-lg border border-border-light bg-surface-light py-1.5 pl-9 pr-3 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-surface-dark dark:text-slate-200"
          />
        </div>
      </div>
    </div>
  );
}

function ProposalCard({ request }: { request: RetestRequest }) {
  return (
    <article className="rounded-xl border border-border-light bg-surface-light p-5 shadow-sm transition-shadow hover:shadow-md dark:border-border-dark dark:bg-surface-dark">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex gap-3">
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-full text-sm font-bold",
              request.badgeColor
            )}
          >
            {request.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {request.name}
              </h3>
              <span
                className={cn(
                  "inline-flex items-center rounded px-2 py-0.5 text-[10px] font-medium",
                  request.statusColor
                )}
              >
                {request.statusLabel}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {request.classLabel}
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              제안일: {request.proposedAt}
            </p>
          </div>
        </div>
        <div className="hidden border-l border-border-light dark:border-border-dark lg:block" />
        <div className="grid flex-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              제안 과목
            </p>
            <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
              {request.subject}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              희망 재시험 일시
            </p>
            <div className="mt-1 flex items-center gap-2 text-sm font-bold text-primary">
              <span className={iconClass("text-sm")}>event</span>
              {request.preferredTime}
            </div>
          </div>
          <div className="md:col-span-2 rounded-lg border border-border-light bg-background-light p-3 text-sm text-slate-700 dark:border-border-dark dark:bg-background-dark dark:text-slate-200">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              학생 제안 사유
            </p>
            <p className="mt-1 leading-relaxed">
              &ldquo;{request.reason}&rdquo;
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 border-t border-border-light pt-4 dark:border-border-dark lg:w-40 lg:border-t-0 lg:border-l lg:pl-6">
          <RetestAcceptButton request={request} />
          <RetestRescheduleButton request={request} />
          <RetestRejectButton request={request} />
        </div>
      </div>
    </article>
  );
}

function InfoBanner() {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 text-sm text-slate-700 dark:border-blue-900/30 dark:bg-blue-900/20 dark:text-slate-100">
      <div className="flex items-start gap-3">
        <span className={cn(iconClass("text-primary"))}>info</span>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white">
            알림톡 자동 발송 안내
          </h4>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            일정 &lsquo;수락&rsquo;, &lsquo;거절&rsquo; 또는 &lsquo;시간
            조정&rsquo; 시 학생과 학부모에게 알림톡이 자동 발송됩니다. 시간 조정
            제안의 경우 학생이 다시 수락해야 최종 확정됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
