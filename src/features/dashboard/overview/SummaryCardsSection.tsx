import type { DashboardSummaryCard } from "@/features/dashboard/types";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

type SummaryCardsSectionProps = {
  cards: DashboardSummaryCard[];
};

export function SummaryCardsSection({ cards }: SummaryCardsSectionProps) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.title}
          className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#1a2632]"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {card.title}
            </p>
            <span
              className={cn(
                iconClass("rounded-lg p-1.5 text-[20px]"),
                card.iconClassName
              )}
            >
              {card.icon}
            </span>
          </div>
          <div className="mt-2 flex items-end gap-2">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {card.value}
            </p>
            {card.delta ? (
              <span
                className={cn(
                  "text-xs font-medium",
                  card.deltaVariant === "positive"
                    ? "rounded bg-green-50 px-1.5 py-0.5 text-green-600 dark:bg-green-900/30 dark:text-green-300"
                    : card.deltaVariant === "negative"
                      ? "text-rose-500"
                      : "text-slate-400"
                )}
              >
                {card.delta}
              </span>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
