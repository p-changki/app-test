import type { Metadata } from "next";
import Link from "next/link";

import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

type StudentDetail = {
  id: string;
  name: string;
  status: string;
  school: string;
  grade: string;
  studentId: string;
  heroAvatar: string;
  contacts: Array<{ label: string; icon: string; value: string }>;
  metrics: Array<{
    label: string;
    value: string;
    icon: string;
    meta?: string;
    variant?: "positive" | "warning";
  }>;
  subjects: Array<{
    icon: string;
    title: string;
    description: string;
    score: number;
  }>;
  attendanceHeatmap: Array<{
    day: number;
    variant: "attendance" | "late" | "absent" | "none";
  }>;
  memoPlaceholder: string;
  counselingLogs: Array<{
    title: string;
    date: string;
    description: string;
    variant: "primary" | "secondary";
  }>;
};

type StudentDetailPageProps = {
  params: Promise<{ studentId: string }>;
};

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

const fallbackStudent = studentDetailData["student-kim-minjun"];

export const metadata: Metadata = {
  title: "학생 상세 정보 - EduTrack",
  description: "선택한 학생의 성취도와 상담 정보를 확인할 수 있습니다.",
};

export default async function StudentDetailPage({
  params,
}: StudentDetailPageProps) {
  const { studentId } = await params;
  const student = studentDetailData[studentId] ?? fallbackStudent;

  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[#111418] text-white transition-colors duration-200"
      )}
    >
      <div className="flex flex-col items-center">
        <HeaderBar />
        <main className="flex w-full max-w-[1280px] flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
          <Breadcrumbs studentName={student.name} />
          <HeroCard student={student} />
          <SummaryGrid metrics={student.metrics} />
          <DetailSections student={student} />
        </main>
      </div>
    </div>
  );
}

function HeaderBar() {
  return (
    <div className="w-full border-b border-[#283039] bg-[#111418]">
      <div className="flex items-center justify-between px-6 py-3 lg:px-10">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-white">
            <div className="size-8 text-primary">
              <span className={iconClass("!text-[32px]")}>school</span>
            </div>
            <h2
              className={cn(
                lexend.className,
                "text-xl font-bold tracking-tight"
              )}
            >
              EduManager
            </h2>
          </div>
          <div className="hidden w-64 items-center gap-2 rounded-lg bg-[#283039] px-3 text-sm text-white md:flex">
            <span className={iconClass("text-text-secondary text-[20px]")}>
              search
            </span>
            <input
              type="text"
              className="w-full border-none bg-transparent placeholder-text-secondary focus:ring-0"
              placeholder="학생, 수업 검색..."
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
            {["대시보드", "학생 관리", "수업 관리", "리포트"].map(
              (item, index) => (
                <a
                  key={item}
                  className={cn(
                    index === 1
                      ? "text-white"
                      : "text-[#9dabb9] hover:text-white",
                    "transition-colors"
                  )}
                  href="#"
                >
                  {item}
                </a>
              )
            )}
          </nav>
          <div className="flex items-center gap-3 border-l border-[#283039] pl-6">
            <button className="relative rounded-full bg-[#283039] p-2 text-white transition hover:bg-[#3b4754]">
              <span className={iconClass("text-[20px]")}>notifications</span>
              <span className="absolute right-2 top-2 size-2 rounded-full border border-[#283039] bg-red-500" />
            </button>
            <div
              className="size-9 rounded-full border border-[#283039] bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCr8-_wzewSYB4QCH6olhv-5PWgwMeLnGITfDAV4OhGSiamCqi4o1xHz52Pf1ne3VaBdvVn_fMQPCYYFPNMRAWKuqbrqPRzjZKlXKKGCkLTGzT9ZEnDLAacjR8CVoqUjjdzCUPCrWilUPwDB6E03EAHMeYbUJfSrRy90w8RnigMsnU9zkgftW5LNB9Z7ZE82ei_3vuQxR03HEJoPWSNhn6R-CNtSYrW_M5hhafkOxTx2HmCliewNjxlbvplZ8kHmOtDtolQ0w02qiY')",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Breadcrumbs({ studentName }: { studentName: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-[#9dabb9]">
      <Link href="/dashboard" className="transition hover:text-white">
        홈
      </Link>
      <span>/</span>
      <Link href="/student-management" className="transition hover:text-white">
        학생 관리
      </Link>
      <span>/</span>
      <span className="font-medium text-white">{studentName}</span>
    </div>
  );
}

function HeroCard({ student }: { student: StudentDetail }) {
  return (
    <section className="rounded-xl border border-[#283039] bg-[#191f26] p-6 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <div className="relative">
            <div
              className="size-32 rounded-xl border-2 border-[#3b4754] bg-cover bg-center"
              style={{ backgroundImage: `url("${student.heroAvatar}")` }}
            />
            <div className="absolute -bottom-2 -right-2 rounded-full border border-[#191f26] bg-green-500 px-2 py-0.5 text-[10px] font-bold">
              {student.status}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">{student.name}</h1>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-[#9dabb9] sm:justify-start">
              <span className={iconClass("text-[16px]")}>school</span>
              <span>{student.school}</span>
              <span className="h-1 w-1 rounded-full bg-[#283039]" />
              <span>{student.grade}</span>
              <span className="h-1 w-1 rounded-full bg-[#283039]" />
              <span>학번: {student.studentId}</span>
            </div>
            <ContactCard contacts={student.contacts} />
          </div>
        </div>
        <div className="flex flex-col gap-3 md:w-40">
          <button className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600">
            <span className={iconClass("text-[20px]")}>mail</span>
            메시지 전송
          </button>
          <button className="flex items-center justify-center gap-2 rounded-lg border border-[#283039] bg-[#283039] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#3b4754]">
            <span className={iconClass("text-[20px]")}>edit</span>
            정보 수정
          </button>
        </div>
      </div>
    </section>
  );
}

function ContactCard({ contacts }: { contacts: StudentDetail["contacts"] }) {
  return (
    <div className="mt-5 w-full max-w-md rounded-lg border border-[#283039] bg-[#212830]/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-medium">
          <span className={iconClass("text-primary text-[18px]")}>
            contact_phone
          </span>
          연락처 정보
        </h4>
        <button className="flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-600">
          <span className={iconClass("text-[14px]")}>save</span>
          저장
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {contacts.map((contact) => (
          <div key={contact.label} className="space-y-1 text-left">
            <label className="block text-[11px] text-[#9dabb9]">
              {contact.label}
            </label>
            <div className="relative">
              <span
                className={cn(
                  iconClass(
                    "absolute left-3 top-1/2 -translate-y-1/2 text-[#9dabb9] text-[18px]"
                  )
                )}
              >
                {contact.icon}
              </span>
              <input
                type="text"
                value={contact.value}
                className="w-full rounded border border-[#283039] bg-[#111418] px-3 py-1.5 pl-10 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary"
                readOnly
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryGrid({ metrics }: { metrics: StudentDetail["metrics"] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-xl border border-[#283039] bg-[#191f26] p-5 transition hover:border-primary/50"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#9dabb9]">{metric.label}</p>
            <span className={iconClass("text-primary text-[20px]")}>
              {metric.icon}
            </span>
          </div>
          <div className="mt-1 flex items-end gap-2">
            <p className="text-2xl font-bold text-white">{metric.value}</p>
            {metric.meta && (
              <p
                className={cn(
                  "text-xs font-medium",
                  metric.variant === "positive" && "text-green-500",
                  metric.variant === "warning" && "text-orange-500",
                  !metric.variant && "text-gray-400"
                )}
              >
                {metric.meta}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function DetailSections({ student }: { student: StudentDetail }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <AchievementSection subjects={student.subjects} />
        <AttendanceSection heatmap={student.attendanceHeatmap} />
      </div>
      <div className="flex flex-col gap-6">
        <QuickMemo placeholder={student.memoPlaceholder} />
        <CounselingLogs logs={student.counselingLogs} />
      </div>
    </div>
  );
}

function AchievementSection({
  subjects,
}: {
  subjects: StudentDetail["subjects"];
}) {
  return (
    <section className="rounded-xl border border-[#283039] bg-[#191f26] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold">학업 성취도</h3>
        <select className="rounded-md border-none bg-[#283039] px-3 py-1.5 text-xs text-white focus:ring-1 focus:ring-primary">
          <option>2023년 2학기</option>
          <option>2023년 1학기</option>
        </select>
      </div>
      <div className="space-y-6">
        {subjects.map((subject) => (
          <div key={subject.title} className="flex flex-col gap-2">
            <div className="flex items-end justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded bg-blue-500/20 p-1.5 text-blue-400">
                  <span className={iconClass("text-[18px]")}>
                    {subject.icon}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {subject.title}
                  </p>
                  <p className="text-xs text-[#9dabb9]">
                    {subject.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-white">
                  {subject.score}
                </span>
                <span className="text-xs text-[#9dabb9]"> / 100</span>
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-[#283039]">
              <div
                className="h-2 rounded-full bg-blue-500"
                style={{ width: `${subject.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center border-t border-[#283039] pt-4">
        <button className="flex items-center gap-1 text-sm font-medium text-primary transition hover:text-white">
          전체 성적표 보기
          <span className={iconClass("text-[16px]")}>arrow_forward</span>
        </button>
      </div>
    </section>
  );
}

function AttendanceSection({
  heatmap,
}: {
  heatmap: StudentDetail["attendanceHeatmap"];
}) {
  return (
    <section className="rounded-xl border border-[#283039] bg-[#191f26] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg	font-bold">최근 출결 현황</h3>
        <div className="flex gap-3 text-xs text-[#9dabb9]">
          <LegendItem color="bg-green-500" label="출석" />
          <LegendItem color="bg-yellow-500" label="지각" />
          <LegendItem color="bg-red-500" label="결석" />
        </div>
      </div>
      <div className="mb-4 grid grid-cols-7 gap-2 text-center text-xs text-[#9dabb9]">
        {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
          <div key={day} className="pb-2">
            {day}
          </div>
        ))}
        {heatmap.map((item, index) => (
          <div
            key={`${item.day}-${index}`}
            className={cn(
              "flex h-10 items-center justify-center rounded text-xs font-medium",
              attendanceVariantStyles[item.variant]
            )}
          >
            {item.day}
          </div>
        ))}
      </div>
      <div className="rounded-lg bg-[#283039] p-3 text-sm text-[#9dabb9]">
        <div className="flex gap-3">
          <span className={iconClass("text-yellow-500 text-[20px]")}>info</span>
          <div>
            <p className="text-white">지각 알림</p>
            <p className="text-xs text-[#9dabb9]">
              10월 6일 15분 지각. 사유: 대중교통 지연.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("size-2.5 rounded-full", color)} />
      <span>{label}</span>
    </div>
  );
}

function QuickMemo({ placeholder }: { placeholder: string }) {
  return (
    <section className="rounded-xl border border-[#283039] bg-[#191f26] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">빠른 메모</h3>
        <button className="text-primary transition hover:text-white">
          <span className={iconClass("text-[20px]")}>save</span>
        </button>
      </div>
      <textarea
        className="h-32 w-full rounded-lg border-none bg-[#283039] p-4 text-sm text-white placeholder:text-[#9dabb9] focus:ring-1 focus:ring-primary"
        placeholder={placeholder}
      />
      <div className="mt-2 flex items-center justify-between text-xs text-[#9dabb9]">
        <span>강사에게만 표시됩니다</span>
        <button className="rounded bg-primary/10 px-3 py-1.5 text-primary transition hover:bg-primary/20 hover:text-white">
          메모 추가
        </button>
      </div>
    </section>
  );
}

function CounselingLogs({ logs }: { logs: StudentDetail["counselingLogs"] }) {
  return (
    <section className="rounded-xl border border-[#283039] bg-[#191f26] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold">상담 일지</h3>
        <button className="rounded border border-[#283039] bg-[#283039] px-3 py-1.5 text-xs transition hover:bg-[#3b4754]">
          + 신규 작성
        </button>
      </div>
      <div className="relative space-y-6 pl-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#283039]">
        {logs.map((log) => (
          <div key={log.title} className="relative pl-6">
            <span
              className={cn(
                "absolute left-[-5px] top-1.5 size-3 rounded-full border-2 border-[#191f26]",
                log.variant === "primary" ? "bg-primary" : "bg-[#3b4754]"
              )}
            />
            <div className="flex flex-col gap-1">
              <div className="flex items-start justify-between text-sm font-medium">
                <span>{log.title}</span>
                <span className="text-[10px] text-[#9dabb9]">{log.date}</span>
              </div>
              <p className="text-xs text-[#9dabb9] leading-relaxed">
                {log.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 border-t border-[#283039] pt-4">
        <button className="w-full text-center text-xs font-medium text-[#9dabb9] transition hover:text-white">
          전체 이력 보기
        </button>
      </div>
    </section>
  );
}

const attendanceVariantStyles: Record<
  StudentDetail["attendanceHeatmap"][number]["variant"],
  string
> = {
  attendance: "border border-green-500/30 bg-green-900/40 text-white",
  late: "border border-yellow-500/30 bg-yellow-900/40 text-white",
  absent: "border border-red-500/30 bg-red-900/40 text-white",
  none: "bg-[#283039] text-[#9dabb9]",
};
