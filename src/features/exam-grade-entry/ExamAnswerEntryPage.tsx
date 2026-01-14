"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { studentEntities } from "@/data/students";
import {
  registerExam,
  useExamById,
  useExamStore,
} from "@/features/exam-data/examStore";
import {
  getExamResults,
  useExamResultStore,
} from "@/features/exam-grade-entry/examResultStore";
import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

const choiceOptions = ["1", "2", "3", "4", "5"] as const;

export function ExamAnswerEntryPage({ examId }: { examId: string }) {
  const router = useRouter();
  const exam = useExamById(examId);
  const examList = useExamStore();
  const results = useExamResultStore((state) => state.results);
  const upsertResult = useExamResultStore((state) => state.upsertResult);
  const setLocked = useExamResultStore((state) => state.setLocked);
  const examResults = useMemo(
    () => getExamResults(results, examId),
    [results, examId]
  );
  const examQuestions = useMemo(() => exam?.questions ?? [], [exam]);
  const examTotalQuestions = exam?.totalQuestions ?? 0;
  const examPassScore = exam?.passScore ?? 0;
  const examTypeLabel = exam?.examType || "시험";
  const examSourceLabel = exam?.source || "학원 제작";
  const students = useMemo(() => {
    if (!exam) return [];
    return studentEntities
      .filter((student) => student.classId === exam.classId)
      .slice(0, 5);
  }, [exam]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportVisibleCount, setReportVisibleCount] = useState(10);
  const [reportStudentVisibleCount, setReportStudentVisibleCount] = useState(5);

  const effectiveStudentId = useMemo(() => {
    if (
      selectedStudentId &&
      students.some((student) => student.id === selectedStudentId)
    ) {
      return selectedStudentId;
    }
    return students[0]?.id ?? "";
  }, [selectedStudentId, students]);
  const selectedStudent = students.find(
    (student) => student.id === effectiveStudentId
  );
  const currentResult = effectiveStudentId
    ? (examResults[effectiveStudentId] ?? null)
    : null;
  const currentAnswers = useMemo(
    () => currentResult?.answers ?? {},
    [currentResult]
  );
  const currentScore = currentResult?.score ?? 0;
  const isLocked = currentResult?.locked ?? false;

  const correctCount = useMemo(() => {
    if (!effectiveStudentId) return 0;
    return examQuestions.reduce((count, question) => {
      const answer = currentAnswers[question.id];
      if (!answer) return count;
      return normalizeAnswer(answer) === normalizeAnswer(question.answer)
        ? count + 1
        : count;
    }, 0);
  }, [currentAnswers, examQuestions, effectiveStudentId]);

  const accuracy = examTotalQuestions
    ? Math.round((correctCount / examTotalQuestions) * 100)
    : 0;
  const passState = currentScore >= examPassScore ? "통과" : "미통과";

  const handleSelect = (studentId: string) => {
    setSelectedStudentId(studentId);
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    if (!effectiveStudentId) return;
    if (isLocked) return;
    const nextAnswers = { ...currentAnswers, [questionId]: answer };
    const nextScore = calculateScore(examQuestions, nextAnswers);
    upsertResult({
      examId,
      studentId: effectiveStudentId,
      answers: nextAnswers,
      score: nextScore,
    });
  };

  const handleTempSave = () => {
    if (!effectiveStudentId) return;
    const nextScore = calculateScore(examQuestions, currentAnswers);
    upsertResult({
      examId,
      studentId: effectiveStudentId,
      answers: currentAnswers,
      score: nextScore,
      locked: false,
    });
  };

  const handleSave = () => {
    if (!effectiveStudentId) return;
    const nextScore = calculateScore(examQuestions, currentAnswers);
    upsertResult({
      examId,
      studentId: effectiveStudentId,
      answers: currentAnswers,
      score: nextScore,
      locked: true,
    });
  };

  const handleEdit = () => {
    if (!effectiveStudentId) return;
    setLocked(examId, effectiveStudentId, false);
  };

  const resultEntries = useMemo(() => {
    const base = students
      .map((student) => {
        const result = examResults[student.id];
        if (!result) return null;
        const correct = examQuestions.reduce((count, question) => {
          const answer = result.answers[question.id];
          if (!answer) return count;
          return normalizeAnswer(answer) === normalizeAnswer(question.answer)
            ? count + 1
            : count;
        }, 0);
        return {
          id: student.id,
          name: student.name,
          score: result.score,
          correct,
        };
      })
      .filter(Boolean) as Array<{
      id: string;
      name: string;
      score: number;
      correct: number;
    }>;
    const scoreOrder = Array.from(
      new Set(base.map((entry) => entry.score))
    ).sort((a, b) => b - a);
    return base.map((entry) => ({
      ...entry,
      rank: scoreOrder.indexOf(entry.score) + 1,
    }));
  }, [students, examResults, examQuestions]);

  const allLocked =
    students.length > 0 &&
    students.every((student) => examResults[student.id]?.locked);
  const canPreview = resultEntries.length > 0;

  const handleFinalize = () => {
    if (!exam || !allLocked) return;
    setReportVisibleCount(10);
    setReportStudentVisibleCount(5);
    setReportOpen(true);
  };

  const handlePreview = () => {
    if (!canPreview) return;
    setReportVisibleCount(10);
    setReportStudentVisibleCount(5);
    setReportOpen(true);
  };

  const handleConfirmFinalize = () => {
    if (!exam) return;
    registerExam({ ...exam, status: "채점 완료" });
    router.push("/exam-dashboard");
  };

  const reportSummary = useMemo(() => {
    if (!resultEntries.length) {
      return { average: 0, topAverage: 0, max: 0 };
    }
    const scores = resultEntries.map((entry) => entry.score);
    const average =
      scores.reduce((sum, value) => sum + value, 0) / scores.length;
    const sorted = [...scores].sort((a, b) => b - a);
    const topCount = Math.max(1, Math.ceil(sorted.length * 0.3));
    const topAverage =
      sorted.slice(0, topCount).reduce((sum, value) => sum + value, 0) /
      topCount;
    const max = sorted[0] ?? 0;
    return {
      average: Math.round(average * 10) / 10,
      topAverage: Math.round(topAverage * 10) / 10,
      max,
    };
  }, [resultEntries]);

  const questionStats = useMemo(() => {
    if (!resultEntries.length) return [];
    return examQuestions.map((question) => {
      const total = resultEntries.length;
      const choiceCounts = choiceOptions.reduce<Record<string, number>>(
        (acc, option) => {
          acc[option] = 0;
          return acc;
        },
        {}
      );
      let correctCount = 0;
      resultEntries.forEach((entry) => {
        const answer = examResults[entry.id]?.answers[question.id];
        if (answer) {
          if (choiceCounts[answer] !== undefined) {
            choiceCounts[answer] += 1;
          }
          if (normalizeAnswer(answer) === normalizeAnswer(question.answer)) {
            correctCount += 1;
          }
        }
      });
      const correctRate = total ? Math.round((correctCount / total) * 100) : 0;
      return {
        id: question.id,
        correctRate,
        wrongRate: 100 - correctRate,
        choices: choiceOptions.map((option) => ({
          option,
          rate: total ? Math.round((choiceCounts[option] / total) * 100) : 0,
        })),
      };
    });
  }, [examQuestions, examResults, resultEntries]);

  if (!exam) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        존재하지 않는 시험입니다.
      </div>
    );
  }

  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200"
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
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
              학생 답안 입력 및 채점
            </li>
          </ol>
        </nav>

        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1
              className={cn(
                lexend.className,
                "text-2xl font-black text-slate-900 dark:text-white"
              )}
            >
              학생 답안 입력 및 채점 관리
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {exam.title} · {exam.targetClass}
            </p>
          </div>
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            시험 선택
            <div className="flex items-center gap-2">
              <select
                value={examId}
                onChange={(event) =>
                  router.push(`/exam-grade-entry/${event.target.value}`)
                }
                className="min-w-[220px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                {examList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} · {item.targetClass}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => router.push("/exam-dashboard")}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                aria-label="대시보드로 돌아가기"
              >
                <span className={iconClass("text-lg")}>arrow_back</span>
                돌아가기
              </button>
            </div>
          </label>
        </header>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  학생 리스트
                </p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {students.length}명
                </p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                현재 시험
              </span>
            </div>
            <div className="space-y-2">
              {students.map((student) => {
                const studentResult = examResults[student.id];
                const statusLabel = studentResult?.locked
                  ? "채점 완료"
                  : studentResult
                    ? "임시 저장"
                    : "대기";
                return (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => handleSelect(student.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition",
                      selectedStudentId === student.id
                        ? "border-primary bg-primary/5"
                        : "border-slate-200 bg-white hover:border-primary/40 hover:bg-slate-50",
                      "dark:border-slate-700 dark:bg-slate-900"
                    )}
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {student.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {exam.targetClass}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-400">
                        {statusLabel}
                      </p>
                      {studentResult ? (
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {studentResult.score}점
                        </p>
                      ) : null}
                    </div>
                  </button>
                );
              })}
              {!students.length ? (
                <p className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                  해당 수업에 등록된 학생이 없습니다.
                </p>
              ) : null}
            </div>
            <div className="mt-4">
              <button
                type="button"
                disabled={!canPreview}
                onClick={handlePreview}
                className={cn(
                  "mb-2 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition",
                  canPreview
                    ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                )}
              >
                미리보기
                <span className={iconClass("text-base")}>visibility</span>
              </button>
              <button
                type="button"
                disabled={!allLocked}
                onClick={handleFinalize}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition",
                  allLocked
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "cursor-not-allowed bg-slate-100 text-slate-400"
                )}
              >
                전체 완료
                <span className={iconClass("text-base")}>check_circle</span>
              </button>
              <p className="mt-2 text-center text-xs text-slate-400">
                모든 학생이 저장되면 활성화됩니다.
              </p>
            </div>
          </aside>

          <section className="space-y-5">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  선택 학생
                </p>
                <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                  {selectedStudent?.name ?? "학생 선택"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedStudent ? exam.targetClass : "학생을 선택해주세요."}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  실시간 점수
                </p>
                <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                  {currentScore}
                  <span className="text-sm text-slate-400">/100</span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  통과 기준 {exam.passScore}점
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  정답 개수
                </p>
                <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                  {correctCount}
                  <span className="text-sm text-slate-400">
                    /{exam.totalQuestions}
                  </span>
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold",
                      passState === "통과"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-rose-100 text-rose-600"
                    )}
                  >
                    {passState}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    정답률 {accuracy}%
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  문항별 답안 입력
                </h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                  {examTypeLabel} · {examSourceLabel}
                </span>
              </div>
              <div className="space-y-3">
                {exam.questions.slice(0, visibleCount).map((question) => {
                  const selectedAnswer = currentAnswers[question.id] ?? "";
                  const isCorrect =
                    selectedAnswer &&
                    normalizeAnswer(selectedAnswer) ===
                      normalizeAnswer(question.answer);
                  return (
                    <div
                      key={question.id}
                      className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/60 md:flex-row md:items-center"
                    >
                      <div className="flex items-center gap-4 md:w-56">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          {question.id}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {question.label}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {question.type} · {question.points}점
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {choiceOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() =>
                              handleAnswerChange(question.id, option)
                            }
                            disabled={isLocked}
                            className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold transition",
                              selectedAnswer === option
                                ? "border-primary bg-primary text-white"
                                : "border-slate-200 text-slate-600 hover:border-primary/60 hover:text-primary",
                              "dark:border-slate-700 dark:text-slate-300",
                              isLocked ? "cursor-not-allowed opacity-60" : ""
                            )}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        {selectedAnswer ? (
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-1 text-xs font-semibold",
                              isCorrect
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-rose-100 text-rose-600"
                            )}
                          >
                            {isCorrect ? "정답" : "오답"}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">미입력</span>
                        )}
                        <span className="text-xs text-slate-400">
                          정답 {question.answer}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {visibleCount < exam.totalQuestions ? (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleCount((prev) =>
                        Math.min(prev + 10, exam.totalQuestions)
                      )
                    }
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    더보기 ({visibleCount}/{exam.totalQuestions})
                    <span className={iconClass("text-base")}>expand_more</span>
                  </button>
                </div>
              ) : null}
              <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleTempSave}
                  disabled={!selectedStudentId || isLocked}
                  className={cn(
                    "rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50",
                    isLocked
                      ? "cursor-not-allowed bg-slate-100 text-slate-400"
                      : "",
                    "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  )}
                >
                  임시저장
                </button>
                {isLocked ? (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    수정
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!selectedStudentId}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    저장
                  </button>
                )}
              </div>
              {!selectedStudentId ? (
                <div className="mt-4 rounded-lg border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                  학생을 선택하면 답안을 입력할 수 있습니다.
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
      {reportOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setReportOpen(false)}
          />
          <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  시험 리포트
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {exam.title} · {exam.examDate}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReportOpen(false)}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <span className={iconClass("text-base")}>close</span>
              </button>
            </div>
            <div className="space-y-6 px-6 py-5 text-sm text-slate-600 dark:text-slate-300">
              <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-400">
                      시험 일자
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {exam.examDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400">평균</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {reportSummary.average}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400">
                      상위 30% 평균
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {reportSummary.topAverage}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400">
                      최고점수
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {reportSummary.max}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                <div className="border-b border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  학생별 성적
                </div>
                <div className="max-h-[260px] overflow-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <tr>
                        <th className="px-4 py-3">이름</th>
                        <th className="px-4 py-3">정답개수</th>
                        <th className="px-4 py-3">점수(배점식)</th>
                        <th className="px-4 py-3">석차</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {resultEntries
                        .slice(0, reportStudentVisibleCount)
                        .map((entry) => (
                          <tr key={entry.id}>
                            <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                              {entry.name}
                            </td>
                            <td className="px-4 py-3">
                              {entry.correct}/{exam.totalQuestions}
                            </td>
                            <td className="px-4 py-3">{entry.score}</td>
                            <td className="px-4 py-3">
                              {entry.rank} / {resultEntries.length}
                            </td>
                          </tr>
                        ))}
                      {resultEntries.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-4 py-6 text-center text-sm text-slate-400"
                          >
                            성적 데이터가 없습니다.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-center border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/50">
                  <button
                    type="button"
                    onClick={() =>
                      setReportStudentVisibleCount((prev) =>
                        Math.min(prev + 5, resultEntries.length || prev + 5)
                      )
                    }
                    className={cn(
                      "flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
                      resultEntries.length <= reportStudentVisibleCount
                        ? "opacity-60"
                        : ""
                    )}
                  >
                    더보기 ({reportStudentVisibleCount}/
                    {Math.max(resultEntries.length, reportStudentVisibleCount)})
                    <span className={iconClass("text-base")}>expand_more</span>
                  </button>
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                <div className="border-b border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  문항별 오답률
                </div>
                <div className="max-h-[420px] overflow-auto">
                  <table className="min-w-full text-center text-sm">
                    <thead className="bg-slate-50 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <tr>
                        <th className="px-4 py-3">문제번호</th>
                        <th className="px-4 py-3">정답률</th>
                        <th className="px-4 py-3">오답률</th>
                        {choiceOptions.map((option) => (
                          <th key={option} className="px-4 py-3">
                            {option}번
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {questionStats
                        .slice(0, reportVisibleCount)
                        .map((stat) => (
                          <tr key={stat.id}>
                            <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                              {stat.id}
                            </td>
                            <td className="px-4 py-3 text-emerald-600">
                              {stat.correctRate}%
                            </td>
                            <td className="px-4 py-3 text-rose-600">
                              {stat.wrongRate}%
                            </td>
                            {stat.choices.map((choice) => (
                              <td key={choice.option} className="px-4 py-3">
                                {choice.rate}%
                              </td>
                            ))}
                          </tr>
                        ))}
                      {questionStats.length === 0 ? (
                        <tr>
                          <td
                            colSpan={8}
                            className="px-4 py-6 text-center text-sm text-slate-400"
                          >
                            오답률 데이터가 없습니다.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
                {questionStats.length > reportVisibleCount ? (
                  <div className="flex justify-center border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/50">
                    <button
                      type="button"
                      onClick={() =>
                        setReportVisibleCount((prev) =>
                          Math.min(prev + 10, questionStats.length)
                        )
                      }
                      className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                      더보기 ({reportVisibleCount}/{questionStats.length})
                      <span className={iconClass("text-base")}>
                        expand_more
                      </span>
                    </button>
                  </div>
                ) : null}
              </section>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-900/50">
              <button
                type="button"
                onClick={() => setReportOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmFinalize}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
              >
                최종 저장
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase();
}

function calculateScore(
  questions: { id: number; points: number; answer: string }[],
  answers: Record<number, string>
) {
  return questions.reduce((total, question) => {
    const answer = answers[question.id];
    if (!answer) return total;
    return normalizeAnswer(answer) === normalizeAnswer(question.answer)
      ? total + question.points
      : total;
  }, 0);
}
