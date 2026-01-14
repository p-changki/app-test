import { StudentProfilePage } from "@/features/student-profile/StudentProfilePage";
import type { StudentDetail } from "@/features/student-management/types";

export function StudentDetailPageContent({
  student,
}: {
  student: StudentDetail;
}) {
  return <StudentProfilePage key={student.id} enableGradeView />;
}
