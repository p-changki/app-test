"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import type { StudentEditProfile } from "@/features/student-management/types";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

type StudentEditModalProps = {
  student: StudentEditProfile;
};

type FormState = {
  name: string;
  school: string;
  grade: string;
  status: string;
  contacts: StudentEditProfile["contacts"];
};

export function StudentEditModal({ student }: StudentEditModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>(() => ({
    name: student.name,
    school: student.school,
    grade: student.grade,
    status: student.status,
    contacts: student.contacts.map((contact) => ({ ...contact })),
  }));
  const [isSaving, setIsSaving] = useState(false);
  const [savedHint, setSavedHint] = useState<string | null>(null);

  const handleOpen = () => {
    setFormState({
      name: student.name,
      school: student.school,
      grade: student.grade,
      status: student.status,
      contacts: student.contacts.map((contact) => ({ ...contact })),
    });
    setSavedHint(null);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsSaving(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSavedHint("변경사항이 저장되었습니다.");
      setTimeout(() => {
        setSavedHint(null);
        handleClose();
      }, 1200);
    }, 600);
  };

  const updateField = (key: keyof FormState, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateContact = (index: number, value: string) => {
    setFormState((prev) => {
      const contacts = [...prev.contacts];
      contacts[index] = { ...contacts[index], value };
      return { ...prev, contacts };
    });
  };

  return (
    <>
      <button
        type="button"
        className="flex items-center justify-center gap-2 rounded-lg border border-[#283039] bg-[#283039] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#3b4754]"
        onClick={handleOpen}
      >
        <span className={iconClass("text-[20px]")}>edit</span>
        정보 수정
      </button>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />
          <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-[#283039] bg-[#0b1118] p-6 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-primary">
                  학생 정보 수정
                </p>
                <h3 className="mt-1 text-2xl font-semibold">{student.name}</h3>
                <p className="text-sm text-slate-400">
                  학적, 학급, 연락처 정보를 한 번에 수정할 수 있습니다.
                </p>
              </div>
              <button
                type="button"
                className="rounded-full border border-[#1f2831] bg-[#141c23] p-2 text-slate-400 transition hover:text-white"
                onClick={handleClose}
                aria-label="닫기"
              >
                <span className={iconClass("text-[20px]")}>close</span>
              </button>
            </div>

            <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="학생 이름"
                  value={formState.name}
                  onChange={(value) => updateField("name", value)}
                  icon="person"
                />
                <Field
                  label="현재 학급/반"
                  value={formState.grade}
                  onChange={(value) => updateField("grade", value)}
                  icon="military_tech"
                />
                <Field
                  label="학교"
                  value={formState.school}
                  onChange={(value) => updateField("school", value)}
                  icon="school"
                />
                <Field
                  label="상태"
                  value={formState.status}
                  onChange={(value) => updateField("status", value)}
                  icon="verified"
                />
              </div>

              <div className="rounded-2xl border border-[#1f2831] bg-[#111923] p-4">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <span className={iconClass("text-[18px] text-primary")}>
                      call
                    </span>
                    연락처 정보
                  </div>
                  <span className="text-xs text-slate-400">
                    총 {formState.contacts.length}건
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {formState.contacts.map((contact, index) => (
                    <label
                      key={`${contact.label}-${index}`}
                      className="flex flex-col gap-1 text-sm text-slate-300"
                    >
                      <span className="text-xs text-slate-400">
                        {contact.label}
                      </span>
                      <div className="relative">
                        <span
                          className={cn(
                            iconClass(
                              "absolute left-3 top-1/2 -translate-y-1/2"
                            ),
                            "text-slate-500"
                          )}
                        >
                          {contact.icon}
                        </span>
                        <input
                          value={contact.value}
                          onChange={(event) =>
                            updateContact(index, event.target.value)
                          }
                          className="w-full rounded-xl border border-[#1f2831] bg-[#0b1118] py-3 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none"
                        />
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-[#1f2831] bg-[#111923] p-4 text-sm text-slate-300">
                <label className="text-xs uppercase tracking-wide text-slate-500">
                  메모
                </label>
                <textarea
                  className="min-h-[120px] rounded-xl border border-[#1f2831] bg-[#0b1118] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none"
                  placeholder="최근 상담 내용, 관리 포인트 등을 작성해 주세요."
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                {savedHint ? (
                  <p className="text-sm text-emerald-400">{savedHint}</p>
                ) : (
                  <p className="text-sm text-slate-400">
                    저장 시 학사 담당자에게 알림이 전송됩니다.
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-[#1f2831] px-4 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
                    onClick={handleClose}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className={cn(
                      "flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition",
                      isSaving ? "opacity-70" : "hover:bg-blue-600"
                    )}
                    disabled={isSaving}
                  >
                    <span className={iconClass("text-[18px]")}>
                      {isSaving ? "progress_activity" : "task_alt"}
                    </span>
                    {isSaving ? "저장 중..." : "변경사항 적용"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: string;
};

function Field({ label, value, onChange, icon }: FieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-300">
      <span className="text-xs text-slate-400">{label}</span>
      <div className="relative">
        <span
          className={cn(
            iconClass("absolute left-3 top-1/2 -translate-y-1/2"),
            "text-slate-500"
          )}
        >
          {icon}
        </span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-[#1f2831] bg-[#0b1118] py-3 pl-10 pr-3 text-sm text-white placeholder:text-slate-600 focus:border-primary focus:outline-none"
        />
      </div>
    </label>
  );
}
