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

import { classEntities } from "@/data/classes";
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

export function StudentGradesDetail() {
  const teacherOptions = useMemo(
    () => Array.from(new Set(classEntities.map((klass) => klass.teacher))),
    []
  );
  const [selectedTeacher, setSelectedTeacher] = useState(
    teacherOptions[0] ?? "담당 강사"
  );
  const [selectedCourseId, setSelectedCourseId] = useState(
    courseExams[0]?.id ?? ""
  );
  const [selectedExamId, setSelectedExamId] = useState<string>("ALL");
  const [showAllModal, setShowAllModal] = useState(false);

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
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-[color:var(--surface-text-muted)]">
            <span>홈</span>
            <span className={iconClass("text-[14px]")}>chevron_right</span>
            <span>학생 페이지</span>
            <span className={iconClass("text-[14px]")}>chevron_right</span>
            <span className="text-primary font-medium">성적 조회</span>
          </div>
          <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1
                className={cn(
                  lexend.className,
                  "text-3xl font-bold tracking-tight text-[color:var(--surface-text)] md:text-4xl"
                )}
              >
                상세 성적 조회
              </h1>
              <p className="text-sm text-[color:var(--surface-text-muted)]">
                {selectedTeacher} 강사 수업 종합 리포트
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <label className="relative">
                <select
                  className="appearance-none rounded-lg border border-[color:var(--surface-border)] bg-[var(--surface-panel)] py-2.5 pl-4 pr-10 text-sm font-medium text-[color:var(--surface-text)] shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={selectedTeacher}
                  onChange={(event) => setSelectedTeacher(event.target.value)}
                >
                  {teacherOptions.map((teacher) => (
                    <option key={teacher} value={teacher}>
                      {teacher} 강사
                    </option>
                  ))}
                </select>
                <span
                  className={iconClass(
                    "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-base text-[color:var(--surface-text-muted)]"
                  )}
                >
                  expand_more
                </span>
              </label>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--surface-border)] bg-[var(--surface-panel)] px-4 py-2.5 text-sm font-medium text-[color:var(--surface-text)] transition hover:bg-[color:var(--surface-border)]/30"
              >
                <span className={iconClass("text-[18px]")}>print</span>
              </button>
            </div>
          </header>
        </div>

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
              <h2 className="text-lg font-bold">성적 변화 추이</h2>
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
              <h2 className="text-lg font-bold">상세 성적표</h2>
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
                    filteredRows.slice(0, 3).map((row) => (
                      <tr
                        key={`${row.courseName}-${row.id}`}
                        className="transition hover:bg-[var(--surface-background)]"
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
                          <button className="text-xs font-medium text-primary hover:underline">
                            상세보기
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {filteredRows.length > 3 ? (
                <div className="border-t border-[color:var(--surface-border)] px-6 py-3 text-right">
                  <button
                    type="button"
                    className="text-sm font-semibold text-primary hover:underline"
                    onClick={() => setShowAllModal(true)}
                  >
                    전체 보기
                  </button>
                </div>
              ) : null}
            </div>
          </article>
        </section>
      </div>
      {showAllModal ? (
        <GradesModal
          rows={filteredRows}
          onClose={() => setShowAllModal(false)}
        />
      ) : null}
    </div>
  );
}

function GradesModal({
  rows,
  onClose,
}: {
  rows: GradeRow[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
      <div className="flex w-full max-w-4xl flex-col rounded-2xl border border-[color:var(--surface-border)] bg-[var(--surface-panel)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[color:var(--surface-border)] px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-[color:var(--surface-text)]">
              전체 시험 내역
            </h3>
            <p className="text-xs text-[color:var(--surface-text-muted)]">
              조건에 해당하는 모든 시험 결과입니다.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-[color:var(--surface-text-muted)] transition hover:bg-[color:var(--surface-border)]/30"
            onClick={onClose}
            aria-label="전체 시험 모달 닫기"
          >
            <span className={iconClass("text-lg")}>close</span>
          </button>
        </div>
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[color:var(--surface-background)] text-xs font-semibold uppercase text-[color:var(--surface-text-muted)]">
              <tr>
                <th className="p-4 pl-6">수업명</th>
                <th className="p-4">시험</th>
                <th className="p-4">과목</th>
                <th className="p-4">원점수</th>
                <th className="p-4">학급 평균</th>
                <th className="p-4">석차</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--surface-border)]">
              {rows.map((row) => (
                <tr key={`modal-${row.courseName}-${row.id}`}>
                  <td className="p-4 pl-6 font-semibold">{row.courseName}</td>
                  <td className="p-4 text-[color:var(--surface-text-muted)]">
                    {row.examLabel}
                  </td>
                  <td className="p-4 text-[color:var(--surface-text-muted)]">
                    {row.subject}
                  </td>
                  <td className="p-4 font-bold">{row.score}</td>
                  <td className="p-4 text-[color:var(--surface-text-muted)]">
                    {row.classAvg}
                  </td>
                  <td className="p-4 font-semibold text-primary">{row.rank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-[color:var(--surface-border)] px-6 py-4 text-right">
          <button
            type="button"
            className="rounded-lg border border-[color:var(--surface-border)] px-4 py-2 text-sm font-medium text-[color:var(--surface-text)] transition hover:bg-[color:var(--surface-border)]/30"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
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
