export type ContactInfo = {
  label: string;
  icon: string;
  value: string;
};

export type StudentEntity = {
  id: string;
  name: string;
  studentId: string;
  classId: string;
  gradeLabel?: string;
  school?: string;
  phone?: string;
  status?: "재원중" | "휴원" | "퇴원";
  attendance?: number;
  averageScore?: number;
  avatarUrl?: string;
  initials?: string;
  contacts?: ContactInfo[];
};

export type ClassSchedule = {
  days: string[];
  time: string;
  location: string;
};

export type ClassAssessment = {
  title: string;
  date: string;
  type: string;
};

export type WatchStudent = {
  name: string;
  issue: string;
  status: "grade" | "attendance" | "behavior";
  lastScore?: number;
  trend?: "up" | "down" | "flat";
};

export type ClassEntity = {
  id: string;
  name: string;
  level: string;
  subject: string;
  teacher: string;
  assistant: string;
  schedule: ClassSchedule;
  capacity: number;
  enrolled: number;
  waitlist?: number;
  status: "신규 개설" | "진행 중" | "마감 임박";
  startDate: string;
  nextAssessment: ClassAssessment;
  focusTags?: string[];
  alerts?: string[];
  watchStudents?: WatchStudent[];
};

export type AssistantEntity = {
  id: string;
  name: string;
  subject: string;
  phone: string;
  className: string;
  recentTask?: string;
  rating?: number;
  status: "근무중" | "휴가" | "퇴사";
  avatarUrl?: string;
};

export type ExamStatus = "채점 중" | "등록 완료" | "초안";

export type ExamQuestion = {
  id: number;
  label: string;
  type: "객관식" | "주관식" | "O/X";
  points: number;
  answer: string;
};

export type ExamDefinition = {
  id: string;
  title: string;
  subject: string;
  classId: string;
  targetClass: string;
  examDate: string;
  createdAt: string;
  totalQuestions: number;
  totalScore: number;
  passScore: number;
  status: ExamStatus;
  summary: string;
  notes: string[];
  questions: ExamQuestion[];
};

export type ExamTemplate = {
  id: string;
  name: string;
  description: string;
};

export type ExamParticipant = {
  id: string;
  name: string;
  classId: string;
  classLabel: string;
  examName: string;
  examType: string;
  testDate: string;
  roundLabel: string;
  score: number;
  rank: number;
  avg: number;
  attendance: string;
  nextLesson: string;
  assignments: string[];
};
