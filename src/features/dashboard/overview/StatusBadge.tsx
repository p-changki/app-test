import type { InquiryStatusVariant } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  label: string;
  variant: InquiryStatusVariant;
};

const STYLES: Record<InquiryStatusVariant, string> = {
  pending:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  progress: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-200",
  done: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  primary: "bg-primary/10 text-primary",
  neutral: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  success:
    "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300",
};

export function StatusBadge({ label, variant }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium",
        STYLES[variant]
      )}
    >
      {variant === "pending" && (
        <span className="size-1.5 rounded-full bg-amber-500" />
      )}
      {variant === "progress" && (
        <span className="size-1.5 rounded-full bg-primary" />
      )}
      {variant === "success" && (
        <span className="size-1.5 rounded-full bg-green-500" />
      )}
      {label}
    </span>
  );
}
