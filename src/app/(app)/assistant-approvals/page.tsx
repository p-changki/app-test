import type { Metadata } from "next";

import { AssistantApprovalsOverview } from "@/features/assistant-management/overview/AssistantApprovalsOverview";

export const metadata: Metadata = {
  title: "조교 관리 - 승인 대기",
  description: "승인 대기 중인 조교 가입 신청을 검토하고 처리하는 화면",
};

export default function AssistantApprovalsPage() {
  return <AssistantApprovalsOverview />;
}
