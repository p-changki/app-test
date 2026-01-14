"use client";

import { useMemo, useRef, useState } from "react";

import {
  DEFAULT_ACADEMY_EN_NAME,
  DEFAULT_ACADEMY_NAME,
} from "@/features/exam-dashboard/simpleReportTemplate";
import { classEntities } from "@/data/classes";
import { studentEntities } from "@/data/students";
import { useExamStore } from "@/features/exam-data/examStore";
import { useExamResultStore } from "@/features/exam-grade-entry/examResultStore";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

type ReportQuestionRow = {
  no: number;
  source: string;
  type: string;
  status: string;
  rate: string;
};

type ReportStudent = {
  id: string;
  name: string;
  classId: string;
  className: string;
  examName: string;
  examType: string;
  examId: string;
  testDate: string;
  roundLabel: string;
  score: number;
  rank: string;
  average: number;
  attendance: string;
  nextLesson: string;
  assignments: string[];
  studentPhone?: string;
  parentPhone?: string;
  totalQuestions: number;
  questionRows: ReportQuestionRow[];
};

const REPORT_TEMPLATES = [
  {
    id: "premium",
    name: "프리미엄 리포트",
    description: "시험 상세 데이터를 반영한 리포트 템플릿",
  },
  {
    id: "simple",
    name: "심플 리포트",
    description: "템플릿 준비 중",
  },
] as const;

type ReportTemplateId = (typeof REPORT_TEMPLATES)[number]["id"];

type GradeReportContentProps = {
  variant?: "modal" | "page";
  onClose?: () => void;
};

export function GradeReportModal() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-white shadow-sm shadow-primary/30 transition hover:bg-[#1a6bbd]"
      >
        <span className={iconClass("text-lg")}>sms</span>
        성적표 발송
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl rounded-2xl bg-white text-slate-900 shadow-2xl dark:bg-[#0f172a] dark:text-slate-100">
            <GradeReportContent onClose={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}

export function GradeReportContent({
  variant = "modal",
  onClose,
}: GradeReportContentProps) {
  const exams = useExamStore();
  const examResultsByExam = useExamResultStore((state) => state.results);
  const [classKeyword, setClassKeyword] = useState("");
  const [showClassResults, setShowClassResults] = useState(false);
  const [hasSelectedClass, setHasSelectedClass] = useState(false);
  const [classFilter, setClassFilter] = useState<"all" | string>("all");
  const [selectedId, setSelectedId] = useState("");
  const [templateId, setTemplateId] = useState<ReportTemplateId>("premium");
  const [sendState, setSendState] = useState<"idle" | "sending" | "done">(
    "idle"
  );
  const [sendTarget, setSendTarget] = useState<"student" | "parent">("student");
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const reportStudents = useMemo(() => {
    const classMap = new Map(classEntities.map((klass) => [klass.id, klass]));
    const studentMap = new Map(
      studentEntities.map((student) => [student.id, student])
    );
    const entries: ReportStudent[] = [];

    exams
      .filter((exam) => exam.status === "채점 완료")
      .forEach((exam) => {
        const examResults = examResultsByExam[exam.id] ?? {};
        const resultList = Object.values(examResults);
        if (!resultList.length) return;

        const scores = resultList.map((result) => result.score);
        const scoreOrder = Array.from(new Set(scores)).sort((a, b) => b - a);
        const average =
          Math.round(
            (scores.reduce((sum, value) => sum + value, 0) / scores.length) * 10
          ) / 10;
        const questionRateMap = new Map<number, string>();
        exam.questions.forEach((question) => {
          const wrongCount = resultList.reduce((count, result) => {
            const answer = result.answers[question.id];
            if (!answer) return count + 1;
            return normalizeAnswer(answer) === normalizeAnswer(question.answer)
              ? count
              : count + 1;
          }, 0);
          const rate = scores.length
            ? Math.round((wrongCount / scores.length) * 100)
            : 0;
          questionRateMap.set(question.id, `${rate}%`);
        });

        resultList.forEach((result) => {
          const student = studentMap.get(result.studentId);
          if (!student) return;
          const klass =
            classMap.get(exam.classId) ?? classMap.get(student.classId);
          const className = klass?.name ?? exam.targetClass ?? "미지정 수업";
          const attendanceLabel =
            typeof student.attendance === "number"
              ? `출석 ${student.attendance}%`
              : "정보 없음";
          const nextLesson = klass
            ? `${klass.schedule.days.join(" / ")} ${klass.schedule.time}`
            : "다음 수업 미정";
          const studentPhone =
            student.phone ??
            student.contacts?.find((contact) => contact.label.includes("학생"))
              ?.value;
          const parentPhone = student.contacts?.find((contact) =>
            contact.label.includes("학부모")
          )?.value;
          const questionRows = exam.questions.map((question) => {
            const answer = result.answers[question.id];
            const correct =
              answer &&
              normalizeAnswer(answer) === normalizeAnswer(question.answer);
            return {
              no: question.id,
              source: question.source?.trim() || "-",
              type: question.type,
              status: correct ? "O" : "X",
              rate: questionRateMap.get(question.id) ?? "-",
            };
          });
          const rankValue = scoreOrder.indexOf(result.score) + 1;
          entries.push({
            id: `${exam.id}-${student.id}`,
            name: student.name,
            classId: klass?.id ?? exam.classId ?? student.classId,
            className,
            examName: exam.title,
            examType: exam.examType,
            examId: exam.id,
            testDate: exam.examDate,
            roundLabel: exam.summary || "회차 정보 없음",
            score: result.score,
            rank: `${rankValue} / ${scores.length}`,
            average,
            attendance: attendanceLabel,
            nextLesson,
            assignments:
              exam.notes?.length > 0
                ? exam.notes
                : ["오답 노트 작성", "취약 유형 보강", "복습 테스트 대비"],
            studentPhone,
            parentPhone,
            totalQuestions: exam.totalQuestions,
            questionRows,
          });
        });
      });

    return entries.sort((a, b) => {
      if (a.testDate === b.testDate) {
        return a.name.localeCompare(b.name);
      }
      return a.testDate > b.testDate ? -1 : 1;
    });
  }, [exams, examResultsByExam]);

  const classOptions = useMemo(() => {
    const unique = new Map<string, { id: string; label: string }>();
    reportStudents.forEach((student) => {
      if (!unique.has(student.classId)) {
        unique.set(student.classId, {
          id: student.classId,
          label: student.className,
        });
      }
    });
    return Array.from(unique.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [reportStudents]);

  const filteredClasses = useMemo(() => {
    return classOptions.filter((klass) =>
      klass.label.includes(classKeyword.trim())
    );
  }, [classKeyword, classOptions]);

  const filteredStudents = useMemo(() => {
    return reportStudents.filter((student) => {
      return classFilter === "all" ? true : student.classId === classFilter;
    });
  }, [classFilter, reportStudents]);

  const visibleStudents = hasSelectedClass ? filteredStudents : [];
  const effectiveSelectedId =
    visibleStudents.find((student) => student.id === selectedId)?.id ??
    visibleStudents[0]?.id ??
    "";
  const selectedStudent =
    visibleStudents.find((student) => student.id === effectiveSelectedId) ??
    visibleStudents[0];
  const selectedSendPhone =
    selectedStudent && sendTarget === "parent"
      ? selectedStudent.parentPhone
      : selectedStudent?.studentPhone;
  const canSend = Boolean(selectedSendPhone);

  const classInputRef = useRef<HTMLInputElement>(null);

  const closeModal = () => {
    onClose?.();
    setClassKeyword("");
    setShowClassResults(false);
    setHasSelectedClass(false);
    setClassFilter("all");
    setTemplateId("premium");
    setSendState("idle");
    setSendModalOpen(false);
    setSendTarget("student");
    setMessage(null);
  };

  const handleOpenSend = () => {
    if (!selectedStudent) return;
    const defaultTarget = selectedStudent.studentPhone
      ? "student"
      : selectedStudent.parentPhone
        ? "parent"
        : "student";
    setSendTarget(defaultTarget);
    setSendModalOpen(true);
  };

  const handleConfirmSend = () => {
    if (!selectedStudent) return;
    const targetPhone =
      sendTarget === "parent"
        ? selectedStudent.parentPhone
        : selectedStudent.studentPhone;
    if (!targetPhone) return;
    setSendModalOpen(false);
    setSendState("sending");
    window.setTimeout(() => {
      setSendState("done");
      const targetLabel = sendTarget === "parent" ? "학부모" : "학생";
      setMessage(
        `${selectedStudent.name} ${targetLabel} (${targetPhone})에게 카카오톡을 발송했습니다.`
      );
      window.setTimeout(() => {
        setMessage(null);
        setSendState("idle");
      }, 1800);
    }, 1200);
  };

  const handleDownloadPdf = () => {
    if (!selectedStudent) return;
    const html = buildTemplateHtml(templateId, selectedStudent);
    const opened = openPdfPreviewWindow(html, () => {
      setMessage(`${selectedStudent.name} 성적표 PDF를 준비했습니다.`);
      window.setTimeout(() => setMessage(null), 2500);
    });
    if (!opened) {
      setMessage("팝업이 차단되었어요. 브라우저 설정을 확인해주세요.");
      window.setTimeout(() => setMessage(null), 4000);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
        <div>
          <p className="text-sm font-semibold text-primary">
            시험 및 과제 관리
          </p>
          <h3 className="text-xl font-bold">학생 성적표 발송</h3>
        </div>
        {variant === "modal" ? (
          <button
            type="button"
            aria-label="닫기"
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={closeModal}
          >
            <span className={iconClass("text-2xl")}>close</span>
          </button>
        ) : null}
      </div>
      <div className="flex max-h-[80vh] flex-col gap-6 overflow-y-auto px-6 py-6 lg:flex-row">
        <aside className="w-full space-y-4 lg:w-72">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">
              수업 검색
            </p>
            <div className="relative mt-2">
              <input
                ref={classInputRef}
                type="text"
                value={classKeyword}
                onChange={(event) => {
                  if (!showClassResults) {
                    setShowClassResults(true);
                  }
                  setClassKeyword(event.target.value);
                }}
                placeholder="수업명 검색"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-primary/20 dark:border-slate-700 dark:bg-[#1a2632] dark:text-white"
              />
              <span
                className={iconClass(
                  "absolute left-3 top-2.5 cursor-pointer text-slate-400"
                )}
                onClick={() => {
                  setShowClassResults(true);
                  classInputRef.current?.focus();
                }}
              >
                search
              </span>
            </div>
            {classKeyword.trim().length === 0 && !showClassResults ? (
              <div className="mt-3 rounded-xl border border-dashed border-slate-200 px-3 py-6 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
                수업명을 검색하거나 아이콘을 눌러 목록을 불러오세요.
              </div>
            ) : (
              <div className="mt-3 max-h-48 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-[#1a2632]">
                <button
                  type="button"
                  onClick={() => {
                    setClassFilter("all");
                    setHasSelectedClass(true);
                  }}
                  className={cn(
                    "w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition",
                    classFilter === "all"
                      ? "bg-primary/10 text-primary"
                      : "text-slate-600 hover:bg-white dark:text-slate-200"
                  )}
                >
                  전체 수업 보기
                </button>
                {filteredClasses.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setClassFilter(option.id);
                      setHasSelectedClass(true);
                    }}
                    className={cn(
                      "w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition",
                      classFilter === option.id
                        ? "bg-primary/10 text-primary"
                        : "text-slate-600 hover:bg-white dark:text-slate-200"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
                {filteredClasses.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-400">
                    검색된 수업이 없습니다.
                  </p>
                ) : null}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase text-slate-500">
              학생 목록
            </p>
            <div className="space-y-2">
              {!hasSelectedClass ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400 dark:border-slate-700">
                  먼저 수업을 검색하고 선택해주세요.
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400 dark:border-slate-700">
                  조건에 맞는 학생이 없습니다.
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <button
                    key={student.id}
                    type="button"
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition",
                      student.id === effectiveSelectedId
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-slate-100 bg-white text-slate-700 hover:border-primary/30 dark:border-slate-800 dark:bg-[#131c2b] dark:text-slate-300"
                    )}
                    onClick={() => setSelectedId(student.id)}
                  >
                    <div className="size-10 rounded-full bg-primary/10 text-center text-sm font-semibold leading-10 text-primary dark:bg-primary/20 dark:text-primary">
                      {student.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{student.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {student.className} · {student.roundLabel}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-[#1a2632]">
            <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
              템플릿 선택
            </p>
            <div className="space-y-2">
              {REPORT_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setTemplateId(template.id)}
                  className={cn(
                    "w-full rounded-xl border px-4 py-2 text-left",
                    templateId === template.id
                      ? "border-primary bg-white text-primary shadow dark:bg-[#132033]"
                      : "border-transparent text-slate-600 hover:border-slate-200 dark:text-slate-300"
                  )}
                >
                  <p className="text-sm font-semibold">{template.name}</p>
                  <p className="text-xs text-slate-500">
                    {template.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </aside>
        <section className="flex-1 space-y-4">
          {selectedStudent ? (
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#121a27]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-700">
                <div>
                  <p className="text-xs font-semibold text-primary">
                    {selectedStudent.examType}
                  </p>
                  <h4 className="text-2xl font-bold">
                    {selectedStudent.name} ·{" "}
                    <span className="text-primary">
                      {selectedStudent.score}점
                    </span>
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {selectedStudent.className} | {selectedStudent.rank}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition",
                      sendState === "sending"
                        ? "cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                        : "bg-primary text-white hover:bg-primary/90"
                    )}
                    onClick={handleOpenSend}
                  >
                    <span className={iconClass("text-base")}>chat</span>
                    {sendState === "sending"
                      ? "발송 중..."
                      : sendState === "done"
                        ? "발송 완료"
                        : "카카오톡 발송"}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200 dark:hover:border-primary dark:hover:text-primary"
                  >
                    <span className={iconClass("text-base")}>
                      picture_as_pdf
                    </span>
                    성적표 PDF
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <TemplatePreview
                  templateId={templateId}
                  student={selectedStudent}
                />
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-400 dark:border-slate-700">
              조건에 맞는 학생을 선택해 주세요.
            </div>
          )}
          {message ? (
            <p className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary">
              {message}
            </p>
          ) : null}
          {sendModalOpen && selectedStudent ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
              <div className="w-full max-w-lg rounded-2xl bg-white text-slate-900 shadow-2xl dark:bg-[#0f172a] dark:text-slate-100">
                <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      카카오톡 발송
                    </p>
                    <h4 className="text-lg font-bold">발송 대상 선택</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSendModalOpen(false)}
                    className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <span className={iconClass("text-xl")}>close</span>
                  </button>
                </div>
                <div className="space-y-4 px-5 py-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-[#1a2632]">
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      대상 학생
                    </p>
                    <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                      {selectedStudent.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {selectedStudent.className} · {selectedStudent.examName}
                    </p>
                  </div>
                  <div className="space-y-3 text-sm">
                    <button
                      type="button"
                      onClick={() => setSendTarget("student")}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition",
                        sendTarget === "student"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-slate-200 bg-white text-slate-700 hover:border-primary/40 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-200"
                      )}
                    >
                      <div>
                        <p className="text-sm font-semibold">학생</p>
                        <p className="text-xs text-slate-500">
                          {selectedStudent.studentPhone ?? "등록된 번호 없음"}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "material-icons text-lg",
                          sendTarget === "student"
                            ? "text-primary"
                            : "text-slate-300"
                        )}
                      >
                        check_circle
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSendTarget("parent")}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition",
                        sendTarget === "parent"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-slate-200 bg-white text-slate-700 hover:border-primary/40 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-200"
                      )}
                    >
                      <div>
                        <p className="text-sm font-semibold">학부모</p>
                        <p className="text-xs text-slate-500">
                          {selectedStudent.parentPhone ?? "등록된 번호 없음"}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "material-icons text-lg",
                          sendTarget === "parent"
                            ? "text-primary"
                            : "text-slate-300"
                        )}
                      >
                        check_circle
                      </span>
                    </button>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500 dark:border-slate-700 dark:bg-[#1a2632]">
                    카카오톡으로만 발송됩니다. 발송 대상과 번호를 확인해주세요.
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSendModalOpen(false)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmSend}
                    disabled={!canSend || sendState === "sending"}
                    className={cn(
                      "rounded-lg px-4 py-2 text-sm font-semibold text-white transition",
                      !canSend || sendState === "sending"
                        ? "cursor-not-allowed bg-slate-300 dark:bg-slate-700"
                        : "bg-primary hover:bg-primary/90"
                    )}
                  >
                    최종 확인
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </>
  );
}

function TemplatePreview({
  templateId,
  student,
}: {
  templateId: ReportTemplateId;
  student: ReportStudent;
}) {
  if (templateId === "simple") {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#111b24]">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-700">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">
              Simple Report
            </p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {student.name} · {student.examName}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {student.className} | {student.testDate}
            </p>
          </div>
          <div className="rounded-2xl bg-primary/10 px-4 py-3 text-center text-primary">
            <p className="text-xs font-semibold uppercase">Score</p>
            <p className="text-2xl font-bold">{student.score}</p>
            <p className="text-xs">{student.rank}</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-[#0f172a]">
            <p className="text-xs text-slate-500">평균점수</p>
            <p className="text-base font-semibold text-slate-900 dark:text-white">
              {student.average}점
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-[#0f172a]">
            <p className="text-xs text-slate-500">출결</p>
            <p className="text-base font-semibold text-slate-900 dark:text-white">
              {student.attendance}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-[#0f172a]">
            <p className="text-xs text-slate-500">다음 수업</p>
            <p className="text-base font-semibold text-slate-900 dark:text-white">
              {student.nextLesson}
            </p>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-300">
          <p className="font-semibold text-slate-900 dark:text-white">
            전달 사항
          </p>
          <ul className="mt-2 space-y-1">
            {student.assignments.map((assignment) => (
              <li key={assignment}>- {assignment}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return <PremiumReportTemplate student={student} />;
}

function PremiumReportTemplate({ student }: { student: ReportStudent }) {
  const year = student.testDate
    ? new Date(student.testDate).getFullYear()
    : new Date().getFullYear();
  const questionRows = student.questionRows;
  const questionRowsReady = questionRows.length > 0;
  const scoreDiff = student.score - student.average;

  return (
    <div className="rounded-3xl border border-slate-200 bg-background-light p-4 text-slate-800 shadow-sm dark:border-slate-700 dark:bg-background-dark dark:text-slate-100">
      <div className="mx-auto w-full max-w-[1440px] space-y-8">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[#5c88da] dark:text-[#7ca2e9] md:text-6xl">
              {year}
            </h1>
            <h2 className="text-3xl font-bold text-[#5c88da] dark:text-[#7ca2e9] md:text-5xl">
              {DEFAULT_ACADEMY_NAME}
              <br />
              주간 리포트
            </h2>
          </div>
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-slate-800 text-xl font-black italic text-white dark:bg-slate-200 dark:text-slate-800">
                SHL
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold leading-tight">
                  {DEFAULT_ACADEMY_NAME}
                </div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                  {DEFAULT_ACADEMY_EN_NAME}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-7">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#111b24]">
                <div className="grid grid-cols-2 text-sm">
                  <div className="bg-primary/80 p-3 text-center font-semibold text-white">
                    학생 이름
                  </div>
                  <div className="p-3 text-center">{student.name}</div>
                  <div className="bg-primary/80 p-3 text-center font-semibold text-white">
                    학원명
                  </div>
                  <div className="p-3 text-center">{DEFAULT_ACADEMY_NAME}</div>
                  <div className="bg-primary/80 p-3 text-center font-semibold text-white">
                    수강반
                  </div>
                  <div className="p-3 text-center">{student.className}</div>
                  <div className="bg-primary/80 p-3 text-center font-semibold text-white">
                    시험 종류
                  </div>
                  <div className="p-3 text-center">{student.examType}</div>
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#111b24]">
                <div className="grid grid-cols-2 text-sm">
                  <div className="bg-primary/80 p-3 text-center font-semibold text-white">
                    수강일자
                  </div>
                  <div className="p-3 text-center">{student.testDate}</div>
                  <div className="bg-primary/80 p-3 text-center font-semibold text-white">
                    회차
                  </div>
                  <div className="p-3 text-center">{student.roundLabel}</div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#111b24]">
              <div className="bg-primary/60 py-2 text-center font-semibold text-white dark:bg-primary/40">
                응시 결과
              </div>
              <div className="grid grid-cols-3 text-center text-sm">
                <div className="border-r border-slate-200 py-3 font-semibold text-slate-500 dark:border-slate-700">
                  원점수
                </div>
                <div className="border-r border-slate-200 py-3 font-semibold text-slate-500 dark:border-slate-700">
                  석차
                </div>
                <div className="py-3 font-semibold text-slate-500">
                  평균점수
                </div>
                <div className="border-t border-r border-slate-200 py-5 text-lg dark:border-slate-700">
                  {student.score}점
                </div>
                <div className="border-t border-r border-slate-200 py-5 text-lg dark:border-slate-700">
                  {student.rank}
                </div>
                <div className="border-t border-slate-200 py-5 text-lg dark:border-slate-700">
                  {student.average}점
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#111b24]">
              <div className="bg-primary/60 py-2 text-center font-semibold text-white dark:bg-primary/40">
                문항별 응시 결과
              </div>
              <table className="w-full border-collapse text-sm">
                <thead className="bg-slate-50 text-slate-600 dark:bg-[#0f172a] dark:text-slate-300">
                  <tr>
                    <th className="px-3 py-2 text-center">No.</th>
                    <th className="px-3 py-2 text-center">출처</th>
                    <th className="px-3 py-2 text-center">유형</th>
                    <th className="px-3 py-2 text-center">O/X</th>
                    <th className="px-3 py-2 text-center">오답률</th>
                  </tr>
                </thead>
                <tbody>
                  {questionRowsReady ? (
                    questionRows.map((row) => (
                      <tr
                        key={`${student.id}-${row.no}`}
                        className="border-t border-slate-100 text-center text-slate-600 dark:border-slate-700 dark:text-slate-300"
                      >
                        <td className="px-3 py-2">{row.no}</td>
                        <td className="px-3 py-2">{row.source}</td>
                        <td className="px-3 py-2">{row.type}</td>
                        <td className="px-3 py-2">{row.status}</td>
                        <td className="px-3 py-2">{row.rate}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="px-3 py-6 text-center text-slate-400"
                        colSpan={5}
                      >
                        문항 결과 데이터가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-8 lg:col-span-5">
            <div className="grid h-32 grid-cols-2 overflow-hidden rounded-2xl border border-slate-200 bg-white text-sm dark:border-slate-700 dark:bg-[#111b24]">
              <div className="flex flex-col">
                <div className="bg-primary/60 py-2 text-center font-semibold text-white dark:bg-primary/40">
                  출결
                </div>
                <div className="flex flex-1 items-center justify-center border-r border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-300">
                    {student.attendance}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="bg-primary/60 py-2 text-center font-semibold text-white dark:bg-primary/40">
                  {student.examType}
                </div>
                <div className="flex flex-1 items-center justify-center">
                  <span className="text-slate-600 dark:text-slate-300">
                    자료수령
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-sm dark:border-slate-700 dark:bg-[#111b24]">
              <div className="bg-primary/60 py-2 text-center font-semibold text-white dark:bg-primary/40">
                과제 사항
              </div>
              <div className="grid grid-cols-3 text-center">
                <div className="border-b border-r border-slate-200 py-2 font-semibold dark:border-slate-700">
                  단어
                </div>
                <div className="border-b border-r border-slate-200 py-2 font-semibold dark:border-slate-700">
                  과제
                </div>
                <div className="border-b border-slate-200 py-2 font-semibold dark:border-slate-700">
                  추가 과제
                </div>
                <div className="border-r border-slate-200 py-4 text-slate-500 dark:border-slate-700">
                  {student.assignments[0] ?? "미응시"}
                </div>
                <div className="border-r border-slate-200 py-4 text-slate-500 dark:border-slate-700">
                  {student.assignments[1] ?? ""}
                </div>
                <div className="py-4 text-slate-500">
                  {student.assignments[2] ?? ""}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#111b24]">
              <div className="bg-primary/60 py-2 text-center font-semibold text-white dark:bg-primary/40">
                취약 유형
              </div>
              <div className="p-8 text-center text-sm text-slate-400">
                취약 유형 데이터가 집계되지 않았습니다.
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#111b24]">
              <div className="bg-primary/60 py-2 text-center font-semibold text-white dark:bg-primary/40">
                회차별 성적 추이
              </div>
              <div className="mt-4 space-y-3 text-xs text-slate-500">
                <div className="flex items-center justify-between">
                  <span>이번 시험 점수</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {student.score}점
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>반 평균 대비</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {scoreDiff >= 0 ? `+${scoreDiff}` : scoreDiff}점
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>다음 수업</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {student.nextLesson}
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#111b24]">
              <div className="bg-primary/60 py-2 text-center font-semibold text-white dark:bg-primary/40">
                전달 사항
              </div>
              <div className="space-y-4 p-6 text-sm text-slate-600 dark:text-slate-300">
                <div>
                  <div className="mb-1 font-bold text-slate-500 dark:text-slate-400">
                    [수업내용]
                  </div>
                  <p>시험 결과 피드백 및 오답 정리</p>
                </div>
                <div>
                  <div className="mb-1 font-bold text-slate-500 dark:text-slate-400">
                    [과제]
                  </div>
                  <ul className="space-y-1">
                    {student.assignments.map((assignment) => (
                      <li key={assignment}>- {assignment}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function normalizeAnswer(value?: string | number) {
  if (value === null || value === undefined) return "";
  return String(value).trim().toLowerCase();
}

function buildTemplateHtml(
  templateId: ReportTemplateId,
  student: ReportStudent
) {
  if (templateId === "simple") {
    return `
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="utf-8" />
          <title>${student.name} 성적표</title>
          <style>
            body { font-family: Pretendard, sans-serif; background:#f8fafc; margin:0; padding:32px; color:#0f172a; }
            .card { max-width:720px; margin:0 auto; background:#fff; border-radius:16px; padding:24px; border:1px solid #e2e8f0; box-shadow:0 8px 20px rgba(15,23,42,0.08); }
            .row { display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap; }
            .badge { background:#e0edff; color:#2563eb; padding:6px 12px; border-radius:999px; font-size:12px; font-weight:600; }
            .grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; margin-top:16px; }
            .box { border:1px solid #e2e8f0; border-radius:12px; padding:12px; background:#f8fafc; }
            ul { margin:8px 0 0; padding-left:16px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="row">
              <div>
                <div class="badge">Simple Report</div>
                <h2 style="margin:10px 0 4px;">${student.name} · ${student.examName}</h2>
                <p style="margin:0;color:#64748b;">${student.className} | ${student.testDate}</p>
              </div>
              <div style="text-align:center;">
                <div style="font-size:12px;color:#64748b;">점수</div>
                <div style="font-size:28px;font-weight:700;color:#2563eb;">${student.score}</div>
                <div style="font-size:12px;color:#64748b;">${student.rank}</div>
              </div>
            </div>
            <div class="grid">
              <div class="box">
                <div style="font-size:12px;color:#64748b;">평균점수</div>
                <div style="font-size:16px;font-weight:700;">${student.average}점</div>
              </div>
              <div class="box">
                <div style="font-size:12px;color:#64748b;">출결</div>
                <div style="font-size:16px;font-weight:700;">${student.attendance}</div>
              </div>
              <div class="box">
                <div style="font-size:12px;color:#64748b;">다음 수업</div>
                <div style="font-size:16px;font-weight:700;">${student.nextLesson}</div>
              </div>
            </div>
            <div style="margin-top:16px;border-top:1px dashed #e2e8f0;padding-top:12px;">
              <div style="font-weight:600;">전달 사항</div>
              <ul>
                ${student.assignments
                  .map((assignment) => `<li>${assignment}</li>`)
                  .join("")}
              </ul>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  const questionRowsHtml =
    student.questionRows.length > 0
      ? student.questionRows
          .map(
            (row) => `
        <tr>
          <td>${row.no}</td>
          <td>${row.source}</td>
          <td>${row.type}</td>
          <td>${row.status}</td>
          <td>${row.rate}</td>
        </tr>`
          )
          .join("")
      : `<tr><td colspan="5" style="padding:12px;text-align:center;color:#94a3b8;">문항 결과 데이터가 없습니다.</td></tr>`;
  const scoreDiff = student.score - student.average;

  return `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="utf-8" />
        <title>${student.name} 성적 리포트</title>
        <style>
          body { font-family: Pretendard, sans-serif; background:#f6f6f8; margin:0; padding:24px; color:#0f172a; }
          .container { max-width:960px; margin:0 auto; background:#fff; border-radius:18px; padding:24px; box-shadow:0 12px 30px rgba(15,23,42,0.08); }
          .grid { display:grid; gap:16px; }
          .grid-2 { grid-template-columns:repeat(2,minmax(0,1fr)); }
          .grid-3 { grid-template-columns:repeat(3,minmax(0,1fr)); }
          h1 { margin:0; font-size:32px; color:#5c88da; }
          h2 { margin:8px 0 0; font-size:24px; color:#5c88da; }
          table { width:100%; border-collapse:collapse; font-size:12px; }
          th, td { border:1px solid #e2e8f0; padding:8px; text-align:center; }
          th { background:#eef2ff; }
          .section-title { background:#76c7c0; color:#fff; padding:8px; text-align:center; border-radius:8px; font-weight:600; }
          .muted { color:#64748b; font-size:12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;">
            <div>
              <h1>${DEFAULT_ACADEMY_NAME}</h1>
              <h2>성적 리포트</h2>
              <p class="muted">${student.className}</p>
            </div>
            <div style="text-align:right;">
              <div class="muted">${student.testDate}</div>
              <div style="font-weight:600;">${student.examName}</div>
            </div>
          </div>
          <div class="grid grid-2" style="margin-top:16px;">
            <div style="border:1px solid #e2e8f0;border-radius:12px;padding:12px;">
              <div class="muted">학생 이름</div>
              <div style="font-size:18px;font-weight:700;">${student.name}</div>
            </div>
            <div style="border:1px solid #e2e8f0;border-radius:12px;padding:12px;">
              <div class="muted">시험 종류</div>
              <div style="font-size:18px;font-weight:700;">${student.examType}</div>
            </div>
          </div>
          <div class="grid grid-3" style="margin-top:16px;">
            <div style="border:1px solid #e2e8f0;border-radius:12px;padding:12px;">
              <div class="muted">원점수</div>
              <div style="font-size:18px;font-weight:700;">${student.score}점</div>
            </div>
            <div style="border:1px solid #e2e8f0;border-radius:12px;padding:12px;">
              <div class="muted">석차</div>
              <div style="font-size:18px;font-weight:700;">${student.rank}</div>
            </div>
            <div style="border:1px solid #e2e8f0;border-radius:12px;padding:12px;">
              <div class="muted">평균점수</div>
              <div style="font-size:18px;font-weight:700;">${student.average}점</div>
            </div>
          </div>
          <div style="margin-top:16px;">
            <div class="section-title">문항별 응시 결과</div>
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>출처</th>
                  <th>유형</th>
                  <th>O/X</th>
                  <th>오답률</th>
                </tr>
              </thead>
              <tbody>
                ${questionRowsHtml}
              </tbody>
            </table>
          </div>
          <div style="margin-top:16px;border-top:1px dashed #e2e8f0;padding-top:12px;font-size:12px;color:#64748b;">
            반 평균 대비 ${scoreDiff >= 0 ? `+${scoreDiff}` : scoreDiff}점 · 출결 ${student.attendance}
          </div>
        </div>
      </body>
    </html>
  `;
}

function openPdfPreviewWindow(html: string, onPrinted?: () => void) {
  const pdfWindow = window.open("", "_blank", "width=900,height=1200");
  if (!pdfWindow) {
    return false;
  }

  let handled = false;
  const triggerPrint = () => {
    if (handled) return;
    handled = true;
    pdfWindow.focus();
    pdfWindow.print();
    pdfWindow.removeEventListener("load", triggerPrint);
    onPrinted?.();
  };

  pdfWindow.addEventListener("load", triggerPrint);
  pdfWindow.document.write(html);
  pdfWindow.document.close();
  window.setTimeout(triggerPrint, 1500);
  return true;
}
