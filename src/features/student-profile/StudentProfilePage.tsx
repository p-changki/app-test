"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

import { classEntities } from "@/data/classes";
import { retestRequests } from "@/data/examRetest";
import {
  CourseEnrollmentModal,
  EnrollmentConfirmModal,
} from "@/features/student-profile/components/CourseEnrollmentModals";
import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

type ProfileFormValues = {
  name: string;
  school: string;
  grade: string;
  studentId: string;
  phone: string;
  email: string;
  parentName: string;
  parentPhone: string;
};

const heroProfile: ProfileFormValues & { status: string; avatar: string } = {
  name: "김민준",
  school: "서울고등학교",
  grade: "2학년",
  studentId: "학번: 20230501",
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
    label: "나의 평균 점수",
    value: "90.5",
    icon: "analytics",
    delta: "2.5% 상승",
    deltaColor: "text-green-500",
    deltaIcon: "trending_up",
  },
  {
    label: "나의 석차",
    value: "상위 5%",
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

const subjectScores = [
  {
    subject: "수학",
    subtitle: "미적분 II",
    icon: "calculate",
    iconClasses: "bg-blue-500/20 text-blue-400",
    score: 92,
  },
  {
    subject: "영어",
    subtitle: "심화 작문",
    icon: "language",
    iconClasses: "bg-purple-500/20 text-purple-400",
    score: 88,
  },
  {
    subject: "과학",
    subtitle: "물리 I",
    icon: "science",
    iconClasses: "bg-teal-500/20 text-teal-400",
    score: 95,
  },
];

type DayStatus = "muted" | "default" | "present" | "tardy";

const calendarDays: Array<{ label: string; status: DayStatus }> = [
  { label: "28", status: "muted" },
  { label: "29", status: "muted" },
  { label: "30", status: "muted" },
  { label: "1", status: "present" },
  { label: "2", status: "present" },
  { label: "3", status: "present" },
  { label: "4", status: "default" },
  { label: "5", status: "present" },
  { label: "6", status: "tardy" },
  { label: "7", status: "present" },
  { label: "8", status: "present" },
  { label: "9", status: "present" },
  { label: "10", status: "default" },
  { label: "11", status: "default" },
];

const calendarWeekdays = ["월", "화", "수", "목", "금", "토", "일"];

const calendarStatusStyles: Record<DayStatus, string> = {
  muted: "bg-[var(--surface-panel)] text-slate-400 opacity-50",
  default: "bg-[var(--surface-panel)] text-[color:var(--surface-text-muted)]",
  present:
    "bg-green-900/40 border border-green-500/30 text-white font-medium relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:size-1 after:rounded-full after:bg-green-500",
  tardy:
    "bg-yellow-900/40 border border-yellow-500/30 text-white font-medium relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:size-1 after:rounded-full after:bg-yellow-500",
};

const studentRetests = retestRequests.slice(0, 3);

export function StudentProfilePage() {
  const [profile, setProfile] = useState(heroProfile);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isEnrollmentOpen, setEnrollmentOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<ProfileFormValues>({
    name: heroProfile.name,
    school: heroProfile.school,
    grade: heroProfile.grade,
    studentId: heroProfile.studentId,
    phone: heroProfile.phone,
    email: heroProfile.email,
    parentName: heroProfile.parentName,
    parentPhone: heroProfile.parentPhone,
  });
  const [subjectFilter, setSubjectFilter] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");

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

  const uniqueSubjects = [
    "전체",
    ...new Set(classEntities.map((klass) => klass.subject)),
  ];
  const filteredClasses = classEntities.filter((klass) => {
    const matchesSubject =
      subjectFilter === "전체" || klass.subject === subjectFilter;
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      term.length === 0 ||
      klass.name.toLowerCase().includes(term) ||
      klass.teacher.toLowerCase().includes(term);
    return matchesSubject && matchesSearch;
  });

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
                  <span className="h-1 w-1 rounded-full bg-[#283039]" />
                  <span>{profile.studentId}</span>
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
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 px-4 text-sm font-medium text-white shadow-lg shadow-primary/20 transition hover:bg-blue-600 md:w-40"
                onClick={() => setEnrollmentOpen(true)}
              >
                <span className={iconClass("text-[20px]")}>add_circle</span>
                수강신청
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-[color:var(--surface-border)] bg-[var(--surface-panel)] py-2.5 px-4 text-sm font-medium text-[color:var(--surface-text)] transition hover:bg-[var(--surface-border)]/40 md:w-40"
                onClick={() => {
                  setFormValues({
                    name: profile.name,
                    school: profile.school,
                    grade: profile.grade,
                    studentId: profile.studentId,
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

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <article className="rounded-xl border border-[#283039] bg-[#191f26] p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold">과목별 성적 현황</h3>
                <select className="rounded-md border-none bg-[#283039] px-3 py-1.5 text-xs text-white focus:ring-1 focus:ring-primary">
                  <option>2023년 2학기</option>
                  <option>2023년 1학기</option>
                </select>
              </div>
              <div className="space-y-6">
                {subjectScores.map((subject) => (
                  <div key={subject.subject} className="space-y-2">
                    <div className="flex items-end justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn("rounded p-1.5", subject.iconClasses)}
                        >
                          <span className={iconClass("text-[18px]")}>
                            {subject.icon}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {subject.subject}
                          </p>
                          <p className="text-xs text-[#9dabb9]">
                            {subject.subtitle}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold">
                          {subject.score}
                        </span>
                        <span className="text-xs text-[#9dabb9]">/ 100</span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#283039]">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${subject.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-[#283039] pt-4 text-center">
                <button className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-blue-400">
                  전체 성적표 보기
                  <span className={iconClass("text-[16px]")}>
                    arrow_forward
                  </span>
                </button>
              </div>
            </article>

            <article className="rounded-xl border border-[#283039] bg-[#191f26] p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold">최근 출결 현황</h3>
                <div className="flex gap-3 text-xs text-[#9dabb9]">
                  <Legend dotClass="bg-green-500" label="출석" />
                  <Legend dotClass="bg-yellow-500" label="지각" />
                  <Legend dotClass="bg-red-500" label="결석" />
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-xs text-[#9dabb9]">
                {calendarWeekdays.map((day) => (
                  <span key={day} className="pb-2">
                    {day}
                  </span>
                ))}
                {calendarDays.map((day) => (
                  <div
                    key={day.label}
                    className={cn(
                      "flex h-10 items-center justify-center rounded border border-transparent text-xs",
                      calendarStatusStyles[day.status] ?? ""
                    )}
                  >
                    {day.label}
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-[#283039] p-3 text-sm text-[#9dabb9]">
                <div className="flex items-start gap-2">
                  <span className={iconClass("text-yellow-500 text-[20px]")}>
                    info
                  </span>
                  <div>
                    <p className="font-medium text-white">지각 알림</p>
                    <p className="text-xs">
                      10월 6일 15분 지각 (사유: 대중교통 지연)
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div className="flex flex-col gap-6">
            <article className="rounded-xl border border-[#283039] bg-[#191f26] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">재시험 일정</h3>
                <button className="text-xs font-medium text-primary hover:text-white">
                  전체 보기
                </button>
              </div>
              <div className="space-y-4">
                {studentRetests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-xl border border-[#283039] bg-[#283039] p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {request.subject}
                        </p>
                        <p className="text-xs text-[#9dabb9]">
                          {request.classLabel} · 담당 {request.teacher}
                        </p>
                      </div>
                      <span className="rounded-full border border-red-500/30 px-2 py-0.5 text-xs font-semibold text-red-300">
                        {request.statusLabel}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 rounded-lg bg-[#191f26] p-3 text-xs text-[#9dabb9] sm:grid-cols-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-wide">
                          선호 일정
                        </span>
                        <p className="font-medium text-white">
                          {request.preferredTime}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wide">
                          장소
                        </span>
                        <p className="font-medium text-white">
                          {request.location}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-[#9dabb9] line-clamp-2">
                      {request.reason}
                    </p>
                  </div>
                ))}
              </div>
            </article>
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
      {isEnrollmentOpen ? (
        <CourseEnrollmentModal
          classes={filteredClasses}
          subjects={uniqueSubjects}
          subjectFilter={subjectFilter}
          onSubjectChange={setSubjectFilter}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedClassId={selectedClassId}
          onSelectClass={setSelectedClassId}
          onClose={() => setEnrollmentOpen(false)}
          onConfirm={() => setConfirmOpen(true)}
        />
      ) : null}
      {isConfirmOpen ? (
        <EnrollmentConfirmModal
          selectedClass={classEntities.find(
            (klass) => klass.id === selectedClassId
          )}
          onClose={() => setConfirmOpen(false)}
          onConfirm={() => {
            setConfirmOpen(false);
            setEnrollmentOpen(false);
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
    { label: "학번", field: "studentId", placeholder: "예: 20230501" },
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

function DetailItem({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-[color:var(--surface-text)]">
      <span className={iconClass("text-[18px] text-[#9dabb9]")}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function Legend({ dotClass, label }: { dotClass: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("size-2.5 rounded-full", dotClass)} />
      <span>{label}</span>
    </span>
  );
}
