"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { classEntities } from "@/data/classes";
import {
  CourseEnrollmentModal,
  EnrollmentConfirmModal,
} from "@/features/student-profile/components/CourseEnrollmentModals";
import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

type HighlightCard = {
  label: string;
  value: string;
  icon: string;
  accent: string;
  meta?: ReactNode;
  actionLabel?: string;
  href?: string;
};

type ExamResult = {
  subject: string;
  icon: string;
  iconClasses: string;
  examName: string;
  date: string;
  score: number;
  status: "통과" | "평균";
};

const performanceTrend = [
  { month: "3월", score: 70 },
  { month: "4월", score: 85 },
  { month: "5월", score: 60 },
  { month: "6월", score: 90 },
  { month: "7월", score: 80 },
  { month: "8월", score: 65 },
];

const examResults: ExamResult[] = [
  {
    subject: "수학",
    icon: "calculate",
    iconClasses: "bg-red-50 dark:bg-red-900/20 text-red-500",
    examName: "대수학 중간고사",
    date: "2023. 10. 12",
    score: 92,
    status: "통과",
  },
  {
    subject: "영어",
    icon: "translate",
    iconClasses: "bg-blue-50 dark:bg-blue-900/20 text-blue-500",
    examName: "단어 쪽지시험",
    date: "2023. 10. 10",
    score: 85,
    status: "통과",
  },
  {
    subject: "과학",
    icon: "science",
    iconClasses: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500",
    examName: "물리 실험 보고서",
    date: "2023. 10. 08",
    score: 78,
    status: "평균",
  },
];

const attendanceSummary = {
  rate: 95,
  present: 57,
  absent: 1,
  tardy: 2,
};

const highlightCards: HighlightCard[] = [
  {
    label: "재시험 필요",
    value: "1과목",
    icon: "event_busy",
    accent: "text-red-500 bg-red-50 dark:bg-red-900/20",
    actionLabel: "예약하기",
  },
  {
    label: "수학 석차",
    value: "상위 10%",
    icon: "bar_chart",
    accent: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
    meta: (
      <span className="flex items-center text-xs font-bold text-emerald-500">
        <span className={iconClass("mr-0.5 text-xs")}>trending_up</span> 2.5%
      </span>
    ),
  },
  {
    label: "평균 점수",
    value: "88.5점",
    icon: "school",
    accent: "text-purple-500 bg-purple-50 dark:bg-purple-900/20",
    meta: (
      <span className="flex items-center text-xs font-bold text-emerald-500">
        <span className={iconClass("mr-0.5 text-xs")}>trending_up</span> 1.2점
      </span>
    ),
  },
  {
    label: "출석 현황",
    value: `${attendanceSummary.rate}%`,
    icon: "schedule",
    accent: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
    href: "/student-attendance",
    meta: (
      <span className="text-xs font-medium text-slate-400">
        결석 {attendanceSummary.absent}일 · 지각 {attendanceSummary.tardy}일
      </span>
    ),
  },
];

const upcomingClasses = [
  {
    month: "10월",
    day: "14",
    title: "심화 수학",
    time: "16:00 - 17:30 • 302호",
  },
  { month: "10월", day: "15", title: "영문학", time: "14:00 - 15:30 • 105호" },
  {
    month: "10월",
    day: "16",
    title: "물리 실험",
    time: "15:00 - 16:30 • 제2실험실",
  },
];

const announcements = [
  { tag: "신규", title: "여름 캠프 접수 시작", date: "오늘" },
  { tag: "시험", title: "중간고사 일정 변경 안내", date: "어제" },
  { tag: "휴일", title: "10월 25일 휴원 안내", date: "10월 10일" },
];

const statusClasses: Record<ExamResult["status"], string> = {
  통과: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300",
  평균: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300",
};

export function StudentDashboardOverview() {
  const [isEnrollmentOpen, setEnrollmentOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [subjectFilter, setSubjectFilter] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");

  const uniqueSubjects = useMemo(
    () => ["전체", ...new Set(classEntities.map((klass) => klass.subject))],
    []
  );

  const filteredClasses = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return classEntities.filter((klass) => {
      const matchesSubject =
        subjectFilter === "전체" || klass.subject === subjectFilter;
      const matchesSearch =
        term.length === 0 ||
        klass.name.toLowerCase().includes(term) ||
        klass.teacher.toLowerCase().includes(term);
      return matchesSubject && matchesSearch;
    });
  }, [searchTerm, subjectFilter]);

  const selectedClass = useMemo(
    () => classEntities.find((klass) => klass.id === selectedClassId),
    [selectedClassId]
  );

  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200"
      )}
    >
      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
        <section className="flex flex-col gap-4 border-b border-slate-200 pb-8 dark:border-slate-800 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              학생 대시보드
            </p>
            <h1
              className={cn(
                lexend.className,
                "mt-2 text-3xl font-bold tracking-tight text-[color:var(--surface-text)]"
              )}
            >
              안녕하세요, 지우님!
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              학습 대시보드에 오신 것을 환영합니다. 오늘의 학습 요약입니다.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-600"
              onClick={() => setEnrollmentOpen(true)}
            >
              <span className={iconClass("text-base")}>edit_calendar</span>
              수강신청
            </button>
            <Link
              href="/student-profile"
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 transition hover:shadow dark:border-slate-700 dark:bg-[#1a2632]"
            >
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                학생:
              </span>
              <span className="text-sm font-bold text-[color:var(--surface-text)]">
                김지우
              </span>
              <span className={iconClass("text-base text-slate-400")}>
                expand_more
              </span>
            </Link>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {highlightCards.map((card) => {
            const renderArticle = (key?: string) => (
              <article
                key={key}
                className={cn(
                  "relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow dark:border-slate-800 dark:bg-[#1a2632]",
                  card.href
                    ? "hover:-translate-y-0.5 hover:shadow-lg"
                    : "hover:shadow-md"
                )}
              >
                {card.label === "재시험 필요" && (
                  <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-red-50 opacity-60 transition-transform duration-300 dark:bg-red-900/20" />
                )}
                <div className="flex items-center gap-3">
                  <div className={cn("rounded-lg p-2", card.accent)}>
                    <span className={iconClass("text-xl")}>{card.icon}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {card.label}
                  </span>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-3xl font-bold text-[color:var(--surface-text)]">
                    {card.value}
                  </p>
                  {card.actionLabel ? (
                    <button
                      type="button"
                      className="flex items-center text-sm font-semibold text-red-500 transition hover:underline"
                    >
                      {card.actionLabel}
                      <span className={iconClass("ml-1 text-xs")}>
                        chevron_right
                      </span>
                    </button>
                  ) : (
                    <span>{card.meta}</span>
                  )}
                </div>
              </article>
            );

            if (card.href) {
              return (
                <Link
                  key={card.label}
                  href={card.href}
                  className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-background)]"
                >
                  {renderArticle()}
                </Link>
              );
            }

            return renderArticle(card.label);
          })}
        </section>

        <section className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <article className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-[#1a2632]">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-[color:var(--surface-text)]">
                  학업 성취도
                </h2>
                <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                  <button className="rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-white shadow-sm">
                    월간
                  </button>
                  <button className="rounded-md px-4 py-1.5 text-sm font-semibold text-slate-500 transition hover:bg-white dark:text-slate-400 dark:hover:bg-slate-700">
                    주간
                  </button>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceTrend}
                    barSize={40}
                    margin={{ top: 10, left: -20, right: 20, bottom: 0 }}
                  >
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="3 3"
                      stroke="rgba(148, 163, 184, 0.4)"
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                    />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                      formatter={(value?: number) => [
                        `${value ?? 0}점`,
                        "평균",
                      ]}
                      cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                      contentStyle={{
                        borderRadius: "12px",
                        borderColor: "var(--surface-border)",
                        backgroundColor: "var(--surface-panel)",
                        color: "var(--surface-text)",
                      }}
                    />
                    <Bar
                      dataKey="score"
                      fill="#3B82F6"
                      radius={[12, 12, 0, 0]}
                      background={{
                        fill: "rgba(59, 130, 246, 0.15)",
                        radius: 12,
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-[#1a2632]">
              <div className="flex items-center justify-between border-b border-slate-50 px-8 py-6 dark:border-slate-800">
                <h2 className="text-xl font-bold">최근 시험 결과</h2>
                <button
                  type="button"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  전체 보기
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/60 text-xs font-bold uppercase tracking-wider text-slate-400 dark:bg-slate-800/50">
                    <tr>
                      <th className="px-8 py-4">과목</th>
                      <th className="px-8 py-4">시험명</th>
                      <th className="px-8 py-4">날짜</th>
                      <th className="px-8 py-4">점수</th>
                      <th className="px-8 py-4 text-center">상태</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {examResults.map((result) => (
                      <tr
                        key={`${result.subject}-${result.examName}`}
                        className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "rounded-lg p-1.5",
                                result.iconClasses
                              )}
                            >
                              <span className={iconClass("text-sm")}>
                                {result.icon}
                              </span>
                            </div>
                            <span className="font-semibold text-[color:var(--surface-text)]">
                              {result.subject}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm text-slate-600 dark:text-slate-300">
                          {result.examName}
                        </td>
                        <td className="px-8 py-5 text-sm text-slate-400">
                          {result.date}
                        </td>
                        <td className="px-8 py-5 text-sm">
                          <span className="font-bold text-[color:var(--surface-text)]">
                            {result.score}
                          </span>
                          <span className="text-xs text-slate-400">/100</span>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-bold",
                              statusClasses[result.status]
                            )}
                          >
                            {result.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </div>

          <div className="space-y-8">
            <article className="relative overflow-hidden rounded-2xl bg-primary p-8 text-white shadow-xl shadow-blue-500/30">
              <div className="absolute -right-4 -bottom-4 opacity-20">
                <span className={iconClass("text-9xl")}>campaign</span>
              </div>
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-2">
                  <span className={iconClass("text-xl")}>campaign</span>
                  <h2 className="text-lg font-bold">공지사항</h2>
                </div>
                {announcements.map((notice, index) => (
                  <div key={notice.title}>
                    <div className="mb-2 flex items-center justify-between text-[10px] uppercase">
                      <span className="rounded bg-white/20 px-2 py-0.5 font-bold">
                        {notice.tag}
                      </span>
                      <span className="opacity-70">{notice.date}</span>
                    </div>
                    <p className="text-sm font-bold">{notice.title}</p>
                    {index < announcements.length - 1 && (
                      <div className="mt-4 h-px bg-white/10" />
                    )}
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-[#1a2632]">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold">다가오는 수업</h2>
                <button className="text-xs font-bold text-primary hover:underline">
                  전체 시간표
                </button>
              </div>
              <div className="space-y-4">
                {upcomingClasses.map((session) => (
                  <div
                    key={`${session.title}-${session.day}`}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800"
                  >
                    <div className="w-12 rounded-lg border border-slate-100 bg-white p-2 text-center dark:border-slate-700 dark:bg-[#1a2632]">
                      <p className="text-[10px] font-bold text-slate-400">
                        {session.month}
                      </p>
                      <p className="text-lg font-bold text-[color:var(--surface-text)]">
                        {session.day}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[color:var(--surface-text)]">
                        {session.title}
                      </p>
                      <p className="text-xs text-slate-400">{session.time}</p>
                    </div>
                    <span className={iconClass("text-slate-300")}>
                      chevron_right
                    </span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>
      </main>
      {isEnrollmentOpen ? (
        <CourseEnrollmentModal
          classes={filteredClasses}
          subjects={uniqueSubjects}
          subjectFilter={subjectFilter}
          onSubjectChange={setSubjectFilter}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedClassId={selectedClassId}
          onSelectClass={setSelectedClassId}
          onClose={() => setEnrollmentOpen(false)}
          onConfirm={() => setConfirmOpen(true)}
        />
      ) : null}
      {isConfirmOpen ? (
        <EnrollmentConfirmModal
          selectedClass={selectedClass}
          onClose={() => setConfirmOpen(false)}
          onConfirm={() => {
            setConfirmOpen(false);
            setEnrollmentOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
