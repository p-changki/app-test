import type { ClinicScheduleSummary } from "@/features/dashboard/types";

type ClinicScheduleCardProps = {
  schedule: ClinicScheduleSummary;
};

const INTENSITY_CLASS: Record<
  ClinicScheduleSummary["segments"][number]["intensity"],
  string
> = {
  low: "bg-primary/30",
  medium: "bg-primary/40",
  high: "bg-primary/60",
};

export function ClinicScheduleCard({ schedule }: ClinicScheduleCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#1a2632]">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          클리닉 시간표
        </h3>
      </div>
      <div className="space-y-2 text-xs text-slate-400">
        <div className="flex justify-between px-1">
          {schedule.timeMarkers.map((time) => (
            <span key={time}>{time}</span>
          ))}
        </div>
        <div className="relative h-4 rounded-full bg-slate-100 dark:bg-slate-800">
          {schedule.segments.map((segment, index) => (
            <div
              key={`${segment.leftPercent}-${index}`}
              className={`absolute top-0 h-full rounded-full ${INTENSITY_CLASS[segment.intensity]}`}
              style={{
                left: `${segment.leftPercent}%`,
                width: `${segment.widthPercent}%`,
              }}
            />
          ))}
        </div>
        <p className="text-center text-slate-500">
          현재{" "}
          <span className="font-bold text-primary">
            {schedule.busiestRangeLabel}
          </span>{" "}
          시간대가 가장 혼잡합니다.
        </p>
      </div>
    </section>
  );
}
