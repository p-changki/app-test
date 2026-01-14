import { lexend } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export function ExamRegistrationHeader({
  totalQuestions,
  totalScore,
}: {
  totalQuestions: number;
  totalScore: number;
}) {
  return (
    <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
      <div className="flex-1 space-y-2">
        <h1
          className={cn(
            lexend.className,
            "text-3xl font-black text-slate-900 dark:text-white md:text-4xl"
          )}
        >
          시험 등록/수정
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400">
          시험지를 등록하고 문항별 상세 정답 및 배점을 설정합니다. 등록된 정보는
          성적표 생성 및 성적 분석에 활용됩니다.
        </p>
      </div>
      <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
        <StatCard
          label="등록된 문항"
          value={String(totalQuestions)}
          suffix="문항"
        />
        <StatCard label="총점" value={String(totalScore)} suffix="점" accent />
      </div>
    </header>
  );
}

function StatCard({
  label,
  value,
  suffix,
  accent,
}: {
  label: string;
  value: string;
  suffix: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-slate-200 bg-[var(--surface-background)] p-4 shadow-sm dark:border-slate-700 dark:bg-[var(--surface-background)]">
      <span className="mb-1 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span
        className={cn(
          "font-display text-3xl font-bold",
          accent ? "text-primary" : "text-slate-900 dark:text-white"
        )}
      >
        {value}
        <span className="ml-1 text-lg font-normal text-slate-400">
          {suffix}
        </span>
      </span>
    </div>
  );
}
