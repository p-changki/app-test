import type { StudentDetail } from "@/features/student-management/types";

const studentDetailData: Record<string, StudentDetail> = {
  "student-kim-minjun": {
    id: "student-kim-minjun",
    name: "김민준",
    status: "재원중",
    school: "서울고등학교",
    grade: "2학년",
    studentId: "20230501",
    heroAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDLlidok0fCHuswxfn8xb4HGkpH3nCBZiLcB_riUWkSRpDng-BXb8_EUE0GKxXUtsH9JW72l_Frd-AfMG397jCLiilW2jSWSlHlnBky1NHB-JQ8dYiLPb0kpYT5Y6sbvc-mdQOKEVZjAZdBD69rVWCu4dsiJqiDuPKrIUtz33Pa4VVLEFeaB-Y4S9vpgEsw1v4ab4nilHKtIn9zh0Pxf1mjD05EAcukiCx4aRFB2CUrN0bBSaH0nszFSSLxuKu7N9irvBRcEh8OKiE",
    contacts: [
      { label: "학생 본인", icon: "smartphone", value: "010-1234-5678" },
      { label: "학부모 (모)", icon: "family_restroom", value: "010-9876-5432" },
    ],
    metrics: [
      {
        label: "평균 점수",
        value: "90.5",
        icon: "analytics",
        meta: "2.5%",
        variant: "positive",
      },
      {
        label: "석차",
        value: "상위 5%",
        icon: "leaderboard",
        meta: "1.0%",
        variant: "positive",
      },
      {
        label: "출석률",
        value: "95%",
        icon: "calendar_today",
        meta: "최근 30일",
      },
      {
        label: "과제 제출",
        value: "18/20",
        icon: "assignment",
        meta: "2건 지연",
        variant: "warning",
      },
    ],
    subjects: [
      { icon: "calculate", title: "수학", description: "미적분 II", score: 92 },
      { icon: "language", title: "영어", description: "심화 작문", score: 88 },
      { icon: "science", title: "과학", description: "물리 I", score: 95 },
    ],
    attendanceHeatmap: [
      { day: 1, variant: "attendance" },
      { day: 2, variant: "attendance" },
      { day: 3, variant: "attendance" },
      { day: 4, variant: "none" },
      { day: 5, variant: "attendance" },
      { day: 6, variant: "late" },
      { day: 7, variant: "attendance" },
      { day: 8, variant: "attendance" },
      { day: 9, variant: "attendance" },
      { day: 10, variant: "none" },
      { day: 11, variant: "none" },
    ],
    memoPlaceholder: "김민준 학생에 대한 메모를 작성하세요...",
    counselingLogs: [
      {
        title: "과제 미제출 상담",
        date: "2023. 10. 15",
        description:
          "최근 영어 과제 제출률 저조 관련 상담. 학교 축제 준비로 인한 시간 부족 호소.",
        variant: "primary",
      },
      {
        title: "학기 목표 설정",
        date: "2023. 09. 01",
        description: "이번 학기 목표 설정 완료. 수학 상위 3% 진입 목표.",
        variant: "secondary",
      },
      {
        title: "학부모 전화 상담",
        date: "2023. 08. 12",
        description: "어머니와 여름 특강 일정 관련 통화. 수강 확정.",
        variant: "secondary",
      },
    ],
  },
};

const defaultStudentId = "student-kim-minjun";

export function getStudentDetailById(studentId: string): StudentDetail {
  return studentDetailData[studentId] ?? studentDetailData[defaultStudentId];
}

export { studentDetailData, defaultStudentId };
