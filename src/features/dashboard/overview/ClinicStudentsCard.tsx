import type { ClinicStudent } from "@/features/dashboard/types";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

type ClinicStudentsCardProps = {
  students: ClinicStudent[];
};

export function ClinicStudentsCard({ students }: ClinicStudentsCardProps) {
  return (
    <section className="grid max-h-[320px] grid-rows-[auto,1fr] gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#1a2632]">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
          <span className={iconClass("text-orange-500")}>schedule</span>
          오늘 클리닉 예정 학생
        </h3>
      </div>
      <div className="custom-scrollbar space-y-2 overflow-y-auto pr-2">
        {students.map((student) => (
          <div
            key={student.name}
            className={cn(
              "flex items-center justify-between rounded-lg border px-3 py-2 text-sm",
              student.status === "완료"
                ? "border-transparent bg-slate-50/60 text-slate-400 dark:bg-slate-800/40"
                : "border-transparent bg-slate-50 dark:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-slate-200 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {student.name.charAt(0)}
              </div>
              <div>
                <p
                  className={cn(
                    "font-medium text-slate-900 dark:text-white",
                    student.status === "완료" &&
                      "line-through text-slate-400 dark:text-slate-500"
                  )}
                >
                  {student.name}
                  <span className="ml-1 text-xs font-normal text-slate-400">
                    | {student.subject}
                  </span>
                </p>
                <p className="text-xs text-slate-500">{student.time}</p>
              </div>
            </div>
            {student.status === "완료" ? (
              <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-600 dark:bg-green-900/30 dark:text-green-300">
                참석
              </span>
            ) : (
              <button className="rounded border border-primary/20 bg-primary/5 px-2 py-1 text-xs font-medium text-primary transition hover:bg-primary hover:text-white">
                입실
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
