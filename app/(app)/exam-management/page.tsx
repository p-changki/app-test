import type { Metadata } from "next";

import { ExamRegistrationClientPage } from "@/features/exam-management/ExamRegistrationClientPage";

export const metadata: Metadata = {
  title: "시험 등록 - EduTrack",
  description: "시험/과제를 등록하고 문항 및 배점을 구성하는 화면",
};

export default function ExamManagementPage() {
  return <ExamRegistrationClientPage />;
}
