import type { Metadata } from "next";

import { ExamRetestProposalsOverview } from "@/features/exam-retest/overview/ExamRetestProposalsOverview";

export const metadata: Metadata = {
  title: "재시험 제안 관리 - EduTrack",
  description: "학생 재시험 제안을 검토하고 수락/조정/거절하는 화면",
};

export default function ExamRetestProposalsPage() {
  return <ExamRetestProposalsOverview />;
}
