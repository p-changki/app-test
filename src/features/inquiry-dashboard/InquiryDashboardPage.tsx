"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import {
  type InquiryRecord,
  type InquiryStatus,
  useInquiryStore,
} from "@/features/inquiry-dashboard/inquiryStore";

type PublishMethod = "now" | "schedule";

export function InquiryDashboardPage() {
  const [unansweredOpen, setUnansweredOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [importantNotice, setImportantNotice] = useState(false);
  const [publishMethod, setPublishMethod] = useState<PublishMethod>("now");
  const [scheduleDate, setScheduleDate] = useState("2024-05-24");
  const [scheduleHour, setScheduleHour] = useState("11시");
  const [scheduleMinute, setScheduleMinute] = useState("30분");
  const [noticeAudience, setNoticeAudience] = useState("전체 학생 및 강사진");
  const [selectedClass, setSelectedClass] = useState("전체 학급");
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [includeParents, setIncludeParents] = useState(false);
  const router = useRouter();
  const inquiries = useInquiryStore();

  const inquiryRows = useMemo(
    () => inquiries.map(buildInquiryRow),
    [inquiries]
  );

  const unansweredRows = useMemo(
    () =>
      inquiries.filter(
        (inquiry) =>
          inquiry.status === "조교 이관" || inquiry.status === "강사 검토"
      ),
    [inquiries]
  );

  const totalCount = inquiries.length;
  const urgentCount = inquiries.filter(
    (inquiry) => inquiry.status === "조교 이관"
  ).length;
  const inProgressCount = inquiries.filter(
    (inquiry) => inquiry.status === "강사 검토"
  ).length;
  const completedCount = inquiries.filter(
    (inquiry) =>
      inquiry.status === "답변 완료" ||
      inquiry.status === "학생/학부모 확인 완료"
  ).length;

  return (
    <div className="flex min-h-screen flex-col bg-background-light text-[#111418] dark:bg-background-dark dark:text-white">
      <div className="flex flex-1 overflow-hidden">
        <main className="flex flex-1 flex-col overflow-y-auto bg-background-light dark:bg-background-dark">
          <div className="flex flex-wrap items-end justify-between gap-4 p-8 pb-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-black tracking-tight text-[#111418] dark:text-white">
                문의 관리 총괄 대시보드
              </h2>
              <p className="text-sm font-medium text-[#617589] dark:text-gray-400">
                실시간 학생 문의 현황 및 조교진 업무 프로세스를 관리합니다.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="flex items-center gap-2 rounded-lg border border-[#dbe0e6] bg-white px-4 py-2 text-sm font-bold shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                type="button"
              >
                <span className="material-symbols-outlined text-sm">
                  download
                </span>
                엑셀 내보내기
              </button>
              <button
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary/90"
                type="button"
                onClick={() => setNoticeOpen(true)}
              >
                <span className="material-symbols-outlined text-sm">add</span>
                공지사항 등록
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 px-8 py-4 md:grid-cols-4">
            <StatCard
              title="누적 문의"
              subtitle="전체"
              value={totalCount.toLocaleString("en-US")}
              trend="+12.5% vs 지난달"
              trendIcon="trending_up"
              trendColor="text-[#078838]"
            />
            <StatCard
              title="미답변 (Urgent)"
              value={urgentCount.toLocaleString("en-US")}
              highlight
              highlightColor="border-l-[#e73908]"
              trend="8건 지연 중"
              trendIcon="priority_high"
              trendColor="text-[#e73908]"
              onClick={() => setUnansweredOpen(true)}
            />
            <StatCard
              title="진행 중"
              value={inProgressCount.toLocaleString("en-US")}
              highlight
              highlightColor="border-l-primary"
              trend="평균 처리 1.2h"
              trendIcon="sync"
              trendColor="text-primary"
            />
            <StatCard
              title="오늘 완료"
              value={completedCount.toLocaleString("en-US")}
              trend="목표 달성 92%"
              trendIcon="check_circle"
              trendColor="text-[#078838]"
            />
          </div>
          <div className="px-8 py-2">
            <div className="flex flex-col gap-4 rounded-xl border border-[#dbe0e6] bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-[#1a242d]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <label className="relative flex flex-1 items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[#617589]">
                    search
                  </span>
                  <input
                    className="w-full rounded-lg border-none bg-[#f0f2f4] px-4 py-2.5 pl-10 text-sm focus:ring-2 focus:ring-primary transition-all dark:bg-gray-800"
                    placeholder="학생명, 학번 또는 문의 제목으로 검색"
                    type="text"
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "상태: 전체",
                    "책임 강사: 전체",
                    "담당자: 전체",
                    "기간: 최근 7일",
                  ].map((label, index) => (
                    <button
                      key={label}
                      className="flex items-center gap-2 rounded-lg bg-[#f0f2f4] px-3 py-2 text-sm font-medium dark:bg-gray-800"
                      type="button"
                    >
                      {label}
                      <span className="material-symbols-outlined text-[18px]">
                        {index === 3 ? "calendar_today" : "expand_more"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 px-8 py-4">
            <div className="flex h-full flex-col overflow-hidden rounded-xl border border-[#dbe0e6] bg-white shadow-sm dark:border-gray-700 dark:bg-[#1a242d]">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#dbe0e6] bg-[#f8f9fa] text-xs font-bold uppercase tracking-wider text-[#617589] dark:border-gray-700 dark:bg-gray-800/50">
                      <th className="px-4 py-4">상태</th>
                      <th className="px-4 py-4">학생명 (학번)</th>
                      <th className="px-4 py-4">문의 제목</th>
                      <th className="px-4 py-4">책임 강사</th>
                      <th className="px-4 py-4">담당 조교</th>
                      <th className="px-4 py-4 text-right">최종 활동</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f2f4] dark:divide-gray-800">
                    {inquiryRows.map((row) => (
                      <tr
                        key={row.id}
                        className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30"
                        onClick={() =>
                          router.push(`/inquiry-dashboard/${row.id}`)
                        }
                      >
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${row.statusClasses}`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-[#111418] dark:text-white">
                              {row.student}
                            </span>
                            <span className="text-[11px] text-[#617589]">
                              {row.studentId}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex max-w-md flex-col">
                            <span className="cursor-pointer truncate text-sm font-semibold text-primary hover:underline">
                              {row.title}
                            </span>
                            <span className="truncate text-[11px] text-[#617589]">
                              {row.context}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="size-6 rounded-full bg-gray-200 bg-cover bg-center"
                              style={{
                                backgroundImage: row.instructorAvatar
                                  ? `url(${row.instructorAvatar})`
                                  : undefined,
                              }}
                            />
                            <span className="text-sm font-medium">
                              {row.instructor}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {row.assistant ? (
                            <div className="flex items-center gap-2">
                              <div className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                                {row.assistantInitials}
                              </div>
                              <span className="text-sm font-medium">
                                {row.assistant}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm italic text-[#617589]">
                              - 미배정 -
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right text-xs font-medium text-[#617589]">
                          {row.lastActivity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-auto flex items-center justify-between border-t border-[#dbe0e6] p-4 text-xs font-medium text-[#617589] dark:border-gray-700">
                <p>
                  총 {totalCount}건 중 1 - {Math.min(totalCount, 20)}건 표시
                </p>
                <div className="flex items-center gap-2">
                  <button
                    className="flex size-8 items-center justify-center rounded border border-[#dbe0e6] text-[#617589] disabled:opacity-50 dark:border-gray-700"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chevron_left
                    </span>
                  </button>
                  {[1, 2, 3].map((page) => (
                    <button
                      key={page}
                      className={`flex size-8 items-center justify-center rounded border text-xs font-bold ${
                        page === 1
                          ? "bg-primary text-white"
                          : "border-[#dbe0e6] dark:border-gray-700"
                      }`}
                      type="button"
                    >
                      {page}
                    </button>
                  ))}
                  <span>...</span>
                  <button
                    className="flex size-8 items-center justify-center rounded border border-[#dbe0e6] text-xs font-bold dark:border-gray-700"
                    type="button"
                  >
                    75
                  </button>
                  <button
                    className="flex size-8 items-center justify-center rounded border border-[#dbe0e6] text-[#617589] dark:border-gray-700"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {unansweredOpen ? (
        <UnansweredModal
          onClose={() => setUnansweredOpen(false)}
          rows={unansweredRows}
        />
      ) : null}
      {noticeOpen ? (
        <NoticeModal
          onClose={() => setNoticeOpen(false)}
          importantNotice={importantNotice}
          onImportantChange={setImportantNotice}
          publishMethod={publishMethod}
          onPublishMethodChange={setPublishMethod}
          scheduleDate={scheduleDate}
          scheduleHour={scheduleHour}
          scheduleMinute={scheduleMinute}
          onScheduleDateChange={setScheduleDate}
          onScheduleHourChange={setScheduleHour}
          onScheduleMinuteChange={setScheduleMinute}
          audience={noticeAudience}
          onAudienceChange={setNoticeAudience}
          selectedClass={selectedClass}
          onSelectedClassChange={setSelectedClass}
          studentSearch={studentSearch}
          onStudentSearchChange={setStudentSearch}
          selectedStudents={selectedStudents}
          onSelectedStudentsChange={setSelectedStudents}
          includeParents={includeParents}
          onIncludeParentsChange={setIncludeParents}
        />
      ) : null}
    </div>
  );
}

type InquiryRow = {
  id: string;
  status: InquiryStatus;
  statusClasses: string;
  student: string;
  studentId: string;
  title: string;
  context: string;
  instructor: string;
  instructorAvatar: string;
  assistant?: string;
  assistantInitials?: string;
  lastActivity: string;
};

const STATUS_BADGE_STYLES: Record<InquiryStatus, string> = {
  "조교 이관": "bg-[#fce8e6] text-[#e73908]",
  "강사 검토": "bg-primary/10 text-primary",
  "답변 완료": "bg-green-100 text-green-700",
  "학생/학부모 확인 완료": "bg-[#f0f2f4] text-[#617589]",
  종료: "bg-[#f0f2f4] text-[#617589]",
};

function parseTimestamp(value: string) {
  const parsed = new Date(value.replace(" ", "T"));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getElapsedLabel(value: string) {
  const parsed = parseTimestamp(value);
  if (!parsed) return value;
  const diffMs = Date.now() - parsed.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));
  if (diffMinutes < 60) return `${diffMinutes}분`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}일`;
}

function buildInquiryRow(inquiry: InquiryRecord): InquiryRow {
  return {
    id: inquiry.id,
    status: inquiry.status,
    statusClasses: STATUS_BADGE_STYLES[inquiry.status],
    student: inquiry.student.name,
    studentId: inquiry.student.studentId,
    title: inquiry.title,
    context: inquiry.category,
    instructor: inquiry.instructor.name,
    instructorAvatar: inquiry.instructor.avatarUrl ?? "",
    assistant: inquiry.assistant?.name,
    assistantInitials: inquiry.assistant?.initials,
    lastActivity: `${getElapsedLabel(inquiry.updatedAt)} 전`,
  };
}

type StatCardProps = {
  title: string;
  value: string;
  trend?: string;
  trendIcon?: string;
  trendColor?: string;
  subtitle?: string;
  highlight?: boolean;
  highlightColor?: string;
  onClick?: () => void;
};

function StatCard({
  title,
  value,
  trend,
  trendIcon,
  trendColor,
  subtitle,
  highlight,
  highlightColor,
  onClick,
}: StatCardProps) {
  return (
    <button
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`text-left rounded-xl border border-[#dbe0e6] bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#1a242d] ${
        highlight && highlightColor ? `border-l-4 ${highlightColor}` : ""
      } ${onClick ? "transition hover:border-primary/40" : ""}`}
    >
      <div className="mb-2 flex items-start justify-between">
        <p className="text-sm font-semibold text-[#617589]">{title}</p>
        {subtitle ? (
          <span className="rounded-full bg-[#f0f2f4] px-2 py-0.5 text-[10px] font-bold">
            {subtitle}
          </span>
        ) : null}
      </div>
      <p className="text-3xl font-black text-[#111418] dark:text-white">
        {value}
      </p>
      {trend ? (
        <div
          className={`mt-2 flex items-center gap-1 text-xs font-bold ${trendColor ?? ""}`}
        >
          {trendIcon ? (
            <span className="material-symbols-outlined text-sm">
              {trendIcon}
            </span>
          ) : null}
          <span>{trend}</span>
        </div>
      ) : null}
    </button>
  );
}

function UnansweredModal({
  onClose,
  rows,
}: {
  onClose: () => void;
  rows: InquiryRecord[];
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
      <div className="w-full max-w-3xl rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface-panel)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[color:var(--surface-border)] px-6 py-4">
          <div>
            <p className="text-xs font-semibold text-[color:var(--surface-text-muted)]">
              미답변 문의
            </p>
            <h3 className="text-lg font-bold text-[color:var(--surface-text)]">
              지연 중인 문의 {rows.length}건
            </h3>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-[color:var(--surface-text-muted)] transition hover:bg-[color:var(--surface-border)]/30"
            onClick={onClose}
            aria-label="미답변 문의 모달 닫기"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
          <div className="space-y-3">
            {rows.map((row) => (
              <div
                key={`unanswered-${row.id}`}
                className="rounded-xl border border-[#dbe0e6] bg-white px-4 py-3 text-sm shadow-sm dark:border-gray-700 dark:bg-[#1a242d]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-bold text-[#111418] dark:text-white">
                      {row.title}
                    </p>
                    <p className="text-xs text-[#617589]">{row.category}</p>
                  </div>
                  <span className="rounded-full bg-[#fce8e6] px-2 py-0.5 text-[10px] font-bold text-[#e73908]">
                    {row.status === "강사 검토" ? "처리 중" : "대기 중"}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-6 text-xs text-[#617589]">
                  <div>
                    <p className="font-semibold text-[#111418] dark:text-white">
                      {row.student.name}
                    </p>
                    <p>{row.student.studentId}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#111418] dark:text-white">
                      책임 강사
                    </p>
                    <p>{row.instructor.name}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#111418] dark:text-white">
                      미답변 시간
                    </p>
                    <p>{getElapsedLabel(row.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type NoticeModalProps = {
  onClose: () => void;
  importantNotice: boolean;
  onImportantChange: (nextValue: boolean) => void;
  publishMethod: PublishMethod;
  onPublishMethodChange: (method: PublishMethod) => void;
  scheduleDate: string;
  scheduleHour: string;
  scheduleMinute: string;
  onScheduleDateChange: (value: string) => void;
  onScheduleHourChange: (value: string) => void;
  onScheduleMinuteChange: (value: string) => void;
  audience: string;
  onAudienceChange: (value: string) => void;
  selectedClass: string;
  onSelectedClassChange: (value: string) => void;
  studentSearch: string;
  onStudentSearchChange: (value: string) => void;
  selectedStudents: string[];
  onSelectedStudentsChange: (value: string[]) => void;
  includeParents: boolean;
  onIncludeParentsChange: (value: boolean) => void;
};

function NoticeModal({
  onClose,
  importantNotice,
  onImportantChange,
  publishMethod,
  onPublishMethodChange,
  scheduleDate,
  scheduleHour,
  scheduleMinute,
  onScheduleDateChange,
  onScheduleHourChange,
  onScheduleMinuteChange,
  audience,
  onAudienceChange,
  selectedClass,
  onSelectedClassChange,
  studentSearch,
  onStudentSearchChange,
  selectedStudents,
  onSelectedStudentsChange,
  includeParents,
  onIncludeParentsChange,
}: NoticeModalProps) {
  const isSchedule = publishMethod === "schedule";
  const isIndividualAudience = audience === "개인 학생/학부모";
  const students = [
    "김철수 (20240101)",
    "이영희 (20230214)",
    "박지민 (20220914)",
    "정수빈 (20210822)",
  ];
  const filteredStudents = students.filter((student) =>
    student.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const addStudent = (student: string) => {
    if (selectedStudents.includes(student)) return;
    onSelectedStudentsChange([...selectedStudents, student]);
    onStudentSearchChange("");
  };

  const removeStudent = (student: string) => {
    onSelectedStudentsChange(
      selectedStudents.filter((item) => item !== student)
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#dbe0e6] bg-white shadow-2xl dark:border-gray-700 dark:bg-[#1a242d]"
        role="dialog"
        aria-modal="true"
        aria-label="공지사항 등록 모달"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#dbe0e6] bg-white px-8 py-5 dark:border-gray-700 dark:bg-[#1a242d]">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-[20px]">
                campaign
              </span>
            </div>
            <h3 className="text-lg font-bold tracking-tight text-[#111418] dark:text-white">
              공지사항 등록
            </h3>
          </div>
          <button
            type="button"
            className="text-[#617589] transition-colors hover:text-[#111418] dark:hover:text-white"
            onClick={onClose}
            aria-label="공지사항 등록 모달 닫기"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex-1 space-y-8 overflow-y-auto p-8">
          <div className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-900/10">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-amber-500">
                priority_high
              </span>
              <div>
                <p className="text-sm font-bold text-amber-800 dark:text-amber-200">
                  중요 공지사항으로 지정
                </p>
                <p className="text-[11px] text-amber-600 dark:text-amber-400">
                  게시판 최상단에 고정되며 알림이 발송됩니다.
                </p>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                className="sr-only peer"
                type="checkbox"
                checked={importantNotice}
                onChange={(event) => onImportantChange(event.target.checked)}
              />
              <div className="relative h-6 w-11 rounded-full bg-gray-200 transition peer-checked:bg-amber-500 dark:bg-gray-700">
                <span className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full border border-gray-300 bg-white transition-all peer-checked:translate-x-full peer-checked:border-white" />
              </div>
            </label>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-1 text-sm font-bold text-[#111418] dark:text-white">
              공지 제목 <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full rounded-xl border-none bg-[#f0f2f4] px-4 py-3 text-sm placeholder:text-[#617589] focus:ring-2 focus:ring-primary transition-all dark:bg-gray-800"
              placeholder="공지사항 제목을 입력하세요 (최대 50자)"
              type="text"
            />
          </div>
          <div className="space-y-4">
            <label className="text-sm font-bold text-[#111418] dark:text-white">
              게시 방법
            </label>
            <div className="rounded-xl border border-[#dbe0e6] bg-[#f8f9fa] p-5 dark:border-gray-700 dark:bg-gray-800/40">
              <div className="flex flex-wrap gap-6">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    className="h-4 w-4 border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                    name="publish_method"
                    type="radio"
                    value="now"
                    checked={publishMethod === "now"}
                    onChange={() => onPublishMethodChange("now")}
                  />
                  <span className="text-sm font-medium text-[#111418] dark:text-white">
                    즉시 게시
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    className="h-4 w-4 border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                    name="publish_method"
                    type="radio"
                    value="schedule"
                    checked={publishMethod === "schedule"}
                    onChange={() => onPublishMethodChange("schedule")}
                  />
                  <span className="text-sm font-medium text-[#111418] dark:text-white">
                    예약 게시
                  </span>
                </label>
              </div>
              <div className="space-y-4 border-t border-[#dbe0e6] pt-4 dark:border-gray-700">
                <div
                  className={`grid gap-4 md:grid-cols-2 ${
                    isSchedule ? "" : "opacity-60"
                  }`}
                >
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-[#617589] dark:text-gray-400">
                      게시 예약 날짜
                    </p>
                    <input
                      className="w-full rounded-lg border border-[#dbe0e6] bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
                      type="date"
                      value={scheduleDate}
                      onChange={(event) =>
                        onScheduleDateChange(event.target.value)
                      }
                      disabled={!isSchedule}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-[#617589] dark:text-gray-400">
                      게시 예약 시간
                    </p>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <select
                          className="w-full appearance-none rounded-lg border border-[#dbe0e6] bg-white py-2.5 pl-3 pr-8 text-sm focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
                          value={scheduleHour}
                          onChange={(event) =>
                            onScheduleHourChange(event.target.value)
                          }
                          disabled={!isSchedule}
                        >
                          {["09시", "10시", "11시", "12시", "13시"].map(
                            (hour) => (
                              <option key={hour}>{hour}</option>
                            )
                          )}
                        </select>
                        <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 scale-75 text-[#617589]">
                          expand_more
                        </span>
                      </div>
                      <div className="relative flex-1">
                        <select
                          className="w-full appearance-none rounded-lg border border-[#dbe0e6] bg-white py-2.5 pl-3 pr-8 text-sm focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
                          value={scheduleMinute}
                          onChange={(event) =>
                            onScheduleMinuteChange(event.target.value)
                          }
                          disabled={!isSchedule}
                        >
                          {["00분", "30분", "45분"].map((minute) => (
                            <option key={minute}>{minute}</option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 scale-75 text-[#617589]">
                          expand_more
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-primary">
                  <span className="material-symbols-outlined text-[16px] mt-0.5">
                    info
                  </span>
                  <p className="text-[11px] font-medium leading-relaxed">
                    예약된 공지는 설정하신 시간에 자동으로 게시되며, 게시 시점에
                    대상 수강생들에게 알림이 발송됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#111418] dark:text-white">
                게시 대상 설정
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-xl bg-[#f0f2f4] py-3 pl-4 pr-10 text-sm focus:ring-2 focus:ring-primary dark:bg-gray-800"
                  value={audience}
                  onChange={(event) => onAudienceChange(event.target.value)}
                >
                  <option>전체 학생 및 강사진</option>
                  <option>특정 학급 (필터링)</option>
                  <option>강사 및 조교 전용</option>
                  <option>특정 수강생 그룹</option>
                  <option>개인 학생/학부모</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#617589]">
                  expand_more
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#111418] dark:text-white">
                세부 학급 선택
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-xl bg-[#f0f2f4] py-3 pl-4 pr-10 text-sm focus:ring-2 focus:ring-primary dark:bg-gray-800"
                  value={selectedClass}
                  onChange={(event) =>
                    onSelectedClassChange(event.target.value)
                  }
                >
                  <option>전체 학급</option>
                  <option>데이터 사이언스 입문 (A반)</option>
                  <option>고급 알고리즘 실습 (B반)</option>
                  <option>운영체제 핵심원리 (C반)</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#617589]">
                  expand_more
                </span>
              </div>
            </div>
          </div>
          {isIndividualAudience ? (
            <div className="space-y-4 rounded-xl border border-[#dbe0e6] bg-[#f8f9fa] p-5 dark:border-gray-700 dark:bg-gray-800/40">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[#111418] dark:text-white">
                    개별 수신자 선택
                  </p>
                  <p className="text-[11px] text-[#617589]">
                    학생을 선택하면 학부모 포함 여부를 설정할 수 있습니다.
                  </p>
                </div>
                <label className="flex items-center gap-2 text-xs font-semibold text-[#617589]">
                  <input
                    type="checkbox"
                    checked={includeParents}
                    onChange={(event) =>
                      onIncludeParentsChange(event.target.checked)
                    }
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  학부모에게도 발송
                </label>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#617589]">
                  search
                </span>
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(event) =>
                    onStudentSearchChange(event.target.value)
                  }
                  placeholder="학생 이름 또는 학번으로 검색"
                  className="w-full rounded-lg border border-[#dbe0e6] bg-white py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
                />
              </div>
              {studentSearch ? (
                <div className="rounded-lg border border-[#dbe0e6] bg-white p-2 text-sm dark:border-gray-700 dark:bg-[#1a242d]">
                  {filteredStudents.length ? (
                    filteredStudents.map((student) => (
                      <button
                        key={student}
                        type="button"
                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[#111418] transition hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800"
                        onClick={() => addStudent(student)}
                      >
                        <span>{student}</span>
                        <span className="material-symbols-outlined text-sm text-primary">
                          add
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-xs text-[#617589]">
                      검색 결과가 없습니다.
                    </p>
                  )}
                </div>
              ) : null}
              <div className="flex flex-wrap gap-2">
                {selectedStudents.length ? (
                  selectedStudents.map((student) => (
                    <span
                      key={student}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#111418] shadow-sm dark:bg-[#1a242d] dark:text-white"
                    >
                      {student}
                      <button
                        type="button"
                        className="text-[#617589] hover:text-[#111418] dark:hover:text-white"
                        onClick={() => removeStudent(student)}
                        aria-label="선택 학생 제거"
                      >
                        <span className="material-symbols-outlined text-sm">
                          close
                        </span>
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-[#617589]">
                    선택된 학생이 없습니다.
                  </p>
                )}
              </div>
            </div>
          ) : null}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#111418] dark:text-white">
              공지 내용
            </label>
            <div className="overflow-hidden rounded-xl border border-[#dbe0e6] dark:border-gray-700">
              <div className="flex gap-2 border-b border-[#dbe0e6] bg-[#f8f9fa] px-3 py-2 dark:border-gray-700 dark:bg-gray-800/50">
                {[
                  "format_bold",
                  "format_italic",
                  "format_list_bulleted",
                  "link",
                  "image",
                ].map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    className="rounded p-1 text-[#617589] transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {icon}
                    </span>
                  </button>
                ))}
              </div>
              <textarea
                className="min-h-[200px] w-full resize-none border-none bg-white p-4 text-sm placeholder:text-[#617589] focus:ring-0 dark:bg-[#1a242d]"
                placeholder="공지 내용을 상세히 입력해주세요. 이미지 및 링크 첨부가 가능합니다."
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#111418] dark:text-white">
              관련 파일 첨부
            </label>
            <div className="flex w-full items-center justify-center">
              <label className="flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#dbe0e6] bg-[#f0f2f4]/50 transition-all hover:bg-[#f0f2f4] dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <span className="material-symbols-outlined mb-1 text-[#617589]">
                    upload_file
                  </span>
                  <p className="text-sm font-medium text-[#111418] dark:text-white">
                    클릭하거나 파일을 여기로 드래그하세요
                  </p>
                  <p className="text-[11px] text-[#617589]">
                    PDF, JPG, PNG, DOCX (최대 10MB)
                  </p>
                </div>
                <input className="hidden" type="file" />
              </label>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-[#dbe0e6] bg-[#f8f9fa] px-8 py-5 dark:border-gray-700 dark:bg-gray-800/30">
          <button
            type="button"
            className="text-sm font-bold text-[#617589] transition-colors hover:text-[#111418] dark:hover:text-white"
            onClick={onClose}
          >
            취소
          </button>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-lg border border-[#dbe0e6] bg-white px-6 py-2.5 text-sm font-bold text-[#111418] transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              임시 저장
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-primary px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-[18px]">
                event_available
              </span>
              예약 설정 완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
