"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

import { classEntities } from "@/data/classes";
import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";
import { StudentGradesDetail } from "@/features/student-grades/StudentGradesDetail";

type ProfileFormValues = {
  name: string;
  school: string;
  grade: string;
  phone: string;
  email: string;
  parentName: string;
  parentPhone: string;
};

const heroProfile: ProfileFormValues & { status: string; avatar: string } = {
  name: "김민준",
  school: "서울고등학교",
  grade: "2학년",
  phone: "010-1234-5678 (본인)",
  email: "minjun.kim@edumanager.com",
  parentName: "김영희",
  parentPhone: "010-9876-5432 (어머니)",
  status: "재원중",
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDLlidok0fCHuswxfn8xb4HGkpH3nCBZiLcB_riUWkSRpDng-BXb8_EUE0GKxXUtsH9JW72l_Frd-AfMG397jCLiilW2jSWSlHlnBky1NHB-JQ8dYiLPb0kpYT5Y6sbvc-mdQOKEVZjAZdBD69rVWCu4dsiJqiDuPKrIUtz33Pa4VVLEFeaB-Y4S9vpgEsw1v4ab4nilHKtIn9zh0Pxf1mjD05EAcukiCx4aRFB2CUrN0bBSaH0nszFSSLxuKu7N9irvBRcEh8OKiE",
};

type SummaryStat = {
  label: string;
  value: string;
  icon: string;
  subValue?: string;
  subText?: string;
  delta?: string;
  deltaColor?: string;
  deltaIcon?: string;
};

const summaryStats: SummaryStat[] = [
  {
    label: "지각",
    value: "지각 1회",
    icon: "analytics",
  },
  {
    label: "결석",
    value: "결석 2회",
    icon: "leaderboard",
    delta: "1.0% 상승",
    deltaColor: "text-green-500",
    deltaIcon: "arrow_upward",
  },
  {
    label: "출석률",
    value: "95%",
    icon: "calendar_today",
    subText: "최근 30일 기준",
  },
];

const classList = classEntities;

const initialAttendanceRecords = [
  { date: "2026-01-08", status: "출석", note: "-" },
  { date: "2026-01-01", status: "출석", note: "-" },
  { date: "2025-12-18", status: "출석", note: "자율 학습" },
  { date: "2025-12-11", status: "출석", note: "-" },
  { date: "2025-12-04", status: "결석", note: "병결" },
  { date: "2025-11-27", status: "지각", note: "교통 지연" },
];

type StudentProfilePageProps = {
  enableGradeView?: boolean;
};

export function StudentProfilePage({
  enableGradeView = false,
}: StudentProfilePageProps) {
  const [profile, setProfile] = useState(heroProfile);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isAttendanceOpen, setAttendanceOpen] = useState(false);
  const [isAttendanceRegisterOpen, setAttendanceRegisterOpen] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState(
    initialAttendanceRecords
  );
  const [selectedGradeClassId, setSelectedGradeClassId] = useState<
    string | null
  >(null);
  const [selectedGradeClassName, setSelectedGradeClassName] = useState("");
  const [formValues, setFormValues] = useState<ProfileFormValues>({
    name: heroProfile.name,
    school: heroProfile.school,
    grade: heroProfile.grade,
    phone: heroProfile.phone,
    email: heroProfile.email,
    parentName: heroProfile.parentName,
    parentPhone: heroProfile.parentPhone,
  });

  const handleFieldChange =
    (field: keyof ProfileFormValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfile((prev) => ({
      ...prev,
      ...formValues,
    }));
    setEditOpen(false);
  };

  return (
    <div
      className={cn(
        notoSansKr.className,
        "min-h-screen bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors"
      )}
    >
      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-[color:var(--surface-text-muted)]">
          <a className="hover:text-primary" href="#">
            홈
          </a>
          <span>/</span>
          <span className="text-[color:var(--surface-text)] font-medium">
            마이페이지
          </span>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#1a2632]">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
              <div className="relative">
                <div
                  className="size-32 rounded-xl border-2 border-[color:var(--surface-border)] bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${profile.avatar})` }}
                />
                <span className="absolute -bottom-2 -right-2 rounded-full border border-[#191f26] bg-green-500 px-2 py-0.5 text-[10px] font-bold">
                  {profile.status}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h2
                  className={cn(
                    lexend.className,
                    "text-2xl font-bold text-[color:var(--surface-text)]"
                  )}
                >
                  {profile.name}
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-[#9dabb9] sm:justify-start">
                  <span className={iconClass("text-[16px]")}>school</span>
                  <span>{profile.school}</span>
                  <span className="h-1 w-1 rounded-full bg-[#283039]" />
                  <span>{profile.grade}</span>
                </div>
                <div className="mt-4 space-y-2 text-sm text-[color:var(--surface-text)]">
                  <DetailItem icon="smartphone" label={profile.phone} />
                  <DetailItem icon="mail" label={profile.email} />
                  <DetailItem
                    icon="family_restroom"
                    label={`학부모: ${profile.parentName}`}
                  />
                  <DetailItem
                    icon="call"
                    label={`학부모 연락처: ${profile.parentPhone}`}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex w-full flex-row gap-3 md:mt-0 md:w-auto md:flex-col">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-[color:var(--surface-border)] bg-[var(--surface-panel)] py-2.5 px-4 text-sm font-medium text-[color:var(--surface-text)] transition hover:bg-[var(--surface-border)]/40 md:w-40"
                onClick={() => {
                  setFormValues({
                    name: profile.name,
                    school: profile.school,
                    grade: profile.grade,
                    phone: profile.phone,
                    email: profile.email,
                    parentName: profile.parentName,
                    parentPhone: profile.parentPhone,
                  });
                  setEditOpen(true);
                }}
              >
                <span className={iconClass("text-[20px]")}>edit</span>내 정보
                수정
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-[color:var(--surface-border)] bg-[var(--surface-panel)] py-2.5 px-4 text-sm font-medium text-[color:var(--surface-text)] transition hover:bg-[var(--surface-border)]/40 md:w-40"
                onClick={() => setAttendanceOpen(true)}
              >
                <span className={iconClass("text-[20px]")}>calendar_today</span>
                출결상세
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-[color:var(--surface-border)] bg-[var(--surface-panel)] py-2.5 px-4 text-sm font-medium text-[color:var(--surface-text)] transition hover:bg-[var(--surface-border)]/40 md:w-40"
                onClick={() => setAttendanceRegisterOpen(true)}
              >
                <span className={iconClass("text-[20px]")}>edit_calendar</span>
                출결 등록
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {summaryStats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-xl border border-[#283039] bg-[#191f26] p-5 transition hover:border-primary/50"
            >
              <div className="flex items-center justify-between text-sm text-[#9dabb9]">
                <p>{stat.label}</p>
                <span className={iconClass("text-primary text-[20px]")}>
                  {stat.icon}
                </span>
              </div>
              <div className="mt-2 flex items-end gap-2">
                <p className="text-2xl font-bold text-white">
                  {stat.value}
                  {stat.subValue ? (
                    <span className="text-base font-normal text-[#9dabb9]">
                      {stat.subValue}
                    </span>
                  ) : null}
                </p>
                {stat.delta && stat.deltaIcon ? (
                  <p
                    className={cn(
                      "flex items-center text-xs font-medium",
                      stat.deltaColor
                    )}
                  >
                    <span className={iconClass("text-[14px] mr-1")}>
                      {stat.deltaIcon}
                    </span>
                    {stat.delta}
                  </p>
                ) : stat.subText ? (
                  <p className="mb-1.5 text-xs text-[#9dabb9]">
                    {stat.subText}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </section>
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <article className="rounded-xl border border-[#283039] bg-[#191f26] p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold">수강 중인 수업</h3>
                <span className="text-xs text-[#9dabb9]">
                  총 {classList.length}개
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {classList.map((klass) => (
                  <div
                    key={klass.id}
                    role={enableGradeView ? "button" : undefined}
                    tabIndex={enableGradeView ? 0 : -1}
                    onClick={() => {
                      if (!enableGradeView) return;
                      setSelectedGradeClassId(klass.id);
                      setSelectedGradeClassName(klass.name);
                    }}
                    onKeyDown={(event) => {
                      if (!enableGradeView) return;
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedGradeClassId(klass.id);
                        setSelectedGradeClassName(klass.name);
                      }
                    }}
                    className={cn(
                      "overflow-hidden rounded-2xl border border-[#2a3240] bg-[#1d2431] shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40",
                      enableGradeView && "cursor-pointer"
                    )}
                  >
                    <div className="relative h-28 overflow-hidden bg-gradient-to-br from-[#1a2233] via-[#203043] to-[#0f1726]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_60%)]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(99,102,241,0.2),_transparent_55%)]" />
                      <button
                        type="button"
                        className="absolute right-3 top-3 rounded-full bg-white/10 p-1.5 text-white/80 transition hover:bg-white/20"
                        aria-label="북마크"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <span className={iconClass("text-[18px]")}>
                          bookmark
                        </span>
                      </button>
                    </div>
                    <div className="space-y-3 p-4">
                      <div className="flex items-center justify-between text-xs text-[#9dabb9]">
                        <span>
                          {klass.subject} · {klass.level}
                        </span>
                        <span className="rounded-full border border-blue-500/30 px-2 py-0.5 text-[10px] font-semibold text-blue-200">
                          {klass.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-base font-semibold text-white">
                          {klass.name}
                        </p>
                        <p className="text-xs text-[#9dabb9]">
                          담당 {klass.teacher}
                        </p>
                      </div>
                      <div className="space-y-1 text-xs text-[#9dabb9]">
                        <div className="flex items-center gap-2">
                          <span
                            className={iconClass("text-[16px] text-blue-200")}
                          >
                            schedule
                          </span>
                          <span>
                            {klass.schedule.days.join("·")} ·{" "}
                            {klass.schedule.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={iconClass("text-[16px] text-blue-200")}
                          >
                            location_on
                          </span>
                          <span>{klass.schedule.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-[#283039] pt-4 text-center">
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  더보기
                  <span className={iconClass("text-[16px]")}>
                    arrow_forward
                  </span>
                </span>
              </div>
            </article>
            {enableGradeView && selectedGradeClassId ? (
              <article className="rounded-xl border border-[#283039] bg-[#191f26] p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-[#9dabb9]">성적 조회</p>
                    <h3 className="text-lg font-bold text-white">
                      {selectedGradeClassName}
                    </h3>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border border-[#283039] px-3 py-1.5 text-sm font-medium text-[#9dabb9] transition hover:border-primary hover:text-primary"
                    onClick={() => setSelectedGradeClassId(null)}
                  >
                    닫기
                  </button>
                </div>
                <div className="overflow-hidden rounded-xl border border-[#283039] bg-[var(--surface-background)]">
                  <StudentGradesDetail hideCourseSelect />
                </div>
              </article>
            ) : null}
          </div>
        </section>
      </main>
      {isEditOpen ? (
        <EditProfileModal
          values={formValues}
          onClose={() => setEditOpen(false)}
          onChange={handleFieldChange}
          onSubmit={handleSubmit}
        />
      ) : null}
      {isAttendanceOpen ? (
        <AttendanceModal
          records={attendanceRecords}
          onClose={() => setAttendanceOpen(false)}
        />
      ) : null}
      {isAttendanceRegisterOpen ? (
        <AttendanceRegisterModal
          onClose={() => setAttendanceRegisterOpen(false)}
          onSave={(record) => {
            setAttendanceRecords((prev) => [record, ...prev]);
            setAttendanceRegisterOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}

type EditProfileModalProps = {
  values: ProfileFormValues;
  onClose: () => void;
  onChange: (
    field: keyof ProfileFormValues
  ) => (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function EditProfileModal({
  values,
  onClose,
  onChange,
  onSubmit,
}: EditProfileModalProps) {
  const fields: Array<{
    label: string;
    field: keyof ProfileFormValues;
    placeholder: string;
  }> = [
    { label: "학생 이름", field: "name", placeholder: "이름을 입력하세요" },
    { label: "학교명", field: "school", placeholder: "예: 서울고등학교" },
    { label: "학년", field: "grade", placeholder: "예: 2학년" },
    { label: "연락처", field: "phone", placeholder: "예: 010-0000-0000" },
    { label: "이메일", field: "email", placeholder: "예: student@email.com" },
    { label: "학부모 성함", field: "parentName", placeholder: "예: 홍길순" },
    {
      label: "학부모 연락처",
      field: "parentPhone",
      placeholder: "예: 010-0000-0000",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-[#1a2632]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[color:var(--surface-text)]">
              내 정보 수정
            </h3>
            <p className="text-sm text-[color:var(--surface-text-muted)]">
              학생 정보를 최신 상태로 유지하세요.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-[color:var(--surface-text-muted)] transition hover:bg-[color:var(--surface-border)]/30"
            aria-label="모달 닫기"
            onClick={onClose}
          >
            <span className={iconClass("text-xl")}>close</span>
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          {fields.map(({ label, field, placeholder }) => (
            <label
              key={field}
              className="block text-sm font-medium text-[color:var(--surface-text)]"
            >
              {label}
              <input
                type="text"
                value={values[field]}
                onChange={onChange(field)}
                placeholder={placeholder}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[color:var(--surface-text)] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#111418]"
              />
            </label>
          ))}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-[color:var(--surface-text)] transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              취소
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

type AttendanceRecord = {
  date: string;
  status: string;
  note: string;
};

type AttendanceModalProps = {
  records: AttendanceRecord[];
  onClose: () => void;
};

function AttendanceModal({ records, onClose }: AttendanceModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-[#1a2632]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[color:var(--surface-text)]">
              출결상세
            </h3>
            <p className="text-sm text-[color:var(--surface-text-muted)]">
              최근 출결 현황을 확인하세요.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-[color:var(--surface-text-muted)] transition hover:bg-[color:var(--surface-border)]/30"
            aria-label="모달 닫기"
            onClick={onClose}
          >
            <span className={iconClass("text-xl")}>close</span>
          </button>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 dark:bg-slate-800/60 dark:text-slate-300">
                <tr>
                  <th className="px-6 py-3">수업 일자</th>
                  <th className="px-6 py-3">내용(결과)</th>
                  <th className="px-6 py-3">메모</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {records.map((record, index) => (
                  <tr
                    key={`${record.date}-${record.status}`}
                    className={cn(
                      "transition-colors",
                      index === 0
                        ? "bg-blue-50/60 dark:bg-blue-900/20"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    )}
                  >
                    <td className="px-6 py-4 font-medium text-[color:var(--surface-text)]">
                      {record.date}
                    </td>
                    <td className="px-6 py-4 text-[color:var(--surface-text)]">
                      {record.status}
                    </td>
                    <td className="px-6 py-4 text-[color:var(--surface-text-muted)]">
                      {record.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendanceRegisterModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (record: AttendanceRecord) => void;
}) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("출석");
  const [note, setNote] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-[#1a2632]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[color:var(--surface-text)]">
              출결 등록
            </h3>
            <p className="text-sm text-[color:var(--surface-text-muted)]">
              수업 출결 정보를 추가로 기록하세요.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-[color:var(--surface-text-muted)] transition hover:bg-[color:var(--surface-border)]/30"
            aria-label="모달 닫기"
            onClick={onClose}
          >
            <span className={iconClass("text-xl")}>close</span>
          </button>
        </div>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSave({
              date,
              status,
              note: note.trim() ? note : "-",
            });
          }}
        >
          <label className="block text-sm font-medium text-[color:var(--surface-text)]">
            수업 일자
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[color:var(--surface-text)] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#111418]"
            />
          </label>
          <label className="block text-sm font-medium text-[color:var(--surface-text)]">
            출결 상태
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[color:var(--surface-text)] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#111418]"
            >
              <option value="출석">출석</option>
              <option value="지각">지각</option>
              <option value="결석">결석</option>
              <option value="조퇴">조퇴</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-[color:var(--surface-text)]">
            메모
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="특이사항을 입력하세요."
              className="mt-1 min-h-[100px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[color:var(--surface-text)] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#111418]"
            />
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-[color:var(--surface-text)] transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              취소
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DetailItem({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-[color:var(--surface-text)]">
      <span className={iconClass("text-[18px] text-[#9dabb9]")}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}
