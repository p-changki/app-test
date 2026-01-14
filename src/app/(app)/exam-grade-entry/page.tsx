import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { examDefinitions } from "@/data/exams";

export const metadata: Metadata = {
  title: "성적 입력 - EduTrack",
  description: "클래스별 시험 및 과제 점수를 입력하고 관리하는 화면",
};

export default function ExamGradeEntryPage() {
  const firstExam = examDefinitions[0];
  if (firstExam) {
    redirect(`/exam-grade-entry/${firstExam.id}`);
  }
  redirect("/exam-dashboard");
}
