import type { Metadata } from "next";

import { StudentProfilePage } from "@/features/student-profile/StudentProfilePage";

export const metadata: Metadata = {
  title: "학생 프로필 - EduTrack",
  description: "학생 상세 정보와 학업 현황을 확인합니다.",
};

export default function StudentProfile() {
  return <StudentProfilePage />;
}
