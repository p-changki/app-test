import type { Metadata } from "next";

import { RemedialTargetsOverview } from "@/features/exam-remedial-targets/overview/RemedialTargetsOverview";

export const metadata: Metadata = {
  title: "재시험 대상자 관리 - EduTrack",
  description: "기준 점수 미달 학생의 재시험 예약 상태를 관리하는 화면",
};

export default function ExamRemedialTargetsPage() {
  return <RemedialTargetsOverview />;
}
