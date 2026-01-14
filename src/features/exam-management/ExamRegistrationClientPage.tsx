"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { AssistantSubNav } from "@/components/layout/AssistantSubNav";
import { examSubNavLinks } from "@/constants/examSubNavLinks";
import { classEntities } from "@/data/classes";
import { ExamRegistrationHeader } from "@/features/exam-management/registration/components/ExamRegistrationHeader";
import {
  ExamInfoSection,
  QuestionList,
  QuestionSetupSection,
  StickyActions,
  SummarySection,
} from "@/features/exam-management/registration/components/FormSections";
import { useExamRegistrationForm } from "@/features/exam-management/registration/hooks/useExamRegistrationForm";
import type {
  DraftQuestion,
  FormState,
} from "@/features/exam-management/registration/types";
import {
  ExamDraft,
  createExamFromDraft,
  registerExam,
  useExamStore,
} from "@/features/exam-data/examStore";
import { notoSansKr } from "@/lib/fonts";
import { cn } from "@/lib/utils";

const breadcrumbs = [
  { label: "홈", href: "/dashboard" },
  { label: "시험/과제 관리", href: "/exam-dashboard" },
  { label: "시험 등록/수정" },
];

export function ExamRegistrationClientPage() {
  const router = useRouter();
  const examList = useExamStore();
  const [selectedExamId, setSelectedExamId] = useState("");
  const [editEnabled, setEditEnabled] = useState(true);
  const {
    form,
    questions,
    banner,
    submitting,
    totalQuestions,
    totalScore,
    questionCountInput,
    setBanner,
    setSubmitting,
    handleFormChange,
    handleQuestionCountChange,
    handleQuestionChange,
    handleRemoveQuestion,
    handleAddQuestion,
    loadExam,
    resetForm,
  } = useExamRegistrationForm();

  const selectedExam = useMemo(
    () => examList.find((exam) => exam.id === selectedExamId),
    [examList, selectedExamId]
  );

  const handleSelectExam = (value: string) => {
    setSelectedExamId(value);
    if (!value) {
      resetForm();
      setEditEnabled(true);
      return;
    }
    const target = examList.find((exam) => exam.id === value);
    if (target) {
      loadExam(target);
      setEditEnabled(false);
    }
  };

  const handleSubmit = () => {
    const validationError = validateForm(form, questions);
    if (validationError) {
      setBanner({ type: "error", text: validationError });
      return;
    }

    setSubmitting(true);
    const draft: ExamDraft = {
      title: form.title,
      subject: form.subject,
      examType: form.examType,
      source: form.source,
      targetClass: form.targetClass,
      examDate: form.examDate,
      passScore: Number(form.passScore) || 0,
      summary: form.summary || `${form.targetClass} ${form.subject} 평가`,
      notes: form.notes
        .split("\n")
        .map((note) => note.trim())
        .filter(Boolean),
      questions: questions.map((question) => ({
        label: question.label.trim() || "무제 문항",
        type: question.type,
        category: question.category,
        source: question.source,
        points: Number(question.points) || 1,
        answer:
          question.type === "주관식"
            ? question.answer.trim() || "-"
            : question.answer || "1",
      })),
    };

    const record = createExamFromDraft(draft);
    registerExam(record);
    setSubmitting(false);
    setBanner({ type: "success", text: "시험지가 등록되었습니다." });
    setTimeout(() => {
      router.push("/exam-dashboard");
    }, 600);
  };

  const handleUpdate = () => {
    if (!selectedExam) return;
    const validationError = validateForm(form, questions);
    if (validationError) {
      setBanner({ type: "error", text: validationError });
      return;
    }
    setSubmitting(true);
    const classMatch = classEntities.find(
      (klass) => klass.name === form.targetClass
    );
    const updatedRecord = {
      ...selectedExam,
      title: form.title.trim() || selectedExam.title,
      subject: form.subject,
      examType: form.examType,
      source: form.source,
      targetClass: form.targetClass,
      examDate: form.examDate,
      passScore: Number(form.passScore) || 0,
      summary:
        form.summary || selectedExam.summary || `${form.targetClass} 평가`,
      notes: form.notes
        .split("\n")
        .map((note) => note.trim())
        .filter(Boolean),
      classId: classMatch?.id ?? selectedExam.classId,
      totalQuestions: questions.length,
      totalScore: 100,
      questions: questions.map((question, index) => ({
        id: index + 1,
        label: question.label.trim() || `문항 ${index + 1}`,
        type: question.type,
        category: question.category,
        source: question.source,
        points: Number(question.points) || 0,
        answer:
          question.type === "주관식"
            ? question.answer.trim() || "-"
            : question.answer || "1",
      })),
    };

    registerExam(updatedRecord);
    setSubmitting(false);
    setBanner({ type: "success", text: "시험지가 수정되었습니다." });
    setEditEnabled(false);
  };

  const handleEnableEdit = () => {
    if (!selectedExamId) return;
    setEditEnabled(true);
  };

  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200"
      )}
    >
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6">
        <BreadcrumbTrail />
        <AssistantSubNav
          activeHref="/exam-management"
          links={examSubNavLinks}
          className="mb-6"
        />
        <ExamRegistrationHeader
          totalQuestions={totalQuestions}
          totalScore={totalScore}
        />
        <section className="rounded-xl border border-slate-200 bg-[var(--surface-background)] p-4 shadow-sm dark:border-slate-700 dark:bg-[var(--surface-background)]">
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            등록된 시험 선택
            <select
              value={selectedExamId}
              onChange={(event) => handleSelectExam(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <option value="">새 시험 등록</option>
              {examList.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.title} · {exam.targetClass}
                </option>
              ))}
            </select>
          </label>
        </section>
        <form
          className="space-y-8"
          onSubmit={(event) => {
            event.preventDefault();
            if (selectedExamId) {
              handleUpdate();
            } else {
              handleSubmit();
            }
          }}
        >
          <fieldset
            disabled={Boolean(selectedExamId) && !editEnabled}
            className={cn(
              "space-y-8",
              selectedExamId && !editEnabled ? "opacity-60" : ""
            )}
          >
            <ExamInfoSection form={form} onChange={handleFormChange} />
            <QuestionSetupSection
              totalQuestions={questionCountInput}
              totalScore={totalScore}
              onQuestionCountChange={handleQuestionCountChange}
            />
            <QuestionList
              questions={questions}
              onChange={handleQuestionChange}
              onRemove={handleRemoveQuestion}
              onAdd={handleAddQuestion}
            />
            <SummarySection form={form} onChange={handleFormChange} />
          </fieldset>
          <StickyActions
            onSubmit={selectedExamId ? handleUpdate : handleSubmit}
            onUpdate={
              selectedExamId && !editEnabled ? handleEnableEdit : undefined
            }
            updateDisabled={!selectedExamId || editEnabled}
            submitting={submitting}
            message={banner}
            submitLabel={selectedExamId ? "저장" : "등록 및 성적 연동"}
            submitDisabled={Boolean(selectedExamId) && !editEnabled}
          />
        </form>
      </main>
    </div>
  );
}

function BreadcrumbTrail() {
  return (
    <nav className="mb-6 flex text-sm text-slate-500 dark:text-slate-400">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((crumb, index) => (
          <li key={`${crumb.label}-${index}`}>
            {crumb.href ? (
              <Link className="hover:text-primary" href={crumb.href}>
                {crumb.label}
              </Link>
            ) : (
              <span className="font-medium text-slate-900 dark:text-white">
                {crumb.label}
              </span>
            )}
            {index < breadcrumbs.length - 1 ? (
              <span className="select-none">/</span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function validateForm(form: FormState, questions: DraftQuestion[]) {
  if (!form.title.trim()) {
    return "시험명을 입력해주세요.";
  }
  if (!form.examDate) {
    return "시험일을 선택해주세요.";
  }
  if (!questions.length) {
    return "최소 1개 이상의 문항이 필요합니다.";
  }
  return null;
}
