import type { Metadata } from "next";

import { ReportPublishClient } from "@/features/exam-management/report-publish/ReportPublishClient";

export const metadata: Metadata = {
  title: "성적표 발표 센터 - EduTrack",
  description: "수업과 학생을 검색해 맞춤 템플릿으로 성적표를 발송합니다.",
};

export default function ExamReportPublishPage() {
  return <ReportPublishClient />;
}
