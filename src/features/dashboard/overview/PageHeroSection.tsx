import { lexend } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export function PageHeroSection() {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-1">
        <h1
          className={cn(
            lexend.className,
            "text-3xl font-bold text-black dark:text-white"
          )}
        >
          강사/조교 대시보드
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          오늘의 업무와 소통 현황을 한눈에 확인하세요.
        </p>
      </div>
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap md:w-auto md:justify-end" />
    </div>
  );
}
