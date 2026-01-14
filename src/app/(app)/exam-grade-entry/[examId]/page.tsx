import type { Metadata } from "next";

import { ExamAnswerEntryPage } from "@/features/exam-grade-entry/ExamAnswerEntryPage";
import { getExamById } from "@/data/exams";

type ParamsPromise = Promise<{ examId: string }>;

export async function generateMetadata({
  params,
}: {
  params: ParamsPromise;
}): Promise<Metadata> {
  const { examId } = await params;
  const exam = getExamById(examId);
  return {
    title: exam ? `${exam.title} 채점 입력` : "학생 답안 입력",
  };
}

export default async function ExamGradeEntryDetailPage({
  params,
}: {
  params: ParamsPromise;
}) {
  const { examId } = await params;
  return <ExamAnswerEntryPage examId={examId} />;
}
