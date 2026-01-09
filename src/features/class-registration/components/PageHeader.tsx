import { iconClass } from "@/lib/icon-class";
import { lexend } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export function ClassRegistrationHeader() {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h1
          className={cn(
            lexend.className,
            "text-3xl font-black text-slate-900 dark:text-white md:text-4xl"
          )}
        >
          수업 등록/개설
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400">
          새로운 강의를 생성하고 수강생을 모집하세요.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          className="flex min-w-[84px] items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-white dark:hover:bg-slate-800"
        >
          취소
        </button>
        <button
          type="button"
          className="flex min-w-[84px] items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition hover:bg-[#1a6bbd]"
        >
          <span className={iconClass("text-[18px]")}>save</span>
          저장 및 게시
        </button>
      </div>
    </div>
  );
}
