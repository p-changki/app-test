import { StudentInquiryDetailPage } from "@/features/student-inquiries/StudentInquiryDetailPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata = {
  title: "문의 상세 - EduTrack",
  description: "학생/학부모용 문의 상세 페이지",
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <StudentInquiryDetailPage inquiryId={id} />;
}
