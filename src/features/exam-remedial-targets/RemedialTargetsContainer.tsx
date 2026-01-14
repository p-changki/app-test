"use client";

import { useMemo } from "react";

import { classEntities } from "@/data/classes";
import { examDefinitions } from "@/data/exams";
import { studentEntities } from "@/data/students";
import { RemedialSummaryStats } from "@/features/exam-remedial-targets/RemedialSummaryStats";
import { RemedialTargetsClient } from "@/features/exam-remedial-targets/RemedialTargetsClient";
import { useExamResultStore } from "@/features/exam-grade-entry/examResultStore";
import type {
  RemedialStudent,
  RemedialSummaryStat,
  UnscheduledStudent,
} from "@/types/exams";

const badgePalette = [
  "bg-slate-200 text-slate-600",
  "bg-emerald-100 text-emerald-600",
  "bg-blue-100 text-blue-600",
  "bg-amber-100 text-amber-600",
  "bg-rose-100 text-rose-600",
];

export function RemedialTargetsContainer() {
  const results = useExamResultStore((state) => state.results);
  const classOptions = useMemo(
    () => ["전체 수업", ...classEntities.map((klass) => klass.name)],
    []
  );
  const examOptions = useMemo(
    () => ["모든 시험", ...examDefinitions.map((exam) => exam.title)],
    []
  );
  const remedialStudents = useMemo<RemedialStudent[]>(() => {
    const classLabelMap = new Map(
      classEntities.map((klass) => [klass.id, klass.name])
    );
    const items: RemedialStudent[] = [];
    examDefinitions.forEach((exam) => {
      const classLabel = classLabelMap.get(exam.classId) ?? exam.targetClass;
      const classStudents = studentEntities.filter(
        (student) => student.classId === exam.classId
      );
      classStudents.forEach((student, index) => {
        const result = results[exam.id]?.[student.id];
        if (!result) return;
        if (result.score >= exam.passScore) return;
        items.push({
          id: `${exam.id}-${student.id}`,
          name: student.name,
          classLabel,
          initials: student.name.slice(0, 1),
          badgeClass: badgePalette[index % badgePalette.length],
          examName: exam.title,
          score: result.score,
          cutline: exam.passScore,
          failDate: exam.examDate,
          status: {
            label: "미예약",
            badgeClass:
              "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            dotClass: "bg-red-500",
          },
        });
      });
    });
    return items;
  }, [results]);

  const unscheduledList = useMemo<UnscheduledStudent[]>(() => {
    return remedialStudents.map((student) => ({
      id: student.id,
      name: student.name,
      classLabel: student.classLabel,
      examName: student.examName,
      missingDate: student.failDate,
      contactStatus: "미연락",
    }));
  }, [remedialStudents]);

  const summaryStats = useMemo<RemedialSummaryStat[]>(() => {
    const totalCount = remedialStudents.length;
    return [
      {
        title: "전체 클리닉 대상자",
        value: String(totalCount),
        suffix: "명",
        trend: "0%",
        trendClass: "text-slate-600 bg-slate-100",
        icon: "groups",
        iconClass:
          "text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-800",
      },
      {
        title: "완료",
        value: "0",
        suffix: "명",
        trend: "0%",
        trendClass: "text-emerald-600 bg-emerald-50",
        icon: "task_alt",
        iconClass: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30",
      },
    ];
  }, [remedialStudents.length, unscheduledList.length]);

  return (
    <>
      <RemedialSummaryStats
        stats={summaryStats}
        todayList={[]}
        unscheduledList={unscheduledList}
      />
      <RemedialTargetsClient
        classOptions={classOptions}
        examOptions={examOptions}
        students={remedialStudents}
      />
    </>
  );
}
