"use client";

import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

type SummaryCard = {
  label: string;
  value: string;
  suffix: string;
  icon: string;
  accent: string;
  progress: number;
};

type AttendanceRecord = {
  date: string;
  weekday: string;
  status: "present" | "late" | "early" | "absent";
  checkIn: string;
  checkOut: string;
  note: string;
  highlight?: boolean;
};

const profile = {
  name: "김철수",
  englishName: "Kim Chul-soo",
  status: "재원생",
  classLabel: "중등 수학 심화반 (Math Advanced Class)",
  studentId: "2023001",
  teacher: "이영희 선생님",
  phone: "010-1234-5678",
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCS96EY1rI5Gev74laY-EIT1dPf44WUqK8NSc09FLxjmZ5GR4rRUjck1dB24qs-YstiVUle_kttTdTWhOpOWxf-yX6GBO-EozyA4xnTeOK2dVMV0oBADY-EYDH6Ykx_wVOr9WWczsvu-bl7R_ZxPqCOkd6O2jcUSS2r9QogdvYfLV1-mFIMF3AsvKgDc2CLiPDaGQw3-fU6SlQF547Nw1S7LscSMpUzbMv5PfsD94-k595CPYAgeQQi5tLq3dxLw8M0ec2HXSq5ri0",
};

const summaryCards: SummaryCard[] = [
  {
    label: "출석 (Present)",
    value: "18",
    suffix: "일",
    icon: "check_circle",
    accent: "text-[#2b8cee]",
    progress: 90,
  },
  {
    label: "지각 (Late)",
    value: "1",
    suffix: "일",
    icon: "schedule",
    accent: "text-[#F59E0B]",
    progress: 15,
  },
  {
    label: "결석 (Absent)",
    value: "0",
    suffix: "일",
    icon: "cancel",
    accent: "text-[#EF4444]",
    progress: 0,
  },
  {
    label: "조퇴 (Early Leave)",
    value: "1",
    suffix: "일",
    icon: "logout",
    accent: "text-[#8B5CF6]",
    progress: 5,
  },
];

const attendanceRecords: AttendanceRecord[] = [
  {
    date: "2023-10-18",
    weekday: "Wed",
    status: "present",
    checkIn: "13:55",
    checkOut: "18:05",
    note: "-",
    highlight: true,
  },
  {
    date: "2023-10-12",
    weekday: "Thu",
    status: "early",
    checkIn: "14:00",
    checkOut: "16:30",
    note: "병원 진료 (Doctor Appointment)",
  },
  {
    date: "2023-10-05",
    weekday: "Thu",
    status: "late",
    checkIn: "14:20",
    checkOut: "18:00",
    note: "버스 지연 (Bus Delay)",
  },
  {
    date: "2023-10-04",
    weekday: "Wed",
    status: "present",
    checkIn: "13:58",
    checkOut: "18:02",
    note: "-",
  },
];

const statusPills: Record<
  AttendanceRecord["status"],
  { label: string; className: string }
> = {
  present: {
    label: "출석",
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  },
  late: {
    label: "지각",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  },
  early: {
    label: "조퇴",
    className:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  },
  absent: {
    label: "결석",
    className: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  },
};

export function StudentAttendanceDetail() {
  const initialDate = attendanceRecords[0]
    ? new Date(attendanceRecords[0].date)
    : new Date();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDate
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(initialDate);
  const selectedDateKey = selectedDate ? formatDateKey(selectedDate) : null;

  const modifierDates = useMemo(() => {
    const present = attendanceRecords
      .filter((record) => record.status === "present")
      .map((record) => new Date(record.date));
    const late = attendanceRecords
      .filter((record) => record.status === "late")
      .map((record) => new Date(record.date));
    const absent = attendanceRecords
      .filter((record) => record.status === "absent")
      .map((record) => new Date(record.date));
    const early = attendanceRecords
      .filter((record) => record.status === "early")
      .map((record) => new Date(record.date));
    return { present, late, absent, early };
  }, []);

  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors"
      )}
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[color:var(--surface-text-muted)]">
            <span>홈</span>
            <span className={iconClass("text-[14px]")}>chevron_right</span>
            <span>학생 관리</span>
            <span className={iconClass("text-[14px]")}>chevron_right</span>
            <span className="text-primary">출결 조회</span>
          </div>
          <div>
            <p className="text-sm text-[color:var(--surface-text-muted)]">
              학생과 학부모님이 출결 현황을 상세하게 확인할 수 있습니다.
            </p>
            <h1
              className={cn(
                lexend.className,
                "mt-1 text-3xl font-bold tracking-tight text-[color:var(--surface-text)] sm:text-4xl"
              )}
            >
              상세 출결 조회
            </h1>
          </div>
        </div>

        <section className="rounded-2xl border border-[color:var(--surface-border)] bg-[var(--surface-panel)] p-6 shadow-sm">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <div
              className="size-28 rounded-full border-2 border-white bg-cover bg-center shadow dark:border-slate-700"
              style={{ backgroundImage: `url(${profile.avatar})` }}
            />
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
                <h2
                  className={cn(
                    lexend.className,
                    "text-2xl font-bold text-[color:var(--surface-text)]"
                  )}
                >
                  {profile.name} ({profile.englishName})
                </h2>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {profile.status}
                </span>
              </div>
              <p className="text-sm font-medium text-[color:var(--surface-text-muted)]">
                {profile.classLabel}
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-[color:var(--surface-text-muted)] sm:justify-start">
                <ProfileDetail
                  icon="badge"
                  label={`ID: ${profile.studentId}`}
                />
                <ProfileDetail
                  icon="school"
                  label={`담임: ${profile.teacher}`}
                />
                <ProfileDetail icon="call" label={profile.phone} />
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {summaryCards.map((card) => (
            <article
              key={card.label}
              className="relative overflow-hidden rounded-2xl border border-[color:var(--surface-border)] bg-[var(--surface-panel)] p-5 shadow-sm"
            >
              <div className="absolute right-0 top-0 p-4 text-[56px] opacity-10">
                <span className={cn(iconClass(), card.accent)}>
                  {card.icon}
                </span>
              </div>
              <p className="text-sm font-medium text-[color:var(--surface-text-muted)]">
                {card.label}
              </p>
              <div className="mt-3 flex items-baseline gap-1">
                <p className="text-3xl font-bold text-[color:var(--surface-text)]">
                  {card.value}
                </p>
                <span className="text-sm font-medium text-[color:var(--surface-text-muted)]">
                  {card.suffix}
                </span>
              </div>
              <div className="mt-3 h-1.5 w-full rounded-full bg-[color:var(--surface-border)]">
                <div
                  className={cn(
                    "h-full rounded-full",
                    card.icon === "check_circle"
                      ? "bg-[#2b8cee]"
                      : card.icon === "schedule"
                        ? "bg-[#F59E0B]"
                        : card.icon === "cancel"
                          ? "bg-[#EF4444]"
                          : "bg-[#8B5CF6]"
                  )}
                  style={{ width: `${card.progress}%` }}
                />
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-[color:var(--surface-border)] bg-[var(--surface-panel)] shadow-sm">
          <div className="flex flex-col gap-4 border-b border-[color:var(--surface-border)] p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 rounded-xl bg-[color:var(--surface-background)] px-3 py-2 text-sm font-semibold">
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-md hover:bg-[var(--surface-panel)]"
                onClick={() => setCurrentMonth((prev) => addMonths(prev, -1))}
              >
                <span
                  className={iconClass(
                    "text-base text-[color:var(--surface-text-muted)]"
                  )}
                >
                  chevron_left
                </span>
              </button>
              <span className="min-w-[120px] text-center text-base font-bold">
                {`${currentMonth.getFullYear()}년 ${currentMonth.getMonth() + 1}월`}
              </span>
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-md hover:bg-[var(--surface-panel)]"
                onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
              >
                <span
                  className={iconClass(
                    "text-base text-[color:var(--surface-text-muted)]"
                  )}
                >
                  chevron_right
                </span>
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-[color:var(--surface-text-muted)]">
              <LegendDot color="bg-[#2b8cee]" label="출석" />
              <LegendDot color="bg-[#F59E0B]" label="지각" />
              <LegendDot color="bg-[#EF4444]" label="결석" />
              <LegendDot color="bg-[#8B5CF6]" label="조퇴" />
            </div>
          </div>
          <div className="border-t border-[color:var(--surface-border)] bg-[var(--surface-background)]">
            <div className="flex flex-col gap-6 p-4 md:p-6 lg:flex-row">
              <div className="rounded-2xl border border-[color:var(--surface-border)] bg-[var(--surface-panel)] p-4 shadow-sm lg:max-w-[420px] lg:flex-none">
                <DayPicker
                  mode="single"
                  weekStartsOn={1}
                  showOutsideDays
                  selected={selectedDate}
                  onSelect={(day) => {
                    if (day) {
                      setSelectedDate(day);
                      setCurrentMonth(day);
                    }
                  }}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  className="rdp w-full text-base"
                  classNames={{
                    months: "space-y-6",
                    month: "space-y-4",
                    caption:
                      "text-left px-2 text-lg font-semibold text-[color:var(--surface-text)]",
                    head_row:
                      "grid grid-cols-7 gap-1 text-sm font-semibold text-[color:var(--surface-text-muted)]",
                    head_cell: "text-center",
                    row: "grid grid-cols-7 gap-2",
                    cell: "w-full",
                    day: "w-full aspect-square rounded-xl border border-transparent text-sm font-medium transition hover:border-[color:var(--surface-border)] focus-visible:outline-none",
                    day_selected:
                      "bg-primary text-white shadow ring-2 ring-primary/30 hover:bg-primary hover:text-white",
                    day_today:
                      "border border-primary text-primary font-bold hover:border-primary hover:text-primary",
                    day_outside:
                      "text-[color:var(--surface-text-muted)] opacity-60",
                    nav: "hidden",
                    table: "w-full border-collapse space-y-1",
                    tbody: "space-y-1",
                  }}
                  modifiers={{
                    present: modifierDates.present,
                    late: modifierDates.late,
                    absent: modifierDates.absent,
                    early: modifierDates.early,
                  }}
                  modifiersClassNames={{
                    present: "bg-blue-50 text-blue-600 border border-blue-100",
                    late: "bg-amber-50 text-amber-600 border border-amber-100",
                    absent: "bg-red-50 text-red-600 border border-red-100",
                    early:
                      "bg-purple-50 text-purple-600 border border-purple-100",
                  }}
                />
              </div>
              <div className="flex-1 rounded-2xl border border-[color:var(--surface-border)] bg-[var(--surface-panel)]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[color:var(--surface-background)] text-xs font-semibold uppercase text-[color:var(--surface-text-muted)]">
                      <tr>
                        <th className="px-4 py-3">날짜</th>
                        <th className="px-4 py-3">요일</th>
                        <th className="px-4 py-3">상태</th>
                        <th className="px-4 py-3">등원 시간</th>
                        <th className="px-4 py-3">하원 시간</th>
                        <th className="px-4 py-3">비고</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[color:var(--surface-border)]">
                      {attendanceRecords.map((record) => {
                        const isSelected = selectedDateKey === record.date;
                        return (
                          <tr
                            key={record.date}
                            className={cn(
                              isSelected || record.highlight
                                ? "bg-blue-50/70 dark:bg-blue-900/20"
                                : "hover:bg-[color:var(--surface-background)]"
                            )}
                          >
                            <td className="px-4 py-3 font-medium">
                              {record.date}
                            </td>
                            <td className="px-4 py-3 text-[color:var(--surface-text-muted)]">
                              {record.weekday}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                                  statusPills[record.status].className
                                )}
                              >
                                <span className="size-1.5 rounded-full bg-current opacity-70" />
                                {statusPills[record.status].label}
                              </span>
                            </td>
                            <td className="px-4 py-3">{record.checkIn}</td>
                            <td className="px-4 py-3">{record.checkOut}</td>
                            <td className="px-4 py-3 text-[color:var(--surface-text-muted)]">
                              {record.note}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-center border-t border-[color:var(--surface-border)] py-4">
                  <button
                    type="button"
                    className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-blue-700"
                  >
                    더 보기
                    <span className={iconClass("text-sm")}>expand_more</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ProfileDetail({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className={iconClass(
          "text-[16px] text-[color:var(--surface-text-muted)]"
        )}
      >
        {icon}
      </span>
      {label}
    </span>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("size-2.5 rounded-full", color)} />
      {label}
    </span>
  );
}

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function formatDateKey(date: Date) {
  return date.toISOString().split("T")[0];
}
