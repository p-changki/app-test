import type { Metadata } from "next";

import { ExamGradeEntryOverview } from "@/features/exam-management/components/ExamGradeEntryOverview";

export const metadata: Metadata = {
  title: "성적 입력 - EduTrack",
  description: "클래스별 시험 및 과제 점수를 입력하고 관리하는 화면",
};

export default function ExamGradeEntryPage() {
  return <ExamGradeEntryOverview />;
}
