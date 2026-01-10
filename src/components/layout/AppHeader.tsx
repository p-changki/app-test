"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { NavigationLinks } from "@/components/layout/NavigationLinks";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

const TOP_NAV_LINKS = [
  { label: "강사/조교 대시보드", href: "/dashboard" },
  { label: "학생/학부모 페이지", href: "/student-dashboard" },
];

const INSTRUCTOR_SUB_LINKS = [
  { label: "학생 관리", href: "/student-management" },
  { label: "수업 관리", href: "/class-management" },
  { label: "스케줄 관리", href: "/schedule-management" },
  { label: "문의 관리", href: "/inquiry-dashboard" },
  { label: "조교 센터", href: "/assistant-management" },
  { label: "시험 관리", href: "/exam-dashboard" },
  { label: "학습 자료실", href: "/learning-resources" },
];

const STUDENT_SUB_LINKS = [
  { label: "대시보드", href: "/student-dashboard" },
  { label: "프로필", href: "/student-profile" },
  { label: "출결", href: "/student-attendance" },
  { label: "나의 수업", href: "/student-classes" },
  { label: "문의 관리", href: "/student-inquiries" },
  { label: "성적 조회", href: "/student-grades" },
];

export function AppHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isStudentSection =
    pathname?.startsWith("/student-dashboard") ||
    pathname?.startsWith("/student-profile") ||
    pathname?.startsWith("/student-attendance") ||
    pathname?.startsWith("/student-classes") ||
    pathname?.startsWith("/student-grades") ||
    pathname?.startsWith("/student-inquiries");

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
    </header>
  );
}
