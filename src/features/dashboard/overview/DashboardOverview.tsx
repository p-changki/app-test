import { notoSansKr } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { ClinicScheduleCard } from "@/features/dashboard/overview/ClinicScheduleCard";
import { ClinicStudentsCard } from "@/features/dashboard/overview/ClinicStudentsCard";
import { InquiryTable } from "@/features/dashboard/overview/InquiryTable";
import { PageHeroSection } from "@/features/dashboard/overview/PageHeroSection";
import { RetestRequestsCard } from "@/features/dashboard/overview/RetestRequestsCard";
import { SummaryCardsSection } from "@/features/dashboard/overview/SummaryCardsSection";
import { TaskTable } from "@/features/dashboard/overview/TaskTable";
import { TodayClassesCard } from "@/features/dashboard/overview/TodayClassesCard";
import {
  clinicScheduleSummary,
  clinicStudents,
  dashboardInquiryRows,
  dashboardSummaryCards,
  dashboardTaskRows,
  retestRequests,
  todaysClassSessions,
} from "@/features/dashboard/overview/data";

export function DashboardOverview() {
  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200"
      )}
    >
      <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <PageHeroSection />
        <SummaryCardsSection cards={dashboardSummaryCards} />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="space-y-6 xl:col-span-8">
            <InquiryTable rows={dashboardInquiryRows} />
            <TaskTable tasks={dashboardTaskRows} />
          </div>
          <div className="space-y-6 xl:col-span-4">
            <TodayClassesCard sessions={todaysClassSessions} />
            <ClinicStudentsCard students={clinicStudents} />
            <ClinicScheduleCard schedule={clinicScheduleSummary} />
            <RetestRequestsCard requests={retestRequests} />
          </div>
        </div>
      </main>
    </div>
  );
}
