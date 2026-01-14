import type { Metadata } from "next";

import { GradeReportPage } from "@/features/exam-dashboard/GradeReportPage";

export const metadata: Metadata = {
  title: "성적표 발송 - EduTrack",
  description: "학생 성적표 발송 및 템플릿 관리 화면",
};

export default function ExamReportSendPage() {
  return <GradeReportPage />;
}
