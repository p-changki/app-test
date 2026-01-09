"use client";

import { useMemo, useRef, useState } from "react";

import {
  SimpleReportData,
  SimpleReportPreview,
  buildQuestionRows,
  buildSimpleTemplateHtml,
  DEFAULT_ACADEMY_EN_NAME,
  DEFAULT_ACADEMY_NAME,
} from "@/features/exam-dashboard/simpleReportTemplate";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

type ReportStudent = {
  id: string;
  name: string;
  classId: string;
  className: string;
  examName: string;
  examType: string;
  testDate: string;
  roundLabel: string;
  score: number;
  rank: string;
  average: number;
  attendance: string;
  nextLesson: string;
  assignments: string[];
};

const REPORT_STUDENTS: ReportStudent[] = [
  {
    id: "stu-minseo",
    name: "최민서",
    classId: "dunsan",
    className: "둔산여고 2학년",
    examName: "복습 테스트 6회차",
    examType: "복습 테스트",
    testDate: "2025-12-08",
    roundLabel: "6회차",
    score: 95,
    rank: "2 / 24",
    average: 83,
    attendance: "정상",
    nextLesson: "1월 28일 (화) 19:00",
    assignments: ["오답노트 10문제", "심화 유형 복습지"],
  },
  {
    id: "stu-jiae",
    name: "김지애",
    classId: "bundang",
    className: "분당고 3학년",
    examName: "모의고사 8회차",
    examType: "모의고사",
    testDate: "2025-12-04",
    roundLabel: "8회차",
    score: 88,
    rank: "5 / 32",
    average: 79,
    attendance: "지각",
    nextLesson: "1월 29일 (수) 20:00",
    assignments: ["심화 유형 복습지", "주간 숙제지 채점"],
  },
  {
    id: "stu-junho",
    name: "이준호",
    classId: "seomun",
    className: "서문고 1학년",
    examName: "주간 테스트 12회차",
    examType: "주간 테스트",
    testDate: "2025-12-05",
    roundLabel: "12회차",
    score: 91,
    rank: "3 / 20",
    average: 85,
    attendance: "정상",
    nextLesson: "1월 30일 (목) 18:00",
    assignments: ["기초 유형 문제집 3~4회", "어휘 테스트"],
  },
];

const CLASS_LIST = Array.from(
  REPORT_STUDENTS.reduce((map, student) => {
    if (!map.has(student.classId)) {
      map.set(student.classId, student.className);
    }
    return map;
  }, new Map<string, string>())
).map(([id, label]) => ({ id, label }));

const REPORT_TEMPLATES = [
  {
    id: "premium",
    name: "심플 리포트",
    description: "브랜드 컬러와 상세 표 구성이 포함된 템플릿",
  },
  {
    id: "simple",
    name: "프리미엄 리포트",
    description: "모바일 카카오 알림에 최적화된 카드형 템플릿",
  },
] as const;

type ReportTemplateId = (typeof REPORT_TEMPLATES)[number]["id"];

export function GradeReportModal() {
  const [open, setOpen] = useState(false);
  const [classKeyword, setClassKeyword] = useState("");
  const [showClassResults, setShowClassResults] = useState(false);
  const [hasSelectedClass, setHasSelectedClass] = useState(false);
  const [classFilter, setClassFilter] = useState<"all" | string>("all");
  const [selectedId, setSelectedId] = useState(REPORT_STUDENTS[0]?.id ?? "");
  const [templateId, setTemplateId] = useState<ReportTemplateId>(
    REPORT_TEMPLATES[0].id
  );
  const [sendState, setSendState] = useState<"idle" | "sending" | "done">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);

  const filteredClasses = useMemo(() => {
    return CLASS_LIST.filter((klass) =>
      klass.label.includes(classKeyword.trim())
    );
  }, [classKeyword]);

  const filteredStudents = useMemo(() => {
    return REPORT_STUDENTS.filter((student) => {
      return classFilter === "all" ? true : student.classId === classFilter;
    });
  }, [classFilter]);

  const effectiveSelectedId =
    filteredStudents.find((student) => student.id === selectedId)?.id ??
    filteredStudents[0]?.id ??
    "";
  const selectedStudent =
    filteredStudents.find((student) => student.id === effectiveSelectedId) ??
    filteredStudents[0];

  const classInputRef = useRef<HTMLInputElement>(null);

  const closeModal = () => {
    setOpen(false);
    setClassKeyword("");
    setShowClassResults(false);
    setHasSelectedClass(false);
    setClassFilter("all");
    setTemplateId(REPORT_TEMPLATES[0].id);
    setSendState("idle");
    setMessage(null);
  };

  const handleSend = () => {
    if (!selectedStudent) return;
    setSendState("sending");
    window.setTimeout(() => {
      setSendState("done");
      setMessage(`${selectedStudent.name} 학생에게 카카오톡을 발송했습니다.`);
      window.setTimeout(() => {
        setMessage(null);
        setSendState("idle");
        setOpen(false);
      }, 1500);
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

  const handlePreview = () => {
    if (!selectedStudent) return;
    const html = buildTemplateHtml(templateId, selectedStudent);
    const opened = openTemplatePreviewWindow(html);
    if (!opened) {
      setMessage("팝업이 차단되었어요. 브라우저 설정을 확인해주세요.");
      window.setTimeout(() => setMessage(null), 4000);
    }
  };

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
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
              <div>
                <p className="text-sm font-semibold text-primary">
                  시험 및 과제 관리
                </p>
                <h3 className="text-xl font-bold">학생 성적표 발송</h3>
              </div>
              <button
                type="button"
                aria-label="닫기"
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                onClick={closeModal}
              >
                <span className={iconClass("text-2xl")}>close</span>
              </button>
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
                            <p className="text-sm font-semibold">
                              {student.name}
                            </p>
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
                          onClick={handleSend}
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
                          onClick={handlePreview}
                          className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200 dark:hover:border-primary dark:hover:text-primary"
                        >
                          <span className={iconClass("text-base")}>
                            visibility
                          </span>
                          템플릿 미리보기
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
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function TemplatePreview({
  templateId,
  student,
}: {
  templateId: string;
  student: ReportStudent;
}) {
  if (templateId === "simple") {
    return (
      <SimpleReportPreview data={toSimpleReportData(student)} scale={0.7} />
    );
  }

  const premiumStats = [
    {
      label: "원점수",
      value: `${student.score}점`,
      detail: `랭크 ${student.rank}`,
    },
    {
      label: "평균점수",
      value: `${student.average}점`,
      detail: "반 평균 기준",
    },
    {
      label: "시험 일정",
      value: student.testDate ?? "-",
      detail: student.roundLabel ?? "회차 정보 없음",
    },
  ];
  const premiumChips = [
    student.className,
    student.examType,
    student.nextLesson ? `다음 수업 ${student.nextLesson}` : null,
  ].filter(Boolean) as string[];
  const questionRows = buildQuestionRows(toSimpleReportData(student));

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 text-slate-800 shadow-xl dark:border-slate-700 dark:bg-[#111b24] dark:text-slate-100">
      <div className="rounded-3xl bg-gradient-to-br from-[#5139d8] via-[#6cded3] to-[#8fe8ba] p-5 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] opacity-80">
              Premium Report
            </p>
            <p className="text-2xl font-bold md:text-3xl">{student.name}</p>
            <p className="text-sm opacity-90">
              {student.className} · {student.examName}
            </p>
          </div>
          <div className="flex gap-3">
            <div className="rounded-2xl bg-white/20 px-4 py-3 text-center shadow-inner backdrop-blur">
              <p className="text-xs uppercase">Score</p>
              <p className="text-3xl font-bold">{student.score}</p>
              <p className="text-[11px] opacity-80">{student.rank}</p>
            </div>
            <div className="rounded-2xl bg-white/20 px-4 py-3 text-center shadow-inner backdrop-blur">
              <p className="text-xs uppercase">Avg</p>
              <p className="text-3xl font-bold">{student.average}</p>
              <p className="text-[11px] opacity-80">{student.testDate}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {premiumChips.map((chip) => (
            <span
              key={chip}
              className="rounded-full bg-white/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {premiumStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-sm dark:border-slate-700 dark:bg-[#162433]"
          >
            <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-300">
              {stat.label}
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
              {stat.value}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {stat.detail}
            </p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#162433] lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-300">
                학습 포인트
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                과제 및 피드백
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {student.assignments.length}개 진행
            </span>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            {student.assignments.map((assignment) => (
              <li
                key={assignment}
                className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-slate-600 shadow-sm dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-200"
              >
                <span className="mt-1 size-2 rounded-full bg-primary" />
                <span className="flex-1">{assignment}</span>
                <span className="text-[11px] font-semibold text-emerald-500">
                  예정
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#162433]">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-300">
            출결 & 다음 수업
          </p>
          <div className="mt-3 space-y-3 text-sm">
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-[#0f172a]">
              <p className="text-xs text-slate-500">출결 상태</p>
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                {student.attendance}
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-[#0f172a]">
              <p className="text-xs text-slate-500">다음 수업</p>
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                {student.nextLesson}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#162433]">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-300">
            문항별 응시 결과
          </p>
          <div className="mt-3 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-700">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-slate-50 text-slate-600 dark:bg-[#0f172a] dark:text-slate-300">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase">
                    No.
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase">
                    출처
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase">
                    유형
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase">
                    O/X
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase">
                    오답률
                  </th>
                </tr>
              </thead>
              <tbody>
                {questionRows.map((row) => (
                  <tr
                    key={row.no}
                    className="border-t border-slate-100 text-slate-600 dark:border-slate-700 dark:text-slate-300"
                  >
                    <td className="px-3 py-2">{row.no}</td>
                    <td className="px-3 py-2">{row.source}</td>
                    <td className="px-3 py-2">{row.type}</td>
                    <td className="px-3 py-2 text-center">{row.status}</td>
                    <td className="px-3 py-2 text-center">{row.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#162433]">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-300">
            지도 메모
          </p>
          <div className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p>
              {student.name} 학생은 {student.examName} 기준으로 {student.score}
              점을 획득했으며 반 평균 대비{" "}
              {student.score - student.average >= 0
                ? `+${student.score - student.average}점`
                : `${student.score - student.average}점`}
              입니다.
            </p>
            <p>
              과제 {student.assignments.length}개를 배정했으며, 다음 수업(
              {student.nextLesson})에 과제 점검 및 취약 유형 보강을 진행합니다.
            </p>
          </div>
        </div>
      </div>
      <footer className="flex items-center justify-between border-t border-dashed border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-700">
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">
            {DEFAULT_ACADEMY_NAME}
          </p>
          <p className="uppercase tracking-widest">{DEFAULT_ACADEMY_EN_NAME}</p>
        </div>
        <span className="text-primary">프리미엄 성적 리포트</span>
      </footer>
    </div>
  );
}

function buildTemplateHtml(templateId: string, student: ReportStudent) {
  const styles = `
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      html, body { width: 700px; margin: 0 auto; background: #f7f7fb; color: #0f172a; }
      body { min-height: 100%; font-family: Pretendard, sans-serif; padding: 18px; display: flex; justify-content: center; align-items: flex-start; }
      .card { width: 100%; max-width: 640px; background: white; border-radius: 16px; padding: 26px; box-shadow: 0 10px 30px rgba(15,23,42,0.08); }
      .flex { display: flex; justify-content: space-between; align-items: center; }
      h1 { font-size: 24px; margin-bottom: 4px; }
      h2 { font-size: 20px; margin: 16px 0 8px; }
      .tag { display: inline-block; padding: 6px 12px; border-radius: 9999px; background: #e0edff; color: #2563eb; font-size: 12px; font-weight: 600; }
      .grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 8px; }
      .box { border-radius: 12px; background: #f1f5f9; padding: 12px; }
      ul { margin: 0; padding-left: 20px; }
      @page { size: A4; margin: 15mm; }
    </style>
  `;

  if (templateId === "simple") {
    return buildSimpleTemplateHtml(toSimpleReportData(student));
  }

  const premiumChips = [
    student.className,
    student.examType,
    student.nextLesson ? `다음 수업 ${student.nextLesson}` : null,
  ]
    .filter(Boolean)
    .map(
      (chip) =>
        `<span style="display:inline-block;background:rgba(255,255,255,0.3);padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600;margin-right:6px;">${chip}</span>`
    )
    .join("");
  const premiumStats = [
    {
      label: "원점수",
      value: `${student.score}점`,
      detail: `랭크 ${student.rank}`,
    },
    {
      label: "평균점수",
      value: `${student.average}점`,
      detail: "반 평균 기준",
    },
    {
      label: "시험 일정",
      value: student.testDate ?? "-",
      detail: student.roundLabel ?? "회차 정보 없음",
    },
  ]
    .map(
      (stat) => `
      <div class="box" style="background:#fff;border:1px solid #e2e8f0;">
        <p style="font-size:10px;color:#64748b;font-weight:600;text-transform:uppercase;margin:0 0 6px;">${stat.label}</p>
        <p style="margin:0;font-size:16px;font-weight:700;color:#0f172a;">${stat.value}</p>
        <p style="margin:4px 0 0;font-size:11px;color:#94a3b8;">${stat.detail}</p>
      </div>`
    )
    .join("");
  const questionRows = buildQuestionRows(toSimpleReportData(student))
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
    .join("");
  const assignmentsHtml = student.assignments
    .map(
      (assignment) => `
        <li style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #e2e8f0;">
          <span style="width:6px;height:6px;border-radius:999px;background:#2b8cee;display:inline-block;"></span>
          <span style="flex:1;font-size:13px;color:#475569;">${assignment}</span>
          <span style="font-size:11px;color:#10b981;font-weight:600;">예정</span>
        </li>`
    )
    .join("");

  return `
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>${student.name} 성적표</title>
        ${styles}
      </head>
      <body>
        <div class="card" style="background:#fff;border-radius:28px;padding:28px;box-shadow:0 25px 60px rgba(15,23,42,0.12);">
          <div style="border-radius:24px;padding:24px;background:linear-gradient(120deg,#5139d8,#6cded3,#8fe8ba);color:#fff;box-shadow:0 20px 40px rgba(81,57,216,0.35);">
            <div style="display:flex;justify-content:space-between;gap:24px;flex-wrap:wrap;">
              <div>
                <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:6px;opacity:0.7;">Premium Report</p>
                <h1 style="margin:4px 0 0;font-size:28px;">${student.name}</h1>
                <p style="margin:0;font-size:14px;opacity:0.9;">${student.className} · ${student.examName}</p>
              </div>
              <div style="display:flex;gap:12px;">
                <div style="padding:12px 18px;border-radius:16px;background:rgba(255,255,255,0.2);text-align:center;">
                  <p style="margin:0;font-size:10px;text-transform:uppercase;">Score</p>
                  <p style="margin:2px 0 0;font-size:22px;font-weight:700;">${student.score}</p>
                  <p style="margin:0;font-size:11px;opacity:0.8;">${student.rank}</p>
                </div>
                <div style="padding:12px 18px;border-radius:16px;background:rgba(255,255,255,0.2);text-align:center;">
                  <p style="margin:0;font-size:10px;text-transform:uppercase;">Avg</p>
                  <p style="margin:2px 0 0;font-size:22px;font-weight:700;">${student.average}</p>
                  <p style="margin:0;font-size:11px;opacity:0.8;">${student.testDate ?? ""}</p>
                </div>
              </div>
            </div>
            <div style="margin-top:12px;">${premiumChips}</div>
          </div>
          <div class="grid" style="margin-top:20px;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;">
            ${premiumStats}
          </div>
          <div class="grid" style="margin-top:20px;display:grid;grid-template-columns:2fr 1fr;gap:16px;">
            <div style="background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:16px;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div>
                  <p style="margin:0;font-size:11px;text-transform:uppercase;color:#64748b;">학습 포인트</p>
                  <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#0f172a;">과제 및 피드백</p>
                </div>
                <span style="font-size:11px;border-radius:999px;background:rgba(43,140,238,0.15);color:#2b8cee;padding:4px 10px;font-weight:600;">${student.assignments.length}개 진행</span>
              </div>
              <ul style="list-style:none;margin:16px 0 0;padding:0;">
                ${assignmentsHtml || `<li style="font-size:13px;color:#94a3b8;">등록된 과제가 없습니다.</li>`}
              </ul>
            </div>
            <div style="background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:16px;">
              <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;color:#64748b;">출결 & 다음 수업</p>
              <div style="font-size:13px;color:#475569;">
                <p style="margin:0 0 6px;"><strong>출결</strong> · ${student.attendance}</p>
                <p style="margin:0;"><strong>다음 수업</strong> · ${student.nextLesson}</p>
              </div>
            </div>
          </div>
          <div class="grid" style="margin-top:20px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;">
            <div style="background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:16px;">
              <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;color:#64748b;">문항별 응시</p>
              <table style="width:100%;border-collapse:collapse;font-size:12px;">
                <thead>
                  <tr style="background:#f1f5f9;color:#475569;">
                    <th style="padding:6px 8px;text-align:left;">No.</th>
                    <th style="padding:6px 8px;text-align:left;">출처</th>
                    <th style="padding:6px 8px;text-align:left;">유형</th>
                    <th style="padding:6px 8px;text-align:center;">O/X</th>
                    <th style="padding:6px 8px;text-align:center;">오답률</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    questionRows ||
                    `<tr><td colspan="5" style="padding:12px;text-align:center;color:#94a3b8;">세부 문항 데이터가 없습니다.</td></tr>`
                  }
                </tbody>
              </table>
            </div>
            <div style="background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:16px;">
              <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;color:#64748b;">지도 메모</p>
              <p style="margin:0 0 8px;font-size:13px;color:#475569;">
                ${student.name} 학생은 ${student.examName} 기준으로 ${student.score}점을 획득했으며 반 평균 대비 ${
                  student.score - student.average >= 0
                    ? `+${student.score - student.average}점`
                    : `${student.score - student.average}점`
                } 입니다.
              </p>
              <p style="margin:0;font-size:13px;color:#475569;">
                과제 ${student.assignments.length}개를 배정했으며, 다음 수업(${student.nextLesson})에서 과제 점검과 취약 유형 보강을 진행합니다.
              </p>
            </div>
          </div>
          <div style="margin-top:20px;display:flex;justify-content:space-between;align-items:center;border-top:1px dashed #e2e8f0;padding-top:12px;font-size:12px;color:#94a3b8;">
            <div>
              <p style="margin:0;font-weight:600;color:#0f172a;">${DEFAULT_ACADEMY_NAME}</p>
              <p style="margin:0;text-transform:uppercase;letter-spacing:4px;font-size:10px;">${DEFAULT_ACADEMY_EN_NAME}</p>
            </div>
            <span style="color:#2b8cee;font-weight:600;">프리미엄 성적 리포트</span>
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

function openTemplatePreviewWindow(html: string) {
  const previewWindow = window.open(
    "",
    "_blank",
    "width=900,height=1200,scrollbars=yes"
  );
  if (!previewWindow) {
    return false;
  }
  previewWindow.document.write(html);
  previewWindow.document.close();
  previewWindow.focus();

  const applyScaling = () => {
    if (!previewWindow || previewWindow.closed) return;
    const doc = previewWindow.document;
    const htmlEl = doc.documentElement;
    const bodyEl = doc.body;
    if (htmlEl) {
      htmlEl.style.width = "100%";
      htmlEl.style.height = "100%";
      htmlEl.style.overflow = "hidden";
      htmlEl.style.backgroundColor = "#f1f5f9";
    }
    if (bodyEl) {
      bodyEl.style.transform = "scale(0.75)";
      bodyEl.style.transformOrigin = "top center";
      bodyEl.style.margin = "20px auto";
      bodyEl.style.maxWidth = "760px";
      bodyEl.style.overflow = "auto";
      bodyEl.style.display = "block";
    }
  };

  previewWindow.addEventListener("load", applyScaling, { once: true });
  setTimeout(applyScaling, 200);

  return true;
}

function toSimpleReportData(student: ReportStudent): SimpleReportData {
  return {
    studentName: student.name,
    examName: student.examName,
    examType: student.examType,
    className: student.className,
    academyName: DEFAULT_ACADEMY_NAME,
    academyEnglishName: DEFAULT_ACADEMY_EN_NAME,
    testDate: student.testDate,
    roundLabel: student.roundLabel,
    score: student.score,
    rank: student.rank,
    averageScore: student.average,
    attendance: student.attendance,
    nextLesson: student.nextLesson,
    assignments: student.assignments,
  };
}
