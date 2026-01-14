import { InstructorProfilePage } from "@/features/instructor-profile/InstructorProfilePage";

export const metadata = {
  title: "강사 프로필 - EduTrack",
  description: "강사/조교 프로필 정보와 담당 강의를 확인하는 페이지",
};

export default function Page() {
  return <InstructorProfilePage />;
}
