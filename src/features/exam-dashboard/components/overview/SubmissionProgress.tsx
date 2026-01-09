import { cn } from "@/lib/utils";

type SubmissionProgressProps = {
  submitted: string;
  progress: number;
};

export function SubmissionProgress({
  submitted,
  progress,
}: SubmissionProgressProps) {
  return (
    <div className="w-full max-w-[160px]">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-slate-600 dark:text-slate-400">{submitted}</span>
        <span
          className={cn(
            progress === 100
              ? "text-green-600"
              : progress === 0
                ? "text-slate-400"
                : "text-primary",
            "font-medium"
          )}
        >
          {progress}%
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={cn(
            "h-1.5 rounded-full",
            progress === 100
              ? "bg-green-500"
              : progress === 0
                ? "bg-slate-300 dark:bg-slate-600"
                : "bg-primary"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
