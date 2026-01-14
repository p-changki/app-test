import type { RetestScheduleItem } from "@/features/dashboard/types";
import { iconClass } from "@/lib/icon-class";

type RetestRequestsCardProps = {
  items: RetestScheduleItem[];
};

export function RetestRequestsCard({ items }: RetestRequestsCardProps) {
  return (
    <section className="rounded-xl border border-rose-100 bg-gradient-to-br from-rose-50 to-white p-5 shadow-sm dark:border-rose-900/30 dark:from-rose-900/10 dark:to-[#1a2632]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <span className={iconClass("text-rose-500")}>event</span>
          클리닉
        </h3>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-rose-100 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm dark:border-rose-900/20 dark:bg-[#131d27] dark:text-white"
          >
            {item.dateLabel} - [{item.groupLabel}] {item.title} ({item.count}명)
          </div>
        ))}
      </div>
    </section>
  );
}
