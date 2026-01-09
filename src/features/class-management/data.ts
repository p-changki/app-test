import type {
  Breadcrumb,
  CalendarConfig,
  ClassAction,
  ClassHeaderSummary,
  ClassQuickCard,
  StudentRow,
  StudentSummary,
  UpcomingSession,
} from "./types";

export const classBreadcrumbs: Breadcrumb[] = [
  { label: "대시보드", href: "/dashboard" },
  { label: "강의 관리", href: "/class-management" },
  { label: "수학 심화 A반 (고2)" },
];

export const classHeaderSummary: ClassHeaderSummary = {
  title: "수학 심화 - 고2 과정",
  code: "MA-11-A",
  statusLabel: "수업 진행 중",
};

export const classActions: ClassAction[] = [
  { label: "정보 수정", icon: "edit", variant: "default" },
  { label: "전체 공지", icon: "notifications", variant: "default" },
  { label: "성적표 출력", icon: "print", variant: "primary" },
];

export const quickCards: ClassQuickCard[] = [
  {
    id: "classroom",
    icon: "meeting_room",
    title: "강의실",
    value: "304호",
    description: "정원 20명 • 빔프로젝터 완비",
    actionLabel: "변경",
  },
  {
    id: "schedule",
    icon: "calendar_clock",
    title: "수업 시간",
    value: "매주 월, 수",
    description: "18:00 - 20:00 (2시간)",
  },
  {
    id: "next-session",
    icon: "hourglass_top",
    title: "다음 수업",
    value: "오늘",
    meta: "2시간 후 시작",
    highlight: {
      label: "임박",
      variant: "success",
    },
  },
  {
    id: "instructors",
    icon: "supervisor_account",
    title: "담당 강사진",
    value: "김현우",
    description: "& 이준호",
    meta: "담당 강사 & 조교",
    avatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAr6WViB8RZmDRAX8RMCQWopz2_EEu684GMUzbY4rKJ6AGEwcdCNGS-HuTRNXKYyTDB83DeoEMevsGQZ3_S7JptueGm6CwvSxPVoA7o3IyCKintn1joIX3YLTj3VGLY8zq-V1WOm5iJe97Z8esuUQ7-cj2UGiMxW6stgZ9AvdjlzIbIzILKYFvVkqQ9JHEbfxG0Grw_0wBR-1TMKgQ6nEOCDLgS8vgmih2TXPfajBwHXD-KUWnQWT8Yoe2vWykVDzpetgVCuRqi2pg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCYdedLy4oO3-FJbqwSliBeLX4EP09RHyKyJkCdn9E2dGoasqK-NouMbSBz9aid8W99b-aNx0ohQqzKrHL-pQpwmO7mlwTJm88F7ngrikH6HXR5VnGj72pWK_lFP2gH7e-DslyTODHiCT4zq6B8Y0gSaFN2g_vazGXIZcNHHb3ZFUnqcaQBJuWDQgbfo1M8kvOtN9TGvcGUXMZZWzFUwnUWfpV2_TTck0lN_VT0DhGn5kCCj32tevk5-vuqCGNpLEptXQU4HWspSr0",
    ],
  },
];

export const studentSummary: StudentSummary = {
  totalLabel: "총 18명",
  attendanceLabel: "평균 출석률 94%",
};

export const students: StudentRow[] = [
  {
    id: "stu-2024001",
    name: "박지윤",
    studentId: "2024001",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCCyoxD05GwP2R-WpMK_Nkqtkd_4x7XPAe1UPqtIz8uHUtAD46EsDx-A43K2fBomJocAiXIch7fJoS9w3XyGBeFk0nm61A-Rijk2l3X-zQr2dxY-UwWcD1kYZK2MsiOlJSeBRoaF8l-mzAHY6fbKha58OU6XhyrN4Z35X5fyfxDBqPoN3TUFDQFReSlJ-2PVjujtHMfbQJgnvw_D6U5eU6O0bXVmu3hFjFBHoQCfmzQbTzsKg25fjwVjte6R0axcChLDleOZvuznp0",
    status: { label: "재원", variant: "default" },
    attendance: 98,
    score: 92,
    scoreDelta: { direction: "up", value: 2 },
  },
  {
    id: "stu-2024002",
    name: "김민수",
    studentId: "2024002",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDVk8o60JAiiHyFrybsSgGh9SYbPVW3o0EBhImw8xWbKblNpHzES8JxzuK7Q0Tr3Sblgv2I2l1CzFMu46W_KUzRT-9dUXJ6ENT_g9hWtXNRcKqmGx6vgHfwezSkrOMXi5-_zQWxjif83AdfTQ7PJGiybkTBb_eG0FxF1adfXGZ2IXvP4Ew91FBDhEpkzMfEDP1phOqdMwisoorgmhKyFzT_1W7I8v86LDP-rUJr4_o5Slj7yJd06myKk_VwoWIuqMwGH6Y8eyA21hw",
    status: { label: "재원", variant: "default" },
    attendance: 85,
    score: 78,
    scoreDelta: { direction: "down", value: 5 },
  },
  {
    id: "stu-2024005",
    name: "최수진",
    studentId: "2024005",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjztx1kdIC4bTIPif_1-gSKlXerGPt1JHGzF5Y-2jG4-bMI20LyTLM73Y-543WhswSipZgdcL6zU2lCHbZ_vLoaSB1CVjkjeJn-Lg127T0e3DcF523pq4wCV_qlu_j92Ns-440vXtsKjYY5TRRC1ILWwxRECZ7sObhEQb4jSZrf5JrGf60GbkTcqTf4Gkv8tQfn3FbIq3PmphumbCX9ERHUXtBGJdhBOYiRqn2EmCSIzibeniKSek-VbJj6nVvLLjvx4iwmMiLvFM",
    status: { label: "결석", variant: "danger" },
    attendance: 92,
    score: 88,
  },
  {
    id: "stu-2024012",
    name: "이준호",
    studentId: "2024012",
    initials: "LJ",
    status: { label: "재원", variant: "default" },
    attendance: 100,
    score: 95,
    scoreDelta: { direction: "up", value: 1 },
  },
];

export const calendarWeekdays = ["월", "화", "수", "목", "금", "토", "일"];

export const calendarConfig: CalendarConfig = {
  monthLabel: "2023년 10월",
  weeks: [
    [
      { label: "25", variant: "muted" },
      { label: "26", variant: "muted" },
      { label: "27", variant: "muted" },
      { label: "28", variant: "muted" },
      { label: "29", variant: "muted" },
      { label: "30", variant: "muted" },
      { label: "1", variant: "default" },
    ],
    [
      { label: "2", variant: "primary" },
      { label: "3", variant: "default" },
      { label: "4", variant: "primary" },
      { label: "5", variant: "default" },
      { label: "6", variant: "default" },
      { label: "7", variant: "default" },
      { label: "8", variant: "default" },
    ],
    [
      { label: "9", variant: "primary" },
      { label: "10", variant: "default" },
      { label: "11", variant: "primary" },
      { label: "12", variant: "default" },
      { label: "13", variant: "default" },
      { label: "14", variant: "default" },
      { label: "15", variant: "default" },
    ],
    [
      { label: "16", variant: "primary" },
      { label: "17", variant: "default" },
      { label: "18", variant: "primary" },
      { label: "19", variant: "default" },
      { label: "20", variant: "default" },
      { label: "21", variant: "default" },
      { label: "22", variant: "default" },
    ],
    [
      { label: "23", variant: "success" },
      { label: "24", variant: "default" },
      { label: "25", variant: "default" },
      { label: "26", variant: "default" },
      { label: "27", variant: "default" },
      { label: "28", variant: "default" },
      { label: "29", variant: "default" },
    ],
  ],
};

export const upcomingSessions: UpcomingSession[] = [
  {
    id: "session-today",
    timeLabel: "오늘, 18:00",
    topic: "이차함수 활용",
    description: "심화 문제 풀이",
    accent: "primary",
  },
  {
    id: "session-25",
    timeLabel: "10월 25일 (수)",
    topic: "복소수 기초",
    description: "개념 확장",
  },
  {
    id: "session-30",
    timeLabel: "10월 30일 (월)",
    topic: "중간고사 총정리",
    description: "모의고사 형식",
  },
];

export const classNotesPlaceholder = "다음 수업을 위한 메모를 입력하세요...";
