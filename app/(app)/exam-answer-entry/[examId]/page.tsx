import type { Metadata } from "next";

import { ExamDetailClientPage } from "@/features/exam-data/components/ExamDetailClientPage";
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
    title: exam ? `${exam.title} - 시험 상세` : "시험 상세",
  };
}

export default async function ExamDetailPage({
  params,
}: {
  params: ParamsPromise;
}) {
  const { examId } = await params;
  return <ExamDetailClientPage examId={examId} />;
}
