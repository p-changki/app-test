import type { Metadata } from "next";

import { ClassRegistrationOverview } from "@/features/class-registration";

export const metadata: Metadata = {
  title: "수업 등록/개설 - EduTrack",
  description: "새로운 강의를 등록하고 운영 정보를 설정하는 화면",
};

export default function ClassRegistrationPage() {
  return <ClassRegistrationOverview />;
}
