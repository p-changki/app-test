import { useMemo, useState } from "react";

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

export function useExamRegistrationForm({
  initialForm = DEFAULT_FORM,
  initialQuestions = buildInitialQuestions(),
}: {
  initialForm?: FormState;
  initialQuestions?: DraftQuestion[];
} = {}) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [questions, setQuestions] = useState<DraftQuestion[]>(initialQuestions);
  const [banner, setBanner] = useState<BannerState>(null);
  const [submitting, setSubmitting] = useState(false);

  const totalQuestions = questions.length;
  const totalScore = useMemo(
    () =>
      questions.reduce(
        (sum, question) => sum + Number(question.points || 0),
        0
      ),
    [questions]
  );

  const handleFormChange = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleQuestionCountChange = (count: number) => {
    if (!Number.isFinite(count) || count < 1 || count > 100) return;
    setQuestions((prev) => {
      if (count === prev.length) return prev;
      if (count > prev.length) {
        const extras = Array.from({ length: count - prev.length }, (_, idx) =>
          createDraftQuestion(prev.length + idx + 1)
        );
        return [...prev, ...extras];
      }
      return prev.slice(0, count);
    });
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
    setQuestions((prev) =>
      prev.length <= 1 ? prev : prev.filter((question) => question.id !== id)
    );
  };

  const handleAddQuestion = () => {
    setQuestions((prev) => [...prev, createDraftQuestion(prev.length + 1)]);
  };

  const resetForm = () => {
    setForm(DEFAULT_FORM);
    setQuestions(buildInitialQuestions());
    setBanner(null);
  };

  return {
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
    resetForm,
  };
}
