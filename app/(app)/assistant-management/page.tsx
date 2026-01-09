import type { Metadata } from "next";

import { AssistantSubNav } from "@/components/layout/AssistantSubNav";
import { TaskAssignmentModal } from "@/features/assistant-management/TaskAssignmentModal";
import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

const metricCards = [
  { label: "전체 배정 조교", value: "12", delta: "+1명", icon: "groups" },
  { label: "현재 근무 중", value: "5", delta: "42%", icon: "badge" },
  { label: "금주 완료 업무", value: "145", delta: "+12%", icon: "task_alt" },
  { label: "평균 업무 평점", value: "4.8", delta: "/ 5.0", icon: "star" },
];

const filters = ["전체", "수학", "영어", "국어", "과학"];

const assistantSubNavLinks = [
  { label: "조교 관리", href: "/assistant-management" },
  { label: "조교 승인", href: "/assistant-approvals" },
] as const;

const assistants = [
  {
    name: "김민수",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAQWqcQPu9Pg9_ZLmJ4PiJwssyLPMU7XQLQsoehHwN3vWULWxL3Hl4mrSQbRoKu7SEVg2x278nJ8tIgLwsuk_fAiiCbzOREDG0okLdJVvs4v1iP_yNUispUyvHeBxymGaIuVxN2mHUqhGLJrhp1eLmTxWxheC7V2QFZE974NWcTpdh_35bRpKAWa_LqDbfp8LzKZd8jGX6LwK8cxM04DDSKc_2hjFfIyt8ePDRc6t4uCfXa-EQ3HP3U2AavRG0742nTcdXgXjtVzK0",
    subject: "수학",
    phone: "010-1234-5678",
    className: "중2 수학 심화반",
    recentTask: "주간 테스트 채점",
    rating: "4.8",
    status: { label: "근무중", color: "emerald" as const },
  },
  {
    name: "이지은",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB9W9Ja9n7iGVOBmRhOdhg-5Kxr_MVJFfqIrpVa4FowlBYghgs1CdXcPjYTZZXR-tVi4pe1F6hnRPcprseo9O8-gxKGmTtbBlq8qcIaxe8uMGyTCmhQZxVlUOZS4AkmJC2NH0AdHaHXsekJ6DmvG1BATjjZJqCM6EwddDpAihnuYbrK15h6rokpRvF-XBMaZojHt0RYqtAqDovc9CtwGIc3dS8X25sNUxBIKA58OYZV6tU_-bYjA_3a_VrOTres7hbMnKeYMnwgxC8",
    subject: "영어",
    phone: "010-9876-5432",
    className: "고1 영어 내신대비",
    recentTask: "단어 시험 감독",
    rating: "4.5",
    status: { label: "근무중", color: "emerald" as const },
  },
  {
    name: "박성호",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD4B8syryjKyCyoTwaNMqC7eEqw4Wf8HSbCl_hSJok1tIpUAJ3zF9572PI3ddFYpOpm-Nz3DSraheoUpvQUfbt2VLMRljhhTmqWEV6_LO4qYg-cW0hHwsyRgNZpinoNldWHQ48TAMYCPb1JgxYrTWuFufviR9dGoUK4ePZyVadkjpsOX3Ky-o2sVLO2DlqFnXAZial1SnVu4xAAeY1V11Oo093MHHrLGM2SPsLPBhH89POLwu0pNHEom5Oxd0th7HTba1Vd9kTZM3c",
    subject: "과학",
    phone: "010-5555-4444",
    className: "초6 창의과학 실험",
    recentTask: "-",
    rating: "4.9",
    status: { label: "퇴근", color: "slate" as const },
  },
  {
    name: "최유리",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDwSSxhr1raBeMIezBpzMy6orLkPABgbBC23Eed9cLuW12OcA3XgG3qhOw-IvtKFb6uASJd_Y20jD9H0GKkOh4RG5OJRGGnCpRd5gVDVJE0gaQQ5yX-QjKggUOl0L7433anXEOxUFJyhlh_nyrD62IKRYOyhty08wbkO6n0H3EY6jxJson5HcAPdWZnX-C2Z8rQX5N_w7F63yK6_AzoQhTfIre7k9TG4jkp66B9MCV3SJdrpyNO4K8sqvBcdr1elAd7eXeEQN6qDBc",
    subject: "국어",
    phone: "010-1111-2222",
    className: "중3 국어 문법특강",
    recentTask: "학생 상담",
    rating: "4.2",
    status: { label: "휴식", color: "yellow" as const },
  },
  {
    name: "정우성",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDWLs4iLHbIAqLtRpE_Q5ZcVw_6YTdnFBl7K9GUdghYE-6c6T3kizfCqMfjU3nOP6R7OfUK65Z11qkp5IwANCnSAlc7y1jB7-3qQ0Wyndo1m1rvcs0IhZS2qxUrYpAR9ep-IJbMsCFUwcj0PRofFclYndKQezsQMX-npwBXlQ8pFKvHkUWwspslendGu90kT1qynCQlbRp7jdM_4_c7vZa_-ntjUr-78zo5ZkTvpswdaPB-S62xzG4qlJskEN3CUpWCkrfBldUF6E4",
    subject: "과학",
    phone: "010-3333-7777",
    className: "고2 물리 I 개념완성",
    recentTask: "-",
    rating: "4.7",
    status: { label: "퇴근", color: "slate" as const },
  },
];

export const metadata: Metadata = {
  title: "조교 관리 - EduTrack",
  description: "배정된 조교 목록을 조회하고 업무를 배정/평가합니다.",
};

export default function AssistantManagementPage() {
  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200"
      )}
    >
      <div className="flex min-h-screen flex-col">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-3 dark:border-slate-800 dark:bg-[#1c2936]">
          <div className="flex flex-1 flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className={iconClass()}>supervisor_account</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  조교 업무 센터
                </p>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  학원 관리 시스템
                </h2>
              </div>
            </div>
            <AssistantSubNav
              activeHref="/assistant-management"
              links={assistantSubNavLinks}
              className="ml-auto hidden md:flex"
            />
          </div>
          <AssistantSubNav
            activeHref="/assistant-management"
            links={assistantSubNavLinks}
            className="w-full justify-center md:hidden"
          />
          <div className="flex items-center gap-4">
            <button className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              <span className={iconClass("text-xl")}>notifications</span>
            </button>
            <div
              className="size-10 rounded-full border-2 border-slate-200 bg-cover bg-center dark:border-slate-700"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD-oRb4_f0zbRGrU3iWzqxERPckiNnurrFOpy6wh4JPkWyznQsv7wF_E6E1IGUiYyR3_nlJIv6j7CjD2A9paVvQyPHBHFufMWZ9n7me6LKRQROKR3ptW4BZGoAMVWjyc04Pwvneu1V1KPUsuQ5cO8chhuZj7xwv-9fnUAiZUW4w-utlbwMLInbkg2jdsoMV2SALqoWITujeIDpNqXl2ptP5nKinEOWjHglO--2PkkxU__mFYuDpNk7xgIVyU1XwLvnikwYLv09TQ_k')",
              }}
            />
          </div>
        </header>
        <main className="flex flex-1 flex-col px-6 py-6 md:px-10">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-1">
                <h1
                  className={cn(
                    lexend.className,
                    "text-3xl font-black text-slate-900 dark:text-white md:text-4xl"
                  )}
                >
                  조교 관리
                </h1>
                <p className="text-base text-slate-500 dark:text-slate-400">
                  배정된 조교를 조회하고 업무를 배정/평가합니다.
                </p>
              </div>
              <button className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark">
                <span className={iconClass("text-lg")}>person_add</span>
                조교 등록
              </button>
            </div>
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {metricCards.map((card) => (
                <div
                  key={card.label}
                  className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#1c2936]"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {card.label}
                    </p>
                    <span className={iconClass("text-slate-400")}>
                      {card.icon}
                    </span>
                  </div>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                      {card.value}
                    </p>
                    <p className="mb-1 text-sm text-emerald-600 dark:text-emerald-400">
                      {card.delta}
                    </p>
                  </div>
                </div>
              ))}
            </section>

            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#1c2936]">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <span
                    className={iconClass(
                      "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    )}
                  >
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="조교 이름 또는 연락처 검색"
                    className="h-12 w-full rounded-lg border border-slate-300 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div className="flex w-full gap-4 md:w-auto">
                  <SelectField
                    placeholder="담당 과목"
                    options={["수학", "영어", "국어", "과학"]}
                  />
                  <SelectField
                    placeholder="근무 상태"
                    options={["근무중", "휴식", "퇴근"]}
                  />
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {filters.map((filter, index) => (
                  <button
                    key={filter}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                      index === 0
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <section className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#1c2936]">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
                      {[
                        "조교명",
                        "담당 과목",
                        "연락처",
                        "배정 클래스",
                        "최근 업무",
                        "평가",
                        "상태",
                        "관리",
                      ].map((col) => (
                        <th
                          key={col}
                          className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {assistants.map((assistant) => (
                      <tr
                        key={assistant.name}
                        className="group transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="size-8 rounded-full bg-cover bg-center"
                              style={{
                                backgroundImage: `url("${assistant.avatar}")`,
                              }}
                            />
                            <span className="font-bold text-slate-900 transition hover:text-primary dark:text-white dark:hover:text-primary">
                              {assistant.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {assistant.subject}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                          {assistant.phone}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                          {assistant.className}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                          {assistant.recentTask}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-amber-400">
                            <span className={iconClass("text-sm")}>star</span>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {assistant.rating}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                "size-2 rounded-full",
                                statusDot[assistant.status.color]
                              )}
                            />
                            <span
                              className={cn(
                                "text-sm font-medium",
                                statusText[assistant.status.color]
                              )}
                            >
                              {assistant.status.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 transition group-hover:opacity-100">
                            <TaskAssignmentModal
                              assistant={{
                                name: assistant.name,
                                phone: assistant.phone,
                                role: assistant.subject,
                              }}
                              triggerClassName="rounded bg-slate-100 p-1.5 text-slate-400 transition hover:text-primary dark:bg-slate-800"
                              triggerContent={
                                <span className={iconClass("text-lg")}>
                                  assignment_add
                                </span>
                              }
                            />
                            <ActionButton icon="edit" label="상세 정보" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/50">
                <p>
                  총{" "}
                  <span className="font-bold text-slate-900 dark:text-white">
                    12
                  </span>
                  명의 조교 중{" "}
                  <span className="font-bold text-slate-900 dark:text-white">
                    1-5
                  </span>{" "}
                  표시
                </p>
                <div className="flex items-center gap-1">
                  <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white">
                    <span className={iconClass("text-lg")}>chevron_left</span>
                  </button>
                  <button className="flex h-8 min-w-[32px] items-center justify-center rounded-lg bg-primary text-sm font-bold text-white shadow-sm">
                    1
                  </button>
                  <button className="flex h-8 min-w-[32px] items-center justify-center rounded-lg text-sm font-medium text-slate-600 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700">
                    2
                  </button>
                  <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white">
                    <span className={iconClass("text-lg")}>chevron_right</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function SelectField({
  placeholder,
  options,
}: {
  placeholder: string;
  options: string[];
}) {
  return (
    <div className="relative flex-1">
      <select
        defaultValue=""
        className="h-12 w-full rounded-lg border border-slate-300 bg-slate-50 pl-4 pr-10 text-sm text-slate-900 focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <span
        className={iconClass(
          "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        )}
      >
        expand_more
      </span>
    </div>
  );
}

function ActionButton({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="rounded bg-slate-100 p-1.5 text-slate-400 transition hover:text-primary dark:bg-slate-800">
      <span className={iconClass("text-lg")}>{icon}</span>
      <span className="sr-only">{label}</span>
    </button>
  );
}

const statusDot = {
  emerald: "bg-emerald-500",
  yellow: "bg-yellow-500",
  slate: "bg-slate-400",
};

const statusText = {
  emerald: "text-emerald-600 dark:text-emerald-400",
  yellow: "text-yellow-600 dark:text-yellow-400",
  slate: "text-slate-500 dark:text-slate-400",
};
