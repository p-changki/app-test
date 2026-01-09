import type { Metadata } from "next";

import { ClassManagementOverview } from "@/features/class-management/components/ClassManagementOverview";

export const metadata: Metadata = {
  title: "수업 관리 - EduTrack",
  description: "클래스별 편성 현황과 주요 알림을 관리합니다.",
};

export default function ClassManagementPage() {
  return <ClassManagementOverview />;
}
