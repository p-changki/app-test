"use client";

import { useMemo, useState } from "react";

import { AssistantSubNav } from "@/components/layout/AssistantSubNav";
import { examSubNavLinks } from "@/constants/examSubNavLinks";
import { lexend, notoSansKr } from "@/lib/fonts";
import {
  DEFAULT_ACADEMY_EN_NAME,
  DEFAULT_ACADEMY_NAME,
  SimpleReportData,
  SimpleReportPreview,
  buildSimpleTemplateHtml,
} from "@/features/exam-dashboard/simpleReportTemplate";
import {
  reportClassOptions,
  reportStudents,
  reportTemplates,
} from "@/data/exams";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";
import type {
  ReportClassOption,
  ReportStudent,
  ReportTemplate,
} from "@/types/exams";

export function ReportPublishClient() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div
      className={cn(
        notoSansKr.className,
        "min-h-screen bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200"
      )}
    >
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <AssistantSubNav
          activeHref="/exam-management"
          links={examSubNavLinks}
        />
        <header className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h1
            className={cn(
              lexend.className,
              "text-3xl font-black text-slate-900 dark:text-white"
            )}
          >
            성적표 발표 센터
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            수업과 학생을 검색해서 맞춤 템플릿을 고르고, 카카오톡과 PDF로
            성적표를 전송하세요.
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            <span className={iconClass("text-lg")}>campaign</span>
            성적표 발송하기
          </button>
        </header>
      </main>
      {modalOpen ? (
        <ReportPublishModal onClose={() => setModalOpen(false)} />
      ) : null}
    </div>
  );
}

function ReportPublishModal({ onClose }: { onClose: () => void }) {
  const [selectedClass, setSelectedClass] = useState<string>(
    reportClassOptions[0].id
  );
  const [classKeyword, setClassKeyword] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    reportStudents[0].id
  );
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    reportTemplates[0].id
  );
  const [message, setMessage] = useState<string | null>(null);

  const filteredStudents = useMemo(() => {
    return reportStudents.filter((student) => {
      return selectedClass === "all" ? true : student.classId === selectedClass;
    });
  }, [selectedClass]);
  const activeStudentId =
    filteredStudents.length &&
    filteredStudents.some((student) => student.id === selectedStudentId)
      ? selectedStudentId
      : (filteredStudents[0]?.id ?? "");
  const selectedStudent =
    filteredStudents.find((student) => student.id === activeStudentId) ??
    undefined;

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
  };

  const handleSend = () => {
    if (!selectedStudent) return;
    setMessage(
      `${selectedStudent.name} 학생에게 카카오톡 안내를 발송했습니다.`
    );
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDownloadPdf = () => {
    if (!selectedStudent) return;
    const templateHtml = getTemplateHtml(selectedTemplate, selectedStudent);
    const opened = openPdfPreviewWindow(templateHtml, () => {
      setMessage(
        `${selectedStudent.name} 성적표 PDF를 준비했습니다. 인쇄 대화상자에서 PDF 저장을 선택하세요.`
      );
      setTimeout(() => setMessage(null), 3000);
    });
    if (!opened) {
      setMessage("팝업이 차단되었어요. 브라우저 설정을 확인해주세요.");
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handlePreview = () => {
    if (!selectedStudent) return;
    const templateHtml = getTemplateHtml(selectedTemplate, selectedStudent);
    const opened = openTemplatePreviewWindow(templateHtml);
    if (!opened) {
      setMessage("팝업이 차단되었어요. 브라우저 설정을 확인해주세요.");
      setTimeout(() => setMessage(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-5xl rounded-3xl border border-slate-200 bg-[var(--surface-background)] shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              성적표 발송
            </p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              학생 성적표를 카카오톡 · PDF로 전달합니다.
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span className={iconClass("text-lg")}>close</span>
          </button>
        </header>
        <div className="grid gap-6 p-6 lg:grid-cols-[360px,1fr]">
          <aside className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/70">
            <ClassFilter
              classes={reportClassOptions}
              selectedClass={selectedClass}
              search={classKeyword}
              onSearch={setClassKeyword}
              onChange={setSelectedClass}
            />
            <StudentList
              students={filteredStudents}
              selectedStudentId={activeStudentId}
              onSelect={handleSelectStudent}
            />
            <TemplateSelector
              templates={reportTemplates}
              selectedTemplate={selectedTemplate}
              onSelect={setSelectedTemplate}
            />
          </aside>
          <section className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6.shadow-sm dark:border-slate-700 dark:bg-slate-800/70">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-700">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    선택된 학생
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {selectedStudent?.name ?? "학생 없음"}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {selectedStudent?.classLabel ?? "-"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ActionButton
                    label="카카오톡 보내기"
                    icon="chat"
                    onClick={handleSend}
                    disabled={!selectedStudent}
                  />
                  <ActionButton
                    label="템플릿 미리보기"
                    icon="visibility"
                    variant="ghost"
                    onClick={handlePreview}
                    disabled={!selectedStudent}
                  />
                  <ActionButton
                    label="PDF 내려받기"
                    icon="picture_as_pdf"
                    variant="secondary"
                    onClick={handleDownloadPdf}
                    disabled={!selectedStudent}
                  />
                </div>
              </div>
              <div className="mt-6">
                {selectedStudent ? (
                  <TemplatePreview
                    templateId={selectedTemplate}
                    student={selectedStudent}
                  />
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    학생을 선택하면 성적표가 미리보기 됩니다.
                  </div>
                )}
              </div>
            </div>
            {message ? (
              <p className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary">
                {message}
              </p>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}

function ClassFilter({
  classes,
  selectedClass,
  search,
  onSearch,
  onChange,
}: {
  classes: readonly ReportClassOption[];
  selectedClass: string;
  search: string;
  onSearch: (value: string) => void;
  onChange: (value: string) => void;
}) {
  const filteredClasses = classes.filter((klass) =>
    klass.name.includes(search.trim())
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
        <span>수업 검색</span>
        <button
          type="button"
          onClick={() => onChange("all")}
          className="rounded-full px-3 py-1 text-[11px] font-semibold text-primary hover:bg-primary/10"
        >
          전체 보기
        </button>
      </div>
      <div className="relative">
        <span
          className={cn(
            iconClass(
              "absolute inset-y-0 left-3 flex cursor-pointer items-center text-lg text-slate-400"
            )
          )}
          onClick={() => onSearch("")}
          role="button"
        >
          search
        </span>
        <input
          type="text"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="수업명 검색"
          className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>
      {search.trim().length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 px-3 py-6 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
          검색어를 입력하면 수업 목록이 나타납니다.
        </div>
      ) : (
        <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800">
          {filteredClasses.map((klass) => (
            <button
              type="button"
              key={klass.id}
              onClick={() => onChange(klass.id)}
              className={cn(
                "w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition",
                klass.id === selectedClass
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
              )}
            >
              {klass.name}
            </button>
          ))}
          {filteredClasses.length === 0 ? (
            <p className="px-2 py-4 text-center text-xs text-slate-500">
              검색된 수업이 없습니다.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

function StudentList({
  students,
  selectedStudentId,
  onSelect,
}: {
  students: readonly ReportStudent[];
  selectedStudentId: string;
  onSelect: (id: string) => void;
}) {
  if (students.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 px-3 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        조건에 맞는 학생이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
        학생 목록
      </p>
      <div className="space-y-2">
        {students.map((student) => (
          <button
            key={student.id}
            type="button"
            onClick={() => onSelect(student.id)}
            className={cn(
              "w-full rounded-xl border px-4 py-3 text-left text-sm transition",
              selectedStudentId === student.id
                ? "border-primary bg-primary/5 text-primary"
                : "border-slate-200 bg-white text-slate-700 hover:border-primary/40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            )}
          >
            <p className="font-semibold">{student.name}</p>
            <p className="text-xs text-slate-500">
              {student.classLabel} · {student.examName}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function TemplateSelector({
  templates,
  selectedTemplate,
  onSelect,
}: {
  templates: readonly ReportTemplate[];
  selectedTemplate: string;
  onSelect: (templateId: string) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
        템플릿 선택
      </p>
      <div className="space-y-3">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template.id)}
            className={cn(
              "w-full rounded-xl border px-4 py-3 text-left transition",
              template.id === selectedTemplate
                ? "border-primary bg-primary/5 text-primary"
                : "border-slate-200 bg-white text-slate-700 hover:border-primary/40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            )}
          >
            <p className="font-bold">{template.name}</p>
            <p className="text-xs text-slate-500">{template.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function ActionButton({
  label,
  icon,
  variant = "primary",
  onClick,
  disabled,
}: {
  label: string;
  icon: string;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary"
          ? "border border-primary/30 bg-primary text-white hover:bg-primary/90"
          : variant === "secondary"
            ? "border border-slate-200 bg-white text-slate-700 hover:border-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            : "border border-dashed border-slate-300 bg-transparent text-slate-600 hover:border-primary/40 hover:text-primary dark:border-slate-600 dark:text-slate-200"
      )}
    >
      <span className={iconClass("text-base")}>{icon}</span>
      {label}
    </button>
  );
}

function TemplatePreview({
  templateId,
  student,
}: {
  templateId: string;
  student: ReportStudent;
}) {
  if (!student) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 px-6 py-20 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        학생을 선택하면 성적표가 미리보기 됩니다.
      </div>
    );
  }

  if (templateId === "simple") {
    return <SimpleReportPreview data={toSimpleReportData(student)} />;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-inner dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Premium Template
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {student.examName}
          </p>
          <p className="text-sm text-slate-500">{student.classLabel}</p>
        </div>
        <div className="rounded-xl bg-primary/10 px-4 py-2 text-center">
          <p className="text-xs font-semibold text-primary">총점</p>
          <p className="text-2xl font-bold text-primary">{student.score}</p>
          <p className="text-xs text-primary/80">랭크 {student.rank}위</p>
        </div>
      </div>
      <div className="grid gap-4 pt-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            출결 현황
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
            {student.attendance}
          </p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            다음 수업
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
            {student.nextLesson}
          </p>
        </div>
      </div>
      <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
        <p className="text-xs font-semibold uppercase text-slate-500">
          과제 및 안내
        </p>
        <div className="mt-2 grid gap-3 md:grid-cols-2">
          {student.assignments.map((assignment) => (
            <div
              key={assignment}
              className="rounded-lg bg-white p-3 text-sm shadow-sm dark:bg-slate-900"
            >
              <p className="font-semibold text-slate-900 dark:text-white">
                {assignment}
              </p>
              <p className="text-xs text-slate-500">다음 수업 전까지 제출</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getTemplateHtml(templateId: string, student: ReportStudent) {
  const baseStyle = `
    <style>
      body { font-family: Pretendard, sans-serif; margin: 0; padding: 24px; background: #f7f7fb; color: #0f172a; }
      .card { max-width: 720px; margin: 0 auto; background: white; border-radius: 16px; padding: 32px; box-shadow: 0 15px 40px rgba(15,23,42,0.08); }
      .flex { display: flex; justify-content: space-between; align-items: center; }
      h1 { font-size: 24px; margin-bottom: 4px; }
      h2 { font-size: 20px; margin: 16px 0 8px; }
      .tag { display: inline-block; padding: 6px 12px; border-radius: 9999px; background: #e0edff; color: #2563eb; font-size: 12px; font-weight: 600; }
      .grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }
      .box { border-radius: 12px; background: #f1f5f9; padding: 16px; }
      ul { margin: 0; padding-left: 20px; }
    </style>
  `;

  if (templateId === "simple") {
    return buildSimpleTemplateHtml(toSimpleReportData(student));
  }

  return `
    <html>
    <head>
      <meta charSet="utf-8" />
      <title>${student.name} 성적표</title>
      ${baseStyle}
    </head>
    <body>
      <div class="card">
        <div class="flex">
          <div>
            <p class="tag">프리미엄 템플릿</p>
            <h1>${student.examName}</h1>
            <p>${student.classLabel}</p>
          </div>
          <div style="text-align:right">
            <h1 style="color:#2563eb">${student.score}</h1>
            <p>랭크 ${student.rank}위</p>
          </div>
        </div>
        <div class="grid" style="margin-top:24px">
          <div class="box">
            <h2>출결</h2>
            <p>${student.attendance}</p>
          </div>
          <div class="box">
            <h2>다음 수업</h2>
            <p>${student.nextLesson}</p>
          </div>
        </div>
        <div class="box" style="margin-top:24px">
          <h2>과제 안내</h2>
          <ul>
            ${student.assignments.map((assignment) => `<li>${assignment}</li>`).join("")}
          </ul>
        </div>
      </div>
    </body>
    </html>
  `;
}

function toSimpleReportData(student: ReportStudent): SimpleReportData {
  return {
    studentName: student.name,
    examName: student.examName,
    examType: student.examType,
    className: student.classLabel,
    academyName: DEFAULT_ACADEMY_NAME,
    academyEnglishName: DEFAULT_ACADEMY_EN_NAME,
    testDate: student.testDate,
    roundLabel: student.roundLabel,
    score: student.score,
    rank: `${student.rank}위`,
    averageScore: student.avg,
    attendance: student.attendance,
    nextLesson: student.nextLesson,
    assignments: [...student.assignments],
  };
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
