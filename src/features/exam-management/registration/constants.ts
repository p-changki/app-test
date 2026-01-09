import type {
  DraftQuestion,
  FormState,
} from "@/features/exam-management/registration/types";

export const SUBJECT_OPTIONS = ["수학", "영어", "국어", "과학"] as const;
export const CLASS_OPTIONS = [
  "고2 수학 A반",
  "고2 수학 B반",
  "고3 심화반",
  "중3 영어 심화반",
] as const;
export const ANSWER_OPTIONS = [1, 2, 3, 4, 5] as const;

export const DEFAULT_FORM: FormState = {
  title: "",
  subject: SUBJECT_OPTIONS[0],
  targetClass: CLASS_OPTIONS[0],
  examDate: "",
  passScore: "80",
  summary: "",
  notes: "",
  autoRetest: true,
};

export function createDraftQuestion(order: number): DraftQuestion {
  return {
    id: `${order}-${Math.random().toString(36).slice(2, 8)}`,
    label: `문항 ${order}`,
    type: "객관식",
    points: 5,
    answer: "1",
    allowPartial: true,
  };
}

export function buildInitialQuestions(count = 2) {
  return Array.from({ length: count }, (_, index) =>
    createDraftQuestion(index + 1)
  );
}
