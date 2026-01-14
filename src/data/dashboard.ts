import { assistantEntities } from "@/data/assistants";
import { classEntities } from "@/data/classes";
import { examDefinitions } from "@/data/exams";
import { studentEntities } from "@/data/students";
import type {
  ClinicScheduleSummary,
  ClinicStudent,
  DashboardSummaryCard,
  DashboardTaskRow,
  InquiryRow,
  RetestScheduleItem,
  TodayClassSession,
} from "@/features/dashboard/types";

const definedScores = studentEntities
  .map((student) => student.averageScore)
  .filter((score): score is number => typeof score === "number");

const averageScore = definedScores.length
  ? definedScores.reduce((sum, score) => sum + score, 0) / definedScores.length
  : 0;
const averageScoreLabel = `${averageScore.toFixed(1)}점`;

const totalStudents = studentEntities.length;
const pausedStudents = studentEntities.filter(
  (student) => student.status && student.status !== "재원중"
).length;
const activeClasses = classEntities.length;
const activeExams = examDefinitions.length;

export const dashboardSummaryCards: DashboardSummaryCard[] = [
  {
    title: "재원 학생",
    value: `${totalStudents}명`,
    delta: pausedStudents ? `휴원 ${pausedStudents}명` : "전체 활성",
    deltaVariant: pausedStudents ? "negative" : "positive",
    icon: "diversity_3",
    iconClassName:
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-200",
  },
  {
    title: "운영 중 수업",
    value: `${activeClasses}개`,
    delta: "신규 개설 1개",
    deltaVariant: "positive",
    icon: "menu_book",
    iconClassName:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200",
  },
  {
    title: "현재 시험 목록",
    value: `${activeExams}개`,
    delta: "시험지 목록",
    deltaVariant: "positive",
    icon: "description",
    iconClassName:
      "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-200",
  },
  {
    title: "평균 점수",
    value: averageScoreLabel,
    icon: "leaderboard",
    iconClassName:
      "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-200",
  },
];

const inquiryStatuses: Array<{
  status: string;
  variant: InquiryRow["statusVariant"];
}> = [
  { status: "진행 중", variant: "progress" },
  { status: "대기", variant: "pending" },
  { status: "완료", variant: "success" },
  { status: "답변 완료", variant: "done" },
];

const inquiryMessages = [
  "추가 상담 일정 문의",
  "보충 수업 좌석 문의",
  "교재 환불 요청",
  "시험 일정 문의",
];

export const dashboardInquiryRows: InquiryRow[] = studentEntities
  .slice(0, inquiryStatuses.length)
  .map((student, index) => {
    const klass = classEntities.find((item) => item.id === student.classId);
    const { status, variant } = inquiryStatuses[index];
    const inquiryType = index % 2 === 0 ? "학생" : "학부모";
    const requesterName =
      inquiryType === "학생" ? student.name : `${student.name} 학부모`;
    const message = inquiryMessages[index] ?? "상담 요청";
    const date = `10/${12 - index} ${14 - index}:0${index}`;

    return {
      type: inquiryType,
      name: requesterName,
      message: `${klass?.name ?? "공통 수업"} ${message}`,
      date,
      status,
      statusVariant: variant,
    };
  });

const taskIcons = ["contact_phone", "rule", "upload_file"] as const;
const taskStatuses: Array<DashboardTaskRow["status"]> = [
  "진행 중",
  "완료",
  "진행 중",
];
const taskVariants: Array<DashboardTaskRow["statusVariant"]> = [
  "primary",
  "success",
  "primary",
];
const taskProgress = [65, 100, 70];
const taskPriorities: Array<DashboardTaskRow["priority"]> = [
  "높음",
  "보통",
  "낮음",
];

export const dashboardTaskRows: DashboardTaskRow[] = assistantEntities
  .slice(0, 3)
  .map((assistant, index) => {
    const klass = classEntities[index % classEntities.length];
    const exam = examDefinitions[index % examDefinitions.length];
    const dueLabels = ["", "", ""];

    return {
      title: `${klass.name} 업무 점검`,
      subTitle: `${exam.title} 채점`,
      icon: taskIcons[index] ?? "task",
      ta: assistant.name,
      avatar:
        assistant.avatarUrl ?? `https://i.pravatar.cc/80?img=${20 + index}`,
      due: dueLabels[index] ?? "예정",
      progress: taskProgress[index] ?? 50,
      status: taskStatuses[index] ?? "진행 중",
      statusVariant: taskVariants[index] ?? "primary",
      priority: taskPriorities[index] ?? "보통",
      issuedAt: `2025.01.0${index + 9} 09:0${index}`,
      assigner: klass.teacher,
      assignerAvatar: `https://i.pravatar.cc/80?img=${30 + index}`,
      dueDateTime: `2025.01.1${index} 18:00`,
      description: `${klass.name}의 ${exam.title} 업무 진행 현황을 점검하고 학습자 피드백을 수집해주세요.`,
      attachments:
        index === 0
          ? [
              {
                name: `${exam.title}_배정표.xlsx`,
                size: "45KB",
              },
            ]
          : undefined,
    };
  });

export const todaysClassSessions: TodayClassSession[] = classEntities
  .slice(0, 3)
  .map((klass) => ({
    time: klass.schedule.time,
    title: klass.name,
    room: klass.schedule.location,
  }));

const sessionStartTimes = Array.from(
  new Set(
    classEntities.map((klass) => klass.schedule.time.split("-")[0].trim())
  )
).slice(0, 5);

const busiestClass =
  classEntities.reduce((acc, klass) => {
    if (!acc) {
      return klass;
    }
    return (klass.enrolled ?? 0) > (acc.enrolled ?? 0) ? klass : acc;
  }, classEntities[0]) ?? classEntities[0];

export const clinicScheduleSummary: ClinicScheduleSummary = {
  timeMarkers:
    sessionStartTimes.length >= 3
      ? sessionStartTimes
      : ["14:00", "15:00", "16:00", "17:00", "18:00"],
  segments: classEntities.slice(0, 4).map((_, index) => {
    const width = 100 / Math.min(classEntities.length, 4);
    const left = index * width;
    const intensity = (["low", "medium", "high"] as const)[index % 3];
    return {
      leftPercent: left,
      widthPercent: width - 5,
      intensity,
    };
  }),
  busiestRangeLabel: busiestClass
    ? `${busiestClass.schedule.time} (${busiestClass.name})`
    : "주요 시간대",
};

export const clinicStudents: ClinicStudent[] = studentEntities
  .slice(0, 3)
  .map((student, index) => {
    const klass = classEntities.find((item) => item.id === student.classId);
    const startTime = klass?.schedule.time.split("-")[0].trim() ?? "15:00";
    const status: ClinicStudent["status"] = index === 2 ? "완료" : "대기";
    return {
      name: student.name,
      subject: klass?.subject ?? "공통",
      time: startTime,
      status,
    };
  });

export const retestScheduleItems: RetestScheduleItem[] = [
  {
    id: "retest-jan-13",
    dateLabel: "1월 13일",
    groupLabel: "A반",
    title: "영어 듣기 평가",
    count: 30,
  },
  {
    id: "retest-jan-18",
    dateLabel: "1월 18일",
    groupLabel: "B반",
    title: "단어 테스트",
    count: 10,
  },
];
