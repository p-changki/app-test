"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  type InquiryStatus,
  useInquiryStore,
} from "@/features/inquiry-dashboard/inquiryStore";

type TabKey = "all" | "waiting" | "processing" | "answered" | "closed";

const STATUS_META: Record<
  InquiryStatus,
  { label: string; badgeClass: string; tabKey: TabKey }
> = {
  "강사 검토": {
    label: "처리 중",
    badgeClass: "bg-amber-100 text-amber-700",
    tabKey: "processing",
  },
  "답변 완료": {
    label: "답변 완료",
    badgeClass: "bg-primary/10 text-primary",
    tabKey: "answered",
  },
  "학생/학부모 확인 완료": {
    label: "답변 완료",
    badgeClass: "bg-primary/10 text-primary",
    tabKey: "answered",
  },
  종료: {
    label: "종료",
    badgeClass: "bg-slate-200 text-slate-500",
    tabKey: "closed",
  },
};

type TabConfig = {
  key: TabKey;
  label: string;
  count: number;
};

export function StudentInquiryListPage() {
  const router = useRouter();
  const inquiries = useInquiryStore();
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [resourceOnly, setResourceOnly] = useState(false);

  const inquiriesWithMeta = useMemo(
    () =>
      inquiries.map((inquiry) => {
        const meta = STATUS_META[inquiry.status];
        return {
          inquiry,
          meta,
        };
      }),
    [inquiries]
  );

  const counts = useMemo(() => {
    return inquiriesWithMeta.reduce(
      (acc, item) => {
        acc[item.meta.tabKey] += 1;
        return acc;
      },
      {
        all: inquiriesWithMeta.length,
        waiting: 0,
        processing: 0,
        answered: 0,
        closed: 0,
      }
    );
  }, [inquiriesWithMeta]);

  const tabs: TabConfig[] = useMemo(
    () => [
      { key: "all", label: "전체", count: counts.all },
      { key: "waiting", label: "대기 중", count: counts.waiting },
      { key: "processing", label: "처리 중", count: counts.processing },
      { key: "answered", label: "답변 완료", count: counts.answered },
      { key: "closed", label: "종료", count: counts.closed },
    ],
    [counts]
  );

  const filtered = useMemo(() => {
    const byStatus =
      activeTab === "all"
        ? inquiriesWithMeta
        : inquiriesWithMeta.filter((item) => item.meta.tabKey === activeTab);
    if (!resourceOnly) {
      return byStatus;
    }
    return byStatus.filter((item) => item.inquiry.category === "자료 공유");
  }, [activeTab, inquiriesWithMeta, resourceOnly]);

  const resourceCount = useMemo(
    () =>
      inquiriesWithMeta.filter((item) => item.inquiry.category === "자료 공유")
        .length,
    [inquiriesWithMeta]
  );

  return (
    <div className="bg-background-light font-display text-[#111418] dark:bg-background-dark dark:text-white min-h-screen">
      <main className="flex-1 overflow-y-auto flex flex-col">
        <header className="max-w-[1200px] w-full mx-auto pt-10 px-8">
          <div className="flex flex-wrap justify-between items-end gap-4 pb-8 border-b border-[#dbe0e6] dark:border-slate-800">
            <div className="flex flex-col gap-2">
              <p className="text-[#111418] dark:text-white text-4xl font-black leading-tight tracking-tight">
                내 문의 내역
              </p>
              <p className="text-[#617589] text-base font-normal">
                강사/조교와 주고받은 모든 1:1 문의를 확인하실 수 있습니다.
              </p>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 min-w-[140px] cursor-pointer justify-center rounded-xl h-12 px-6 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              onClick={() => router.push("/student-inquiries/new")}
            >
              <span className="material-symbols-outlined text-lg">
                edit_note
              </span>
              <span>새 문의 작성</span>
            </button>
          </div>
        </header>
        <section className="max-w-[1200px] w-full mx-auto px-8 mt-6">
          <div className="flex flex-wrap items-center justify-between border-b border-[#dbe0e6] dark:border-slate-800 gap-4">
            <div className="flex gap-8">
              {tabs.map((tab) => {
                const isActive = tab.key === activeTab;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex flex-col items-center justify-center pb-3 pt-2 border-b-[3px] transition-colors ${
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-[#617589] hover:text-[#111418]"
                    }`}
                  >
                    <p className="text-sm font-bold tracking-tight">
                      {tab.label} ({tab.count})
                    </p>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setResourceOnly((prev) => !prev)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                resourceOnly
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-500 hover:text-slate-700"
              }`}
            >
              <span className="material-symbols-outlined text-base">
                filter_alt
              </span>
              자료 공유만 {resourceOnly ? `(${resourceCount})` : ""}
            </button>
          </div>
        </section>
        <section className="max-w-[1200px] w-full mx-auto px-8 py-6 flex-1">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#dbe0e6] dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-background-light/50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase tracking-wider">
                      제목
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase tracking-wider w-32">
                      상태
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase tracking-wider w-48">
                      담당 강사
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-[#617589] uppercase tracking-wider w-48">
                      최종 업데이트
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dbe0e6] dark:divide-slate-800">
                  {filtered.map(({ inquiry, meta }) => {
                    const assigneeName = inquiry.instructor.name;
                    const assigneeInitial = assigneeName.slice(0, 1);
                    const isResourceShare = inquiry.category === "자료 공유";
                    return (
                      <tr
                        key={inquiry.id}
                        className="hover:bg-background-light/30 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
                        onClick={() =>
                          router.push(`/student-inquiries/${inquiry.id}`)
                        }
                      >
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-primary/60 text-lg">
                                {isResourceShare ? "share" : "lock"}
                              </span>
                              <span className="text-sm font-semibold group-hover:text-primary transition-colors">
                                {inquiry.title}
                              </span>
                            </div>
                            {isResourceShare ? (
                              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                                {isResourceShare ? (
                                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700">
                                    자료 공유
                                  </span>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-bold ${meta.badgeClass}`}
                          >
                            {meta.label}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                              {assigneeInitial}
                            </div>
                            <span className="text-sm font-medium">
                              {assigneeName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-[#617589]">
                          {inquiry.updatedAt}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <footer className="max-w-[1200px] w-full mx-auto px-8 pb-12">
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-lg border border-[#dbe0e6] dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800"
            >
              <span className="material-symbols-outlined text-sm">
                chevron_left
              </span>
            </button>
            <button
              type="button"
              className="text-sm font-bold flex size-10 items-center justify-center text-white rounded-lg bg-primary"
            >
              1
            </button>
            <button
              type="button"
              className="text-sm font-medium flex size-10 items-center justify-center text-[#617589] rounded-lg hover:bg-white dark:hover:bg-slate-800"
            >
              2
            </button>
            <button
              type="button"
              className="text-sm font-medium flex size-10 items-center justify-center text-[#617589] rounded-lg hover:bg-white dark:hover:bg-slate-800"
            >
              3
            </button>
            <span className="text-[#617589] px-2">...</span>
            <button
              type="button"
              className="text-sm font-medium flex size-10 items-center justify-center text-[#617589] rounded-lg hover:bg-white dark:hover:bg-slate-800"
            >
              12
            </button>
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-lg border border-[#dbe0e6] dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800"
            >
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
            </button>
          </div>
          <p className="text-center text-[10px] text-[#617589] mt-8 flex items-center justify-center gap-1 uppercase tracking-widest">
            <span className="material-symbols-outlined text-xs">
              verified_user
            </span>
            데이터 보안 및 암호화 통신 적용 중
          </p>
        </footer>
      </main>
    </div>
  );
}
