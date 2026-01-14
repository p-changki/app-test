"use client";

import { useMemo, useState } from "react";

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
  type ScheduleSlot,
  ScheduleSection,
} from "@/features/class-registration/components/sections/FormSections";
import {
  classRegistrationNavLinks,
  registrationBreadcrumbs,
  scheduleSlots,
} from "@/features/class-registration/data";

export function ClassRegistrationOverview() {
  const [formValues, setFormValues] = useState({
    title: "",
    subject: "",
    grade: "",
    startDate: "",
    assistant: "",
    status: "",
    description: "",
  });
  const [schedule, setSchedule] = useState<ScheduleSlot[]>(
    scheduleSlots.map((slot) => ({ ...slot }))
  );
  const [studentCounts, setStudentCounts] = useState({
    manual: 1,
    existing: 0,
  });

  const totalStudents = studentCounts.manual + studentCounts.existing;
  const scheduleLabel = useMemo(() => {
    if (schedule.length === 0) return "시간 미정";
    const dayLabels = Array.from(
      new Set(
        schedule
          .map((slot) => slot.day.replace("요일", "").trim())
          .filter(Boolean)
      )
    );
    const timeRange = schedule[0]
      ? `${schedule[0].start} - ${schedule[0].end}`
      : "시간 미정";
    return dayLabels.length
      ? `${dayLabels.join(", ")} ${timeRange}`
      : timeRange;
  }, [schedule]);

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
            <BasicInfoSection
              values={formValues}
              onChange={(field, value) =>
                setFormValues((prev) => ({ ...prev, [field]: value }))
              }
            />
            <LogisticsSection
              onCountsChange={(counts) => setStudentCounts(counts)}
            />
            <ScheduleSection
              slots={schedule}
              onChange={(id, field, value) =>
                setSchedule((prev) =>
                  prev.map((slot) =>
                    slot.id === id ? { ...slot, [field]: value } : slot
                  )
                )
              }
            />
            <DescriptionSection
              value={formValues.description}
              onChange={(value) =>
                setFormValues((prev) => ({ ...prev, description: value }))
              }
            />
          </div>
          <aside className="flex flex-col gap-6">
            <PreviewCard
              title={formValues.title}
              subject={formValues.subject}
              grade={formValues.grade}
              assistant={formValues.assistant}
              scheduleLabel={scheduleLabel}
              startDate={formValues.startDate}
              status={formValues.status}
              studentCount={totalStudents}
            />
            <HelperCard />
          </aside>
        </div>
        <div className="h-20" />
      </div>
    </div>
  );
}
