import type { Metadata } from "next";

import { ExamEditClientPage } from "@/features/exam-data/components/ExamEditClientPage";
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
    title: exam ? `${exam.title} 수정` : "시험 수정",
  };
}

export default async function ExamEditPage({
  params,
}: {
  params: ParamsPromise;
}) {
  const { examId } = await params;
  return <ExamEditClientPage examId={examId} />;
}
