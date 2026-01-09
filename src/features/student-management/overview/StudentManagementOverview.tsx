import Link from "next/link";

import {
  classChips,
  classSection,
  classStudentMap,
  defaultClassId,
  filterSelects,
  headerActions,
  pageSummary,
  pagination,
  studentBreadcrumbs,
} from "@/features/student-management/data";
import { StudentManagementInteractive } from "@/features/student-management/StudentManagementInteractive";
import { lexend, notoSansKr } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export function StudentManagementOverview() {
  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200"
      )}
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumbs />
        <div className="flex flex-col gap-6">
          <PageSummary />
          <StudentManagementInteractive
            actions={headerActions}
            classes={classChips}
            classSection={classSection}
            classStudentMap={classStudentMap}
            defaultClassId={defaultClassId}
            filterSelects={filterSelects}
            pagination={pagination}
          />
        </div>
        <footer className="text-center text-xs text-slate-400 dark:text-slate-600">
          © 2024 에듀 매니저. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

function Breadcrumbs() {
  return (
    <nav className="flex items-center text-sm text-slate-500 dark:text-slate-400">
      {studentBreadcrumbs.map((crumb, index) => (
        <span key={crumb.label} className="flex items-center">
          {crumb.href ? (
            <Link
              href={crumb.href}
              className="text-slate-600 transition-colors hover:text-primary dark:text-slate-300 dark:hover:text-primary"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="font-medium text-slate-900 dark:text-white">
              {crumb.label}
            </span>
          )}
          {index < studentBreadcrumbs.length - 1 && (
            <span className="mx-2 text-slate-300 dark:text-slate-600">/</span>
          )}
        </span>
      ))}
    </nav>
  );
}

function PageSummary() {
  return (
    <div className="flex flex-col gap-2">
      <h1
        className={cn(
          lexend.className,
          "text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl"
        )}
      >
        {pageSummary.title}
      </h1>
      <p className="text-slate-500 dark:text-slate-400">
        {pageSummary.description}
      </p>
    </div>
  );
}
