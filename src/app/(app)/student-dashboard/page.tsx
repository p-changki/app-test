import type { Metadata } from "next";

import { StudentDashboardOverview } from "@/features/student-dashboard/StudentDashboardOverview";

export const metadata: Metadata = {
  title: "학생 페이지 대시보드 - EduTrack",
  description: "학생이 주간 목표, 일정, 피드백을 확인하는 전용 공간입니다.",
};

export default function StudentDashboardPage() {
  return <StudentDashboardOverview />;
}
