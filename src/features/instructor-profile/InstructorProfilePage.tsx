"use client";

import { useEffect, useState } from "react";

import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import type { InstructorSettings } from "@/lib/instructor-settings";
import {
  loadInstructorSettings,
  onInstructorSettingsChange,
  saveInstructorSettings,
} from "@/lib/instructor-settings";
import { cn } from "@/lib/utils";

const instructorProfile = {
  name: "김진수 강사",
  role: "대표 강사",
  team: "수학 교육팀 | 고등부 심화 담당",
  joinedAt: "2022-03-01",
  lastLogin: "2023-10-27 14:30",
  id: "jinsoo_math_01",
  email: "jinsoo@academy.com",
  phone: "010-1234-5678",
  status: "본인 인증 완료",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBCL11Jx-jmQJ7YOr0RyljFeMW0G3HnMSYH9qH-m7iUFGP7a1cH2FTnLji5NeFpn4NqAQrZP8Q0q1BOeQ4AN2GdYwG1vBe7b9AKQ3Q9kvh7yYxOS0QzKlj9rVh_p6mG5roG_S2i4P69yoC4b2q0dA_NvPq04KlNo5q6er8FYUgn4m-d0CYb8w8hIM4dLtQn2bG0hIlmI2FTI6n_4P7QG1U0Wggn5kN0o0WpRBQ1b9O8s-XT3iDWyy1gFqvZ4",
};

const assistantTeam = [
  { name: "이하늘 조교", role: "학습 지원", initials: "LH" },
  { name: "정민우 조교", role: "상담/관리", initials: "MW" },
  { name: "박서윤 조교", role: "시험 관리", initials: "SY" },
];

const classes = [
  {
    name: "수학 I 심화 A반",
    grade: "고등학교 2학년",
    room: "본관 402호",
    count: "24/30",
  },
  {
    name: "수학 II 선택 특강",
    grade: "고등학교 1학년",
    room: "본관 301호",
    count: "18/25",
  },
  {
    name: "킬러 문항 정복 (주말)",
    grade: "고등학교 3학년",
    room: "별관 102호",
    count: "42/50",
  },
];

export function InstructorProfilePage() {
  const [settings, setSettings] = useState<InstructorSettings>(() =>
    loadInstructorSettings()
  );
  const [isEditOpen, setEditOpen] = useState(false);
  const [editTab] = useState<"profile">("profile");

  useEffect(() => onInstructorSettingsChange(setSettings), []);

  const handleToggle = (key: keyof InstructorSettings) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveInstructorSettings(next);
      return next;
    });
  };

  return (
    <div
      className={cn(
        notoSansKr.className,
        "min-h-screen bg-[var(--surface-background)] text-[color:var(--surface-text)]"
      )}
    >
      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
        <section className="rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface-panel)] p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative">
                <div
                  className="size-20 rounded-full border-2 border-[color:var(--surface-border)] bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${instructorProfile.avatarUrl})`,
                  }}
                />
                <span className="absolute -bottom-2 -right-2 rounded-full border border-white bg-primary px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                  {instructorProfile.role}
                </span>
              </div>
              <div className="space-y-1">
                <h1
                  className={cn(
                    lexend.className,
                    "text-2xl font-bold text-[color:var(--surface-text)]"
                  )}
                >
                  {instructorProfile.name}
                </h1>
                <p className="text-sm font-medium text-primary">
                  {instructorProfile.team}
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-[color:var(--surface-text-muted)]">
                  <span className="flex items-center gap-1">
                    <span className={iconClass("text-[14px]")}>
                      calendar_today
                    </span>
                    입사일: {instructorProfile.joinedAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className={iconClass("text-[14px]")}>schedule</span>
                    최근 접속: {instructorProfile.lastLogin}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto md:items-center">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 sm:w-auto"
                onClick={() => setEditOpen(true)}
                aria-label={
                  editTab === "profile"
                    ? "프로필 수정 열기"
                    : "프로필 편집 열기"
                }
              >
                <span className={iconClass("text-[18px]")}>edit</span>
                프로필 수정
              </button>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl border border-[color:var(--surface-border)] bg-white p-6 shadow-sm dark:bg-[#1a2632]">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[color:var(--surface-text)]">
                  기본 정보
                </h2>
                <span className="text-xs font-semibold text-primary">
                  ID: {instructorProfile.id}
                </span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <InfoRow label="성함 (실명)" value={instructorProfile.name} />
                <InfoRow label="이메일 주소" value={instructorProfile.email} />
                <InfoRow label="휴대폰 번호" value={instructorProfile.phone} />
                <InfoRow label="인증 상태" value={instructorProfile.status} />
              </div>
              <button
                type="button"
                className="mt-4 text-xs font-semibold text-primary hover:underline"
              >
                번호 변경
              </button>
            </section>

            <section className="rounded-2xl border border-[color:var(--surface-border)] bg-white p-6 shadow-sm dark:bg-[#1a2632]">
              <h2 className="text-base font-bold text-[color:var(--surface-text)]">
                소속 및 담당 강의
              </h2>
              <div className="mt-4 rounded-xl border border-[color:var(--surface-border)] bg-[color:var(--surface-background)] p-4">
                <div className="flex items-center gap-3 text-sm font-semibold text-primary">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className={iconClass("text-[20px]")}>school</span>
                  </span>
                  CURRENT AFFILIATION
                </div>
                <p className="mt-2 text-sm font-semibold text-[color:var(--surface-text)]">
                  대치 프리미엄 수학 전문 학원 (본점)
                </p>
              </div>
              <div className="mt-6">
                <p className="text-sm font-semibold text-[color:var(--surface-text-muted)]">
                  현재 담당 클래스
                </p>
                <div className="mt-3 overflow-hidden rounded-xl border border-[color:var(--surface-border)]">
                  <div className="grid grid-cols-4 bg-[color:var(--surface-background)] px-4 py-2 text-xs font-semibold text-[color:var(--surface-text-muted)]">
                    <span>클래스명</span>
                    <span>대상</span>
                    <span>강의실</span>
                    <span className="text-right">인원</span>
                  </div>
                  <div className="divide-y divide-[color:var(--surface-border)]">
                    {classes.map((item) => (
                      <div
                        key={item.name}
                        className="grid grid-cols-4 px-4 py-3 text-sm text-[color:var(--surface-text)]"
                      >
                        <span className="font-semibold">{item.name}</span>
                        <span className="text-sm text-[color:var(--surface-text-muted)]">
                          {item.grade}
                        </span>
                        <span className="text-sm text-[color:var(--surface-text-muted)]">
                          {item.room}
                        </span>
                        <span className="text-right font-semibold">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-[color:var(--surface-border)] bg-white p-6 shadow-sm dark:bg-[#1a2632]">
              <h2 className="text-base font-bold text-[color:var(--surface-text)]">
                알림 및 채널 설정
              </h2>
              <p className="mt-1 text-xs text-[color:var(--surface-text-muted)]">
                강사 계정에 연결된 주요 알림 채널을 관리합니다.
              </p>
              <div className="mt-4 space-y-3">
                <SettingRow
                  label="앱 푸시 알림"
                  toggleOn={settings.pushEnabled}
                  onToggle={() => handleToggle("pushEnabled")}
                />
                <SettingRow
                  label="이메일 알림"
                  toggleOn={settings.emailEnabled}
                  onToggle={() => handleToggle("emailEnabled")}
                />
                <SettingRow label="SMS 발송 설정" actionLabel="연결" />
              </div>
            </section>
            <section className="rounded-2xl border border-[color:var(--surface-border)] bg-white p-6 shadow-sm dark:bg-[#1a2632]">
              <h2 className="text-base font-bold text-[color:var(--surface-text)]">
                함께 일하는 조교
              </h2>
              <div className="mt-4 space-y-3">
                {assistantTeam.map((assistant) => (
                  <div
                    key={assistant.name}
                    className="flex items-center justify-between rounded-xl border border-[color:var(--surface-border)] bg-[color:var(--surface-background)] px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {assistant.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[color:var(--surface-text)]">
                          {assistant.name}
                        </p>
                        <p className="text-xs text-[color:var(--surface-text-muted)]">
                          {assistant.role}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-lg border border-[color:var(--surface-border)] bg-white px-2 py-1 text-xs font-semibold text-[color:var(--surface-text-muted)]"
                    >
                      보기
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="w-full rounded-xl border border-dashed border-[color:var(--surface-border)] px-4 py-3 text-sm font-semibold text-primary"
                >
                  + 조교 추가 등록
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
      {isEditOpen ? (
        <InstructorProfileEditModal onClose={() => setEditOpen(false)} />
      ) : null}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[color:var(--surface-border)] bg-[color:var(--surface-background)] px-4 py-3">
      <p className="text-xs font-semibold text-[color:var(--surface-text-muted)]">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-[color:var(--surface-text)]">
        {value}
      </p>
    </div>
  );
}

function SettingRow({
  label,
  actionLabel,
  toggleOn,
  onToggle,
}: {
  label: string;
  actionLabel?: string;
  toggleOn?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[color:var(--surface-border)] bg-[color:var(--surface-background)] px-4 py-3">
      <span className="text-sm font-semibold text-[color:var(--surface-text)]">
        {label}
      </span>
      {actionLabel ? (
        <button
          type="button"
          className="rounded-lg border border-[color:var(--surface-border)] bg-white px-3 py-1 text-xs font-semibold text-[color:var(--surface-text-muted)]"
        >
          {actionLabel}
        </button>
      ) : (
        <button
          type="button"
          className={cn(
            "relative inline-flex h-5 w-9 items-center rounded-full transition",
            toggleOn ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
          )}
          onClick={onToggle}
          aria-pressed={toggleOn}
          aria-label={`${label} ${toggleOn ? "켜짐" : "꺼짐"}`}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 rounded-full bg-white shadow transition",
              toggleOn ? "translate-x-4" : "translate-x-1"
            )}
          />
        </button>
      )}
    </div>
  );
}

function InstructorProfileEditModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[color:var(--surface-border)] bg-white shadow-2xl dark:bg-[#101620]">
        <div className="flex items-start justify-between border-b border-[color:var(--surface-border)] px-6 py-5">
          <div>
            <h3 className="text-lg font-bold text-[color:var(--surface-text)]">
              프로필 및 학원 정보 수정
            </h3>
            <p className="mt-1 text-xs text-[color:var(--surface-text-muted)]">
              강사 프로필과 소속 학원의 최신 정보를 관리하세요.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-[color:var(--surface-text-muted)] transition hover:bg-[color:var(--surface-border)]/30"
            onClick={onClose}
            aria-label="프로필 수정 모달 닫기"
          >
            <span className={iconClass("text-lg")}>close</span>
          </button>
        </div>

        <div className="flex gap-6 border-b border-[color:var(--surface-border)] px-6">
          <span className="pb-3 pt-4 text-sm font-semibold text-primary">
            강사 프로필 수정
          </span>
        </div>

        <div className="max-h-[65vh] overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <div className="size-20 rounded-full border border-[color:var(--surface-border)] bg-slate-100" />
                <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-primary text-white">
                  <span className={iconClass("text-[14px]")}>photo_camera</span>
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[color:var(--surface-text)]">
                  프로필 사진
                </p>
                <p className="text-xs text-[color:var(--surface-text-muted)]">
                  권장 사이즈: 400x400px 이상, JPG, PNG 파일
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    사진 변경
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-[color:var(--surface-border)] px-3 py-1.5 text-xs font-semibold text-[color:var(--surface-text-muted)]"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <LabeledInput label="성함 (실명)" placeholder="김진수" />
              <LabeledInput label="담당 과목" placeholder="수학" />
              <div className="sm:col-span-2">
                <LabeledInput
                  label="소속 학원"
                  placeholder="고등부 심화 교육팀"
                />
              </div>
              <div className="sm:col-span-2">
                <LabeledTextarea
                  label="한 줄 소개"
                  placeholder="대치동 10년 경력, 학생들의 사고력을 확장시키는 수학 전문가 김진수입니다."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[color:var(--surface-border)] bg-[color:var(--surface-background)] px-6 py-4">
          <button
            type="button"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-[color:var(--surface-text-muted)] hover:text-[color:var(--surface-text)]"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            변경 사항 저장
          </button>
        </div>
      </div>
    </div>
  );
}

function LabeledInput({
  label,
  placeholder,
}: {
  label: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold text-[color:var(--surface-text)]">
      <span className="text-xs font-semibold text-[color:var(--surface-text-muted)]">
        {label}
      </span>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full rounded-lg border border-[color:var(--surface-border)] bg-[color:var(--surface-background)] px-3 py-2 text-sm text-[color:var(--surface-text)] outline-none transition focus:border-primary"
      />
    </label>
  );
}

function LabeledTextarea({
  label,
  placeholder,
}: {
  label: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold text-[color:var(--surface-text)]">
      <span className="text-xs font-semibold text-[color:var(--surface-text-muted)]">
        {label}
      </span>
      <textarea
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-lg border border-[color:var(--surface-border)] bg-[color:var(--surface-background)] px-3 py-2 text-sm text-[color:var(--surface-text)] outline-none transition focus:border-primary"
      />
    </label>
  );
}
