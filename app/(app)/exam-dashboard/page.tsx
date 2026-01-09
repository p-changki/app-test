import type { Metadata } from "next";

import { ExamDashboardOverview } from "@/features/exam-dashboard/components/overview/ExamDashboardOverview";

export const metadata: Metadata = {
  title: "시험 및 과제 관리 - EduTrack",
  description: "시험과 과제 현황을 점검하고 채점/재시험을 관리합니다.",
};

export default function ExamDashboardPage() {
  return <ExamDashboardOverview />;
}
