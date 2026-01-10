import type { Metadata } from "next";

import { StudentClassesSchedule } from "@/features/student-classes/StudentClassesSchedule";

export const metadata: Metadata = {
  title: "나의 수업 - EduTrack",
  description: "학생이 수강중인 수업 일정과 세부 정보를 확인합니다.",
};

export default function StudentClassesPage() {
  return <StudentClassesSchedule />;
}
