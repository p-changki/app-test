import type { Metadata } from "next";

import {
  getStudentDetailById,
  defaultStudentId,
} from "@/features/student-management/detail/data";
import { StudentDetailPageContent } from "@/features/student-management/detail/StudentDetailPageContent";

type StudentDetailPageProps = {
  params?: Promise<{ studentId: string }>;
};

export const metadata: Metadata = {
  title: "학생 상세 정보 - EduTrack",
  description: "선택한 학생의 성취도와 상담 정보를 확인할 수 있습니다.",
};

export default async function StudentDetailPage({
  params,
}: StudentDetailPageProps) {
  const resolvedParams = params
    ? await params
    : { studentId: defaultStudentId };
  const student = getStudentDetailById(resolvedParams.studentId);

  return <StudentDetailPageContent student={student} />;
}
