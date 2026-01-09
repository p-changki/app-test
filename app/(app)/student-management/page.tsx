import type { Metadata } from "next";

import { StudentManagementOverview } from "@/features/student-management/overview/StudentManagementOverview";

export const metadata: Metadata = {
  title: "학생 관리 - EduTrack",
  description: "학급별 학생을 조회하고 배정/알림을 관리하는 화면",
};

export default function StudentManagementPage() {
  return <StudentManagementOverview />;
}
