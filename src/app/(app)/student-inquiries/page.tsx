import { StudentInquiryListPage } from "@/features/student-inquiries/StudentInquiryListPage";

export const metadata = {
  title: "문의 관리 - EduTrack",
  description: "학생/학부모용 문의 관리 목록",
};

export default function Page() {
  return <StudentInquiryListPage />;
}
