import Link from "next/link";
import type { Metadata } from "next";

import { TaskDetailModal } from "@/features/dashboard/components/TaskDetailModal";
import { DashboardTaskAssignmentModal } from "@/features/dashboard/TaskAssignmentModal";
import type { DashboardTaskRow } from "@/features/dashboard/types";
import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

const summaryCards = [
  {
    title: "전체 수강생",
    value: "142명",
    delta: "+4명 (이번 달)",
    deltaVariant: "positive" as const,
    icon: "groups",
    iconClassName: "text-primary bg-primary/10",
  },
  {
    title: "오늘 출석률",
    value: "96.5%",
    delta: "전일 대비 +1.2%",
    icon: "donut_large",
    iconClassName: "text-purple-500 bg-purple-500/10",
  },
  {
    title: "오늘 클리닉 예정",
    value: "18명",
    delta: "-1명 (취소)",
    deltaVariant: "negative" as const,
    icon: "school",
    iconClassName: "text-orange-500 bg-orange-500/10",
  },
  {
    title: "재시험 요청",
    value: "3건",
    delta: "+3건 (신규)",
    deltaVariant: "positive" as const,
    icon: "warning",
    iconClassName: "text-rose-500 bg-rose-500/10",
  },
];

const inquiryRows = [
  {
    type: "학부모",
    name: "김민준",
    message: "이번 주말 보충 수업 시간 확인 부탁드립니다.",
    date: "2023.10.25",
    status: "대기중",
    statusVariant: "pending" as const,
  },
  {
    type: "학생",
    name: "이서연",
    message: "수학 과제 15번 문제 질문있습니다.",
    date: "2023.10.25",
    status: "처리중",
    statusVariant: "progress" as const,
  },
  {
    type: "학부모",
    name: "박지훈",
    message: "성적표가 아직 도착하지 않았습니다.",
    date: "2023.10.24",
    status: "완료",
    statusVariant: "done" as const,
  },
  {
    type: "학생",
    name: "최수민",
    message: "다음 주 결석 예정이라 보강 일정 잡고 싶어요.",
    date: "2023.10.24",
    status: "대기중",
    statusVariant: "pending" as const,
  },
];

const taskRows: DashboardTaskRow[] = [
  {
    title: "주간 테스트지 인쇄 및 제본",
    subTitle: "수학 A반, B반 (총 50부)",
    icon: "print",
    ta: "김조교",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCWwSuo6-Lj59xi6W2eBwedVG0zaPdC0h9GosrGPRQ_4KNOXv4vWGadXJ-FYsdGdeSz61xuBuju_SLWxulwHpNR15GVQnZQfVJ7Uektbv97tLbuhUi_Ek9CbVw0H-DQ8kmj_J5ggKWbDEMN1JHy1A6IcHKA9fhml3lC8FSpchL_NFoTl2957UeDk5lIm3gfHZ2Y9oYGo-TX7AdAKh9u7a0A1PTK6xkyjY7HJwbKAU4DlnAGcdxJVRJ3UARui8h0hRuv_U47Re_C6wY",
    due: "D-0 (오늘)",
    dueDateTime: "2023-10-25 14:00 마감",
    progress: 80,
    status: "진행중",
    statusVariant: "primary" as const,
    priority: "높음",
    issuedAt: "2023-10-24 09:30 발송됨",
    assigner: "김 강사",
    assignerAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBYUib1rsD0h5chaNuMZmjSt7pyn76AaSbsEA4luGw41QT-vNywlrk_AldbhT6HB1ZruEgR41JdSy-F58bbYAnhcLYfQNofNh2wHfdaZf3B6DZxY6B8Ef9CPMWUW9xfbTrGASGOTYj2IygoDHl5nG6wZlPZs05-vDIP4I_Zzxz1wUiaHSeujw-LPBG1dDRQOy74AUwt4038KxskpybtUBRMWBLnlNOFhU74urizLZTbJpXK5PDJjQjHfNbhjJkXL0SUIKBvL04-xlU",
    description:
      '주간 테스트 복사용 원본은 자료함 > "시험자료" 폴더에 있습니다. A반 30부, B반 20부를 흑백으로 인쇄하고 제본 커버는 파란색으로 통일해주세요. 완성본은 오늘 15시까지 3층 교무실에 전달 부탁드립니다.',
    attachments: [
      {
        name: "주간테스트_출력파일.pdf",
        size: "1.2 MB",
        icon: "picture_as_pdf",
      },
      { name: "제본 안내.txt", size: "32 KB", icon: "description" },
    ],
  },
  {
    title: "모의고사 성적 입력",
    subTitle: "10월 정기 모의고사",
    icon: "grading",
    ta: "이조교",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBghHjSvZ2iBR2LwsPE7ptNIwMfcH_9rATlF1oGkc676vINklO1NCBpGwuwk16dSG0pyM1J3RzG7ZGKHe_xxIfoHsYzhBNCP5ac3_7DEF6fiunfs0QlkNOtDVA01xeAlS7aqrwmZS-fXg7_KxL76OFAElVyWOiInC3tlzK4e482MBd4jqKpxCtCqFEqBSEq2JsOABVdM-GNhNFuSV_jO1TdhididoPg-AiA67zSHKpOwjniYsfQPH0-apxiH_3QU6x_4MVXeGEefTw",
    due: "D-2",
    dueDateTime: "2023-10-27 18:00 마감",
    progress: 20,
    status: "시작전",
    statusVariant: "neutral" as const,
    priority: "보통",
    issuedAt: "2023-10-23 17:10 발송됨",
    assigner: "박 강사",
    assignerAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDWLs4iLHbIAqLtRpE_Q5ZcVw_6YTdnFBl7K9GUdghYE-6c6T3kizfCqMfjU3nOP6R7OfUK65Z11qkp5IwANCnSAlc7y1jB7-3qQ0Wyndo1m1rvcs0IhZS2qxUrYpAR9ep-IJbMsCFUwcj0PRofFclYndKQezsQMX-npwBXlQ8pFKvHkUWwspslendGu90kT1qynCQlbRp7jdM_4_c7vZa_-ntjUr-78zo5ZkTvpswdaPB-S62xzG4qlJskEN3CUpWCkrfBldUF6E4",
    description:
      "10월 정기 모의고사 결과를 EduTrack 시스템에 입력해주세요. 국어/영어/수학 순으로 입력 후 점수 검토 탭에서 반 평균을 확인하고 이상값이 있으면 코멘트 남겨주세요.",
  },
  {
    title: "교재 재고 파악",
    subTitle: "다음 달 신규 교재 준비",
    icon: "inventory_2",
    ta: "김조교",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAXq2TqfXCqNDE_FBo1ZT4W6ZJtimr40JTFIzltg5xm7u345wUaMqjbQd5TV1LpwsE1OuAY9P3Tj4cNHvgrG4Me9pERWyqUXgkWGqpHdOJUBpm3GQPTR4aKXBB3oK6IL-AjvjDukraALB1lGArDj3v82ybwGSbXzhZRhHyQKxfWY2UTA9rb5VyP47xI-WZ3zlZ2k0w0fGIicAPGbolSefCLLhi09qx0eXGg0hATFvxuVxytqd3Ux9ISGf9saSeZEsmfWqVKNCK49_8",
    due: "D-5",
    dueDateTime: "2023-10-30 10:00 마감",
    progress: 100,
    status: "완료",
    statusVariant: "success" as const,
    priority: "낮음",
    issuedAt: "2023-10-20 08:50 발송됨",
    assigner: "운영팀",
    assignerAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCr8-_wzewSYB4QCH6olhv-5PWgwMeLnGITfDAV4OhGSiamCqi4o1xHz52Pf1ne3VaBdvVn_fMQPCYYFPNMRAWKuqbrqPRzjZKlXKKGCkLTGzT9ZEnDLAacjR8CVoqUjjdzCUPCrWilUPwDB6E03EAHMeYbUJfSrRy90w8RnigMsnU9zkgftW5LNB9Z7ZE82ei_3vuQxR03HEJoPWSNhn6R-CNtSYrW_M5hhafkOxTx2HmCliewNjxlbvplZ8kHmOtDtolQ0w02qiY",
    description:
      "다음 달 신규 편성되는 수학, 과학 교재 재고를 확인하고 부족 수량을 엑셀 시트에 업데이트했습니다. 별도 조치는 필요 없으며 최종 수량만 확인해주세요.",
  },
];

const todaysClasses = [
  {
    time: "16:00",
    title: "고2 수학 정규반",
    room: "강의실 302호 • 김조교 담당",
  },
  {
    time: "19:00",
    title: "고3 미적분 심화",
    room: "강의실 401호 • 이조교 담당",
  },
];

const clinicStudents = [
  { name: "박민수", subject: "수학1", time: "15:00 ~ 17:00", status: "대기" },
  { name: "최유진", subject: "미적분", time: "14:00 ~ 16:00", status: "완료" },
  { name: "김동현", subject: "기하", time: "17:00 ~ 19:00", status: "대기" },
  { name: "이준호", subject: "수학2", time: "18:00 ~ 20:00", status: "대기" },
];

const retestStudents = [
  {
    name: "김철수",
    grade: "고2",
    reason: "10/24 주간테스트 불합격 (65점)",
  },
  {
    name: "이영희",
    grade: "고1",
    reason: "단어시험 3차 통과 실패",
  },
];

export const metadata: Metadata = {
  title: "강사 대시보드 - EduTrack",
  description: "강사/조교를 위한 학습 관리 대시보드",
};

export default function DashboardPage() {
  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200"
      )}
    >
      <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <PageHero />
        <SummaryGrid />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="space-y-6 xl:col-span-8">
            <InquiryTable />
            <TaskTable />
          </div>
          <div className="space-y-6 xl:col-span-4">
            <TodayClasses />
            <ClinicList />
            <ClinicSchedule />
            <RetestList />
          </div>
        </div>
      </main>
    </div>
  );
}

function PageHero() {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-1">
        <h1
          className={cn(
            lexend.className,
            "text-3xl font-bold text-slate-900 dark:text-white"
          )}
        >
          강사/조교 대시보드
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          오늘의 업무와 소통 현황을 한눈에 확인하세요.
        </p>
      </div>
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap md:w-auto md:justify-end">
        <Link
          href="/schedule-management"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-[#1a2632] dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
        >
          <span className={iconClass("text-[20px]")}>calendar_today</span>
          일정 관리
        </Link>
        <Link
          href="/assistant-approvals"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-[#1a2632] dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
        >
          <span className={iconClass("text-[20px]")}>how_to_reg</span>
          가입 승인 관리
        </Link>
        <Link
          href="/assistant-management"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-[#1a2632] dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
        >
          <span className={iconClass("text-[20px]")}>supervisor_account</span>
          조교 관리
        </Link>
        <DashboardTaskAssignmentModal
          variant="primary"
          buttonLabel="새 업무 등록"
          icon="add"
          className="w-full justify-center sm:w-auto"
        />
      </div>
    </div>
  );
}

function SummaryGrid() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {summaryCards.map((card) => (
        <div
          key={card.title}
          className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#1a2632]"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {card.title}
            </p>
            <span
              className={cn(
                iconClass("rounded-lg p-1.5 text-[20px]"),
                card.iconClassName
              )}
            >
              {card.icon}
            </span>
          </div>
          <div className="mt-2 flex items-end gap-2">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {card.value}
            </p>
            <span
              className={cn(
                "text-xs font-medium",
                card.deltaVariant === "positive"
                  ? "rounded bg-green-50 px-1.5 py-0.5 text-green-600 dark:bg-green-900/30 dark:text-green-300"
                  : card.deltaVariant === "negative"
                    ? "text-rose-500"
                    : "text-slate-400"
              )}
            >
              {card.delta}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function InquiryTable() {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#1a2632]">
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className={iconClass("text-primary")}>forum</span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            최근 문의 요청 사항 (학생/학부모)
          </h3>
        </div>
        <a
          href="#"
          className="text-sm font-medium text-primary hover:text-primary/80"
        >
          전체보기
        </a>
      </header>
      <div className="hidden md:block">
        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-[#131d27] dark:text-slate-400">
                <th className="px-6 py-3">구분</th>
                <th className="px-6 py-3">이름</th>
                <th className="w-2/5 px-6 py-3">문의 내용</th>
                <th className="px-6 py-3">등록일</th>
                <th className="px-6 py-3 text-right">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {inquiryRows.map((row) => (
                <tr
                  key={`${row.name}-${row.date}`}
                  className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        row.type === "학생"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
                      )}
                    >
                      {row.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                    {row.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {row.message}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {row.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <StatusBadge
                      label={row.status}
                      variant={row.statusVariant}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="space-y-3 px-4 py-4 md:hidden">
        {inquiryRows.map((row) => (
          <div
            key={`${row.name}-${row.date}-mobile`}
            className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-sm text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200"
          >
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold",
                  row.type === "학생"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
                )}
              >
                {row.type}
              </span>
              <span>{row.date}</span>
            </div>
            <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white">
              {row.name}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {row.message}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">상태</span>
              <StatusBadge label={row.status} variant={row.statusVariant} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TaskTable() {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#1a2632]">
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className={iconClass("text-purple-500")}>checklist</span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            강사 업무 지시 내역
          </h3>
        </div>
        <DashboardTaskAssignmentModal buttonLabel="+ 업무 추가" icon="add" />
      </header>
      <div className="hidden md:block">
        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-[#131d27] dark:text-slate-400">
                <th className="w-1/3 px-6 py-3">지시 업무명</th>
                <th className="px-6 py-3">대상 조교</th>
                <th className="px-6 py-3">기한 (D-Day)</th>
                <th className="px-6 py-3">진행률</th>
                <th className="px-6 py-3 text-right">진행 상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {taskRows.map((row) => (
                <tr
                  key={row.title}
                  className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-6 py-4">
                    <TaskDetailModal task={row}>
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-300">
                          <span className={iconClass("text-[18px]")}>
                            {row.icon}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {row.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {row.subTitle}
                          </p>
                        </div>
                      </div>
                    </TaskDetailModal>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="size-6 rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${row.avatar})` }}
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {row.ta}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                    {row.due}
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${row.progress}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <StatusBadge
                      label={row.status}
                      variant={row.statusVariant}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="space-y-3 px-4 py-4 md:hidden">
        {taskRows.map((row) => (
          <TaskDetailModal
            key={`${row.title}-mobile`}
            task={row}
            triggerClassName="rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-left shadow-sm dark:border-slate-700 dark:bg-slate-900/40"
          >
            <div className="flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                  <span className={iconClass("text-[20px]")}>{row.icon}</span>
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {row.title}
                  </p>
                  <p className="text-xs text-slate-500">{row.subTitle}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <div
                    className="size-6 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${row.avatar})` }}
                  />
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {row.ta}
                  </span>
                </div>
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {row.due}
                </span>
              </div>
              <div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${row.progress}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  진행률 {row.progress}%
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">상태</span>
                <StatusBadge label={row.status} variant={row.statusVariant} />
              </div>
            </div>
          </TaskDetailModal>
        ))}
      </div>
    </section>
  );
}

function TodayClasses() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#1a2632]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
          <span className={iconClass("text-slate-500")}>event_note</span>
          조교 담당 당일 수업
        </h3>
        <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          10월 25일
        </span>
      </div>
      <div className="space-y-3">
        {todaysClasses.map((session) => (
          <div
            key={session.title}
            className="flex rounded-lg border border-slate-100 p-3 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50"
          >
            <div className="mr-3 flex w-14 flex-shrink-0 flex-col items-center border-r border-slate-100 pr-3 text-center text-slate-500 dark:border-slate-700">
              <span className="text-xs font-medium">시작</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {session.time}
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {session.title}
              </p>
              <p className="text-xs text-slate-500">{session.room}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ClinicList() {
  return (
    <section className="grid max-h-[320px] grid-rows-[auto,1fr] gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#1a2632]">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
          <span className={iconClass("text-orange-500")}>schedule</span>
          오늘 클리닉 예정 학생
        </h3>
      </div>
      <div className="custom-scrollbar space-y-2 overflow-y-auto pr-2">
        {clinicStudents.map((student) => (
          <div
            key={student.name}
            className={cn(
              "flex items-center justify-between rounded-lg border px-3 py-2 text-sm",
              student.status === "완료"
                ? "border-transparent bg-slate-50/60 text-slate-400 dark:bg-slate-800/40"
                : "border-transparent bg-slate-50 dark:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-slate-200 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {student.name.charAt(0)}
              </div>
              <div>
                <p
                  className={cn(
                    "font-medium text-slate-900 dark:text-white",
                    student.status === "완료" &&
                      "line-through text-slate-400 dark:text-slate-500"
                  )}
                >
                  {student.name}
                  <span className="ml-1 text-xs font-normal text-slate-400">
                    | {student.subject}
                  </span>
                </p>
                <p className="text-xs text-slate-500">{student.time}</p>
              </div>
            </div>
            {student.status === "완료" ? (
              <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-600 dark:bg-green-900/30 dark:text-green-300">
                참석
              </span>
            ) : (
              <button className="rounded border border-primary/20 bg-primary/5 px-2 py-1 text-xs font-medium text-primary transition hover:bg-primary hover:text-white">
                입실
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function ClinicSchedule() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#1a2632]">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          클리닉 시간표
        </h3>
      </div>
      <div className="space-y-2 text-xs text-slate-400">
        <div className="flex justify-between px-1">
          {["14:00", "16:00", "18:00", "20:00", "22:00"].map((time) => (
            <span key={time}>{time}</span>
          ))}
        </div>
        <div className="relative h-4 rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="absolute left-0 top-0 h-full w-1/4 bg-primary/30" />
          <div className="absolute left-[35%] top-0 h-full w-[40%] bg-primary/60" />
          <div className="absolute left-[85%] top-0 h-full w-[15%] bg-primary/20" />
        </div>
        <p className="text-center text-slate-500">
          현재 <span className="font-bold text-primary">16:00 ~ 18:00</span>{" "}
          시간대가 가장 혼잡합니다.
        </p>
      </div>
    </section>
  );
}

function RetestList() {
  return (
    <section className="rounded-xl border border-rose-100 bg-gradient-to-br from-rose-50 to-white p-5 shadow-sm dark:border-rose-900/30 dark:from-rose-900/10 dark:to-[#1a2632]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <span className={iconClass("text-rose-500")}>warning</span>
          재시험 요청 학생
        </h3>
        <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
          {retestStudents.length}
        </span>
      </div>
      <div className="space-y-3">
        {retestStudents.map((student) => (
          <div
            key={student.name}
            className="flex items-center justify-between rounded-lg border border-rose-100 bg-white p-3 shadow-sm dark:border-rose-900/20 dark:bg-[#131d27]"
          >
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {student.name} ({student.grade})
              </p>
              <p className="text-xs font-medium text-rose-500">
                {student.reason}
              </p>
            </div>
            <div className="flex gap-1">
              <button className="rounded bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600">
                <span className={iconClass("text-[18px]")}>close</span>
              </button>
              <button className="rounded bg-primary p-1.5 text-white hover:bg-primary/90">
                <span className={iconClass("text-[18px]")}>check</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatusBadge({
  label,
  variant,
}: {
  label: string;
  variant: "pending" | "progress" | "done" | "primary" | "neutral" | "success";
}) {
  const styles: Record<typeof variant, string> = {
    pending:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
    progress:
      "bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-200",
    done: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    primary: "bg-primary/10 text-primary",
    neutral:
      "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    success:
      "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium",
        styles[variant]
      )}
    >
      {variant === "pending" && (
        <span className="size-1.5 rounded-full bg-amber-500" />
      )}
      {variant === "progress" && (
        <span className="size-1.5 rounded-full bg-primary" />
      )}
      {variant === "success" && (
        <span className="size-1.5 rounded-full bg-green-500" />
      )}
      {label}
    </span>
  );
}
