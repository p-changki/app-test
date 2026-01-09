import { AssistantSubNav } from "@/components/layout/AssistantSubNav";
import { examSubNavLinks } from "@/constants/examSubNavLinks";
import { GradeReportModal } from "@/features/exam-dashboard/GradeReportModal";
import { AssignmentsTableSection } from "@/features/exam-dashboard/components/overview/AssignmentsTableSection";
import { FlaggedAssignmentsSection } from "@/features/exam-dashboard/components/overview/FlaggedAssignmentsSection";
import { StatsGrid } from "@/features/exam-dashboard/components/overview/StatsGrid";
import {
  assignmentRows,
  examStats,
  flaggedAssignments,
  tableFilters,
} from "@/data/exams";
import { lexend, notoSansKr } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export function ExamDashboardOverview() {
  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200"
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1
              className={cn(
                lexend.className,
                "text-3xl font-bold text-slate-900 dark:text-white"
              )}
            >
              시험 및 과제 관리
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              학생 평가를 생성, 채점 및 관리합니다.
            </p>
          </div>
        </header>
        <div className="flex justify-end gap-3">
          <AssistantSubNav
            activeHref="/exam-dashboard"
            links={examSubNavLinks}
            className="ml-auto"
          />
          <GradeReportModal />
        </div>
        <StatsGrid stats={examStats} />
        <FlaggedAssignmentsSection assignments={flaggedAssignments} />
        <AssignmentsTableSection filters={tableFilters} rows={assignmentRows} />
      </div>
    </div>
  );
}
