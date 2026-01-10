import { InquiryDetailPage } from "@/features/inquiry-dashboard/InquiryDetailPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata = {
  title: "문의 상세 - EduTrack",
  description: "문의 처리 상세 페이지",
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <InquiryDetailPage inquiryId={id} />;
}
