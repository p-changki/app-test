import { classEntities } from "@/data/classes";
import type { ExamDefinition } from "@/types/entities";
import type {
  AssignmentRow,
  ExamGradeRow,
  ExamStatCard,
  FlaggedAssignment,
  RegisteredExam,
  ReportClassOption,
  ReportStudent,
  ReportTemplate,
  RemedialStudent,
  RemedialSummaryStat,
  TodayRetestStudent,
  UnscheduledStudent,
} from "@/types/exams";

const buildQuestions = (
  count: number,
  points: number,
  label: string,
  source: string
) =>
  Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    label: `${label} ${index + 1}`,
    type: "객관식" as const,
    category: label,
    source,
    points,
    answer: String((index % 5) + 1),
  }));

export const examDefinitions: ExamDefinition[] = [
  {
    id: "eng-preview-5",
    title: "리포트용 영어 모의평가",
    subject: "영어(독해)",
    examType: "모의고사",
    source: "학원 제작",
    classId: "class-eng-preview-2025-01",
    targetClass: "고2 영어 리포트반",
    examDate: "2026-01-13",
    createdAt: "2026-01-10",
    totalQuestions: 5,
    totalScore: 100,
    passScore: 80,
    status: "채점 완료",
    summary: "시험 리포트 예시용 모의평가입니다.",
    notes: ["리포트 시안 검수"],
    questions: buildQuestions(5, 20, "독해", "리포트 시안"),
  },
  {
    id: "eng-reading-basic-20",
    title: "영어 독해 기본 평가",
    subject: "영어(독해)",
    examType: "단원 평가",
    source: "학원 제작",
    classId: "class-eng-a-2025-01",
    targetClass: "고1 영어 A반",
    examDate: "2025-03-20",
    createdAt: "2025-03-10",
    totalQuestions: 20,
    totalScore: 100,
    passScore: 80,
    status: "등록 완료",
    summary: "독해 기본 개념 이해도를 확인하는 평가입니다.",
    notes: ["지문 길이 조정 필요", "오답 노트 필수"],
    questions: buildQuestions(20, 5, "독해", "교재 A"),
  },
  {
    id: "eng-grammar-listening-50",
    title: "영어 문법+듣기 종합",
    subject: "영어(문법/듣기)",
    examType: "모의고사",
    source: "기출+자체",
    classId: "class-eng-b-2025-01",
    targetClass: "고2 영어 심화반",
    examDate: "2025-03-27",
    createdAt: "2025-03-15",
    totalQuestions: 50,
    totalScore: 100,
    passScore: 80,
    status: "등록 완료",
    summary: "문법과 듣기를 통합한 실전 모의고사입니다.",
    notes: ["듣기 파트 재생 장비 점검"],
    questions: buildQuestions(50, 2, "문법/듣기", "기출+자체"),
  },
];

const clinicClassIds = new Set(
  classEntities
    .filter((klass) => {
      const hasAlert = (klass.alerts ?? []).some((alert) =>
        ["보충", "결시", "클리닉"].some((keyword) => alert.includes(keyword))
      );
      const hasFocusTag = (klass.focusTags ?? []).some((tag) =>
        ["보충", "결시", "클리닉"].some((keyword) => tag.includes(keyword))
      );
      return hasAlert || hasFocusTag;
    })
    .map((klass) => klass.id)
);

const clinicExamCount = examDefinitions.filter((exam) =>
  clinicClassIds.has(exam.classId)
).length;

export const examStats: ExamStatCard[] = [
  {
    title: "총 시험 등록",
    value: `${examDefinitions.length}개`,
    subtitle: "등록된 시험 수",
    icon: "content_paste",
    accentClass:
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400",
  },
  {
    title: "클리닉 대상 시험",
    value: `${clinicExamCount}개`,
    subtitle: "클리닉 대상 클래스 기준",
    icon: "local_hospital",
    accentClass:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
    href: "/exam-remedial-targets",
  },
];

export const flaggedAssignments: FlaggedAssignment[] = [
  {
    id: "kim-minji",
    student: "김민지",
    assignment: "중간고사 수학 복습",
    scoreLabel: "45점 / 100점 (탈락)",
    timestamp: "2시간 전",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB-L5f1_DZ6tV7hATrR8Kjz-_ptOs-IDispvH5kLcpnDEOOwVOD5zN15O2hori-1qfW1c7rCadZpxcZgEmZmZRtMpdPj4ylKwiT0kpWK9fs_YWoSjnz4NCTDUOH_kdTrOaIPE1RtBf2srj0SQEsspnEdM_3oyYzNRlCbYrKCUPd35JqafcW5SDLphjJjRyBWump3kmZYi2qy4PWKbagmawFIw337MI4lnapoHBCX4jNCdv0fM7W5RRh-Wr9DNKqOZxolmHh7EHqAog",
    primaryAction: {
      label: "재시험 배정",
      icon: "restart_alt",
      variant: "primary",
    },
    secondaryIcon: "chat",
  },
  {
    id: "lee-junho",
    student: "이준호",
    assignment: "어휘 퀴즈 3",
    scoreLabel: "8점 / 20점 (부족)",
    timestamp: "5시간 전",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBIgS_bql83QxEK5omeza4pEBa8WRsZHgRSTfDPHWRP-W1t_RqfCDh0xTf1_GiPrYIzF_AMxspsUBNCYFWvyWkHF20-QAY1Tw8chDj42SmIImb0qyK4Y0B8zGjCD3ez2suPHSz03K6Dz0vFox3Im_HcnYGyNqL3XGomMUb90ZSWp9LuothegJrG-PorxWekAtUvLR8iM-Fzj6zvaxPz9t9-mfrRx2bJbRC_3joNulAM6IKlvU77Gft__BXf3YRle7xTob-Qa-WyFXs",
    primaryAction: {
      label: "보충 학습 지시",
      icon: "library_books",
      variant: "secondary",
    },
    secondaryIcon: "chat",
  },
  {
    id: "park-seoyeon",
    student: "박서연",
    assignment: "물리 실험 보고서",
    scoreLabel: "D 등급 (재작성)",
    timestamp: "1일 전",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCDeKPU5D_FbOsU2xcYz1ZGLwcHkHchHnvJP3yDjT9SGYBoIkVGj5M67d1R_hL2JveWDMVeKHpiUQbUvLLl7ihCdxhj0x-azh2oHSwzqtAuaHCUdR26U0KgXBB_yPDUG-nVBDiqqWv8EBcjNNEzNbj17Dh_6UzcZGhnkqwW7f9NQG4a1OrRjomSM_y29jBh-aRrC7FpUGEcw0tThh0KhfFCKJ30ZH0ybZQimCjjj8It94U4lZ2eEp7Q4vEtNbaAsVqydHAvTs_PYbY",
    primaryAction: {
      label: "면담 예약",
      icon: "event",
      variant: "ghost",
    },
    secondaryIcon: "send",
  },
];

export const assignmentRows: AssignmentRow[] = [
  {
    id: "eng-preview-5",
    title: "리포트용 영어 모의평가",
    subtitle: "모의고사 · 학원 제작",
    icon: "menu_book",
    iconClass:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    classLabel: "고2 영어 리포트반",
    dueDate: "2026. 01. 10",
    submitted: "3/3",
    progress: 100,
    status: {
      label: "채점 중",
      color:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    },
    primaryAction: {
      label: "채점하기",
      variant: "primary",
      href: "/exam-grade-entry/eng-preview-5",
    },
  },
  {
    id: "eng-reading-basic-20",
    title: "영어 독해 기본 평가",
    subtitle: "단원 평가 · 학원 제작",
    icon: "menu_book",
    iconClass:
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    classLabel: "고1 영어 A반",
    dueDate: "2025. 03. 10",
    submitted: "0/5",
    progress: 0,
    status: {
      label: "진행 중",
      color:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    },
    primaryAction: {
      label: "채점하기",
      variant: "primary",
      href: "/exam-grade-entry/eng-reading-basic-20",
    },
  },
  {
    id: "eng-grammar-listening-50",
    title: "영어 문법+듣기 종합",
    subtitle: "모의고사 · 기출+자체",
    icon: "spellcheck",
    iconClass: "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400",
    classLabel: "고2 영어 심화반",
    dueDate: "2025. 03. 15",
    submitted: "0/5",
    progress: 0,
    status: {
      label: "진행 중",
      color:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    },
    primaryAction: {
      label: "채점하기",
      variant: "primary",
      href: "/exam-grade-entry/eng-grammar-listening-50",
    },
  },
];

export const tableFilters: string[] = ["진행 중", "채점 완료"];

export const gradeEntryClassOptions: readonly string[] = [
  "전체 클래스",
  ...classEntities.map(
    (klass) =>
      `${klass.name} (${klass.schedule.days.join(", ")} ${klass.schedule.time})`
  ),
];

export const assessmentOptions: readonly string[] = [
  "10월 4주차 주간 테스트",
  "10월 3주차 주간 테스트",
  "중간고사 대비 모의고사",
  "9월 모의고사 (교육청)",
];

export const gradeRows: ExamGradeRow[] = [
  {
    id: 1,
    name: "김지민",
    phone: "010-1234-5678",
    initials: "김",
    badgeClass:
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    attendance: "출석",
    score: 96,
    rank: 1,
    memo: "계산 실수 주의 필요",
  },
  {
    id: 2,
    name: "이도윤",
    phone: "010-9876-5432",
    initials: "이",
    badgeClass:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    attendance: "출석",
    score: 88,
    rank: 5,
  },
  {
    id: 3,
    name: "박서연",
    phone: "010-4567-8901",
    initials: "박",
    badgeClass:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    attendance: "지각",
    score: 75,
    rank: 12,
    memo: "30분 지각, 재시험 예정",
  },
  {
    id: 4,
    name: "최준호",
    phone: "010-2222-3333",
    initials: "최",
    badgeClass:
      "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600",
    attendance: "결석",
    score: 0,
    memo: "무단 결석",
  },
  {
    id: 5,
    name: "강수민",
    phone: "010-5555-7777",
    initials: "강",
    badgeClass:
      "bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-300 border-orange-200 dark:border-orange-800",
    attendance: "출석",
  },
];

export const reportClassOptions: readonly ReportClassOption[] = [
  { id: "all", name: "전체 수업" },
  ...classEntities.map((klass) => ({ id: klass.id, name: klass.name })),
];

export const reportStudents: readonly ReportStudent[] = [
  {
    id: "s-001",
    name: "김하늘",
    classId: "class-a-2025-01",
    classLabel: "수학 A반 (심화)",
    examName: "2025 1월 모의고사",
    examType: "모의고사",
    testDate: "2025-01-08",
    roundLabel: "6회차",
    score: 96,
    rank: 2,
    avg: 83,
    attendance: "정상",
    nextLesson: "1월 28일 (화) 19:00",
    assignments: ["오답노트 10문제", "심화 유형 복습지"],
  },
  {
    id: "s-002",
    name: "이서준",
    classId: "class-a-2025-01",
    classLabel: "수학 A반 (심화)",
    examName: "2025 1월 모의고사",
    examType: "심화 테스트",
    testDate: "2025-01-08",
    roundLabel: "6회차",
    score: 88,
    rank: 5,
    avg: 83,
    attendance: "지각",
    nextLesson: "1월 28일 (화) 19:00",
    assignments: ["심화 유형 복습지", "주간 숙제지 채점"],
  },
  {
    id: "s-003",
    name: "박서연",
    classId: "class-b-2025-01",
    classLabel: "수학 B반 (기초)",
    examName: "2025 1월 모의고사",
    examType: "기초 진단",
    testDate: "2025-01-07",
    roundLabel: "2회차",
    score: 74,
    rank: 12,
    avg: 68,
    attendance: "정상",
    nextLesson: "1월 27일 (월) 18:00",
    assignments: ["기초 유형 문제집 3~4회", "어휘 테스트"],
  },
];

export const reportTemplates: readonly ReportTemplate[] = [
  {
    id: "premium",
    name: "심플 리포트",
    description: "교실/시험 정보가 정교하게 표현되는 하이브리드 템플릿",
  },
  {
    id: "simple",
    name: "프리미엄 리포트",
    description: "모바일 카카오 알림에 최적화된 간단한 카드뷰",
  },
];

export const classFilterOptions = [
  "전체 수업",
  ...classEntities.map((klass) => klass.name),
] as const;

export const examFilterOptions = [
  "모든 시험",
  ...examDefinitions.map((exam) => exam.title),
] as const;

export const statusFilterOptions = [
  "전체 상태",
  "미예약",
  "알림 발송 완료",
  "예약 완료",
  "제안 검토 중",
  "재시험 완료",
] as const;

export const remedialSummaryStats: RemedialSummaryStat[] = [
  {
    title: "전체 클리닉 대상자",
    value: "42",
    suffix: "명",
    trend: "+3%",
    trendClass: "text-green-600 bg-green-50",
    icon: "groups",
    iconClass:
      "text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-800",
  },
  {
    title: "미예약 학생",
    value: "5",
    suffix: "명",
    trend: "-2%",
    trendClass: "text-red-600 bg-red-50",
    icon: "event_busy",
    iconClass: "text-red-600 bg-red-50 dark:bg-red-900/30",
  },
  {
    title: "제안 검토 중",
    value: "8",
    suffix: "명",
    trend: "+1%",
    trendClass: "text-green-600 bg-green-50",
    icon: "pending_actions",
    iconClass: "text-orange-500 bg-orange-50 dark:bg-orange-900/30",
  },
  {
    title: "오늘 재시험 예정",
    value: "5",
    suffix: "명",
    trend: "-5%",
    trendClass: "text-red-600 bg-red-50",
    icon: "today",
    iconClass: "text-blue-600 bg-blue-50 dark:bg-blue-900/30",
  },
];

export const todayRetestStudents: TodayRetestStudent[] = [
  {
    id: "kim-chulsoo",
    name: "김철수",
    classLabel: "수학 A반 (심화)",
    examName: "주간 테스트 (삼각함수)",
    schedule: "오후 4:00 · 제2강의동 302호",
    status: "확정",
  },
  {
    id: "lee-yeonghui",
    name: "이영희",
    classLabel: "수학 A반 (심화)",
    examName: "주간 테스트 (삼각함수)",
    schedule: "오후 5:30 · 제2강의동 305호",
    status: "확정",
  },
  {
    id: "park-jimin",
    name: "박지민",
    classLabel: "수학 B반 (기초)",
    examName: "단원평가 (방정식)",
    schedule: "오후 6:00 · 본관 201호",
    status: "입실 예정",
  },
  {
    id: "choi-hyunwoo",
    name: "최현우",
    classLabel: "수학 B반 (기초)",
    examName: "단원평가 (방정식)",
    schedule: "오후 7:00 · 본관 105호",
    status: "확정",
  },
  {
    id: "jung-hana",
    name: "정하나",
    classLabel: "영어 C반",
    examName: "주간 리딩 테스트",
    schedule: "오후 8:00 · 제1강의동 202호",
    status: "확정",
  },
];

export const unscheduledStudents: UnscheduledStudent[] = [
  {
    id: "kim-chulsoo",
    name: "김철수",
    classLabel: "수학 A반 (심화)",
    examName: "주간 테스트 (삼각함수)",
    missingDate: "2023.11.20",
    contactStatus: "미연락",
  },
  {
    id: "park-jimin",
    name: "박지민",
    classLabel: "수학 B반 (기초)",
    examName: "단원평가 (방정식)",
    missingDate: "2023.11.19",
    contactStatus: "학부모 연락 완료",
  },
  {
    id: "jang-seojun",
    name: "장서준",
    classLabel: "영어 C반",
    examName: "주간 리딩 테스트",
    missingDate: "2023.11.19",
    contactStatus: "알림 발송",
  },
  {
    id: "lee-haram",
    name: "이하람",
    classLabel: "영어 C반",
    examName: "주간 리딩 테스트",
    missingDate: "2023.11.18",
    contactStatus: "재통화 예정",
  },
  {
    id: "choi-hyunwoo",
    name: "최현우",
    classLabel: "수학 B반 (기초)",
    examName: "단원평가 (방정식)",
    missingDate: "2023.11.19",
    contactStatus: "학부모 재연락 필요",
  },
];

export const remedialStudents: RemedialStudent[] = [
  {
    id: "kim-chulsoo",
    name: "김철수",
    classLabel: "수학 A반 (심화)",
    initials: "김A",
    badgeClass: "bg-slate-200 text-slate-600",
    examName: "주간 테스트 (삼각함수)",
    score: 55,
    cutline: 70,
    failDate: "2023.11.20",
    status: {
      label: "미예약",
      badgeClass:
        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      dotClass: "bg-red-500",
    },
  },
  {
    id: "lee-yeonghui",
    name: "이영희",
    classLabel: "수학 A반 (심화)",
    initials: "이B",
    badgeClass: "bg-blue-100 text-blue-600",
    examName: "주간 테스트 (삼각함수)",
    score: 62,
    cutline: 70,
    failDate: "2023.11.20",
    status: {
      label: "예약 완료",
      badgeClass:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      dotClass: "bg-blue-500",
    },
  },
  {
    id: "park-jimin",
    name: "박지민",
    classLabel: "수학 B반 (기초)",
    initials: "박C",
    badgeClass: "bg-orange-100 text-orange-600",
    examName: "단원평가 (방정식)",
    score: 48,
    cutline: 60,
    failDate: "2023.11.19",
    status: {
      label: "알림 발송 완료",
      badgeClass:
        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
      dotClass: "bg-slate-500",
    },
  },
  {
    id: "jang-seojun",
    name: "장서준",
    classLabel: "영어 C반",
    initials: "장D",
    badgeClass: "bg-teal-100 text-teal-600",
    examName: "주간 리딩 테스트",
    score: 61,
    cutline: 75,
    failDate: "2023.11.19",
    status: {
      label: "제안 검토 중",
      badgeClass:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      dotClass: "bg-orange-500",
    },
  },
];

export function getExamList(): RegisteredExam[] {
  return [...examDefinitions];
}

export function getExamById(id: string): RegisteredExam | undefined {
  return examDefinitions.find((exam) => exam.id === id);
}
