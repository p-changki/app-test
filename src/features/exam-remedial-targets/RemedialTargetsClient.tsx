"use client";

import { useEffect, useMemo, useState } from "react";

import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";
import type { RemedialStudent } from "@/types/exams";

type RemedialTargetsClientProps = {
  classOptions: readonly string[];
  examOptions: readonly string[];
  students: RemedialStudent[];
  onSend?: (payload: {
    exam: string;
    students: RemedialStudent[];
    email: string;
  }) => void;
};

export function RemedialTargetsClient({
  classOptions,
  examOptions,
  students,
  onSend,
}: RemedialTargetsClientProps) {
  const defaultMessage =
    "안녕하세요 {학생명}님,\n지난 {시험명} 재시험이 필요합니다.\n링크를 통해 참석 여부를 알려주세요.";
  const [selectedClass, setSelectedClass] = useState(classOptions[0]);
  const [selectedExam, setSelectedExam] = useState(examOptions[0]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [channel, setChannel] = useState<"kakao" | "sms">("kakao");
  const [message, setMessage] = useState(defaultMessage);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const closeSendModal = () => {
    setSendModalOpen(false);
    setEmail("");
    setMessage(defaultMessage);
    setChannel("kakao");
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchClass =
        selectedClass === classOptions[0] ||
        student.classLabel.includes(selectedClass.replace("전체 ", ""));
      const matchExam =
        selectedExam === examOptions[0] ||
        student.examName.includes(selectedExam);
      return matchClass && matchExam;
    });
  }, [students, selectedClass, selectedExam, classOptions, examOptions]);

  const toggleAll = (checked: boolean) => {
    setSelectedIds(
      checked ? filteredStudents.map((student) => student.id) : []
    );
  };

  const toggleOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((value) => value !== id)
    );
  };

  const handleSendConfirm = () => {
    const recipients = students.filter((student) =>
      selectedIds.includes(student.id)
    );
    if (recipients.length === 0) return;
    if (onSend) {
      onSend({ exam: selectedExam, students: recipients, email });
    }
    setSendModalOpen(false);
    setEmail("");
    setMessage(defaultMessage);
    setChannel("kakao");
  };

  const sendDisabled = selectedIds.length === 0;

  const handleCompleteSelected = () => {
    if (selectedIds.length === 0) return;
    setCompletedIds((prev) => {
      const next = new Set(prev);
      selectedIds.forEach((id) => next.add(id));
      return Array.from(next);
    });
    setSelectedIds([]);
  };

  useEffect(() => {
    const detail = { disabled: sendDisabled, count: selectedIds.length };
    window.dispatchEvent(new CustomEvent("remedial-sendstate", { detail }));
  }, [sendDisabled, selectedIds.length]);

  useEffect(() => {
    const handler = () => {
      if (!sendDisabled) {
        setSendModalOpen(true);
      }
    };
    window.addEventListener("remedial-request-send", handler);
    return () => window.removeEventListener("remedial-request-send", handler);
  }, [sendDisabled]);

  return (
    <>
      <section className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <InlineSelect
          label="수업"
          options={classOptions}
          value={selectedClass}
          onChange={setSelectedClass}
        />
        <InlineSelect
          label="시험"
          options={examOptions}
          value={selectedExam}
          onChange={setSelectedExam}
        />
        <div className="ml-auto flex items-center gap-2">
          <button className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
            <span className={iconClass("text-xl")}>filter_list</span>
          </button>
          <button
            onClick={() => {
              setSelectedClass(classOptions[0]);
              setSelectedExam(examOptions[0]);
            }}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <span className={iconClass("text-xl")}>refresh</span>
          </button>
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={handleCompleteSelected}
            className={cn(
              "rounded-lg px-3 py-2 text-xs font-semibold shadow-sm transition",
              selectedIds.length === 0
                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                : "bg-primary text-white hover:bg-primary/90"
            )}
          >
            완료 표시
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
          선택된 시험:{" "}
          <strong className="text-slate-900 dark:text-white">
            {selectedExam}
          </strong>
        </div>
        <div className="overflow-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <th className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-800"
                    checked={
                      selectedIds.length > 0 &&
                      selectedIds.length === filteredStudents.length
                    }
                    aria-label="모두 선택"
                    onChange={(event) => toggleAll(event.target.checked)}
                  />
                </th>
                <th className="px-6 py-4">학생 정보</th>
                <th className="px-6 py-4">미통과 시험명</th>
                <th className="px-6 py-4">점수 / 컷</th>
                <th className="px-6 py-4">미통과 일자</th>
                <th className="px-6 py-4 text-right">재시험 확인</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
              {filteredStudents.map((student) => (
                <StudentRow
                  key={student.id}
                  row={student}
                  checked={selectedIds.includes(student.id)}
                  onToggle={toggleOne}
                  completed={completedIds.includes(student.id)}
                />
              ))}
              {filteredStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
                  >
                    선택된 조건에 해당하는 학생이 없습니다.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {sendModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeSendModal}
          />
          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0f1722]">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  알림 발송
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  선택된 시험과 학생에게 재시험 알림을 보냅니다.
                </p>
              </div>
              <button
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                onClick={closeSendModal}
              >
                <span className={iconClass("text-base")}>close</span>
              </button>
            </div>
            <div className="space-y-4 px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  선택한 시험
                </p>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedExam}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  발송 채널
                  <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
                    <label className="flex flex-1 items-center gap-2 text-sm font-medium">
                      <input
                        type="radio"
                        name="channel"
                        value="kakao"
                        checked={channel === "kakao"}
                        onChange={() => setChannel("kakao")}
                      />
                      카카오톡 알림톡
                    </label>
                    <label className="flex flex-1 items-center gap-2 text-sm font-medium">
                      <input
                        type="radio"
                        name="channel"
                        value="sms"
                        checked={channel === "sms"}
                        onChange={() => setChannel("sms")}
                      />
                      SMS
                    </label>
                  </div>
                </label>
                <label className="flex flex-1 flex-col gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  발송 이메일
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="notify@classtrack.academy"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-primary dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                  />
                </label>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  발송 메시지
                </label>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={5}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-primary dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                />
                <p className="mt-1 text-xs text-slate-400">
                  변수: {"{학생명}"} {"{시험명}"} {"{재시험일}"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  대상 학생 ({selectedIds.length}명)
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  {students
                    .filter((student) => selectedIds.includes(student.id))
                    .map((student) => (
                      <li
                        key={student.id}
                        className="text-slate-700 dark:text-slate-200"
                      >
                        • {student.name} ({student.classLabel})
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-900/30">
              <button
                type="button"
                onClick={closeSendModal}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                취소
              </button>
              <button
                type="button"
                disabled={!email || selectedIds.length === 0}
                onClick={handleSendConfirm}
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className={iconClass("text-base")}>
                  {channel === "kakao" ? "chat" : "sms"}
                </span>
                {channel === "kakao" ? "카카오톡 발송" : "SMS 발송"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function InlineSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
      {label}:
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function StudentRow({
  row,
  checked,
  onToggle,
  completed,
}: {
  row: RemedialStudent;
  checked: boolean;
  onToggle: (id: string, next: boolean) => void;
  completed: boolean;
}) {
  return (
    <tr className="transition hover:bg-slate-50 dark:hover:bg-slate-800/30">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onToggle(row.id, event.target.checked)}
          disabled={completed}
          className="rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-800"
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
              row.badgeClass
            )}
          >
            {row.initials}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {row.name}
            </p>
            <p className="text-xs text-slate-500">{row.classLabel}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
        {row.examName}
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-black text-red-500">{row.score}</span>
        <span className="text-xs text-slate-400"> / {row.cutline}</span>
      </td>
      <td className="px-6 py-4 text-sm text-slate-500">{row.failDate}</td>
      <td className="px-6 py-4 text-right">
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold",
            completed
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              completed ? "bg-emerald-500" : "bg-slate-400"
            )}
          />
          {completed ? "완료 표시" : "알림 예정"}
        </span>
      </td>
    </tr>
  );
}
