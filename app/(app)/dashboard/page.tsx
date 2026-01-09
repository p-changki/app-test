import type { Metadata } from "next";

import { DashboardOverview } from "@/features/dashboard/overview/DashboardOverview";

export const metadata: Metadata = {
  title: "강사 대시보드 - EduTrack",
  description: "강사/조교를 위한 학습 관리 대시보드",
};

export default function DashboardPage() {
  return <DashboardOverview />;
}
