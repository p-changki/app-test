import type {
  Announcement,
  AssignmentStatus,
  AttendanceSummary,
  ClassSummary,
  DashboardNavLink,
  FocusStudent,
  MetricCard,
  PerformanceSummary,
  ProfileSummary,
  QuickAction,
  SidebarFooterLink,
} from "./types";

export const profileSummary: ProfileSummary = {
  name: "김서준",
  title: "수석 강사 (수학)",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAbFGHaTfEPWYKAyOiNmOC8hBwIIFUCVwc6rhnWG0dXSW76nBgfSbGFUSMqWz8gm3ZKGEbmoAklf8UVQbaAb6WtBZfiD-4bxP2Ls5PRfvjGtEVBdNObxutfIzK3zwiBNlTSHOLrJpAGDDs_8TGSwP3ZRyoI7GmWiKJ4F_CDBdvcyk-lsiTeLuPOT3k3RlXuOZJ5HgPqvapzJvj0cIYG3z2_eBf_N9M4JTRlbjS4pCjvE3lHN_EqMgpHz0Ivty7PEBXzwvpS8fx_wD0",
};

const sidebarNavLinksBase: Array<Omit<DashboardNavLink, "active">> = [
  { label: "대시보드", icon: "dashboard", href: "/dashboard" },
  { label: "학생 관리", icon: "groups", href: "/student-management" },
  { label: "수업 관리", icon: "menu_book", href: "/class-management" },
  { label: "수업 개설", icon: "edit_square", href: "/class-registration" },
  { label: "시험 관리", icon: "assignment", href: "/exam-dashboard" },
  { label: "시험 등록", icon: "contract", href: "/exam-management" },
  { label: "성적 입력", icon: "edit_document", href: "#" },
  { label: "출결 관리", icon: "calendar_month", href: "#" },
  { label: "상담 일지", icon: "forum", href: "#" },
];

export const getSidebarNavLinks = (activeLabel: string): DashboardNavLink[] =>
  sidebarNavLinksBase.map((link) => ({
    ...link,
    active: link.label === activeLabel,
  }));

export const sidebarNavLinks = getSidebarNavLinks("대시보드");

export const sidebarFooterLinks: SidebarFooterLink[] = [
  { label: "설정", icon: "settings", href: "#" },
  { label: "로그아웃", icon: "logout", href: "#", intent: "danger" },
];

export const quickActions: QuickAction[] = [
  {
    title: "성적 입력",
    description: "시험/과제 점수",
    href: "#",
    icon: "edit_document",
    accentClass: "bg-blue-50 text-primary dark:bg-blue-900/20",
  },
  {
    title: "성적표 발송",
    description: "학부모 알림톡",
    href: "#",
    icon: "send",
    accentClass:
      "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
  },
  {
    title: "시험/과제 관리",
    description: "새 항목 등록",
    href: "#",
    icon: "assignment_add",
    accentClass:
      "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  },
  {
    title: "시험 현황",
    description: "채점/재시험",
    href: "/exam-dashboard",
    icon: "assignment",
    accentClass:
      "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
  },
  {
    title: "시험 등록",
    description: "시험/과제 관리",
    href: "/exam-management",
    icon: "fact_check",
    accentClass:
      "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
  },
  {
    title: "가입 승인",
    description: "강사/조교 요청",
    href: "/assistant-approvals",
    icon: "person_add",
    accentClass:
      "bg-slate-50 text-slate-700 dark:bg-slate-800/30 dark:text-slate-200",
  },
  {
    title: "조교 관리",
    description: "배정/평가 현황",
    href: "/assistant-management",
    icon: "supervisor_account",
    accentClass:
      "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300",
  },
];

export const metricCards: MetricCard[] = [
  {
    label: "전체 수강생",
    value: "120명",
    icon: "group",
    deltaLabel: "+2명",
    deltaState: "increase",
    accentClass: "bg-blue-50 dark:bg-blue-900/20 text-primary",
  },
  {
    label: "오늘 출석률",
    value: "95%",
    icon: "fact_check",
    deltaLabel: "+1.2%",
    deltaState: "increase",
    accentClass:
      "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  },
  {
    label: "과제 제출률",
    value: "88%",
    icon: "assignment_turned_in",
    deltaLabel: "-2.5%",
    deltaState: "decrease",
    accentClass:
      "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  },
  {
    label: "최근 시험 평균",
    value: "82.5점",
    icon: "analytics",
    deltaLabel: "+0.5점",
    deltaState: "increase",
    accentClass:
      "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400",
  },
];

export const performanceSummary: PerformanceSummary = {
  subject: "주간 테스트 성적 추이 (수학)",
  description: "최근 6주 평균 성적 변화",
  averageScore: "평균 82.5점",
  changeLabel: "+2.5% (전주 대비)",
  changeState: "increase",
};

export const assignmentStatuses: AssignmentStatus[] = [
  {
    title: "수학 I 3단원 쪽지시험",
    badge: {
      label: "D-Day",
      className: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    },
    progressLabel: "90% 제출",
    progressPercent: 90,
    progressClass: "bg-primary",
  },
  {
    title: "미적분 심화 문제집",
    badge: {
      label: "D-2",
      className:
        "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    },
    progressLabel: "45% 제출",
    progressPercent: 45,
    progressClass: "bg-orange-400",
  },
  {
    title: "10월 월말평가",
    badge: {
      label: "마감",
      className:
        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    },
    progressLabel: "채점 완료",
    progressPercent: 100,
    progressClass: "bg-emerald-500",
  },
];

export const classSummaries: ClassSummary[] = [
  { name: "고2 수학 A반", schedule: "월/수/금 18:00", studentCount: "25명" },
  { name: "고3 수학 S반", schedule: "화/목 19:00", studentCount: "15명" },
  { name: "중3 수학 심화", schedule: "토 14:00", studentCount: "18명" },
];

export const attendanceSummary: AttendanceSummary = {
  attended: 114,
  total: 120,
  dateLabel: "2023.10.24 기준",
  breakdown: [
    { label: "출석", percent: 95, colorClass: "bg-primary" },
    { label: "지각", percent: 3, colorClass: "bg-yellow-400" },
    { label: "결석", percent: 2, colorClass: "bg-red-500" },
  ],
};

export const focusStudents: FocusStudent[] = [
  {
    id: "minho",
    name: "이민호",
    group: "고2 수학 A반",
    initials: "이",
    statusLabel: "결석 3회 누적",
    statusClass: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  {
    id: "jisu",
    name: "박지수",
    group: "고2 수학 B반",
    initials: "박",
    statusLabel: "성적 급락 (-15점)",
    statusClass:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
  {
    id: "hyunwoo",
    name: "최현우",
    group: "고3 수학 S반",
    initials: "최",
    statusLabel: "과제 미제출",
    statusClass:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
];

export const announcements: Announcement[] = [
  {
    id: "exam",
    title: "11월 수능 대비 모의고사 일정 안내",
    category: "중요",
    categoryClass:
      "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    timestamp: "1시간 전",
  },
  {
    id: "counsel",
    title: "학부모 상담 주간 스케줄 확인 요청",
    category: "공지",
    categoryClass:
      "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    timestamp: "어제",
  },
  {
    id: "policy",
    title: "강의실 내 방역 수칙 안내",
    category: "일반",
    categoryClass:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    timestamp: "2일 전",
  },
];

export const dashboardSearchPlaceholder = "학생 이름, 전화번호 검색...";
export const dashboardPrimaryAction = "성적표 발송";
