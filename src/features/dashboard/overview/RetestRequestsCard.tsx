import type { RetestRequest } from "@/features/dashboard/types";
import { iconClass } from "@/lib/icon-class";

type RetestRequestsCardProps = {
  requests: RetestRequest[];
};

export function RetestRequestsCard({ requests }: RetestRequestsCardProps) {
  return (
    <section className="rounded-xl border border-rose-100 bg-gradient-to-br from-rose-50 to-white p-5 shadow-sm dark:border-rose-900/30 dark:from-rose-900/10 dark:to-[#1a2632]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <span className={iconClass("text-rose-500")}>warning</span>
          재시험 요청 학생
        </h3>
        <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
          {requests.length}
        </span>
      </div>
      <div className="space-y-3">
        {requests.map((student) => (
          <div
            key={student.name}
            className="flex items-center justify-between rounded-lg border border-rose-100 bg-white p-3 shadow-sm dark:border-rose-900/20 dark:bg-[#131d27]"
          >
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {student.name} ({student.grade})
              </p>
              <p className="text-xs font-medium text-rose-500">
                {student.reason}
              </p>
            </div>
            <div className="flex gap-1">
              <button className="rounded bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600">
                <span className={iconClass("text-[18px]")}>close</span>
              </button>
              <button className="rounded bg-primary p-1.5 text-white hover:bg-primary/90">
                <span className={iconClass("text-[18px]")}>check</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
