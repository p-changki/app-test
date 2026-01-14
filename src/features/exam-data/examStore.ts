"use client";

import { useSyncExternalStore } from "react";

import { examDefinitions } from "@/data/exams";
import type { ExamQuestion, ExamStatus, RegisteredExam } from "@/types/exams";

const STORAGE_KEY = "eduops.exam-records.v2";

type DraftQuestionInput = {
  label: string;
  type: ExamQuestion["type"];
  category: string;
  source: string;
  points: number;
  answer: string;
};

export type ExamDraft = {
  title: string;
  subject: string;
  examType: string;
  source: string;
  targetClass: string;
  examDate: string;
  passScore: number;
  status?: ExamStatus;
  summary?: string;
  notes?: string[];
  questions: DraftQuestionInput[];
};

let examsState: RegisteredExam[] = [...examDefinitions];
let initialized = false;
const listeners = new Set<() => void>();

function ensureInit() {
  if (initialized || typeof window === "undefined") {
    return;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        examsState = parsed;
      }
    }
  } catch {
    // ignore parse errors and fall back to sample data
  }

  initialized = true;
}

function getClientSnapshot() {
  ensureInit();
  return examsState;
}

function getServerSnapshot() {
  return examDefinitions;
}

function persist(data: RegisteredExam[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

function subscribe(listener: () => void) {
  ensureInit();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function setState(updater: (prev: RegisteredExam[]) => RegisteredExam[]) {
  const next = updater(getClientSnapshot());
  examsState = next;
  persist(next);
  listeners.forEach((listener) => listener());
}

export function useExamStore<T = RegisteredExam[]>(
  selector?: (exams: RegisteredExam[]) => T
): T {
  const derivedSelector = selector ?? ((state) => state as unknown as T);
  return useSyncExternalStore(
    subscribe,
    () => derivedSelector(getClientSnapshot()),
    () => derivedSelector(getServerSnapshot())
  );
}

export function registerExam(record: RegisteredExam) {
  setState((prev) => {
    const existingIndex = prev.findIndex((exam) => exam.id === record.id);
    if (existingIndex >= 0) {
      const next = [...prev];
      next[existingIndex] = record;
      return next;
    }
    return [record, ...prev];
  });
}

export function removeExams(ids: string[]) {
  if (!ids.length) return;
  setState((prev) => prev.filter((exam) => !ids.includes(exam.id)));
}

export function createExamId(title: string) {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const unique = Date.now().toString(36);
  return slug ? `${slug}-${unique}` : `exam-${unique}`;
}

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

export function createExamFromDraft(draft: ExamDraft): RegisteredExam {
  const now = new Date();
  const questions = draft.questions.map((question, index) => ({
    id: index + 1,
    label: question.label.trim() || `문항 ${index + 1}`,
    type: question.type,
    category: question.category?.trim() || "",
    source: question.source?.trim() || "",
    points: Number.isFinite(question.points) ? question.points : 0,
    answer: question.answer.trim() || "-",
  }));

  const totalScore = 100;

  return {
    id: createExamId(draft.title),
    title: draft.title.trim() || `새 시험 ${formatDate(now)}`,
    subject: draft.subject,
    examType: draft.examType.trim() || "일반 시험",
    source: draft.source.trim() || "학원 제작",
    classId: draft.targetClass || "unassigned",
    targetClass: draft.targetClass,
    examDate: draft.examDate || formatDate(now),
    createdAt: formatDate(now),
    totalQuestions: questions.length,
    totalScore,
    passScore: draft.passScore,
    status: draft.status ?? "초안",
    summary:
      draft.summary?.trim() || `${draft.targetClass} ${draft.subject} 시험`,
    notes: draft.notes ?? [],
    questions,
  };
}

export function upsertExamFromDraft(draft: ExamDraft) {
  const record = createExamFromDraft(draft);
  registerExam(record);
  return record;
}

export function useExamById(examId: string) {
  return useExamStore((exams) => exams.find((exam) => exam.id === examId));
}
