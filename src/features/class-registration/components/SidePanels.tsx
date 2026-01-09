import { iconClass } from "@/lib/icon-class";

export function PreviewCard() {
  return (
    <div className="sticky top-24">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        미리보기 (Preview)
      </h3>
      <div className="flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl dark:border-slate-700 dark:bg-[#1e2630]">
        <div
          className="relative aspect-video w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://lh3.googleusercontent.com/aida-public/AB6AXuAwH0qY7PMoymk-agWEo0Gv6b9nWvvFSd5iNFWbO6u3JhckE2PbFt7eVM4tRVRTb7oC_tq_rBKL3yuKzWddhHzaMKuNO_FBbxhifUjKc7_oVJewbG4OBmGjTrgblCfgxwkm2dj_SYHhHgwgNA32sREMPvvYyZPTTQSaQi-Vj-eQe9XsZp5M7D70YHy4rKOkj--6RTaYmAffVKZL17MKcXuN_gCTW8MfrUG91oBDuQuv_i1Zn29h2obxIXJFo04jfIlPtmPZAD2Cek0)",
          }}
        >
          <span className="absolute left-3 top-3 rounded bg-white/90 px-2 py-1 text-xs font-bold text-slate-900 dark:bg-black/60 dark:text-white">
            모집중
          </span>
          <span className="absolute right-3 top-3 rounded-full bg-primary p-1.5 text-white shadow-lg">
            <span className={iconClass("text-[16px]")}>bookmark</span>
          </span>
        </div>
        <div className="flex flex-col gap-2 px-4 pb-4 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              수학 • 고3
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <span className={iconClass("text-[14px]")}>group</span>0/20
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            [고3] 수능 대비 수학 심화반
          </h3>
          <div className="flex items-center gap-2">
            <span
              className="size-6 rounded-full border border-slate-200 bg-cover bg-center dark:border-slate-600"
              style={{
                backgroundImage:
                  "url(https://lh3.googleusercontent.com/aida-public/AB6AXuA73q1WgcoBsz-UhMEQBhLdC3cqi8E4fsYlRB3zMDsng-Fflha-w3E10g1wFnjdXvBazp17X8F4fwj6VAkhm6K46aIm4eC3fJBOOcihpNNiON92MS08QvXWbeMmD605-OTtlmHxUY9RJTe0Dd1vHaYbZdQuz-AWn7yZIRzleGvNK-WdSuA0G09HCoOqKWuCxTyKewtFyjiiNBKMU6KmHVDvYx4cK9Fw0ykHyyQXAp_Tb7Z0ImLiCj66qHAzL1bMobS7HybyAGRaIJ8)",
              }}
            />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              김철수 강사
            </span>
          </div>
          <div className="my-2 h-px bg-slate-100 dark:bg-slate-700" />
          <div className="flex flex-col gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-2">
              <span className={iconClass("text-[16px]")}>schedule</span>월, 목
              18:00 - 20:00
            </span>
            <span className="flex items-center gap-2">
              <span className={iconClass("text-[16px]")}>location_on</span>102호
              (중강의실)
            </span>
          </div>
          <button
            type="button"
            className="mt-2 w-full rounded-lg bg-slate-100 py-2 text-sm font-bold text-slate-900 transition hover:bg-primary hover:text-white dark:bg-slate-700 dark:text-white"
          >
            상세 보기
          </button>
        </div>
      </div>
    </div>
  );
}

export function HelperCard() {
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/10 p-4">
      <div className="flex items-start gap-3">
        <span className={iconClass("text-primary mt-0.5")}>info</span>
        <div>
          <h4 className="mb-1 text-sm font-bold text-primary">등록 팁</h4>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            정확한 강의 대상을 태그로 입력하면 학부모님들이 검색할 때 더 쉽게
            찾을 수 있습니다. 상세 설명에는 주차별 커리큘럼을 포함하는 것이
            좋습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
