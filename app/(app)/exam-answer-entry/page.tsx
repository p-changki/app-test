import type { Metadata } from "next";

import { ExamListClientPage } from "@/features/exam-data/components/ExamListClientPage";

export const metadata: Metadata = {
  title: "시험지 목록 - EduTrack",
  description: "등록된 시험지를 한 번에 조회하고 상태를 점검하는 화면",
};

export default function ExamAnswerEntryPage() {
  return <ExamListClientPage />;
}
