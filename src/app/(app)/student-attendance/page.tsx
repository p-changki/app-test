import type { Metadata } from "next";

import { StudentAttendanceDetail } from "@/features/student-attendance/StudentAttendanceDetail";

export const metadata: Metadata = {
  title: "학생 출결 상세 - EduTrack",
  description: "학생의 월별 출결 현황을 달력과 리스트로 확인합니다.",
};

export default function StudentAttendancePage() {
  return <StudentAttendanceDetail />;
}
