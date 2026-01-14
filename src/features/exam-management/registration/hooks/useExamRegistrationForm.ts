import { useState } from "react";

import {
  buildInitialQuestions,
  createDraftQuestion,
  DEFAULT_FORM,
} from "@/features/exam-management/registration/constants";
import type {
  BannerState,
  DraftQuestion,
  FormState,
} from "@/features/exam-management/registration/types";
import type { RegisteredExam } from "@/types/exams";

export function useExamRegistrationForm({
  initialForm = DEFAULT_FORM,
  initialQuestions = buildInitialQuestions(0),
}: {
  initialForm?: FormState;
  initialQuestions?: DraftQuestion[];
} = {}) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [questions, setQuestions] = useState<DraftQuestion[]>(initialQuestions);
  const [questionCountInput, setQuestionCountInput] = useState<string>(
    String(initialQuestions.length ?? 0)
  );
  const [banner, setBanner] = useState<BannerState>(null);
  const [submitting, setSubmitting] = useState(false);

  const totalQuestions = questions.length;
  const totalScore = 100;

  const buildDistributedQuestions = (count: number) => {
    if (count <= 0) return [] as DraftQuestion[];
    const base = Math.floor(100 / count);
    const remainder = 100 - base * count;
    return Array.from({ length: count }, (_, index) => {
      const question = createDraftQuestion(index + 1);
      return {
        ...question,
        points: base + (index < remainder ? 1 : 0),
      };
    });
  };

  const handleFormChange = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleQuestionCountChange = (value: string) => {
    setQuestionCountInput(value);
    if (value == "") {
      setQuestions([]);
      return;
    }
    if (!/^\d+$/.test(value)) {
      return;
    }
    const nextCount = Math.min(Math.max(Number(value), 0), 100);
    if (String(nextCount) != value) {
      setQuestionCountInput(String(nextCount));
    }
    setQuestions(buildDistributedQuestions(nextCount));
  };

  const handleQuestionChange = (
    id: string,
    updates: Partial<Omit<DraftQuestion, "id">>
  ) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === id ? { ...question, ...updates } : question
      )
    );
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions((prev) => {
      const next =
        prev.length <= 1 ? [] : prev.filter((question) => question.id !== id);
      setQuestionCountInput(String(next.length));
      return next;
    });
  };

  const handleAddQuestion = () => {
    setQuestions((prev) => {
      const next = [...prev, createDraftQuestion(prev.length + 1)];
      setQuestionCountInput(String(next.length));
      return next;
    });
  };

  const resetForm = () => {
    setForm(DEFAULT_FORM);
    setQuestions(buildInitialQuestions(0));
    setQuestionCountInput("0");
    setBanner(null);
  };

  const loadExam = (exam: RegisteredExam) => {
    setForm({
      title: exam.title ?? "",
      subject: exam.subject ?? DEFAULT_FORM.subject,
      examType: exam.examType ?? "",
      source: exam.source ?? "",
      targetClass: exam.targetClass ?? DEFAULT_FORM.targetClass,
      examDate: exam.examDate ?? "",
      passScore: String(exam.passScore ?? DEFAULT_FORM.passScore),
      summary: exam.summary ?? "",
      notes: Array.isArray(exam.notes) ? exam.notes.join("\n") : "",
      autoRetest: DEFAULT_FORM.autoRetest,
    });
    const loadedQuestions = exam.questions.map((question, index) => ({
      id: `${index + 1}-${Math.random().toString(36).slice(2, 8)}`,
      label: question.label,
      type: question.type === "O/X" ? "객관식" : question.type,
      category: question.category ?? "",
      source: question.source ?? "",
      points: question.points,
      answer: question.answer,
      allowPartial: false,
    }));
    setQuestions(loadedQuestions);
    setQuestionCountInput(String(loadedQuestions.length));
    setBanner(null);
  };

  return {
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
    resetForm,
    loadExam,
  };
}
