"use client";

import { GradeReportContent } from "@/features/exam-dashboard/GradeReportModal";
import { notoSansKr } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export function GradeReportPage() {
  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200"
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <GradeReportContent variant="page" />
      </div>
    </div>
  );
}
