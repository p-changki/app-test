import { AssistantSubNav } from "@/components/layout/AssistantSubNav";
import { notoSansKr } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { ClassRegistrationHeader } from "@/features/class-registration/components/PageHeader";
import { RegistrationBreadcrumbs } from "@/features/class-registration/components/RegistrationBreadcrumbs";
import {
  HelperCard,
  PreviewCard,
} from "@/features/class-registration/components/SidePanels";
import {
  BasicInfoSection,
  DescriptionSection,
  LogisticsSection,
  ScheduleSection,
} from "@/features/class-registration/components/sections/FormSections";
import {
  classRegistrationNavLinks,
  registrationBreadcrumbs,
} from "@/features/class-registration/data";

export function ClassRegistrationOverview() {
  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200"
      )}
    >
      <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-[1200px] flex-col px-4 py-6 md:px-8 lg:px-10">
        <RegistrationBreadcrumbs items={registrationBreadcrumbs} />
        <AssistantSubNav
          activeHref="/class-registration"
          links={classRegistrationNavLinks}
          className="mb-6"
        />
        <ClassRegistrationHeader />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <BasicInfoSection />
            <LogisticsSection />
            <ScheduleSection />
            <DescriptionSection />
          </div>
          <aside className="flex flex-col gap-6">
            <PreviewCard />
            <HelperCard />
          </aside>
        </div>
        <div className="h-20" />
      </div>
    </div>
  );
}
