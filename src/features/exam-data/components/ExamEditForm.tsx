"use client";

import { useState } from "react";

import type { ExamQuestion, RegisteredExam } from "@/types/exams";
import { iconClass } from "@/lib/icon-class";

type ExamEditFormProps = {
  exam: RegisteredExam;
};

export function ExamEditForm({ exam }: ExamEditFormProps) {
  const [form, setForm] = useState(() => ({
    title: exam.title,
    subject: exam.subject,
    targetClass: exam.targetClass,
    examDate: exam.examDate,
    totalQuestions: String(exam.totalQuestions),
    totalScore: String(exam.totalScore),
    passScore: String(exam.passScore),
    status: exam.status,
    summary: exam.summary,
    notes: exam.notes.join("\n"),
  }));
  const [questions, setQuestions] = useState<ExamQuestion[]>(
    exam.questions.map((question) => ({ ...question }))
  );

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (
    index: number,
    field: keyof ExamQuestion,
    value: string
  ) => {
    setQuestions((prev) =>
      prev.map((question, idx) =>
        idx === index
          ? {
              ...question,
              [field]:
                field === "points" || field === "id" ? Number(value) : value,
            }
          : question
      )
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        label: `새 문항 ${prev.length + 1}`,
        type: "객관식",
        points: 1,
        answer: "",
      },
    ]);
  };

  return (
    <form className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-[var(--surface-background)] p-4 shadow-sm dark:border-slate-700">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          <span className={iconClass("text-primary")}>edit</span>
          기본 정보
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <LabeledInput
            label="시험/과제명"
            value={form.title}
            onChange={(value) => handleChange("title", value)}
          />
          <LabeledInput
            label="과목"
            value={form.subject}
            onChange={(value) => handleChange("subject", value)}
          />
          <LabeledInput
            label="대상 반"
            value={form.targetClass}
            onChange={(value) => handleChange("targetClass", value)}
          />
          <LabeledInput
            label="시험일"
            type="date"
            value={form.examDate}
            onChange={(value) => handleChange("examDate", value)}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-[var(--surface-background)] p-4 shadow-sm dark:border-slate-700">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          <span className={iconClass("text-primary")}>quiz</span>
          문항/배점
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <LabeledInput
            label="총 문항"
            type="number"
            value={form.totalQuestions}
            onChange={(value) => handleChange("totalQuestions", value)}
          />
          <LabeledInput
            label="총점"
            type="number"
            value={form.totalScore}
            onChange={(value) => handleChange("totalScore", value)}
          />
          <LabeledInput
            label="통과 기준 점수"
            type="number"
            value={form.passScore}
            onChange={(value) => handleChange("passScore", value)}
          />
        </div>
        <div className="mt-4">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
            상태
          </label>
          <select
            value={form.status}
            onChange={(event) =>
              handleChange(
                "status",
                event.target.value as RegisteredExam["status"]
              )
            }
            className="mt-1 w-full rounded-lg border border-slate-300 bg-[var(--surface-background)] px-3 py-2 text-sm font-medium text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[var(--surface-background)] dark:text-white md:w-48"
          >
            <option value="채점 완료">채점 완료</option>
            <option value="채점 중">채점 중</option>
            <option value="등록 완료">등록 완료</option>
            <option value="초안">초안</option>
          </select>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-[var(--surface-background)] p-4 shadow-sm dark:border-slate-700">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          <span className={iconClass("text-primary")}>notes</span>
          요약 및 메모
        </h2>
        <label className="mb-2 block text-xs font-bold text-slate-500 dark:text-slate-400">
          시험 요약
        </label>
        <textarea
          rows={3}
          value={form.summary}
          onChange={(event) => handleChange("summary", event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-[var(--surface-background)] p-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[var(--surface-background)] dark:text-white"
        />
        <label className="mb-2 mt-4 block text-xs font-bold text-slate-500 dark:text-slate-400">
          후속 작업 메모 (줄바꿈 구분)
        </label>
        <textarea
          rows={3}
          value={form.notes}
          onChange={(event) => handleChange("notes", event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-[var(--surface-background)] p-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[var(--surface-background)] dark:text-white"
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-[var(--surface-background)] p-4 shadow-sm dark:border-slate-700">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <span className={iconClass("text-primary")}>quiz</span>
            문항 및 정답 편집
          </h2>
          <button
            type="button"
            onClick={addQuestion}
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span className={iconClass("text-base")}>add</span>
            문항 추가
          </button>
        </div>
        <div className="space-y-3">
          {questions.map((question, index) => (
            <div
              key={`${question.id}-${index}`}
              className="rounded-xl border border-slate-200 bg-[var(--surface-background)] p-3 shadow-sm dark:border-slate-700"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">
                  #{question.id}
                </span>
                <input
                  type="text"
                  value={question.label}
                  onChange={(event) =>
                    handleQuestionChange(index, "label", event.target.value)
                  }
                  className="flex-1 rounded-lg border border-slate-300 bg-[var(--surface-background)] px-3 py-1.5 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[var(--surface-background)] dark:text-white"
                  placeholder="문항 제목"
                />
              </div>
              <div className="grid gap-3 text-sm sm:grid-cols-4">
                <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  유형
                  <select
                    value={question.type}
                    onChange={(event) =>
                      handleQuestionChange(index, "type", event.target.value)
                    }
                    className="rounded-lg border border-slate-300 bg-[var(--surface-background)] px-2 py-1.5 text-sm font-medium text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[var(--surface-background)] dark:text-white"
                  >
                    <option value="객관식">객관식</option>
                    <option value="주관식">주관식</option>
                    <option value="O/X">O / X</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  배점
                  <input
                    type="number"
                    value={question.points}
                    onChange={(event) =>
                      handleQuestionChange(index, "points", event.target.value)
                    }
                    className="rounded-lg border border-slate-300 bg-[var(--surface-background)] px-2 py-1.5 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[var(--surface-background)] dark:text-white"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 sm:col-span-2">
                  정답
                  <input
                    type="text"
                    value={question.answer}
                    onChange={(event) =>
                      handleQuestionChange(index, "answer", event.target.value)
                    }
                    className="rounded-lg border border-slate-300 bg-[var(--surface-background)] px-2 py-1.5 text-sm font-mono text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[var(--surface-background)] dark:text-white"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 dark:border-slate-700 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          취소
        </button>
        <button
          type="button"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1a6bbd]"
        >
          변경 저장
        </button>
      </div>
    </form>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-slate-300 bg-[var(--surface-background)] px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[var(--surface-background)] dark:text-white"
      />
    </label>
  );
}
