export type DraftQuestion = {
  id: string;
  label: string;
  type: "객관식" | "주관식";
  points: number;
  answer: string;
  allowPartial: boolean;
};

export type FormState = {
  title: string;
  subject: string;
  targetClass: string;
  examDate: string;
  passScore: string;
  summary: string;
  notes: string;
  autoRetest: boolean;
};

export type BannerState = { type: "success" | "error"; text: string } | null;
