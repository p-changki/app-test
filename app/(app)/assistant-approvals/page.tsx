import type { Metadata } from "next";

import { AssistantSubNav } from "@/components/layout/AssistantSubNav";
import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

const stageTabs = [
  { label: "승인 대기", count: 3, active: true },
  { label: "승인 완료", count: 8 },
  { label: "반려됨", count: 2 },
];

const applicants = [
  {
    name: "박지훈",
    phone: "010-1234-5678",
    email: "pjh@example.com",
    appliedAt: "2024. 06. 20 14:30",
    instructor: "김민수 선생님",
    role: "중등 수학 보조",
    badgeColor: "amber",
  },
  {
    name: "최수민",
    phone: "010-9876-5432",
    email: "soomin@example.com",
    appliedAt: "2024. 06. 19 09:15",
    instructor: "이서연 선생님",
    role: "고등 영어 채점",
    badgeColor: "blue",
    highlight: true,
  },
  {
    name: "김태희",
    phone: "010-5555-7777",
    email: "taehee@example.com",
    appliedAt: "2024. 06. 18 10:20",
    instructor: "박준형 선생님",
    role: "초등 과학 실험",
    badgeColor: "emerald",
  },
];

export const metadata: Metadata = {
  title: "조교 관리 - 승인 대기",
  description: "승인 대기 중인 조교 가입 신청을 검토하고 처리하는 화면",
};

export default function AssistantApprovalsPage() {
  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-background-light text-slate-900 transition-colors duration-200 dark:bg-background-dark dark:text-slate-100"
      )}
    >
      <div className="flex h-screen w-full overflow-hidden">
        <main className="flex flex-1 flex-col overflow-hidden">
          <TopNav />
          <div className="flex-1 overflow-y-auto px-4 py-6 md:px-10">
            <div className="mx-auto flex w-full max-w-[1024px] flex-col gap-6 pb-16">
              <PageHeader />
              <StageTabs />
              <ApplicantsSection />
              <RejectionPanel />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function TopNav() {
  return (
    <header className="flex h-16 flex-none items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm dark:border-slate-700 dark:bg-[#1a2632]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 text-slate-900 dark:text-white">
          <div className="size-8 text-primary">
            <span className={iconClass("text-[28px]")}>school</span>
          </div>
          <h1
            className={cn(lexend.className, "text-lg font-bold leading-tight")}
          >
            학원 통합 관리
          </h1>
        </div>
        <AssistantSubNav
          activeHref="/assistant-approvals"
          className="hidden lg:flex"
        />
      </div>
      <div className="flex items-center gap-3">
        <button className="flex size-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">
          <span className={iconClass()}>search</span>
        </button>
        <button className="relative flex size-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">
          <span className={iconClass()}>notifications</span>
          <span className="absolute top-2 right-2 size-2 rounded-full border-2 border-white bg-red-500 dark:border-[#1a2632]"></span>
        </button>
        <div
          className="size-10 rounded-full border border-slate-200 bg-cover bg-center dark:border-slate-700"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAiYj2Q2dYiHmBXAqAthqjU2DIYy-9FbB0xrb013VhvirMVUQIdIKv3CEp2CMjSPdwGLQvK7SmsjCX7qUNqK5RpLYpG47TYNW1ByQE0McUMEF3NLXuEx16t49WRQDtijWCf8cGmnMCAKIXJf4qs9ryRjUqAI3kYiIJmJGA1K2XUgkzM464-oCQnvjjK81k148cX8u3I82egcx5cmRPzlv2tsDR_s_E2h3y81zVsi2C9OC5xB3EnuMVco87Lf3-a14VfnETgyhFaofA')",
          }}
        />
      </div>
    </header>
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
        <div className="flex gap-2">
          <button className="hidden items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 sm:flex">
            <span className={iconClass("text-base")}>download</span>
            엑셀 다운로드
          </button>
          <button className="hidden items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 sm:flex">
            <span className={iconClass("text-base")}>link</span>
            가입 링크 복사
          </button>
        </div>
      </div>
    </section>
  );
}

function StageTabs() {
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
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
              tab.active
                ? "bg-primary text-white shadow-sm shadow-blue-200 dark:shadow-none"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            )}
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

function ApplicantsSection() {
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
        {applicants.map((applicant) => (
          <article
            key={applicant.name}
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
                  applicant.badgeColor === "amber" &&
                    "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300",
                  applicant.badgeColor === "blue" &&
                    "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300",
                  applicant.badgeColor === "emerald" &&
                    "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"
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
                <div className="mt-1 flex flex-col gap-1 text-sm text-slate-500 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className={iconClass("text-[18px] text-slate-400")}>
                      call
                    </span>
                    {applicant.phone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className={iconClass("text-[18px] text-slate-400")}>
                      mail
                    </span>
                    {applicant.email}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#0f172a]">
              <div className="grid gap-4 text-sm text-slate-600 dark:text-slate-200 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    지정 강사
                  </p>
                  <p className="mt-1 font-semibold">{applicant.instructor}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    지원 역할
                  </p>
                  <p className="mt-1 font-semibold">{applicant.role}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    신청일
                  </p>
                  <p className="mt-1 font-semibold">{applicant.appliedAt}</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-end gap-3">
                <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700">
                  <span className={iconClass("text-base")}>close</span>
                  반려
                </button>
                <button className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-600 dark:shadow-none">
                  <span className={iconClass("text-base", true)}>check</span>
                  승인
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function RejectionPanel() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#1a2632]">
      <div className="mb-3 flex items-center gap-3">
        <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/30">
          <span className={iconClass("text-red-500")}>report_problem</span>
        </div>
        <div>
          <h5 className="text-base font-bold text-slate-900 dark:text-white">
            반려 사유 작성
          </h5>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            반려 시 이유를 반드시 입력해 주세요. 입력된 내용은 조교에게 알림으로
            전송됩니다.
          </p>
        </div>
      </div>
      <textarea
        className="h-32 w-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        placeholder="예: 제출 자료 불일치로 인한 반려 처리"
      />
      <div className="mt-4 flex justify-end gap-3">
        <button className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
          취소
        </button>
        <button className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600">
          반려 확정
        </button>
      </div>
    </section>
  );
}
