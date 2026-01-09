import type { Metadata } from "next";

import { AssistantSubNav } from "@/components/layout/AssistantSubNav";
import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

const breadcrumbs = [
  { label: "홈", href: "/dashboard" },
  { label: "수업 관리", href: "/class-management" },
  { label: "수업 개설" },
];

const subjects = ["수학", "영어", "과학", "국어"];
const audiences = ["고등학교 3학년"];
const classrooms = [
  { value: "101", label: "101호 (대강의실)" },
  { value: "102", label: "102호 (중강의실)" },
  { value: "103", label: "103호 (소강의실)" },
];

const scheduleSlots = [
  { id: "mon", day: "월요일", start: "18:00", end: "20:00" },
  { id: "thu", day: "목요일", start: "18:00", end: "20:00" },
];

const classSubNavLinks = [
  { label: "수업 관리", href: "/class-management" },
  { label: "수업 개설", href: "/class-registration" },
] as const;

export const metadata: Metadata = {
  title: "수업 등록/개설 - EduTrack",
  description: "새로운 강의를 등록하고 운영 정보를 설정하는 화면",
};

export default function ClassRegistrationPage() {
  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200"
      )}
    >
      <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-[1200px] flex-col px-4 py-6 md:px-8 lg:px-10">
        <Breadcrumbs />
        <AssistantSubNav
          activeHref="/class-registration"
          links={classSubNavLinks}
          className="mb-6"
        />
        <PageHeader />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <BasicInfoSection />
            <LogisticsSection />
            <ScheduleSection />
            <DescriptionSection />
          </div>
          <aside className="flex flex-col gap-6">
            <PreviewCard />
            <HelperCard />
          </aside>
        </div>
        <div className="h-20" />
      </div>
    </div>
  );
}

function Breadcrumbs() {
  return (
    <nav className="mb-4 flex flex-wrap gap-2 text-sm text-slate-500 dark:text-slate-400">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.label} className="flex items-center gap-2">
          {crumb.href ? (
            <a href={crumb.href} className="font-medium hover:text-primary">
              {crumb.label}
            </a>
          ) : (
            <span className="font-medium text-slate-900 dark:text-white">
              {crumb.label}
            </span>
          )}
          {index < breadcrumbs.length - 1 && <span>/</span>}
        </div>
      ))}
    </nav>
  );
}

function PageHeader() {
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

function BasicInfoSection() {
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
            <div className="relative">
              <select
                defaultValue=""
                className="w-full appearance-none rounded-lg border border-slate-300 bg-gray-50 p-3 pr-10 text-slate-900 focus:ring-2 focus:ring-primary dark:border-slate-600 dark:bg-[#111418] dark:text-white"
              >
                <option value="" disabled>
                  과목 선택
                </option>
                {subjects.map((subject) => (
                  <option key={subject}>{subject}</option>
                ))}
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

function LogisticsSection() {
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
            {audiences.map((audience) => (
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
          <div className="relative">
            <select
              defaultValue="102"
              className="w-full appearance-none rounded-lg border border-slate-300 bg-gray-50 p-3 pr-10 text-slate-900 focus:ring-2 focus:ring-primary dark:border-slate-600 dark:bg-[#111418] dark:text-white"
            >
              <option value="">강의실 선택</option>
              {classrooms.map((room) => (
                <option key={room.value} value={room.value}>
                  {room.label}
                </option>
              ))}
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
        </div>
      </div>
    </section>
  );
}

function ScheduleSection() {
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

function DescriptionSection() {
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

function PreviewCard() {
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

function HelperCard() {
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
