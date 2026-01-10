import type { Metadata } from "next";

import { StudentGradesDetail } from "@/features/student-grades/StudentGradesDetail";

export const metadata: Metadata = {
  title: "학생 성적 조회 - EduTrack",
  description: "학생의 학기별 성적을 상세 분석으로 제공합니다.",
};

export default function StudentGradesPage() {
  return <StudentGradesDetail />;
}
