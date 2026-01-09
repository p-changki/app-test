import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";
import {
  subjectOptions,
  audienceTags,
  classroomOptions,
  scheduleSlots,
} from "@/features/class-registration/data";

export function BasicInfoSection() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#1e2630]">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
        <span className={iconClass("text-primary")}>edit_document</span>
        강의 기본 정보
      </h3>
      <div className="space-y-4">
        <FormField label="수업명" required>
          <input
            type="text"
            placeholder="예: [고3] 수능 대비 수학 심화반"
            className="w-full rounded-lg border border-slate-300 bg-gray-50 p-3 text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-600 dark:bg-[#111418] dark:text-white"
          />
        </FormField>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="과목" required>
            <SelectField options={subjectOptions} placeholder="과목 선택" />
          </FormField>
          <FormField label="연계 클래스" required>
            <div className="relative">
              <input
                type="text"
                placeholder="클래스 또는 반 검색"
                className="w-full rounded-lg border border-slate-300 bg-gray-50 p-3 pl-10 text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-600 dark:bg-[#111418] dark:text-white"
              />
              <span
                className={cn(
                  iconClass(
                    "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500"
                  )
                )}
              >
                search
              </span>
            </div>
          </FormField>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="개강일">
            <input
              type="date"
              className="w-full rounded-lg border border-slate-300 bg-gray-50 p-3 text-slate-900 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-600 dark:bg-[#111418] dark:text-white"
            />
          </FormField>
          <FormField label="수업 상태">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex flex-1 items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 dark:border-slate-600 dark:text-white dark:hover:bg-slate-800"
              >
                모집중
              </button>
              <button
                type="button"
                className="flex flex-1 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-bold text-slate-500 transition hover:bg-slate-200 dark:border-slate-600 dark:bg-[#283039] dark:text-slate-200"
              >
                대기중
              </button>
            </div>
          </FormField>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="수강료">
            <div className="flex items-center rounded-lg border border-slate-300 bg-gray-50 px-3 text-slate-900 focus-within:ring-2 focus-within:ring-primary dark:border-slate-600 dark:bg-[#111418] dark:text-white">
              <span className="text-sm text-slate-500">월</span>
              <input
                type="number"
                placeholder="예: 380,000"
                className="w-full border-none bg-transparent p-3 text-right text-lg font-bold focus:outline-none"
              />
              <span className="text-sm text-slate-500">원</span>
            </div>
          </FormField>
          <FormField label="담당 강사">
            <div className="relative">
              <input
                type="text"
                placeholder="강사 이름 검색"
                className="w-full rounded-lg border border-slate-300 bg-gray-50 p-3 pl-10 text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-600 dark:bg-[#111418] dark:text-white"
              />
              <span
                className={cn(
                  iconClass(
                    "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500"
                  )
                )}
              >
                person_search
              </span>
            </div>
          </FormField>
        </div>
      </div>
    </section>
  );
}

export function LogisticsSection() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#1e2630]">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
        <span className={iconClass("text-primary")}>
          settings_accessibility
        </span>
        운영 정보
      </h3>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-3 space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
            수강 대상
          </label>
          <div className="flex min-h-[48px] flex-wrap gap-2 rounded-lg border border-slate-300 bg-gray-50 p-2 dark:border-slate-600 dark:bg-[#111418]">
            {audienceTags.map((audience) => (
              <span
                key={audience}
                className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary"
              >
                {audience}
                <button
                  type="button"
                  className="text-primary/70 hover:text-primary"
                >
                  <span className={iconClass("text-[16px]")}>close</span>
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="+ 태그 추가 (Enter)"
              className="min-w-[120px] flex-1 border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-0 dark:text-white"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
            정원 (명)
          </label>
          <div className="flex items-center">
            <button
              type="button"
              className="flex h-[46px] w-[46px] items-center justify-center rounded-l-lg bg-slate-200 text-slate-600 transition hover:bg-slate-300 dark:bg-[#283039] dark:text-white dark:hover:bg-[#3e4856]"
            >
              <span className={iconClass("text-[18px]")}>remove</span>
            </button>
            <input
              type="number"
              defaultValue={20}
              className="h-[46px] w-full border-y border-slate-300 bg-gray-50 text-center text-slate-900 focus:outline-none dark:border-slate-600 dark:bg-[#111418] dark:text-white"
            />
            <button
              type="button"
              className="flex h-[46px] w-[46px] items-center justify-center rounded-r-lg bg-slate-200 text-slate-600 transition hover:bg-slate-300 dark:bg-[#283039] dark:text-white dark:hover:bg-[#3e4856]"
            >
              <span className={iconClass("text-[18px]")}>add</span>
            </button>
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
            강의실 배정
          </label>
          <SelectField
            options={classroomOptions.map((room) => room.label)}
            placeholder="강의실 선택"
            defaultValue="102"
          />
        </div>
      </div>
    </section>
  );
}

export function ScheduleSection() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#1e2630]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          <span className={iconClass("text-primary")}>calendar_month</span>
          강의 시간표
        </h3>
        <button
          type="button"
          className="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary/80"
        >
          <span className={iconClass("text-[18px]")}>add_circle</span>
          시간 추가
        </button>
      </div>
      <div className="hidden grid-cols-12 gap-3 px-2 text-sm font-medium text-slate-500 md:grid">
        <div className="col-span-3">요일</div>
        <div className="col-span-4">시작 시간</div>
        <div className="col-span-4">종료 시간</div>
        <div />
      </div>
      <div className="space-y-3">
        {scheduleSlots.map((slot) => (
          <div
            key={slot.id}
            className="grid grid-cols-1 items-center gap-3 rounded-lg border border-slate-200 bg-gray-50 p-3 dark:border-slate-700 dark:bg-[#111418] md:grid-cols-12"
          >
            <div className="md:col-span-3">
              <select className="w-full appearance-none rounded border border-slate-300 bg-white p-2 text-sm text-slate-900 focus:ring-2 focus:ring-primary dark:border-slate-600 dark:bg-[#1e2630] dark:text-white">
                <option>{slot.day}</option>
              </select>
            </div>
            <div className="md:col-span-4">
              <input
                type="time"
                defaultValue={slot.start}
                className="w-full rounded border border-slate-300 bg-white p-2 text-sm text-slate-900 focus:ring-2 focus:ring-primary dark:border-slate-600 dark:bg-[#1e2630] dark:text-white"
              />
            </div>
            <div className="md:col-span-4">
              <input
                type="time"
                defaultValue={slot.end}
                className="w-full rounded border border-slate-300 bg-white p-2 text-sm text-slate-900 focus:ring-2 focus:ring-primary dark:border-slate-600 dark:bg-[#1e2630] dark:text-white"
              />
            </div>
            <div className="flex justify-end md:col-span-1 md:justify-center">
              <button
                type="button"
                className="p-1 text-slate-400 transition hover:text-red-500"
              >
                <span className={iconClass("text-[20px]")}>delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function DescriptionSection() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#1e2630]">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
        <span className={iconClass("text-primary")}>description</span>
        상세 설명
      </h3>
      <textarea
        rows={6}
        placeholder="커리큘럼 상세 내용, 수업 목표, 준비물 등을 입력하세요."
        className="w-full resize-none rounded-lg border border-slate-300 bg-gray-50 p-4 text-slate-900 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-600 dark:bg-[#111418] dark:text-white"
      />
    </section>
  );
}

function SelectField({
  options,
  placeholder,
  defaultValue,
}: {
  options: readonly string[] | readonly { value: string; label: string }[];
  placeholder: string;
  defaultValue?: string;
}) {
  return (
    <div className="relative">
      <select
        defaultValue={defaultValue ?? ""}
        className="w-full appearance-none rounded-lg border border-slate-300 bg-gray-50 p-3 pr-10 text-slate-900 focus:ring-2 focus:ring-primary dark:border-slate-600 dark:bg-[#111418] dark:text-white"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => {
          if (typeof option === "string") {
            return (
              <option key={option} value={option}>
                {option}
              </option>
            );
          }
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
      <span
        className={cn(
          iconClass(
            "pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500"
          )
        )}
      >
        expand_more
      </span>
    </div>
  );
}

function FormField({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
