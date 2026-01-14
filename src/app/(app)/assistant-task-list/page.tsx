import type { Metadata } from "next";

import { AssistantTaskListPage } from "@/features/assistant-management/AssistantTaskListPage";

export const metadata: Metadata = {
  title: "업무 지시 내역 - EduTrack",
  description: "강사가 지시한 조교 업무 내역을 확인합니다.",
};

export default function AssistantTaskListRoute() {
  return <AssistantTaskListPage />;
}
