"use client";

import { cn } from "@/lib/utils";
import { iconClass } from "@/lib/icon-class";
import type { ClassEntity } from "@/types/entities";

export type CourseEnrollmentModalProps = {
  classes: ClassEntity[];
  subjects: string[];
  subjectFilter: string;
  onSubjectChange: (subject: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedClassId: string | null;
  onSelectClass: (id: string) => void;
  onClose: () => void;
  onConfirm: () => void;
};

export function CourseEnrollmentModal({
  classes,
  subjects,
  subjectFilter,
  onSubjectChange,
  searchTerm,
  onSearchChange,
  selectedClassId,
  onSelectClass,
  onClose,
  onConfirm,
}: CourseEnrollmentModalProps) {
  const selectedClass = classes.find((klass) => klass.id === selectedClassId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="flex w-full max-w-5xl flex-col rounded-2xl border border-[#283039] bg-[#111418] text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#283039] px-6 py-4">
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-primary">
              <span className={iconClass("text-[18px]")}>school</span>
              에듀매니저 대치 본원
            </div>
            <h2 className="text-xl font-bold">수강신청</h2>
            <p className="text-sm text-[#9dabb9]">
              원하는 강좌를 선택하여 수강신청을 진행하세요.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-[#9dabb9] transition hover:bg-[#283039]"
            aria-label="수강신청 모달 닫기"
            onClick={onClose}
          >
            <span className={iconClass("text-[24px]")}>close</span>
          </button>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6 custom-scrollbar">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#9dabb9]">
              학원 선택
            </label>
            <div className="relative">
              <span
                className={iconClass(
                  "absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#9dabb9]"
                )}
              >
                apartment
              </span>
              <input
                readOnly
                value="에듀매니저 대치 본원"
                className="w-full rounded-lg border border-[#283039] bg-[#191f26] py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => {
              const isActive = subjectFilter === subject;
              return (
                <button
                  key={subject}
                  type="button"
                  onClick={() => onSubjectChange(subject)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-primary text-white shadow shadow-primary/20"
                      : "bg-[#283039] text-[#9dabb9] hover:text-white"
                  )}
                >
                  {subject}
                </button>
              );
            })}
          </div>
          <div className="relative">
            <span
              className={iconClass(
                "absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#9dabb9]"
              )}
            >
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="강좌명 또는 강사명을 검색하세요"
              className="w-full rounded-lg border border-[#283039] bg-[#191f26] py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="space-y-4">
            {classes.map((klass) => (
              <CourseCard
                key={klass.id}
                klass={klass}
                active={klass.id === selectedClassId}
                onSelect={() => onSelectClass(klass.id)}
              />
            ))}
            {classes.length === 0 ? (
              <p className="rounded-xl border border-dashed border-[#283039] bg-[#191f26] p-8 text-center text-sm text-[#9dabb9]">
                조건에 맞는 개설 수업이 없습니다. 필터를 조정하거나 다른
                키워드를 입력해보세요.
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t border-[#283039] px-6 py-4 text-sm text-[#9dabb9] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className={iconClass("text-[18px]")}>info</span>
            <span>수강신청 완료 시 담당 강사에게 알림이 발송됩니다.</span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="rounded-lg border border-[#283039] px-5 py-2 text-white transition hover:bg-[#283039]"
              onClick={onClose}
            >
              취소
            </button>
            <button
              type="button"
              disabled={!selectedClass}
              className={cn(
                "rounded-lg px-6 py-2 font-semibold text-white transition",
                selectedClass
                  ? "bg-primary shadow-lg shadow-primary/20 hover:bg-blue-600"
                  : "cursor-not-allowed bg-[#283039] text-[#9dabb9]"
              )}
              onClick={() => {
                if (!selectedClass) return;
                onConfirm();
              }}
            >
              수강신청
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseCard({
  klass,
  active,
  onSelect,
}: {
  klass: ClassEntity;
  active: boolean;
  onSelect: () => void;
}) {
  const remaining = klass.capacity - klass.enrolled;
  const tags = klass.focusTags?.slice(0, 3).join(" • ");

  return (
    <div
      className={cn(
        "rounded-xl border px-5 py-4 transition",
        active
          ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
          : "border-[#283039] bg-[#191f26] hover:border-primary/40"
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-[#9dabb9]">
            <span className="rounded bg-[#283039] px-2 py-1 text-primary">
              {klass.subject}
            </span>
            <span className="flex items-center gap-1">
              <span className={iconClass("text-[16px]")}>schedule</span>
              {klass.schedule.days.join("/")} {klass.schedule.time}
            </span>
          </div>
          <h3 className="text-lg font-bold">{klass.name}</h3>
          <p className="mt-1 text-sm text-[#9dabb9]">
            강사 {klass.teacher} · 조교 {klass.assistant} ·{" "}
            {klass.schedule.location}
          </p>
          {tags ? (
            <p className="mt-2 text-xs text-[#9dabb9] line-clamp-2">{tags}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:border-l sm:border-[#283039] sm:pl-5">
          <div className="text-right text-sm text-[#9dabb9]">
            <span className="block text-xs">잔여석</span>
            <span className="text-white">
              <span
                className={remaining <= 3 ? "text-orange-400" : "text-primary"}
              >
                {remaining}
              </span>{" "}
              / {klass.capacity}
            </span>
          </div>
          <button
            type="button"
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold transition",
              active
                ? "bg-primary text-white shadow shadow-primary/30"
                : "bg-[#283039] text-white hover:bg-primary"
            )}
            onClick={onSelect}
          >
            {active ? "선택됨" : "선택"}
          </button>
        </div>
      </div>
    </div>
  );
}

export type EnrollmentConfirmModalProps = {
  selectedClass?: ClassEntity;
  onClose: () => void;
  onConfirm: () => void;
};

export function EnrollmentConfirmModal({
  selectedClass,
  onClose,
  onConfirm,
}: EnrollmentConfirmModalProps) {
  if (!selectedClass) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-[color:var(--surface-text)] shadow-xl dark:border-slate-800 dark:bg-[#1a2632]">
        <h3 className="text-lg font-semibold">수강신청 확인</h3>
        <p className="mt-2 text-sm text-[color:var(--surface-text-muted)]">
          {`${selectedClass.name} 수업에 신청하시겠습니까?`}
        </p>
        <p className="mt-1 text-xs text-[color:var(--surface-text-muted)]">
          신청 완료 시 담당 강사에게 알림이 전송됩니다.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-[color:var(--surface-text)] transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
            onClick={onConfirm}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
