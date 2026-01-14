"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";
import { studentRecords } from "@/features/student-management/data";

export type ScheduleSlot = {
  id: string;
  day: string;
  start: string;
  end: string;
};

type BasicInfoValues = {
  title: string;
  subject: string;
  grade: string;
  startDate: string;
  assistant: string;
  status: string;
};

type BasicInfoSectionProps = {
  values: BasicInfoValues;
  onChange: (field: keyof BasicInfoValues, value: string) => void;
};

export function BasicInfoSection({ values, onChange }: BasicInfoSectionProps) {
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
            value={values.title}
            onChange={(event) => onChange("title", event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-gray-50 p-3 text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-600 dark:bg-[#111418] dark:text-white"
          />
        </FormField>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="과목" required>
            <input
              type="text"
              placeholder="예: 수학"
              value={values.subject}
              onChange={(event) => onChange("subject", event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-gray-50 p-3 text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-600 dark:bg-[#111418] dark:text-white"
            />
          </FormField>
          <FormField label="학년" required>
            <input
              type="text"
              placeholder="예: 고2"
              value={values.grade}
              onChange={(event) => onChange("grade", event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-gray-50 p-3 text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-600 dark:bg-[#111418] dark:text-white"
            />
          </FormField>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="개강일" required>
            <input
              type="date"
              value={values.startDate}
              onChange={(event) => onChange("startDate", event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-gray-50 p-3 text-slate-900 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-600 dark:bg-[#111418] dark:text-white"
            />
          </FormField>
          <FormField label="수업 상태" required>
            <div className="relative">
              <select
                value={values.status}
                onChange={(event) => onChange("status", event.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-gray-50 p-3 pr-10 text-slate-900 focus:ring-2 focus:ring-primary dark:border-slate-600 dark:bg-[#111418] dark:text-white"
              >
                <option value="">상태 선택</option>
                <option value="진행중">진행중</option>
                <option value="종강">종강</option>
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
          <FormField label="담당 조교">
            <div className="relative">
              <select
                value={values.assistant}
                onChange={(event) => onChange("assistant", event.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-gray-50 p-3 pr-10 text-slate-900 focus:ring-2 focus:ring-primary dark:border-slate-600 dark:bg-[#111418] dark:text-white"
              >
                <option value="">조교 선택</option>
                <option value="이하늘 조교">이하늘 조교</option>
                <option value="정민우 조교">정민우 조교</option>
                <option value="박서윤 조교">박서윤 조교</option>
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
        </div>
      </div>
    </section>
  );
}

type LogisticsSectionProps = {
  onCountsChange?: (counts: { manual: number; existing: number }) => void;
};

export function LogisticsSection({ onCountsChange }: LogisticsSectionProps) {
  const [activeTab, setActiveTab] = useState<"manual" | "existing">("manual");
  const [students, setStudents] = useState([
    {
      name: "",
      phone: "",
      school: "",
      grade: "",
      parentPhone: "",
    },
  ]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const { data: existingStudents = studentRecords } = useQuery({
    queryKey: ["student-records"],
    queryFn: async () => studentRecords,
    staleTime: 1000 * 60 * 10,
  });

  const handleChange = (
    index: number,
    field: keyof (typeof students)[number],
    value: string
  ) => {
    setStudents((prev) =>
      prev.map((student, idx) =>
        idx === index ? { ...student, [field]: value } : student
      )
    );
  };

  const handleAddRow = () => {
    setStudents((prev) => [
      ...prev,
      { name: "", phone: "", school: "", grade: "", parentPhone: "" },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    setStudents((prev) => prev.filter((_, idx) => idx !== index));
  };

  const toggleStudent = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const filteredStudents = existingStudents.filter((student) => {
    const target = `${student.name} ${student.school} ${student.grade ?? ""} ${
      student.contact ?? ""
    }`
      .toLowerCase()
      .normalize("NFC");
    return target.includes(studentSearch.trim().toLowerCase());
  });

  useEffect(() => {
    onCountsChange?.({
      manual: students.length,
      existing: selectedStudentIds.length,
    });
  }, [onCountsChange, selectedStudentIds.length, students.length]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#1e2630]">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
        <span className={iconClass("text-primary")}>
          settings_accessibility
        </span>
        수기입력 학생 등록
      </h3>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-2 text-sm dark:border-slate-700 dark:bg-[#0c1219]">
          <button
            type="button"
            className={cn(
              "flex-1 rounded-lg px-4 py-2 font-semibold transition",
              activeTab === "manual"
                ? "bg-primary text-white"
                : "text-slate-500 hover:text-primary dark:text-slate-300"
            )}
            onClick={() => setActiveTab("manual")}
          >
            수기 입력
          </button>
          <button
            type="button"
            className={cn(
              "flex-1 rounded-lg px-4 py-2 font-semibold transition",
              activeTab === "existing"
                ? "bg-primary text-white"
                : "text-slate-500 hover:text-primary dark:text-slate-300"
            )}
            onClick={() => setActiveTab("existing")}
          >
            기존 학생 선택
          </button>
        </div>

        {activeTab === "manual" ? (
          <>
            {students.map((student, index) => (
              <div
                key={`manual-student-${index}`}
                className="rounded-xl border border-slate-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-[#111418]"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    학생 정보 {index + 1}
                  </p>
                  {students.length > 1 ? (
                    <button
                      type="button"
                      className="text-sm font-medium text-rose-500 hover:text-rose-400"
                      onClick={() => handleRemoveRow(index)}
                    >
                      삭제
                    </button>
                  ) : null}
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <InputField
                    label="학생 이름"
                    placeholder="예: 김민준"
                    value={student.name}
                    onChange={(value) => handleChange(index, "name", value)}
                  />
                  <InputField
                    label="연락처"
                    placeholder="예: 010-1234-5678"
                    value={student.phone}
                    onChange={(value) => handleChange(index, "phone", value)}
                  />
                  <InputField
                    label="학생 학교"
                    placeholder="예: 서울고등학교"
                    value={student.school}
                    onChange={(value) => handleChange(index, "school", value)}
                  />
                  <InputField
                    label="학생 학년"
                    placeholder="예: 2학년"
                    value={student.grade}
                    onChange={(value) => handleChange(index, "grade", value)}
                  />
                  <InputField
                    label="학부모 번호"
                    placeholder="예: 010-9876-5432"
                    value={student.parentPhone}
                    onChange={(value) =>
                      handleChange(index, "parentPhone", value)
                    }
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary hover:text-primary dark:border-slate-600 dark:text-slate-300"
              onClick={handleAddRow}
            >
              <span className={iconClass("text-[18px]")}>add</span>
              학생 추가
            </button>
          </>
        ) : (
          <div className="space-y-4 rounded-xl border border-slate-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-[#111418]">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-300">
                학생 검색
              </label>
              <input
                type="text"
                value={studentSearch}
                onChange={(event) => setStudentSearch(event.target.value)}
                placeholder="학생 이름 또는 학교 검색"
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-600 dark:bg-[#0c1219] dark:text-white"
              />
            </div>
            <div className="max-h-[260px] space-y-2 overflow-y-auto pr-1">
              {filteredStudents.map((student) => (
                <label
                  key={student.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-primary/50 dark:border-slate-600 dark:bg-[#0c1219] dark:text-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                      checked={selectedStudentIds.includes(student.id)}
                      onChange={() => toggleStudent(student.id)}
                    />
                    <div>
                      <p className="font-semibold">{student.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {student.school} · {student.grade ?? "학년 미등록"}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">
                    {student.contact ?? "연락처 미등록"}
                  </span>
                </label>
              ))}
              {filteredStudents.length === 0 ? (
                <p className="text-center text-xs text-slate-400">
                  검색 결과가 없습니다.
                </p>
              ) : null}
            </div>
            <div className="rounded-lg border border-dashed border-slate-300 p-3 text-xs text-slate-500 dark:border-slate-600 dark:text-slate-400">
              선택된 학생 {selectedStudentIds.length}명
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function InputField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-600 dark:bg-[#0c1219] dark:text-white"
      />
    </label>
  );
}

type ScheduleSectionProps = {
  slots: ScheduleSlot[];
  onChange: (id: string, field: keyof ScheduleSlot, value: string) => void;
};

export function ScheduleSection({ slots, onChange }: ScheduleSectionProps) {
  const dayOptions = [
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
    "일요일",
  ];

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
        {slots.map((slot) => (
          <div
            key={slot.id}
            className="grid grid-cols-1 items-center gap-3 rounded-lg border border-slate-200 bg-gray-50 p-3 dark:border-slate-700 dark:bg-[#111418] md:grid-cols-12"
          >
            <div className="md:col-span-3">
              <select
                className="w-full appearance-none rounded border border-slate-300 bg-white p-2 text-sm text-slate-900 focus:ring-2 focus:ring-primary dark:border-slate-600 dark:bg-[#1e2630] dark:text-white"
                value={slot.day}
                onChange={(event) =>
                  onChange(slot.id, "day", event.target.value)
                }
              >
                {dayOptions.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-4">
              <input
                type="time"
                value={slot.start}
                onChange={(event) =>
                  onChange(slot.id, "start", event.target.value)
                }
                className="w-full rounded border border-slate-300 bg-white p-2 text-sm text-slate-900 focus:ring-2 focus:ring-primary dark:border-slate-600 dark:bg-[#1e2630] dark:text-white"
              />
            </div>
            <div className="md:col-span-4">
              <input
                type="time"
                value={slot.end}
                onChange={(event) =>
                  onChange(slot.id, "end", event.target.value)
                }
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

type DescriptionSectionProps = {
  value: string;
  onChange: (value: string) => void;
};

export function DescriptionSection({
  value,
  onChange,
}: DescriptionSectionProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#1e2630]">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
        <span className={iconClass("text-primary")}>description</span>
        상세 설명
      </h3>
      <textarea
        rows={6}
        placeholder="커리큘럼 상세 내용, 수업 목표, 준비물 등을 입력하세요."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-none rounded-lg border border-slate-300 bg-gray-50 p-4 text-slate-900 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-600 dark:bg-[#111418] dark:text-white"
      />
    </section>
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
