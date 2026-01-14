"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

type ScorePoint = {
  label: string;
  myScore: number;
  classAvg: number;
};

type CourseExam = {
  id: string;
  name: string;
  exams: Array<{
    id: string;
    subject: string;
    examLabel: string;
    examType: string;
    score: number;
    classAvg: number;
    rank: string;
    badge: string;
    badgeTone: "green" | "blue" | "yellow" | "red";
  }>;
};

type GradeRow = CourseExam["exams"][number] & {
  courseId: string;
  courseName: string;
};

const scoreTimeline: ScorePoint[] = [
  { label: "3월 모의", myScore: 72, classAvg: 65 },
  { label: "1학기 중간", myScore: 78, classAvg: 70 },
  { label: "6월 모의", myScore: 92, classAvg: 68 },
  { label: "1학기 기말", myScore: 88, classAvg: 75 },
  { label: "9월 모의", myScore: 95, classAvg: 80 },
];

const courseExams: CourseExam[] = [
  {
    id: "math-advanced",
    name: "수학 II 심화반",
    exams: [
      {
        id: "math-final",
        subject: "수학 II",
        examLabel: "2학기 기말고사",
        examType: "기말고사",
        score: 92,
        classAvg: 70.5,
        rank: "3 / 30",
        badge: "A",
        badgeTone: "green",
      },
      {
        id: "math-mid",
        subject: "수학 II",
        examLabel: "2학기 중간고사",
        examType: "중간고사",
        score: 89,
        classAvg: 72.4,
        rank: "4 / 30",
        badge: "A",
        badgeTone: "green",
      },
      {
        id: "math-mock",
        subject: "수학 II",
        examLabel: "6월 모의평가",
        examType: "모의고사",
        score: 94,
        classAvg: 68.2,
        rank: "2 / 30",
        badge: "A+",
        badgeTone: "green",
      },
    ],
  },
  {
    id: "english-advanced",
    name: "영어 독해반",
    exams: [
      {
        id: "eng-final",
        subject: "영어 독해",
        examLabel: "2학기 기말고사",
        examType: "기말고사",
        score: 88,
        classAvg: 68.2,
        rank: "8 / 28",
        badge: "B",
        badgeTone: "blue",
      },
      {
        id: "eng-mid",
        subject: "영어 독해",
        examLabel: "2학기 중간고사",
        examType: "중간고사",
        score: 85,
        classAvg: 67.3,
        rank: "9 / 28",
        badge: "B",
        badgeTone: "blue",
      },
    ],
  },
  {
    id: "science-lab",
    name: "과학탐구 실전반",
    exams: [
      {
        id: "science-final",
        subject: "물리학 I",
        examLabel: "2학기 기말고사",
        examType: "기말고사",
        score: 95,
        classAvg: 62.0,
        rank: "1 / 24",
        badge: "A+",
        badgeTone: "green",
      },
      {
        id: "science-prac",
        subject: "물리학 I",
        examLabel: "실험 평가",
        examType: "실기",
        score: 90,
        classAvg: 71.5,
        rank: "2 / 24",
        badge: "A",
        badgeTone: "green",
      },
    ],
  },
  {
    id: "history-core",
    name: "한국사 집중반",
    exams: [
      {
        id: "history-final",
        subject: "한국사",
        examLabel: "2학기 기말고사",
        examType: "기말고사",
        score: 65,
        classAvg: 77.0,
        rank: "22 / 30",
        badge: "C",
        badgeTone: "red",
      },
      {
        id: "history-mid",
        subject: "한국사",
        examLabel: "2학기 중간고사",
        examType: "중간고사",
        score: 72,
        classAvg: 75.5,
        rank: "18 / 30",
        badge: "B",
        badgeTone: "yellow",
      },
    ],
  },
  {
    id: "korean-lit",
    name: "현대문학 토론반",
    exams: [
      {
        id: "korean-final",
        subject: "현대문학",
        examLabel: "2학기 기말고사",
        examType: "기말고사",
        score: 81,
        classAvg: 75.4,
        rank: "12 / 30",
        badge: "B",
        badgeTone: "yellow",
      },
    ],
  },
];

type StudentGradesDetailProps = {
  hideCourseSelect?: boolean;
};

export function StudentGradesDetail({
  hideCourseSelect = false,
}: StudentGradesDetailProps) {
  const [selectedCourseId, setSelectedCourseId] = useState(
    courseExams[0]?.id ?? ""
  );
  const [selectedExamId, setSelectedExamId] = useState<string>("ALL");
  const [showAll, setShowAll] = useState(false);
  const [detailRow, setDetailRow] = useState<GradeRow | null>(null);

  const selectedCourse = useMemo(
    () =>
      courseExams.find((course) => course.id === selectedCourseId) ??
      courseExams[0],
    [selectedCourseId]
  );

  const examOptions = useMemo(() => {
    if (!selectedCourse) return [];
    return selectedCourse.exams;
  }, [selectedCourse]);

  const gradeRows: GradeRow[] = useMemo(() => {
    return courseExams.flatMap((course) =>
      course.exams.map((exam) => ({
        ...exam,
        courseId: course.id,
        courseName: course.name,
      }))
    );
  }, []);

  const filteredRows = useMemo(() => {
    return gradeRows.filter((row) => {
      const matchesCourse = selectedCourse
        ? row.courseId === selectedCourse.id
        : true;
      const matchesExam =
        selectedExamId === "ALL" ||
        row.id === selectedExamId ||
        row.examLabel === selectedExamId;
      return matchesCourse && matchesExam;
    });
  }, [gradeRows, selectedCourse, selectedExamId]);

  const activeExam = filteredRows[0];
  const totalParticipants = useMemo(() => {
    if (!activeExam) return "-";
    const [, total] = activeExam.rank.split("/");
    return total?.trim() ?? "-";
  }, [activeExam]);

  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors"
      )}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-10">
        <section className="rounded-2xl border border-[color:var(--surface-border)] bg-[var(--surface-panel)] p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold text-[color:var(--surface-text-muted)]">
                조회 조건
              </p>
              <p className="text-sm text-[color:var(--surface-text-muted)]">
                수강한 수업과 시험을 선택해 성적을 확인하세요.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {hideCourseSelect ? null : (
                <label className="relative flex-1 min-w-[220px]">
                  <span className="mb-1 block text-xs font-semibold text-[color:var(--surface-text-muted)]">
                    수업 선택
                  </span>
                  <select
                    className="w-full appearance-none rounded-lg border border-[color:var(--surface-border)] bg-[var(--surface-panel)] py-2.5 pl-4 pr-10 text-sm font-medium text-[color:var(--surface-text)] shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    value={selectedCourse?.id ?? ""}
                    onChange={(event) => {
                      setSelectedCourseId(event.target.value);
                      setSelectedExamId("ALL");
                    }}
                  >
                    {courseExams.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                  <span
                    className={iconClass(
                      "pointer-events-none absolute right-3 top-[38px] text-base text-[color:var(--surface-text-muted)]"
                    )}
                  >
                    expand_more
                  </span>
                </label>
              )}
              <label className="relative flex-1 min-w-[220px]">
                <span className="mb-1 block text-xs font-semibold text-[color:var(--surface-text-muted)]">
                  시험 선택
                </span>
                <select
                  className="w-full appearance-none rounded-lg border border-[color:var(--surface-border)] bg-[var(--surface-panel)] py-2.5 pl-4 pr-10 text-sm font-medium text-[color:var(--surface-text)] shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={selectedExamId}
                  onChange={(event) => setSelectedExamId(event.target.value)}
                >
                  <option value="ALL">전체 시험</option>
                  {examOptions.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.examLabel}
                    </option>
                  ))}
                </select>
                <span
                  className={iconClass(
                    "pointer-events-none absolute right-3 top-[38px] text-base text-[color:var(--surface-text-muted)]"
                  )}
                >
                  expand_more
                </span>
              </label>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-[color:var(--surface-border)] bg-[var(--surface-panel)] p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-[color:var(--surface-text-muted)]">
                  선택 시험 점수
                </p>
                <p className="mt-2 text-3xl font-bold text-[color:var(--surface-text)]">
                  {activeExam ? `${activeExam.score}점` : "시험 미선택"}
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs text-[color:var(--surface-text-muted)]">
              {activeExam
                ? `${activeExam.examLabel} • ${activeExam.subject}`
                : "시험을 선택해주세요"}
            </p>
          </article>
          <article className="rounded-2xl border border-[color:var(--surface-border)] bg-[var(--surface-panel)] p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-[color:var(--surface-text-muted)]">
                  학급 석차
                </p>
                <p className="mt-2 text-3xl font-bold text-[color:var(--surface-text)]">
                  {activeExam ? activeExam.rank : "시험 미선택"}
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs text-[color:var(--surface-text-muted)]">
              {activeExam ? activeExam.courseName : "선택된 수업이 없습니다"}
            </p>
          </article>
          <article className="rounded-2xl border border-[color:var(--surface-border)] bg-[var(--surface-panel)] p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-[color:var(--surface-text-muted)]">
                  시험 응시 인원
                </p>
                <p className="mt-2 text-3xl font-bold text-[color:var(--surface-text)]">
                  {activeExam ? `${totalParticipants}명` : "시험 미선택"}
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs text-[color:var(--surface-text-muted)]">
              {activeExam
                ? "선택한 조건에 해당하는 응시생 수"
                : "시험을 선택해주세요"}
            </p>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-6">
          <article className="rounded-2xl border border-[color:var(--surface-border)] bg-[var(--surface-panel)] p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className={cn(lexend.className, "text-lg font-bold")}>
                성적 변화 추이
              </h2>
              <div className="flex gap-4 text-xs font-semibold text-[color:var(--surface-text-muted)]">
                <Legend color="bg-primary" label="내 점수" />
                <Legend
                  color="bg-slate-400 dark:bg-slate-600"
                  label="반 평균"
                />
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={scoreTimeline}
                  margin={{ left: 0, right: 20, top: 10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="rgba(148,163,184,0.4)"
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "var(--surface-text-muted)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[40, 100]}
                    tick={{ fill: "var(--surface-text-muted)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      borderColor: "var(--surface-border)",
                      backgroundColor: "var(--surface-panel)",
                      color: "var(--surface-text)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="myScore"
                    stroke="#2b8cee"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="내 점수"
                  />
                  <Line
                    type="monotone"
                    dataKey="classAvg"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    strokeDasharray="5 5"
                    name="반 평균"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-6">
          <article className="overflow-hidden rounded-2xl border border-[color:var(--surface-border)] bg-[var(--surface-panel)] shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--surface-border)] px-6 py-4">
              <h2 className="text-lg font-bold">시험목록</h2>
              <div className="flex gap-2 text-sm font-medium text-[color:var(--surface-text-muted)]">
                <button
                  type="button"
                  className="flex items-center gap-1 hover:text-primary"
                >
                  <span className={iconClass("text-sm")}>filter_list</span>
                  필터
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1 hover:text-primary"
                >
                  <span className={iconClass("text-sm")}>sort</span>
                  정렬
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[color:var(--surface-background)] text-xs font-semibold uppercase text-[color:var(--surface-text-muted)]">
                  <tr>
                    <th className="p-4 pl-6">수업명</th>
                    <th className="p-4">시험</th>
                    <th className="p-4">과목</th>
                    <th className="p-4">원점수</th>
                    <th className="p-4">학급 평균</th>
                    <th className="p-4">석차</th>
                    <th className="p-4 pr-6 text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--surface-border)]">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td
                        className="p-6 text-center text-sm text-[color:var(--surface-text-muted)]"
                        colSpan={8}
                      >
                        선택한 조건에 해당하는 성적이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    (showAll ? filteredRows : filteredRows.slice(0, 3)).map(
                      (row) => (
                        <tr
                          key={`${row.courseName}-${row.id}`}
                          className="cursor-pointer transition hover:bg-[var(--surface-background)]"
                          onClick={() => setDetailRow(row)}
                        >
                          <td className="p-4 pl-6 font-semibold text-[color:var(--surface-text)]">
                            {row.courseName}
                          </td>
                          <td className="p-4 text-[color:var(--surface-text-muted)]">
                            {row.examLabel}
                          </td>
                          <td className="p-4 text-[color:var(--surface-text-muted)]">
                            {row.subject}
                          </td>
                          <td className="p-4 font-bold text-[color:var(--surface-text)]">
                            {row.score}
                          </td>
                          <td className="p-4 text-[color:var(--surface-text-muted)]">
                            {row.classAvg}
                          </td>
                          <td className="p-4 font-semibold text-primary">
                            {row.rank}
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <button
                              type="button"
                              className="text-xs font-medium text-primary hover:underline"
                              onClick={(event) => {
                                event.stopPropagation();
                                setDetailRow(row);
                              }}
                            >
                              상세내역
                            </button>
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
              <div className="border-t border-[color:var(--surface-border)] px-6 py-3 text-center">
                <button
                  type="button"
                  className="text-sm font-semibold text-primary hover:underline"
                  onClick={() => setShowAll((prev) => !prev)}
                >
                  {showAll ? "접기" : "더보기"}
                </button>
              </div>
            </div>
          </article>
        </section>
      </div>
      {detailRow ? (
        <ExamDetailModal row={detailRow} onClose={() => setDetailRow(null)} />
      ) : null}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("size-2.5 rounded-full", color)} />
      {label}
    </span>
  );
}

function ExamDetailModal({
  row,
  onClose,
}: {
  row: GradeRow;
  onClose: () => void;
}) {
  const [isReportPreviewOpen, setIsReportPreviewOpen] = useState(false);

  const wrongTypeSummary = [
    { label: "어휘", count: 4, rate: "40%" },
    { label: "문법", count: 3, rate: "30%" },
    { label: "내용일치", count: 2, rate: "20%" },
    { label: "빈칸", count: 1, rate: "10%" },
  ];

  const questionRows = [
    {
      no: 1,
      source: "19년 6월 38번",
      type: "제목",
      result: "X",
      wrongRate: "60%",
    },
    {
      no: 2,
      source: "25년 10월 40번",
      type: "주제",
      result: "O",
      wrongRate: "0%",
    },
    {
      no: 3,
      source: "25년 10월 38번",
      type: "내용일치",
      result: "X",
      wrongRate: "60%",
    },
    {
      no: 4,
      source: "25년 10월 22번",
      type: "어법",
      result: "X",
      wrongRate: "80%",
    },
    {
      no: 5,
      source: "하루6개 1등급 15-4",
      type: "어휘",
      result: "O",
      wrongRate: "40%",
    },
    {
      no: 6,
      source: "19년 9월 23번",
      type: "어휘",
      result: "X",
      wrongRate: "10%",
    },
  ];

  const reportHtml = useMemo(() => buildReportHtml(row), [row]);
  const reportFileName = useMemo(() => `grade-report-${row.id}.html`, [row.id]);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
        <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface-panel)] shadow-2xl">
          <div className="flex items-center justify-between border-b border-[color:var(--surface-border)] px-6 py-4">
            <div>
              <p className="text-xs font-semibold text-[color:var(--surface-text-muted)]">
                상세 학생 성적 내역
              </p>
              <h3 className="text-lg font-bold text-[color:var(--surface-text)]">
                {row.examLabel}
              </h3>
              <p className="text-sm text-[color:var(--surface-text-muted)]">
                {row.courseName} · {row.subject}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/20"
                onClick={() => setIsReportPreviewOpen(true)}
                aria-label="성적표 인쇄 미리보기"
              >
                <span className={iconClass("text-sm")}>print</span>
                인쇄
              </button>
              <button
                type="button"
                className="rounded-full p-2 text-[color:var(--surface-text-muted)] transition hover:bg-[color:var(--surface-border)]/30"
                onClick={onClose}
                aria-label="상세 성적 모달 닫기"
              >
                <span className={iconClass("text-lg")}>close</span>
              </button>
            </div>
          </div>
          <div className="max-h-[75vh] overflow-y-auto px-6 py-6">
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="space-y-4 lg:col-span-4">
                <div className="rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface-background)] p-4">
                  <p className="text-xs font-semibold text-[color:var(--surface-text-muted)]">
                    학생 이름
                  </p>
                  <p className="mt-2 text-base font-bold text-[color:var(--surface-text)]">
                    최민서
                  </p>
                </div>
                <div className="rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface-background)] p-4">
                  <p className="text-xs font-semibold text-[color:var(--surface-text-muted)]">
                    시험 종류
                  </p>
                  <p className="mt-2 text-base font-bold text-[color:var(--surface-text)]">
                    {row.examLabel}
                  </p>
                  <p className="mt-1 text-xs text-[color:var(--surface-text-muted)]">
                    2025-12-08 · 6회차
                  </p>
                </div>
                <div className="rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface-background)] p-4">
                  <p className="text-xs font-semibold text-[color:var(--surface-text-muted)]">
                    오답 유형 요약
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {wrongTypeSummary.map((item) => (
                      <span
                        key={item.label}
                        className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                      >
                        {item.label} {item.count} · {item.rate}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4 lg:col-span-8">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface-background)] p-4">
                    <p className="text-xs font-semibold text-[color:var(--surface-text-muted)]">
                      원점수
                    </p>
                    <p className="mt-2 text-2xl font-bold text-[color:var(--surface-text)]">
                      {row.score}점
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface-background)] p-4">
                    <p className="text-xs font-semibold text-[color:var(--surface-text-muted)]">
                      학급 평균
                    </p>
                    <p className="mt-2 text-2xl font-bold text-[color:var(--surface-text)]">
                      {row.classAvg}점
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface-background)] p-4">
                    <p className="text-xs font-semibold text-[color:var(--surface-text-muted)]">
                      석차
                    </p>
                    <p className="mt-2 text-2xl font-bold text-primary">
                      {row.rank}
                    </p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[color:var(--surface-border)]">
                  <div className="bg-primary/60 px-4 py-3 text-sm font-semibold text-white">
                    문항별 오답률
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[color:var(--surface-background)] text-xs font-semibold uppercase text-[color:var(--surface-text-muted)]">
                        <tr>
                          <th className="p-3 pl-4">No.</th>
                          <th className="p-3">출처</th>
                          <th className="p-3">유형</th>
                          <th className="p-3">O/X</th>
                          <th className="p-3">오답률</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[color:var(--surface-border)]">
                        {questionRows.map((item) => (
                          <tr key={item.no}>
                            <td className="p-3 pl-4 font-semibold">
                              {item.no}
                            </td>
                            <td className="p-3 text-[color:var(--surface-text-muted)]">
                              {item.source}
                            </td>
                            <td className="p-3 text-[color:var(--surface-text-muted)]">
                              {item.type}
                            </td>
                            <td className="p-3 font-semibold">{item.result}</td>
                            <td className="p-3 text-[color:var(--surface-text-muted)]">
                              {item.wrongRate}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface-background)] p-4">
                  <p className="text-xs font-semibold text-[color:var(--surface-text-muted)]">
                    오답 유형 상세 메모
                  </p>
                  <p className="mt-2 text-sm text-[color:var(--surface-text)]">
                    내용일치/어법 문항에서 오답이 집중되었습니다. 핵심 문장
                    찾기와 문법 포인트 복습이 필요합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isReportPreviewOpen ? (
        <ReportPreviewModal
          html={reportHtml}
          fileName={reportFileName}
          onClose={() => setIsReportPreviewOpen(false)}
        />
      ) : null}
    </>
  );
}

function ReportPreviewModal({
  html,
  fileName,
  onClose,
}: {
  html: string;
  fileName: string;
  onClose: () => void;
}) {
  const handleDownload = () => {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => window.URL.revokeObjectURL(url), 200);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4 py-6">
      <div className="flex w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface-panel)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[color:var(--surface-border)] px-6 py-4">
          <div>
            <p className="text-xs font-semibold text-[color:var(--surface-text-muted)]">
              성적표 미리보기
            </p>
            <h3 className="text-lg font-bold text-[color:var(--surface-text)]">
              인쇄 전 확인
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
              onClick={handleDownload}
            >
              <span className={iconClass("text-base")}>download</span>
              다운로드
            </button>
            <button
              type="button"
              className="rounded-full p-2 text-[color:var(--surface-text-muted)] transition hover:bg-[color:var(--surface-border)]/30"
              onClick={onClose}
              aria-label="성적표 미리보기 닫기"
            >
              <span className={iconClass("text-lg")}>close</span>
            </button>
          </div>
        </div>
        <div className="bg-[color:var(--surface-background)] p-4">
          <div className="overflow-hidden rounded-2xl border border-[color:var(--surface-border)] bg-white">
            <iframe
              title="성적표 미리보기"
              srcDoc={html}
              className="h-[72vh] w-full"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function buildReportHtml(row: GradeRow) {
  const score = Number.isFinite(row.score) ? String(row.score) : "";
  const classAvg = Number.isFinite(row.classAvg) ? String(row.classAvg) : "";
  const rank = row.rank ?? "";
  const examLabel = row.examLabel ?? "";
  const courseName = row.courseName ?? "";
  const subject = row.subject ?? "";

  return `<!DOCTYPE html>
<html class="light" lang="ko">
  <head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>학생 성적 리포트 상세 보기</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms,typography"></script>
    <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
    <script>
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              primary: "#76c7c0",
              "background-light": "#f8fafc",
              "background-dark": "#0f172a",
            },
            fontFamily: {
              display: ["Pretendard", "sans-serif"],
            },
            borderRadius: {
              DEFAULT: "0.5rem",
            },
          },
        },
      };
    </script>
    <style>
      body {
        font-family: 'Pretendard', sans-serif;
      }
      .report-grid-header {
        background-color: #76c7c0;
        color: #ffffff;
        font-weight: 600;
        padding: 0.5rem 1rem;
        text-align: center;
        border-right: 1px solid #ffffff;
      }
      .report-grid-header:last-child {
        border-right: 0;
      }
      .report-grid-cell {
        padding: 0.5rem 1rem;
        text-align: center;
        border-bottom: 1px solid #e2e8f0;
        border-right: 1px solid #e2e8f0;
      }
      .report-grid-cell:last-child {
        border-right: 0;
      }
      .table-teal {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #e2e8f0;
      }
      .table-teal th {
        background-color: #76c7c0;
        color: #ffffff;
        padding: 0.75rem 1rem;
        font-weight: 600;
        font-size: 0.875rem;
        border-right: 1px solid rgba(255, 255, 255, 0.2);
      }
      .table-teal th:last-child {
        border-right: 0;
      }
      .table-teal td {
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
        text-align: center;
        border-bottom: 1px solid #e2e8f0;
        border-right: 1px solid #e2e8f0;
      }
      .table-teal td:last-child {
        border-right: 0;
      }
    </style>
  </head>
  <body class="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen">
    <div class="max-w-[1440px] mx-auto p-6 md:p-10">
      <header class="flex justify-between items-start mb-10">
        <div>
          <h1 class="text-6xl font-bold text-[#5c88da] dark:text-[#7ca2e9] leading-tight mb-2">2025</h1>
          <h2 class="text-5xl font-bold text-[#5c88da] dark:text-[#7ca2e9] leading-tight tracking-tight">
            서하늘영어<br/>주간 리포트
          </h2>
        </div>
        <div class="flex flex-col items-end">
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-12 h-12 bg-slate-800 dark:bg-slate-200 rounded-full flex items-center justify-center text-white dark:text-slate-800 font-black text-xl italic">
              SHL
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold leading-tight">서하늘영어</div>
              <div class="text-[10px] tracking-widest text-slate-500 uppercase">Seohaneul English</div>
            </div>
          </div>
          <button class="p-2 rounded-full bg-slate-200 dark:bg-slate-800 transition-colors" onclick="document.documentElement.classList.toggle('dark')">
            <span class="material-icons text-xl align-middle">dark_mode</span>
          </button>
        </div>
      </header>
      <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 lg:col-span-7 space-y-8">
          <div class="grid grid-cols-2 gap-4">
            <div class="overflow-hidden border border-slate-200 dark:border-slate-700 rounded shadow-sm">
              <div class="grid grid-cols-2">
                <div class="bg-primary/80 dark:bg-primary/60 text-white p-3 font-semibold text-center border-b border-white/20">학생 이름</div>
                <div class="p-3 text-center border-b dark:border-slate-700">최민서</div>
                <div class="bg-primary/80 dark:bg-primary/60 text-white p-3 font-semibold text-center border-b border-white/20">학원명</div>
                <div class="p-3 text-center border-b dark:border-slate-700"></div>
                <div class="bg-primary/80 dark:bg-primary/60 text-white p-3 font-semibold text-center border-b border-white/20">수강반</div>
                <div class="p-3 text-center border-b dark:border-slate-700">${courseName}</div>
                <div class="bg-primary/80 dark:bg-primary/60 text-white p-3 font-semibold text-center">시험 종류</div>
                <div class="p-3 text-center">${examLabel}</div>
              </div>
            </div>
            <div class="overflow-hidden border border-slate-200 dark:border-slate-700 rounded shadow-sm h-fit">
              <div class="grid grid-cols-2">
                <div class="bg-primary/80 dark:bg-primary/60 text-white p-3 font-semibold text-center border-b border-white/20">수강일자</div>
                <div class="p-3 text-center border-b dark:border-slate-700">2025-12-08</div>
                <div class="bg-primary/80 dark:bg-primary/60 text-white p-3 font-semibold text-center">회차</div>
                <div class="p-3 text-center">6회차</div>
              </div>
            </div>
          </div>
          <div class="rounded overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="bg-primary/60 dark:bg-primary/40 text-white text-center py-2 font-semibold">응시 결과</div>
            <div class="grid grid-cols-3">
              <div class="text-center p-3 border-r dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-400">원점수</div>
              <div class="text-center p-3 border-r dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-400">석차</div>
              <div class="text-center p-3 font-semibold text-slate-600 dark:text-slate-400">평균점수</div>
              <div class="text-center p-6 border-t border-r dark:border-slate-700 text-lg">${score}점</div>
              <div class="text-center p-6 border-t border-r dark:border-slate-700 text-lg">${rank}</div>
              <div class="text-center p-6 border-t dark:border-slate-700 text-lg">${classAvg}점</div>
            </div>
          </div>
          <div class="rounded overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="bg-primary/60 dark:bg-primary/40 text-white text-center py-2 font-semibold">문항별 응시 결과</div>
            <table class="table-teal">
              <thead>
                <tr>
                  <th class="w-16">No.</th>
                  <th>출처</th>
                  <th>유형</th>
                  <th class="w-20">O/X</th>
                  <th class="w-24">오답률</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-slate-800/50">
                <tr><td>1</td><td>19년 6월 38번</td><td>제목</td><td></td><td>60%</td></tr>
                <tr><td>2</td><td>25년 10월 40번</td><td>주제</td><td></td><td>0%</td></tr>
                <tr><td>3</td><td>25년 10월 38번</td><td>내용일치</td><td></td><td>60%</td></tr>
                <tr><td>4</td><td>25년 10월 22번</td><td>어법</td><td></td><td>80%</td></tr>
                <tr><td>5</td><td>하루6개 1등급 15-4</td><td>어법</td><td></td><td>40%</td></tr>
                <tr><td>6</td><td>19년 9월 23번</td><td>어휘</td><td></td><td>10%</td></tr>
                <tr><td>7</td><td>하루6개 1등급 15-5</td><td>어휘</td><td></td><td>30%</td></tr>
                <tr><td>8</td><td>19년 6월 37번</td><td>빈칸</td><td></td><td>30%</td></tr>
                <tr><td>9</td><td>25년 10월 29번</td><td>빈칸</td><td></td><td>70%</td></tr>
                <tr><td>10</td><td>19년 9월 36번</td><td>빈칸</td><td></td><td>10%</td></tr>
                <tr><td>11</td><td>25년 10월 33번</td><td>순서</td><td></td><td>40%</td></tr>
                <tr><td>12</td><td>25년 10월 41-42번</td><td>삽입</td><td></td><td>60%</td></tr>
                <tr><td>13</td><td></td><td>제목</td><td></td><td>30%</td></tr>
                <tr><td>14</td><td></td><td>어휘</td><td></td><td>80%</td></tr>
                <tr><td>15</td><td>25년 10월 35번</td><td>요약</td><td></td><td>60%</td></tr>
                <tr><td>16</td><td></td><td></td><td></td><td></td></tr>
                <tr><td>17</td><td></td><td></td><td></td><td></td></tr>
                <tr><td>18</td><td></td><td></td><td></td><td></td></tr>
                <tr><td>19</td><td></td><td></td><td></td><td></td></tr>
                <tr><td>20</td><td></td><td></td><td></td><td></td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="col-span-12 lg:col-span-5 space-y-8">
          <div class="grid grid-cols-2 h-32 border border-slate-200 dark:border-slate-700 rounded overflow-hidden">
            <div class="flex flex-col">
              <div class="bg-primary/60 dark:bg-primary/40 text-white text-center py-2 font-semibold border-r border-white/20">출결</div>
              <div class="flex-1 flex items-center justify-center border-r dark:border-slate-700 bg-white dark:bg-slate-800">
                <span class="text-slate-600 dark:text-slate-300">결석</span>
              </div>
            </div>
            <div class="flex flex-col">
              <div class="bg-primary/60 dark:bg-primary/40 text-white text-center py-2 font-semibold">${subject}</div>
              <div class="flex-1 flex items-center justify-center bg-white dark:bg-slate-800">
                <span class="text-slate-600 dark:text-slate-300">자료수령</span>
              </div>
            </div>
          </div>
          <div class="border border-slate-200 dark:border-slate-700 rounded overflow-hidden">
            <div class="bg-primary/60 dark:bg-primary/40 text-white text-center py-2 font-semibold">과제 사항</div>
            <div class="grid grid-cols-3">
              <div class="text-center p-2 border-r border-b dark:border-slate-700 font-semibold text-sm">단어</div>
              <div class="text-center p-2 border-r border-b dark:border-slate-700 font-semibold text-sm">과제</div>
              <div class="text-center p-2 border-b dark:border-slate-700 font-semibold text-sm">추가 과제</div>
              <div class="text-center p-4 border-r dark:border-slate-700 text-slate-500 min-h-[60px]">미응시</div>
              <div class="text-center p-4 border-r dark:border-slate-700"></div>
              <div class="text-center p-4"></div>
            </div>
          </div>
          <div class="border border-slate-200 dark:border-slate-700 rounded overflow-hidden">
            <div class="bg-primary/60 dark:bg-primary/40 text-white text-center py-2 font-semibold">취약 유형</div>
            <div class="p-8 text-center text-slate-400 bg-white dark:bg-slate-800">
              <span class="italic text-sm">취약 유형 데이터가 집계되지 않았습니다.</span>
            </div>
          </div>
          <div class="border border-slate-200 dark:border-slate-700 rounded overflow-hidden bg-white dark:bg-slate-800 p-4">
            <div class="bg-primary/60 dark:bg-primary/40 text-white text-center py-2 font-semibold -mx-4 -mt-4 mb-4">회차별 성적 추이</div>
            <div class="h-48 relative px-6 mt-4">
              <div class="absolute left-6 top-0 bottom-6 w-px bg-slate-300 dark:bg-slate-600"></div>
              <div class="absolute left-6 bottom-6 right-6 h-px bg-slate-300 dark:bg-slate-600"></div>
              <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                <line class="text-slate-200 dark:text-slate-700" stroke="currentColor" stroke-dasharray="2" x1="0" x2="100" y1="25" y2="25"></line>
                <line class="text-slate-200 dark:text-slate-700" stroke="currentColor" stroke-dasharray="2" x1="0" x2="100" y1="50" y2="50"></line>
                <line class="text-slate-200 dark:text-slate-700" stroke="currentColor" stroke-dasharray="2" x1="0" x2="100" y1="75" y2="75"></line>
                <path d="M 10,70 L 30,30 L 50,50 L 70,70 L 90,35" fill="none" stroke="#f59e0b" stroke-width="2"></path>
                <circle cx="10" cy="70" fill="#f59e0b" r="2"></circle>
                <circle cx="30" cy="30" fill="#f59e0b" r="2"></circle>
                <circle cx="50" cy="50" fill="#f59e0b" r="2"></circle>
                <circle cx="70" cy="70" fill="#f59e0b" r="2"></circle>
                <circle cx="90" cy="35" fill="#f59e0b" r="2"></circle>
              </svg>
              <div class="flex justify-between mt-2 px-2 text-[10px] text-slate-500 font-bold">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
              </div>
              <div class="absolute -left-1 top-0 bottom-6 flex flex-col justify-between text-[10px] text-slate-500 font-bold pr-1">
                <span>20</span><span>15</span><span>10</span><span>5</span><span>0</span>
              </div>
            </div>
          </div>
          <div class="border border-slate-200 dark:border-slate-700 rounded overflow-hidden">
            <div class="bg-primary/60 dark:bg-primary/40 text-white text-center py-2 font-semibold">전달 사항</div>
            <div class="p-6 bg-white dark:bg-slate-800 text-sm space-y-4">
              <div>
                <div class="font-bold text-slate-600 dark:text-slate-400 mb-1">[수업내용]</div>
                <p class="text-slate-700 dark:text-slate-300">24강 + 25강 (6지문) / 교과서 5과</p>
              </div>
              <div>
                <div class="font-bold text-slate-600 dark:text-slate-400 mb-1">[과제]</div>
                <ul class="text-slate-700 dark:text-slate-300 list-none space-y-1">
                  <li>- 포켓보카 전범위 암기</li>
                  <li>- 7주차 주간지 풀이/채점/오답</li>
                  <li>- 교과서 5과 교재 02, 03번 풀이/채점/오답</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer class="mt-16 flex justify-end items-center space-x-2 border-t pt-6 dark:border-slate-800">
        <div class="w-10 h-10 bg-slate-800 dark:bg-slate-200 rounded-full flex items-center justify-center text-white dark:text-slate-800 font-black text-lg italic">
          SHL
        </div>
        <div class="text-right">
          <div class="text-xl font-bold leading-tight">서하늘영어</div>
          <div class="text-[8px] tracking-[0.2em] text-slate-500 uppercase font-medium">SEOHANEUL ENGLISH</div>
        </div>
      </footer>
    </div>
  </body>
</html>`;
}
