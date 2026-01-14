"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import { assistantEntities } from "@/data/assistants";
import { TaskAssignmentModal } from "@/features/assistant-management/TaskAssignmentModal";
import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";
import type { AssistantEntity } from "@/types/entities";

const STATUS_OPTIONS = ["근무중", "휴가", "퇴사"] as const;
type StatusOption = (typeof STATUS_OPTIONS)[number];

type AssistantRecord = {
  id: string;
  name: string;
  avatar: string;
  subject: string;
  phone: string;
  email: string;
  className: string;
  recentTask: string;
  rating: string;
  status: StatusOption;
};

type ContractRecord = {
  assistantId: string;
  name: string;
  subject: string;
  className: string;
  status: "서명 완료" | "서명 대기" | "재전송 필요";
  updatedAt: string;
  fileName: string;
};

const assistantRecordSource: AssistantRecord[] = assistantEntities.map(
  (assistant, index) => mapAssistantEntityToRecord(assistant, index)
);

const uniqueSubjects = Array.from(
  new Set(assistantRecordSource.map((assistant) => assistant.subject))
).filter(Boolean);

const subjectFilterOptions: readonly string[] = ["전체", ...uniqueSubjects];

const contractFileRecords: ContractRecord[] = buildContractRecords(
  assistantRecordSource
);

const metricCards = buildMetricCards(
  assistantRecordSource,
  contractFileRecords
);

const statusFilterOptions: readonly string[] = ["전체", ...STATUS_OPTIONS];

export function AssistantManagementClientPage() {
  const [assistantRecords, setAssistantRecords] = useState<AssistantRecord[]>(
    () => assistantRecordSource
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusMap, setStatusMap] = useState<Record<string, StatusOption>>(() =>
    assistantRecordSource.reduce<Record<string, StatusOption>>(
      (acc, assistant) => {
        acc[assistant.id] = assistant.status;
        return acc;
      },
      {}
    )
  );
  const [detailAssistantId, setDetailAssistantId] = useState<string | null>(
    null
  );
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("전체");
  const [statusFilter, setStatusFilter] = useState<string>("전체");

  const detailAssistant =
    assistantRecords.find((assistant) => assistant.id === detailAssistantId) ??
    null;

  const filteredAssistants = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    return assistantRecords.filter((assistant) => {
      const currentStatus = statusMap[assistant.id] ?? assistant.status;
      if (keyword) {
        const haystack = [
          assistant.name,
          assistant.phone,
          assistant.className,
          assistant.subject,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(keyword)) {
          return false;
        }
      }
      if (subjectFilter !== "전체" && assistant.subject !== subjectFilter) {
        return false;
      }
      if (statusFilter !== "전체" && currentStatus !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [assistantRecords, searchKeyword, statusFilter, statusMap, subjectFilter]);

  const tableRangeLabel =
    filteredAssistants.length > 0 ? `1-${filteredAssistants.length}` : "0";

  const normalizedSelectedIds = useMemo(() => {
    const visibleIds = new Set(
      filteredAssistants.map((assistant) => assistant.id)
    );
    return selectedIds.filter((id) => visibleIds.has(id));
  }, [filteredAssistants, selectedIds]);

  const selectedAssistants = useMemo(
    () =>
      filteredAssistants.filter((assistant) =>
        normalizedSelectedIds.includes(assistant.id)
      ),
    [filteredAssistants, normalizedSelectedIds]
  );

  const selectedRecipients = selectedAssistants.map((assistant) => {
    const statusLabel = statusMap[assistant.id] ?? assistant.status;
    return {
      id: assistant.id,
      name: assistant.name,
      phone: assistant.phone,
      role: assistant.subject,
      statusLabel,
    };
  });

  const toggleAll = (checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) {
        const next = new Set(prev);
        filteredAssistants.forEach((assistant) => next.add(assistant.id));
        return Array.from(next);
      }
      const visibleIds = new Set(
        filteredAssistants.map((assistant) => assistant.id)
      );
      return prev.filter((id) => !visibleIds.has(id));
    });
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const allSelected =
    filteredAssistants.length > 0 &&
    normalizedSelectedIds.length === filteredAssistants.length;

  const bulkDisabled = selectedAssistants.length === 0;

  const handleStatusChange = (id: string, nextStatus: StatusOption) => {
    setStatusMap((prev) => ({ ...prev, [id]: nextStatus }));
    setAssistantRecords((prev) =>
      prev.map((assistant) =>
        assistant.id === id ? { ...assistant, status: nextStatus } : assistant
      )
    );
  };
  const openDetailModal = (id: string) => {
    setDetailAssistantId(id);
  };

  const closeDetailModal = () => {
    setDetailAssistantId(null);
  };

  const handleSaveDetail = (updated: AssistantRecord) => {
    setAssistantRecords((prev) =>
      prev.map((assistant) =>
        assistant.id === updated.id ? updated : assistant
      )
    );
    setStatusMap((prev) => ({ ...prev, [updated.id]: updated.status }));
    setDetailAssistantId(null);
  };

  const openContractModal = () => setContractModalOpen(true);
  const closeContractModal = () => setContractModalOpen(false);

  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200"
      )}
    >
      <div className="flex min-h-screen flex-col">
        <main className="flex flex-1 flex-col px-6 py-6 md:px-10">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-1">
                <h1
                  className={cn(
                    lexend.className,
                    "text-3xl font-black text-slate-900 dark:text-white md:text-4xl"
                  )}
                >
                  조교 관리
                </h1>
                <p className="text-base text-slate-500 dark:text-slate-400">
                  배정된 조교를 조회하고 업무를 배정/평가합니다.
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-2 sm:flex-none">
                <div className="flex flex-wrap items-center gap-2">
                  <NavButton href="/assistant-management" isActive>
                    조교 관리
                  </NavButton>
                  <NavButton href="/assistant-approvals">조교 승인</NavButton>
                </div>
                <TaskAssignmentModal
                  assistants={selectedRecipients}
                  disabled={bulkDisabled}
                  triggerClassName={cn(
                    "flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60",
                    "sm:w-auto"
                  )}
                  triggerContent={
                    <>
                      <span className={iconClass("text-lg")}>assignment</span>
                      조교 업무 지시
                      {selectedAssistants.length > 0 ? (
                        <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium">
                          {selectedAssistants.length}명
                        </span>
                      ) : null}
                    </>
                  }
                />
              </div>
            </div>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {metricCards.map((card) => {
                const isInteractive = Boolean(card.interactive);
                const cardBody = (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {card.label}
                      </p>
                      <span className={iconClass("text-slate-400")}>
                        {card.icon}
                      </span>
                    </div>
                    <div className="flex items-end gap-2">
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        {card.value}
                      </p>
                      <p className="mb-1 text-sm text-emerald-600 dark:text-emerald-400">
                        {card.delta}
                      </p>
                    </div>
                  </>
                );
                if (card.href) {
                  return (
                    <Link
                      key={card.label}
                      href={card.href}
                      className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg dark:border-slate-800 dark:bg-[#1c2936]"
                    >
                      {cardBody}
                      <span className="text-xs font-semibold text-primary">
                        업무 지시 내역 보기
                      </span>
                    </Link>
                  );
                }

                if (isInteractive) {
                  return (
                    <button
                      key={card.label}
                      type="button"
                      onClick={openContractModal}
                      className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg dark:border-slate-800 dark:bg-[#1c2936]"
                    >
                      {cardBody}
                      <span className="text-xs font-semibold text-primary">
                        계약서 보관함 열기
                      </span>
                    </button>
                  );
                }

                return (
                  <div
                    key={card.label}
                    className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#1c2936]"
                  >
                    {cardBody}
                  </div>
                );
              })}
            </section>

            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#1c2936]">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <span
                    className={iconClass(
                      "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    )}
                  >
                    search
                  </span>
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(event) => setSearchKeyword(event.target.value)}
                    placeholder="조교 이름 또는 연락처 검색"
                    className="h-12 w-full rounded-lg border border-slate-300 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div className="flex w-full gap-4 md:w-auto">
                  <SelectField
                    placeholder="담당 과목"
                    options={subjectFilterOptions}
                    value={subjectFilter}
                    onChange={setSubjectFilter}
                  />
                  <SelectField
                    placeholder="근무 상태"
                    options={statusFilterOptions}
                    value={statusFilter}
                    onChange={setStatusFilter}
                  />
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {subjectFilterOptions.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSubjectFilter(filter)}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                      subjectFilter === filter
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <section className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#1c2936]">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
                      <th className="px-4 py-4">
                        <input
                          type="checkbox"
                          className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                          checked={allSelected}
                          onChange={(event) => toggleAll(event.target.checked)}
                          aria-label="모든 조교 선택"
                        />
                      </th>
                      {[
                        "조교명",
                        "담당 과목",
                        "연락처",
                        "배정 클래스",
                        "최근 업무",
                        "상태",
                      ].map((col) => (
                        <th
                          key={col}
                          className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {filteredAssistants.map((assistant) => {
                      const checked = normalizedSelectedIds.includes(
                        assistant.id
                      );
                      const statusValue =
                        statusMap[assistant.id] ?? assistant.status;
                      return (
                        <tr
                          key={assistant.id}
                          className="group cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          onClick={() => openDetailModal(assistant.id)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              openDetailModal(assistant.id);
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          aria-label={`${assistant.name} 상세 정보 보기`}
                        >
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                              checked={checked}
                              onChange={() => toggleOne(assistant.id)}
                              onClick={(event) => event.stopPropagation()}
                              aria-label={`${assistant.name} 선택`}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="size-8 rounded-full bg-cover bg-center"
                                style={{
                                  backgroundImage: `url("${assistant.avatar}")`,
                                }}
                              />
                              <span className="font-bold text-slate-900 transition hover:text-primary dark:text-white dark:hover:text-primary">
                                {assistant.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                              {assistant.subject}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                            {assistant.phone}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                            {assistant.className}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                            {assistant.recentTask ? (
                              <span>{assistant.recentTask}</span>
                            ) : (
                              <span className="text-slate-400 dark:text-slate-500">
                                작업 내역 없음
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "size-2 rounded-full",
                                  statusVisuals[statusValue].dot
                                )}
                              />
                              <select
                                value={statusValue}
                                onChange={(event) =>
                                  handleStatusChange(
                                    assistant.id,
                                    event.target.value as StatusOption
                                  )
                                }
                                className={cn(
                                  "rounded-lg border px-3 py-1.5 text-sm font-medium transition focus:outline-none",
                                  "bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200",
                                  statusVisuals[statusValue].select
                                )}
                                onClick={(event) => event.stopPropagation()}
                              >
                                {STATUS_OPTIONS.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  총{" "}
                  <span className="font-bold text-slate-900 dark:text-white">
                    {assistantRecords.length}
                  </span>
                  명의 조교 중{" "}
                  <span className="font-bold text-slate-900 dark:text-white">
                    {tableRangeLabel}
                  </span>{" "}
                  표시
                  {selectedAssistants.length > 0 ? (
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      선택 {selectedAssistants.length}명
                    </span>
                  ) : null}
                </p>
                <div className="flex items-center gap-1">
                  <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white">
                    <span className={iconClass("text-lg")}>chevron_left</span>
                  </button>
                  <button className="flex h-8 min-w-[32px] items-center justify-center rounded-lg bg-primary text-sm font-bold text-white shadow-sm">
                    1
                  </button>
                  <button className="flex h-8 min-w-[32px] items-center justify-center rounded-lg text-sm font-medium text-slate-600 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700">
                    2
                  </button>
                  <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white">
                    <span className={iconClass("text-lg")}>chevron_right</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>
        <AssistantDetailModal
          assistant={detailAssistant}
          open={detailAssistant !== null}
          onClose={closeDetailModal}
          onSave={handleSaveDetail}
        />
        {contractModalOpen ? (
          <AssistantContractModal
            open={contractModalOpen}
            onClose={closeContractModal}
            contracts={contractFileRecords}
            assistants={assistantRecords}
          />
        ) : null}
      </div>
    </div>
  );
}

function SelectField({
  placeholder,
  options,
  value,
  onChange,
}: {
  placeholder: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative flex-1">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-lg border border-slate-300 bg-slate-50 pl-4 pr-10 text-sm text-slate-900 focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      >
        {!value && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span
        className={iconClass(
          "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        )}
      >
        expand_more
      </span>
    </div>
  );
}

function NavButton({
  href,
  children,
  isActive = false,
}: {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition sm:flex-none",
        isActive
          ? "border-primary/40 bg-primary/10 text-primary dark:border-primary/40 dark:bg-primary/10 dark:text-primary"
          : "border-slate-200 bg-[var(--surface-background)] text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#243140] dark:text-slate-200"
      )}
    >
      {children}
    </Link>
  );
}

type AssistantDetailModalProps = {
  assistant: AssistantRecord | null;
  open: boolean;
  onClose: () => void;
  onSave: (assistant: AssistantRecord) => void;
};

function AssistantDetailModal({
  assistant,
  open,
  onClose,
  onSave,
}: AssistantDetailModalProps) {
  const [formState, setFormState] = useState<AssistantRecord | null>(assistant);

  useEffect(() => {
    setFormState(assistant);
  }, [assistant]);

  if (!open || !formState) {
    return null;
  }

  const handleFieldChange = <K extends keyof AssistantRecord>(
    field: K,
    value: AssistantRecord[K]
  ) => {
    setFormState((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formState) {
      onSave(formState);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#111a24]">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className="size-12 rounded-full border border-slate-200 bg-cover bg-center dark:border-slate-700"
              style={{ backgroundImage: `url("${formState.avatar}")` }}
            />
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {formState.name}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {formState.subject} 조교 • 현재 상태 {formState.status}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span className={iconClass()}>close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 px-6 py-6 md:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              이름
              <input
                type="text"
                value={formState.name}
                onChange={(event) =>
                  handleFieldChange("name", event.target.value)
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              연락처
              <input
                type="tel"
                value={formState.phone}
                onChange={(event) =>
                  handleFieldChange("phone", event.target.value)
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              이메일
              <input
                type="email"
                value={formState.email}
                onChange={(event) =>
                  handleFieldChange("email", event.target.value)
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              담당 과목
              <input
                type="text"
                value={formState.subject}
                onChange={(event) =>
                  handleFieldChange("subject", event.target.value)
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              배정 클래스
              <input
                type="text"
                value={formState.className}
                onChange={(event) =>
                  handleFieldChange("className", event.target.value)
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              상태
              <select
                value={formState.status}
                onChange={(event) =>
                  handleFieldChange(
                    "status",
                    event.target.value as StatusOption
                  )
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-500 dark:text-slate-400 md:col-span-2">
              최근 업무
              <textarea
                rows={3}
                value={formState.recentTask}
                onChange={(event) =>
                  handleFieldChange("recentTask", event.target.value)
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </label>
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/40">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
            >
              <span className={iconClass("text-base")}>save</span>
              변경 사항 저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

type AssistantContractModalProps = {
  open: boolean;
  onClose: () => void;
  contracts: readonly ContractRecord[];
  assistants: readonly AssistantRecord[];
};

function AssistantContractModal({
  open,
  onClose,
  contracts,
  assistants,
}: AssistantContractModalProps) {
  const [sendMode, setSendMode] = useState(false);
  const [selectedAssistantId, setSelectedAssistantId] = useState(
    assistants[0]?.id ?? ""
  );
  const [sendStatus, setSendStatus] = useState<"idle" | "success">("idle");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [templateName, setTemplateName] = useState("표준 근로계약서 (2024)");
  const [uploadName, setUploadName] = useState<string | null>(null);
  const selectedAssistant = assistants.find(
    (assistant) => assistant.id === selectedAssistantId
  );

  if (!open) return null;

  const handleSendSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedAssistantId) return;
    setSendStatus("success");
    setTimeout(() => {
      setSendMode(false);
      setSendStatus("idle");
    }, 1500);
  };

  const handleTemplateUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadName(file.name);
      setTemplateName(file.name);
    }
  };

  const resetSendState = () => {
    setSendMode(false);
    setSendStatus("idle");
    setRecipientEmail("");
    setTemplateName("표준 근로계약서 (2024)");
    setUploadName(null);
    setTimeout(() => {
      setSendMode(false);
      setSendStatus("idle");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0f1722]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              조교 계약서 관리
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              서명 상태와 계약서 파일을 확인하고 관리합니다.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSendMode((prev) => !prev)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition",
                sendMode
                  ? "border-primary/40 bg-primary/10 text-primary dark:border-primary/40 dark:bg-primary/10 dark:text-primary"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              )}
            >
              <span className={iconClass("text-base")}>send</span>
              계약서 발송
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <span className={iconClass()}>close</span>
            </button>
          </div>
        </div>
        {sendMode ? (
          <form onSubmit={handleSendSubmit} className="px-6 py-4">
            <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-[#141f2b] dark:text-slate-300">
              선택한 조교의 이메일로 계약서 양식을 발송합니다. 서명 완료 시 자동
              저장되며, 전송 로그가 기록됩니다.
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-500 dark:text-slate-300">
                계약서 발송 대상
                <select
                  value={selectedAssistantId}
                  onChange={(event) =>
                    setSelectedAssistantId(event.target.value)
                  }
                  className="rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="">조교 선택</option>
                  {assistants.map((assistant) => (
                    <option key={assistant.id} value={assistant.id}>
                      {assistant.name} • {assistant.subject}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-500 dark:text-slate-300">
                수신 이메일
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(event) => setRecipientEmail(event.target.value)}
                  placeholder="assist@academy.com"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-500 dark:text-slate-300">
                발송 양식
                <select
                  value={templateName}
                  onChange={(event) => setTemplateName(event.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option>표준 근로계약서 (2024)</option>
                  <option>조교 단기 계약서</option>
                  {uploadName ? (
                    <option value={uploadName}>{uploadName}</option>
                  ) : null}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-500 dark:text-slate-300">
                계약서 템플릿 업로드
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleTemplateUpload}
                  className="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-600 file:mr-3 file:rounded file:border-none file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-dark dark:border-slate-700 dark:text-slate-300"
                />
                {uploadName ? (
                  <span className="text-xs text-primary mt-1">
                    업로드된 파일: {uploadName}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 mt-1">
                    PDF 또는 DOC/DOCX 업로드 가능
                  </span>
                )}
              </label>
            </div>
            <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-300">
              <p className="font-semibold text-slate-700 dark:text-slate-100">
                이메일 미리보기
              </p>
              <p className="mt-2 text-sm leading-6">
                안녕하세요 {selectedAssistant?.name ?? "조교"}님, <br />
                {templateName} 파일을 확인하시고 3일 이내에 서명 부탁드립니다.
                서명 완료 시 자동으로 시스템에 반영됩니다.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={resetSendState}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={
                  !selectedAssistantId ||
                  !recipientEmail ||
                  sendStatus === "success"
                }
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className={iconClass("text-base")}>outgoing_mail</span>
                {sendStatus === "success" ? "발송 완료!" : "계약서 발송"}
              </button>
            </div>
          </form>
        ) : null}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
          <div className="grid gap-3">
            {contracts.map((contract) => (
              <div
                key={contract.fileName}
                className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-primary/40 hover:shadow-md dark:border-slate-700 dark:bg-[#121c2a]"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">
                      {contract.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {contract.subject} • {contract.className}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      contract.status === "서명 완료" &&
                        "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300",
                      contract.status === "서명 대기" &&
                        "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300",
                      contract.status === "재전송 필요" &&
                        "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-300"
                    )}
                  >
                    {contract.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <span>업데이트: {contract.updatedAt}</span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <span className={iconClass("text-base")}>download</span>
                    {contract.fileName}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/40">
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            계약서 일괄 다운로드
          </button>
          <button
            type="button"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
          >
            미제출자 알림 발송
          </button>
        </div>
      </div>
    </div>
  );
}

function mapAssistantEntityToRecord(
  assistant: AssistantEntity,
  index: number
): AssistantRecord {
  const fallbackAvatar = buildAvatarPlaceholder(assistant.name, index);
  return {
    id: assistant.id,
    name: assistant.name,
    avatar: assistant.avatarUrl ?? fallbackAvatar,
    subject: assistant.subject,
    phone: assistant.phone,
    email: assistant.email ?? `${assistant.id}@academy.com`,
    className: assistant.className,
    recentTask:
      assistant.recentTask && assistant.recentTask.trim()
        ? assistant.recentTask
        : "업무 배정 예정",
    rating:
      typeof assistant.rating === "number"
        ? assistant.rating.toFixed(1)
        : "4.5",
    status: assistant.status,
  };
}

function buildContractRecords(assistants: AssistantRecord[]): ContractRecord[] {
  const statusSequence: ContractRecord["status"][] = [
    "서명 완료",
    "서명 대기",
    "재전송 필요",
  ];

  return assistants.slice(0, 3).map((assistant, index) => {
    const status = statusSequence[index % statusSequence.length];
    const date = (18 - index).toString().padStart(2, "0");
    return {
      assistantId: assistant.id,
      name: assistant.name,
      subject: assistant.subject,
      className: assistant.className,
      status,
      updatedAt: `2024-06-${date}`,
      fileName: `2024-1학기_${assistant.name.replace(/\s+/g, "")}_계약서.pdf`,
    };
  });
}

function buildMetricCards(
  assistants: AssistantRecord[],
  contracts: ContractRecord[]
) {
  const totalAssistants = assistants.length;
  const activeAssistants = assistants.filter(
    (assistant) => assistant.status === "근무중"
  ).length;
  const pendingContracts = contracts.filter(
    (contract) => contract.status !== "서명 완료"
  ).length;
  const activeRatio =
    totalAssistants > 0
      ? Math.round((activeAssistants / totalAssistants) * 100)
      : 0;
  const newlyAdded = Math.max(totalAssistants - 4, 0);

  return [
    {
      label: "전체 배정 조교",
      value: `${totalAssistants}`,
      delta: newlyAdded ? `+${newlyAdded}명` : "업데이트 완료",
      icon: "groups",
    },
    {
      label: "현재 근무 중",
      value: `${activeAssistants}`,
      delta: `${activeRatio}%`,
      icon: "badge",
    },
    {
      label: "조교 계약서 관리",
      value: `${contracts.length}건`,
      delta: `미제출 ${pendingContracts}건`,
      icon: "description",
      interactive: true,
    },
    {
      label: "업무 지시 내역",
      value: "128건",
      delta: "이번 주 +12건",
      icon: "assignment_turned_in",
      href: "/assistant-task-list",
    },
  ];
}

function buildAvatarPlaceholder(name: string, index: number) {
  const colors = ["0D8ABC", "6366F1", "059669", "9333EA"];
  const color = colors[index % colors.length];
  const initials = encodeURIComponent(name.slice(0, 2));
  return `https://ui-avatars.com/api/?background=${color}&color=fff&name=${initials}`;
}

const statusVisuals: Record<StatusOption, { dot: string; select: string }> = {
  근무중: {
    dot: "bg-emerald-500",
    select: "border-emerald-100 focus:ring-2 focus:ring-emerald-300/60",
  },
  휴가: {
    dot: "bg-amber-400",
    select: "border-amber-100 focus:ring-2 focus:ring-amber-300/60",
  },
  퇴사: {
    dot: "bg-slate-400",
    select: "border-slate-200 focus:ring-2 focus:ring-slate-400/60",
  },
};
