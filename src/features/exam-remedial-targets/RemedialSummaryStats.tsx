"use client";

import { useMemo, useState, type KeyboardEvent } from "react";

import type {
  RemedialSummaryStat,
  TodayRetestStudent,
  UnscheduledStudent,
} from "@/types/exams";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

type RemedialSummaryStatsProps = {
  stats: RemedialSummaryStat[];
  todayList: TodayRetestStudent[];
  unscheduledList?: UnscheduledStudent[];
};

export function RemedialSummaryStats({
  stats,
  todayList,
  unscheduledList = [],
}: RemedialSummaryStatsProps) {
  const [open, setOpen] = useState(false);
  const [unscheduledOpen, setUnscheduledOpen] = useState(false);
  const todayCount = useMemo(() => todayList.length, [todayList]);
  const unscheduledCount = useMemo(
    () => unscheduledList.length,
    [unscheduledList]
  );

  const handleOpen = () => {
    if (todayCount === 0) {
      return;
    }
    setOpen(true);
  };

  const handleUnscheduledOpen = () => {
    if (unscheduledCount === 0) return;
    setUnscheduledOpen(true);
  };

  const closeModal = () => setOpen(false);
  const closeUnscheduled = () => setUnscheduledOpen(false);

  return (
    <>
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const isTodayCard = stat.title === "오늘 재시험 예정";
          const isUnscheduledCard = stat.title === "미예약 학생";
          const interactiveProps =
            isTodayCard || isUnscheduledCard
              ? {
                  role: "button" as const,
                  tabIndex: 0,
                  onClick: isTodayCard ? handleOpen : handleUnscheduledOpen,
                  onKeyDown: (event: KeyboardEvent) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      if (isTodayCard) {
                        handleOpen();
                      } else if (isUnscheduledCard) {
                        handleUnscheduledOpen();
                      }
                    }
                  },
                }
              : {};
          const isClickable =
            (isTodayCard && todayCount > 0) ||
            (isUnscheduledCard && unscheduledCount > 0);
          return (
            <article
              key={stat.title}
              className={cn(
                "rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900",
                isClickable
                  ? "cursor-pointer transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
                  : undefined
              )}
              {...interactiveProps}
            >
              <div className="mb-4 flex items-start justify-between">
                <div className={cn("rounded-lg p-2", stat.iconClass)}>
                  <span
                    className={iconClass(
                      "text-xl",
                      stat.icon === "hourglass_empty"
                    )}
                  >
                    {stat.icon}
                  </span>
                </div>
                <span
                  className={cn(
                    "rounded px-2 py-1 text-xs font-bold",
                    stat.trendClass
                  )}
                >
                  {stat.trend}
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {stat.title}
              </p>
              <p className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {stat.value}
                </span>
                <span className="text-lg font-medium text-slate-400">
                  {stat.suffix}
                </span>
              </p>
              {isTodayCard && todayCount > 0 ? (
                <p className="mt-3 text-xs font-semibold text-primary">
                  오늘 재시험 명단 보기
                </p>
              ) : null}
              {isUnscheduledCard && unscheduledCount > 0 ? (
                <p className="mt-3 text-xs font-semibold text-primary">
                  미예약 명단 보기
                </p>
              ) : null}
            </article>
          );
        })}
      </section>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  오늘 재시험 예정 학생
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  총 {todayCount}명 · 재시험 일정이 오늘로 예정된 학생
                  명단입니다.
                </p>
              </div>
              <button
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                onClick={closeModal}
                aria-label="모달 닫기"
              >
                <span className={iconClass("text-lg")}>close</span>
              </button>
            </div>
            {todayCount === 0 ? (
              <p className="px-6 py-16 text-center text-sm text-slate-500 dark:text-slate-400">
                오늘 재시험 예정 학생이 없습니다.
              </p>
            ) : (
              <div className="max-h-[420px] overflow-y-auto px-6 py-4">
                <table className="min-w-full text-left text-sm">
                  <thead className="sticky top-0 bg-white text-xs font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                    <tr>
                      <th className="py-2 pr-3">학생</th>
                      <th className="py-2 pr-3">수업</th>
                      <th className="py-2 pr-3">시험명</th>
                      <th className="py-2 pr-3">재시험 시간</th>
                      <th className="py-2">상태</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {todayList.map((student) => (
                      <tr
                        key={student.id}
                        className="text-slate-700 dark:text-slate-300"
                      >
                        <td className="py-3 pr-3 font-semibold text-slate-900 dark:text-white">
                          {student.name}
                        </td>
                        <td className="py-3 pr-3 text-xs text-slate-500 dark:text-slate-400">
                          {student.classLabel}
                        </td>
                        <td className="py-3 pr-3 text-xs text-slate-500 dark:text-slate-400">
                          {student.examName}
                        </td>
                        <td className="py-3 pr-3 font-medium">
                          {student.schedule}
                        </td>
                        <td className="py-3">
                          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary dark:text-primary">
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {unscheduledOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeUnscheduled}
          />
          <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  미예약 학생 명단
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  총 {unscheduledCount}명 · 아직 재시험 일정을 확정하지 않은
                  학생입니다.
                </p>
              </div>
              <button
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                onClick={closeUnscheduled}
                aria-label="미예약 학생 모달 닫기"
              >
                <span className={iconClass("text-lg")}>close</span>
              </button>
            </div>
            {unscheduledCount === 0 ? (
              <p className="px-6 py-16 text-center text-sm text-slate-500 dark:text-slate-400">
                미예약 학생이 없습니다.
              </p>
            ) : (
              <div className="max-h-[420px] overflow-y-auto px-6 py-4">
                <table className="min-w-full text-left text-sm">
                  <thead className="sticky top-0 bg-white text-xs font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                    <tr>
                      <th className="py-2 pr-3">학생</th>
                      <th className="py-2 pr-3">수업</th>
                      <th className="py-2 pr-3">미통과 시험</th>
                      <th className="py-2 pr-3">미통과 일자</th>
                      <th className="py-2">연락 현황</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {unscheduledList.map((student) => (
                      <tr
                        key={student.id}
                        className="text-slate-700 dark:text-slate-300"
                      >
                        <td className="py-3 pr-3 font-semibold text-slate-900 dark:text-white">
                          {student.name}
                        </td>
                        <td className="py-3 pr-3 text-xs text-slate-500 dark:text-slate-400">
                          {student.classLabel}
                        </td>
                        <td className="py-3 pr-3 text-xs text-slate-500 dark:text-slate-400">
                          {student.examName}
                        </td>
                        <td className="py-3 pr-3 text-xs font-medium">
                          {student.missingDate}
                        </td>
                        <td className="py-3">
                          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                            {student.contactStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
              <button
                type="button"
                onClick={closeUnscheduled}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
