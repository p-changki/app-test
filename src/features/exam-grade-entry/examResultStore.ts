"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type StudentAnswerMap = Record<number, string>;

export type StudentExamResult = {
  examId: string;
  studentId: string;
  answers: StudentAnswerMap;
  score: number;
  locked: boolean;
  updatedAt: string;
};

type ExamResultState = {
  results: Record<string, Record<string, StudentExamResult>>;
  upsertResult: (payload: {
    examId: string;
    studentId: string;
    answers: StudentAnswerMap;
    score: number;
    locked?: boolean;
  }) => void;
  setLocked: (examId: string, studentId: string, locked: boolean) => void;
  clearResult: (examId: string, studentId: string) => void;
  clearExam: (examId: string) => void;
};

const STORAGE_KEY = "eduops.exam-results";
const PREVIEW_EXAM_ID = "eng-preview-5";

const initialResults: ExamResultState["results"] = {
  [PREVIEW_EXAM_ID]: {
    "student-eng-preview-01": {
      examId: PREVIEW_EXAM_ID,
      studentId: "student-eng-preview-01",
      answers: { 1: "1", 2: "2", 3: "3", 4: "4", 5: "5" },
      score: 100,
      locked: true,
      updatedAt: "2026-01-14T00:00:00.000Z",
    },
    "student-eng-preview-02": {
      examId: PREVIEW_EXAM_ID,
      studentId: "student-eng-preview-02",
      answers: { 1: "1", 2: "3", 3: "3", 4: "2", 5: "5" },
      score: 60,
      locked: true,
      updatedAt: "2026-01-14T00:00:00.000Z",
    },
    "student-eng-preview-03": {
      examId: PREVIEW_EXAM_ID,
      studentId: "student-eng-preview-03",
      answers: { 1: "1", 2: "2", 3: "3", 4: "4", 5: "1" },
      score: 80,
      locked: true,
      updatedAt: "2026-01-14T00:00:00.000Z",
    },
  },
};

export const useExamResultStore = create<ExamResultState>()(
  persist(
    (set) => ({
      results: initialResults,
      upsertResult: ({ examId, studentId, answers, score, locked }) =>
        set((state) => {
          const examResults = state.results[examId] ?? {};
          const existing = examResults[studentId];
          const nextLocked = locked ?? existing?.locked ?? false;
          return {
            results: {
              ...state.results,
              [examId]: {
                ...examResults,
                [studentId]: {
                  examId,
                  studentId,
                  answers,
                  score,
                  locked: nextLocked,
                  updatedAt: new Date().toISOString(),
                },
              },
            },
          };
        }),
      setLocked: (examId, studentId, locked) =>
        set((state) => {
          const examResults = state.results[examId] ?? {};
          const existing = examResults[studentId];
          if (!existing) return state;
          return {
            results: {
              ...state.results,
              [examId]: {
                ...examResults,
                [studentId]: {
                  ...existing,
                  locked,
                  updatedAt: new Date().toISOString(),
                },
              },
            },
          };
        }),
      clearResult: (examId, studentId) =>
        set((state) => {
          const examResults = { ...(state.results[examId] ?? {}) };
          if (!examResults[studentId]) return state;
          delete examResults[studentId];
          return {
            results: {
              ...state.results,
              [examId]: examResults,
            },
          };
        }),
      clearExam: (examId) =>
        set((state) => {
          if (!state.results[examId]) return state;
          const next = { ...state.results };
          delete next[examId];
          return { results: next };
        }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function getExamResults(
  results: ExamResultState["results"],
  examId: string
) {
  return results[examId] ?? {};
}
