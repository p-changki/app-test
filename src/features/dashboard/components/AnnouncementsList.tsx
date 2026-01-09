import Link from "next/link";

import type { Announcement } from "@/features/dashboard/types";

type AnnouncementsListProps = {
  announcements: Announcement[];
};

export function AnnouncementsList({ announcements }: AnnouncementsListProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-border-light bg-surface-light shadow-sm dark:border-border-dark dark:bg-surface-dark">
      <div className="flex items-center justify-between border-b border-border-light p-5 dark:border-border-dark">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          주요 알림 및 공지사항
        </h3>
        <Link href="#" className="text-sm text-primary hover:underline">
          더보기
        </Link>
      </div>
      <div className="divide-y divide-border-light dark:divide-border-dark">
        {announcements.map((announcement) => (
          <article
            key={announcement.id}
            className="group cursor-pointer p-4 transition hover:bg-slate-50 dark:hover:bg-white/5"
          >
            <div className="mb-1 flex items-start justify-between">
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-bold ${announcement.categoryClass}`}
              >
                {announcement.category}
              </span>
              <span className="text-xs text-slate-400">
                {announcement.timestamp}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-800 transition group-hover:text-primary dark:text-slate-200">
              {announcement.title}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
