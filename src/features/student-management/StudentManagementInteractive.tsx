"use client";

import { useMemo, useState } from "react";

import { StudentActionsPanel } from "@/features/student-management/StudentActionsPanel";
import { StudentTable } from "@/features/student-management/StudentTable";
import type {
  ClassChip,
  FilterSelect,
  HeaderAction,
  PaginationItem,
  StudentRecord,
  StudentStatusOption,
} from "@/features/student-management/types";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

const gradeLabelMap: Record<string, string> = {
  h1: "고1",
  h2: "고2",
  h3: "고3",
};

const statusFilterMap: Record<string, StudentStatusOption> = {
  active: "재원중",
  pause: "휴원",
  grad: "퇴원",
};

type StudentManagementInteractiveProps = {
  actions: HeaderAction[];
  classes: ClassChip[];
  classSection: { title: string; actionLabel: string };
  classStudentMap: Record<string, StudentRecord[]>;
  defaultClassId: string;
  filterSelects: FilterSelect[];
  pagination: PaginationItem[];
};

export function StudentManagementInteractive({
  actions,
  classes,
  classSection,
  classStudentMap,
  defaultClassId,
  filterSelects,
  pagination,
}: StudentManagementInteractiveProps) {
  const [activeClassId, setActiveClassId] = useState(defaultClassId);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [studentStatuses, setStudentStatuses] = useState<
    Record<string, StudentStatusOption>
  >(() => {
    const map: Record<string, StudentStatusOption> = {};
    classStudentMap.all.forEach((student) => {
      const label = student.status.label;
      if (label === "재원중" || label === "휴원" || label === "퇴원") {
        map[student.id] = label;
      } else {
        map[student.id] = "재원중";
      }
    });
    return map;
  });

  const visibleStudents = useMemo(
    () => classStudentMap[activeClassId] ?? [],
    [activeClassId, classStudentMap]
  );

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const gradeLabel = gradeLabelMap[gradeFilter];
    const statusLabel = statusFilterMap[statusFilter];

    return visibleStudents.filter((student) => {
      const statusValue =
        studentStatuses[student.id] ??
        (["재원중", "휴원", "퇴원"].includes(student.status.label)
          ? (student.status.label as StudentStatusOption)
          : "재원중");

      if (query) {
        const target = `${student.name} ${student.studentId} ${student.contact}`
          .toLowerCase()
          .normalize("NFC");
        if (!target.includes(query)) {
          return false;
        }
      }
      if (gradeLabel) {
        if (!student.school.includes(gradeLabel)) {
          return false;
        }
      }
      if (statusLabel && statusValue !== statusLabel) {
        return false;
      }
      return true;
    });
  }, [
    gradeFilter,
    searchQuery,
    statusFilter,
    studentStatuses,
    visibleStudents,
  ]);
  const normalizedSelectedStudentIds = useMemo(() => {
    const visibleIdSet = new Set(filteredStudents.map((student) => student.id));
    return selectedStudentIds.filter((id) => visibleIdSet.has(id));
  }, [filteredStudents, selectedStudentIds]);

  const selectedStudents = useMemo(
    () =>
      filteredStudents.filter((student) =>
        normalizedSelectedStudentIds.includes(student.id)
      ),
    [filteredStudents, normalizedSelectedStudentIds]
  );

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleToggleAll = () => {
    setSelectedStudentIds((prev) => {
      const filteredIds = filteredStudents.map((student) => student.id);
      const hasAll = filteredIds.every((id) => prev.includes(id));
      if (hasAll) {
        return prev.filter((id) => !filteredIds.includes(id));
      }
      const next = [...prev];
      filteredIds.forEach((id) => {
        if (!next.includes(id)) {
          next.push(id);
        }
      });
      return next;
    });
  };

  const handleSelectClass = (classId: string) => {
    setActiveClassId(classId);
    setSelectedStudentIds([]);
  };

  const handleStatusChange = (
    studentId: string,
    status: StudentStatusOption
  ) => {
    setStudentStatuses((prev) => ({ ...prev, [studentId]: status }));
  };

  const tableSummary = {
    total: filteredStudents.length,
    rangeLabel:
      filteredStudents.length > 0 ? `1-${filteredStudents.length}` : "0",
  };

  return (
    <div className="flex flex-col gap-6">
      <ClassSelectorPanel
        classSection={classSection}
        classChips={classes}
        activeClassId={activeClassId}
        onSelectClass={handleSelectClass}
      />
      <StudentActionsPanel
        actions={actions}
        students={visibleStudents}
        classes={classes}
        selectedStudents={selectedStudents}
        onAlertComplete={() => setSelectedStudentIds([])}
      />
      <FilterPanel
        filterSelects={filterSelects}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        gradeFilter={gradeFilter}
        onGradeFilterChange={setGradeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
      <StudentTable
        students={filteredStudents}
        tableSummary={tableSummary}
        pagination={pagination}
        selectedStudentIds={normalizedSelectedStudentIds}
        onToggleStudent={handleToggleStudent}
        onToggleAll={handleToggleAll}
        studentStatuses={studentStatuses}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

function ClassSelectorPanel({
  classSection,
  classChips,
  activeClassId,
  onSelectClass,
}: {
  classSection: { title: string; actionLabel: string };
  classChips: ClassChip[];
  activeClassId: string;
  onSelectClass: (id: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-[var(--surface-background)] p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-[var(--surface-background)] sm:p-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <span className={cn(iconClass("text-primary"))}>school</span>
            {classSection.title}
          </h3>
        </div>
        <div className="custom-scrollbar -mx-2 flex items-center gap-2 overflow-x-auto px-2 pb-2">
          {classChips.map((chip) => {
            if (chip.isDivider) {
              return (
                <span
                  key={chip.id}
                  className="mx-1 hidden h-6 w-px flex-shrink-0 bg-slate-300 dark:bg-slate-700 sm:block"
                />
              );
            }
            if (chip.isAddButton) {
              return (
                <button
                  key={chip.id}
                  type="button"
                  className="flex size-9 flex-shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-300 text-slate-400 transition hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-slate-600 dark:text-slate-500 dark:hover:text-primary"
                  title="새 수업 추가"
                >
                  <span className={iconClass()}>add</span>
                </button>
              );
            }
            if (!chip.label) {
              return null;
            }
            const isActive = activeClassId === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => onSelectClass(chip.id)}
                className={cn(
                  "flex flex-shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-white shadow-sm shadow-primary/30"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                )}
              >
                {chip.icon ? (
                  <span className={iconClass("text-[18px]")}>{chip.icon}</span>
                ) : null}
                <span>{chip.label}</span>
                {typeof chip.count === "number" && (
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      isActive
                        ? "rounded bg-white/20 px-1.5 py-0.5 text-white"
                        : "text-slate-400"
                    )}
                  >
                    {chip.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FilterPanel({
  filterSelects,
  searchQuery,
  onSearchChange,
  gradeFilter,
  onGradeFilterChange,
  statusFilter,
  onStatusFilterChange,
}: {
  filterSelects: FilterSelect[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  gradeFilter: string;
  onGradeFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}) {
  const gradeSelect = filterSelects.find((select) => select.id === "grade");
  const statusSelect = filterSelects.find((select) => select.id === "status");

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-[var(--surface-background)] p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-[var(--surface-background)] lg:flex-row lg:items-center lg:justify-between">
      <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
        <div className="relative w-full sm:w-64">
          <span
            className={cn(
              iconClass(
                "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              )
            )}
          >
            search
          </span>
          <input
            type="text"
            placeholder="이름, ID, 전화번호 검색"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>
        {gradeSelect && (
          <select
            className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 pr-8 text-sm text-slate-700 outline-none transition focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            value={gradeFilter}
            onChange={(event) => onGradeFilterChange(event.target.value)}
          >
            <option value="">{gradeSelect.placeholder}</option>
            {gradeSelect.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
        {statusSelect && (
          <select
            className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 pr-8 text-sm text-slate-700 outline-none transition focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.target.value)}
          >
            <option value="">{statusSelect.placeholder}</option>
            {statusSelect.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </section>
  );
}
