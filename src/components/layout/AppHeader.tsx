"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { NavigationLinks } from "@/components/layout/NavigationLinks";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { iconClass } from "@/lib/icon-class";
import type { InstructorSettings } from "@/lib/instructor-settings";
import {
  loadInstructorSettings,
  onInstructorSettingsChange,
  saveInstructorSettings,
} from "@/lib/instructor-settings";
import { cn } from "@/lib/utils";

const TOP_NAV_LINKS = [
  { label: "강사/조교 대시보드", href: "/dashboard" },
  { label: "학생/학부모 페이지", href: "/student-dashboard" },
];

const INSTRUCTOR_SUB_LINKS = [
  { label: "학생 관리", href: "/student-management" },
  { label: "수업 관리", href: "/class-management" },
  { label: "스케줄 관리", href: "/schedule-management" },
  { label: "소통", href: "/inquiry-dashboard" },
  { label: "조교 센터", href: "/assistant-management" },
  { label: "시험 관리", href: "/exam-dashboard" },
  { label: "학습 자료실", href: "/learning-resources" },
];

const STUDENT_SUB_LINKS = [
  { label: "대시보드", href: "/student-dashboard" },
  { label: "프로필", href: "/student-profile" },
  { label: "수업 스케줄", href: "/student-classes" },
  { label: "소통", href: "/student-inquiries" },
  { label: "성적 조회", href: "/student-grades" },
];

export function AppHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<InstructorSettings>(() =>
    loadInstructorSettings()
  );
  const pathname = usePathname();
  const isStudentSection =
    pathname?.startsWith("/student-dashboard") ||
    pathname?.startsWith("/student-profile") ||
    pathname?.startsWith("/student-classes") ||
    pathname?.startsWith("/student-grades") ||
    pathname?.startsWith("/student-inquiries");

  useEffect(() => onInstructorSettingsChange(setSettings), []);

  const handleToggle = (key: keyof InstructorSettings) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveInstructorSettings(next);
      return next;
    });
  };

  return (
    <header
      className={cn(
        "border-b bg-[var(--surface-panel)] text-sm shadow-sm dark:bg-slate-900",
        isStudentSection
          ? "border-transparent"
          : "border-[color:var(--surface-border)]"
      )}
    >
      <div className="border-b border-[color:var(--surface-border)]">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <Link
            href="/dashboard"
            className="text-base font-semibold transition-colors hover:text-primary"
            style={{ color: "var(--surface-text)" }}
          >
            EduTrack
          </Link>
          <NavigationLinks
            links={TOP_NAV_LINKS}
            className="hidden flex-1 justify-center md:flex"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg border border-transparent p-2 text-[color:var(--surface-text)] transition hover:border-[color:var(--surface-border)] hover:bg-[color:var(--surface-background)]"
              aria-label="알림"
            >
              <span className={iconClass("text-[20px]")}>notifications</span>
            </button>
            <button
              type="button"
              className="rounded-lg border border-transparent p-2 text-[color:var(--surface-text)] transition hover:border-[color:var(--surface-border)] hover:bg-[color:var(--surface-background)]"
              aria-label="설정"
              onClick={() => setSettingsOpen(true)}
            >
              <span className={iconClass("text-[20px]")}>settings</span>
            </button>
            <Link
              href="/instructor-profile"
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[color:var(--surface-border)] bg-slate-100 text-sm font-semibold text-slate-600 transition hover:border-primary/50 hover:text-primary dark:bg-slate-800 dark:text-slate-200"
              aria-label="강사 프로필로 이동"
            >
              HK
            </Link>
            <ThemeToggle />
            <button
              type="button"
              className="rounded-lg border border-transparent p-2 text-[color:var(--surface-text)] transition hover:border-[color:var(--surface-border)] md:hidden"
              aria-label="메뉴 열기"
              onClick={() => setMobileOpen(true)}
            >
              <span className={iconClass("text-[20px]")}>menu</span>
            </button>
          </div>
        </div>
      </div>
      {isStudentSection ? (
        <div className="border-t border-transparent bg-[var(--surface-background)]">
          <div className="mx-auto flex w-full max-w-6xl items-center gap-4 overflow-x-auto px-4 py-2 text-xs">
            {STUDENT_SUB_LINKS.map((link) => {
              const isActive =
                pathname === link.href || pathname?.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-3 py-1 font-medium transition",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-[color:var(--surface-text-muted)] hover:text-primary"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="border-t border-transparent bg-[var(--surface-background)]">
          <div className="mx-auto flex w-full max-w-6xl items-center gap-4 overflow-x-auto px-4 py-2 text-xs">
            {INSTRUCTOR_SUB_LINKS.map((link) => {
              const isActive =
                pathname === link.href || pathname?.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-3 py-1 font-medium transition",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-[color:var(--surface-text-muted)] hover:text-primary"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 flex items-start justify-end md:hidden">
          <button
            type="button"
            aria-label="모바일 메뉴 닫기"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full w-80 max-w-full translate-y-0 border-l border-[var(--surface-border)] bg-white p-6 text-slate-900 shadow-2xl transition-transform dark:bg-slate-900 dark:text-white">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-base font-semibold">메뉴</p>
              <button
                type="button"
                aria-label="모바일 메뉴 닫기"
                className="rounded-full p-2 text-[color:var(--surface-text)] transition hover:bg-[color:var(--surface-border)]/20"
                onClick={() => setMobileOpen(false)}
              >
                <span className={iconClass("text-[22px]")}>close</span>
              </button>
            </div>
            <NavigationLinks
              links={TOP_NAV_LINKS}
              className="flex-col gap-4 text-base"
            />
            <div className="mt-6 space-y-4 text-sm">
              <div>
                <p className="mb-2 text-xs font-semibold text-[color:var(--surface-text-muted)]">
                  강사/조교 섹션
                </p>
                <div className="flex flex-col gap-2">
                  {INSTRUCTOR_SUB_LINKS.map((link) => (
                    <Link
                      key={`mobile-instructor-${link.href}`}
                      href={link.href}
                      className={cn(
                        "rounded-lg px-3 py-2",
                        pathname === link.href ||
                          pathname?.startsWith(`${link.href}/`)
                          ? "bg-primary/10 text-primary"
                          : "text-[color:var(--surface-text)] hover:bg-[color:var(--surface-border)]/30"
                      )}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold text-[color:var(--surface-text-muted)]">
                  학생 섹션
                </p>
                <div className="flex flex-col gap-2">
                  {STUDENT_SUB_LINKS.map((link) => (
                    <Link
                      key={`mobile-student-${link.href}`}
                      href={link.href}
                      className={cn(
                        "rounded-lg px-3 py-2",
                        pathname === link.href ||
                          pathname?.startsWith(`${link.href}/`)
                          ? "bg-primary/10 text-primary"
                          : "text-[color:var(--surface-text)] hover:bg-[color:var(--surface-border)]/30"
                      )}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {settingsOpen ? (
        <SettingsModal
          settings={settings}
          onToggle={handleToggle}
          onClose={() => setSettingsOpen(false)}
        />
      ) : null}
    </header>
  );
}

function SettingsModal({
  settings,
  onToggle,
  onClose,
}: {
  settings: InstructorSettings;
  onToggle: (key: keyof InstructorSettings) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[color:var(--surface-border)] bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-[color:var(--surface-border)] px-6 py-4">
          <div>
            <p className="text-xs font-semibold text-[color:var(--surface-text-muted)]">
              강사 설정
            </p>
            <h3 className="text-lg font-bold text-[color:var(--surface-text)]">
              설정 및 보안
            </h3>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-[color:var(--surface-text-muted)] transition hover:bg-[color:var(--surface-border)]/30"
            onClick={onClose}
            aria-label="설정 모달 닫기"
          >
            <span className={iconClass("text-lg")}>close</span>
          </button>
        </div>
        <div className="space-y-3 px-6 py-5">
          <SettingRow label="비밀번호 관리" actionLabel="변경" />
          <SettingRow
            label="푸시 알림 수신"
            toggleOn={settings.pushEnabled}
            onToggle={() => onToggle("pushEnabled")}
          />
          <SettingRow
            label="이메일 알림 수신"
            toggleOn={settings.emailEnabled}
            onToggle={() => onToggle("emailEnabled")}
          />
        </div>
      </div>
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
