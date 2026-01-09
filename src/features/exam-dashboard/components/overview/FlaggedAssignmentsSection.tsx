import type { FlaggedAssignment } from "@/types/exams";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

type FlaggedAssignmentsSectionProps = {
  assignments: FlaggedAssignment[];
};

export function FlaggedAssignmentsSection({
  assignments,
}: FlaggedAssignmentsSectionProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          <span className={cn(iconClass("text-rose-500"))}>error</span>
          확인 필요: 미통과 과제/시험
        </h3>
        <a
          href="#"
          className="flex items-center gap-1 text-sm text-slate-500 transition hover:text-primary dark:text-slate-400"
        >
          전체 보기 <span className={iconClass("text-sm")}>arrow_forward</span>
        </a>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assignments.map((assignment) => (
          <article
            key={assignment.id}
            className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-[var(--surface-background)] p-4 shadow-sm transition hover:shadow-md dark:border-rose-900/50 dark:bg-[var(--surface-background)]"
          >
            <div className="flex items-start gap-3">
              <div
                className="size-12 shrink-0 rounded-full border border-slate-100 bg-cover bg-center dark:border-slate-700"
                style={{ backgroundImage: `url("${assignment.avatar}")` }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between">
                  <p className="truncate text-base font-bold text-slate-900 dark:text-white">
                    {assignment.student}
                  </p>
                  <span className="rounded px-1.5 py-0.5 text-xs text-slate-400">
                    {assignment.timestamp}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">
                  {assignment.assignment}
                </p>
                <span className="mt-2 inline-block rounded border border-rose-100 bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-600 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400">
                  {assignment.scoreLabel}
                </span>
              </div>
            </div>
            <div className="flex gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <button
                type="button"
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition",
                  assignment.primaryAction.variant === "primary"
                    ? "bg-rose-600 text-white hover:bg-rose-700"
                    : assignment.primaryAction.variant === "secondary"
                      ? "border border-rose-200 bg-[var(--surface-background)] text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:bg-[var(--surface-background)] dark:text-rose-300 dark:hover:bg-slate-800"
                      : "border border-slate-200 bg-[var(--surface-background)] text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[var(--surface-background)] dark:text-slate-300"
                )}
              >
                <span className={iconClass("text-lg")}>
                  {assignment.primaryAction.icon}
                </span>
                {assignment.primaryAction.label}
              </button>
              <button
                type="button"
                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <span className={iconClass()}>{assignment.secondaryIcon}</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
