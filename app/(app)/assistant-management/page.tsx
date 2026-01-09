import type { Metadata } from "next";

import { AssistantManagementClientPage } from "@/features/assistant-management/AssistantManagementClientPage";

export const metadata: Metadata = {
  title: "조교 관리 - EduTrack",
  description: "배정된 조교 목록을 조회하고 업무를 배정/평가합니다.",
};

export default function AssistantManagementPage() {
  return <AssistantManagementClientPage />;
}
