"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { AssistantSubNav } from "@/components/layout/AssistantSubNav";
import { examSubNavLinks } from "@/constants/examSubNavLinks";
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
} from "@/features/exam-data/examStore";
import { notoSansKr } from "@/lib/fonts";
import { cn } from "@/lib/utils";

const breadcrumbs = [
  { label: "홈", href: "/dashboard" },
  { label: "시험/과제 관리", href: "/exam-dashboard" },
  { label: "시험 상세 등록" },
];

export function ExamRegistrationClientPage() {
  const router = useRouter();
  const {
    form,
    questions,
    banner,
    submitting,
    totalQuestions,
    totalScore,
    setBanner,
    setSubmitting,
    handleFormChange,
    handleQuestionCountChange,
    handleQuestionChange,
    handleRemoveQuestion,
    handleAddQuestion,
  } = useExamRegistrationForm();

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
      router.push("/exam-answer-entry");
    }, 600);
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
        <form
          className="space-y-8"
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <ExamInfoSection form={form} onChange={handleFormChange} />
          <QuestionSetupSection
            totalQuestions={totalQuestions}
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
          <StickyActions
            onSubmit={handleSubmit}
            submitting={submitting}
            message={banner}
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
