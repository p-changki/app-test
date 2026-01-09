"use client";

import Link from "next/link";
import { useState } from "react";

import { NavigationLinks } from "@/components/layout/NavigationLinks";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { iconClass } from "@/lib/icon-class";

const NAV_LINKS = [
  { label: "홈", href: "/dashboard" },
  { label: "학생 관리", href: "/student-management" },
  { label: "수업 관리", href: "/class-management" },
  { label: "스케줄 관리", href: "/schedule-management" },
  { label: "조교 센터", href: "/assistant-management" },
  { label: "시험 관리", href: "/exam-dashboard" },
  { label: "학습 자료실", href: "/learning-resources" },
];

export function AppHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="border-b bg-white text-sm shadow-sm dark:bg-slate-900"
      style={{
        borderColor: "var(--surface-border)",
        color: "var(--surface-text)",
      }}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/dashboard"
          className="text-base font-semibold transition-colors hover:text-primary"
          style={{ color: "var(--surface-text)" }}
        >
          EduTrack
        </Link>
        <NavigationLinks
          links={NAV_LINKS}
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
              links={NAV_LINKS}
              className="flex-col gap-4 text-base"
            />
          </div>
        </div>
      ) : null}
    </header>
  );
}
