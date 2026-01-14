import Link from "next/link";

import { lexend } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

export function PageHeroSection() {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-1">
        <h1
          className={cn(
            lexend.className,
            "text-3xl font-bold text-black dark:text-white"
          )}
        >
          강사/조교 대시보드
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          오늘의 업무와 소통 현황을 한눈에 확인하세요.
        </p>
      </div>
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap md:w-auto md:justify-end">
        <QuickLink href="/class-management" icon="menu_book">
          수업 관리
        </QuickLink>
        <QuickLink href="/student-management" icon="groups">
          학생 관리
        </QuickLink>
        <QuickLink href="/exam-dashboard" icon="assignment">
          시험 현황
        </QuickLink>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-[#1a2632] dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
    >
      <span className={iconClass("text-[20px]")}>{icon}</span>
      {children}
    </Link>
  );
}
