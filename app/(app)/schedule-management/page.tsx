import type { Metadata } from "next";

import { ScheduleManagementOverview } from "@/features/schedule-management/overview/ScheduleManagementOverview";

export const metadata: Metadata = {
  title: "스케줄 관리 - EduTrack",
  description: "수업, 상담, 시험 등 주요 일정을 한 화면에서 관리합니다.",
};

export default function ScheduleManagementPage() {
  return <ScheduleManagementOverview />;
}
