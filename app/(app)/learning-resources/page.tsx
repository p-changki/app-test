import type { Metadata } from "next";

import Breadcrumbs from "@/features/learning-resources/components/Breadcrumbs";
import FiltersPanel from "@/features/learning-resources/components/FiltersPanel";
import PageHero from "@/features/learning-resources/components/PageHero";
import PaginationBar from "@/features/learning-resources/components/PaginationBar";
import ResourceTable from "@/features/learning-resources/components/ResourceTable";
import {
  breadcrumbs,
  pagination,
  resourceFilters,
  resources,
} from "@/features/learning-resources/data";
import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "학습 자료실 - EduManager",
  description: "수업 보조 자료와 심화 학습 콘텐츠를 한 곳에서 관리합니다.",
};

export default function LearningResourcesPage() {
  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200"
      )}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbs} />

        <PageHero
          title="학습 자료실"
          description="수업 보조 자료와 심화 학습 콘텐츠를 검색하고 다운로드하세요."
          iconClass={iconClass}
          titleClassName={lexend.className}
        />

        <FiltersPanel filters={resourceFilters} iconClass={iconClass} />

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-700 dark:bg-[#1a2632]">
          <ResourceTable resources={resources} iconClass={iconClass} />
          <PaginationBar pages={pagination} iconClass={iconClass} />
        </section>
      </div>
    </div>
  );
}
