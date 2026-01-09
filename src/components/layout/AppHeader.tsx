import Link from "next/link";

import { NavigationLinks } from "@/components/layout/NavigationLinks";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

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
  return (
    <header
      className="border-b text-sm shadow-sm backdrop-blur"
      style={{
        backgroundColor: "var(--surface-panel)",
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
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
