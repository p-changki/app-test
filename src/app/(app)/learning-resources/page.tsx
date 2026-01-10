import type { Metadata } from "next";

import { LearningResourcesOverview } from "@/features/learning-resources/LearningResourcesOverview";

export const metadata: Metadata = {
  title: "학습 자료실 - EduManager",
  description: "수업 보조 자료와 심화 학습 콘텐츠를 한 곳에서 관리합니다.",
};

export default function LearningResourcesPage() {
  return <LearningResourcesOverview />;
}
