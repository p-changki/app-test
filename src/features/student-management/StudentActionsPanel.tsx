"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";

import type {
  ClassChip,
  HeaderAction,
  StudentRecord,
} from "@/features/student-management/types";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

type StudentActionsPanelProps = {
  actions: HeaderAction[];
  students: StudentRecord[];
  classes: ClassChip[];
  selectedStudents: StudentRecord[];
  onAlertComplete?: () => void;
};

type RegisterFormState = {
  name: string;
  studentId: string;
  school: string;
  grade: string;
  contact: string;
  parentContact: string;
  classId: string;
};

const emptyRegisterForm: RegisterFormState = {
  name: "",
  studentId: "",
  school: "",
  grade: "",
  contact: "",
  parentContact: "",
  classId: "",
};

export function StudentActionsPanel({
  actions,
  students,
  classes,
  selectedStudents,
  onAlertComplete,
}: StudentActionsPanelProps) {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [classMoveOpen, setClassMoveOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [registerForm, setRegisterForm] =
    useState<RegisterFormState>(emptyRegisterForm);
  const [registerStatus, setRegisterStatus] = useState<
    "idle" | "saving" | "success"
  >("idle");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [targetClass, setTargetClass] = useState("");
  const [classMoveMemo, setClassMoveMemo] = useState("");
  const [classMoveStatus, setClassMoveStatus] = useState<
    "idle" | "saving" | "success"
  >("idle");
  const [alertStatus, setAlertStatus] = useState<
    "idle" | "sending" | "success"
  >("idle");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTemplate, setAlertTemplate] = useState("absent-reminder");
  const [alertError, setAlertError] = useState<string | null>(null);
  const [alertChannel, setAlertChannel] = useState<"kakao" | "sms">("kakao");
  const [alertTargetRecipient, setAlertTargetRecipient] = useState<
    "all" | "student" | "parent"
  >("all");
  const [alertSchedule, setAlertSchedule] = useState("before-1hour");
  const [alertAutoSend, setAlertAutoSend] = useState(false);
  const [activeAlertStudent, setActiveAlertStudent] =
    useState<StudentRecord | null>(null);

  const classOptions = useMemo(
    () =>
      classes.filter(
        (chip) => chip.label && !chip.isDivider && !chip.isAddButton
      ),
    [classes]
  );
  const expectedRecipients =
    selectedStudents.length * (alertTargetRecipient === "all" ? 2 : 1);

  const handleActionClick = (actionId: string) => {
    if (actionId === "bulk-transfer") {
      setSelectedIds([]);
      setTargetClass("");
      setClassMoveMemo("");
      setClassMoveStatus("idle");
      setClassMoveOpen(true);
    } else if (actionId === "add-student") {
      setRegisterForm(emptyRegisterForm);
      setRegisterStatus("idle");
      setRegisterOpen(true);
    } else if (actionId === "send-alert") {
      if (selectedStudents.length === 0) {
        setAlertError("알림을 보낼 학생을 테이블에서 선택해 주세요.");
        setTimeout(() => setAlertError(null), 2000);
        return;
      }
      const targetStudent = selectedStudents[0];
      setActiveAlertStudent(targetStudent);
      setAlertMessage(
        `[Academix] 수업 알림\n안녕하세요 ${
          targetStudent.name
        }님,\n오늘 {시간}에 '{수업명}' 수업이 예정되어 있습니다.\n304호 강의실로 늦지 않게 와주세요.\n* 문의: 02-1234-5678`
      );
      setAlertTemplate("absent-reminder");
      setAlertChannel("kakao");
      setAlertTargetRecipient("all");
      setAlertSchedule("before-1hour");
      setAlertAutoSend(false);
      setAlertStatus("idle");
      setAlertOpen(true);
    }
  };

  const handleRegisterChange = (
    field: keyof RegisterFormState,
    value: string
  ) => {
    setRegisterForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegisterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRegisterStatus("saving");
    setTimeout(() => {
      setRegisterStatus("success");
      setTimeout(() => {
        setRegisterOpen(false);
        setRegisterStatus("idle");
      }, 1200);
    }, 700);
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.length === students.length
        ? []
        : students.map((student) => student.id)
    );
  };

  const handleClassMoveSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedIds.length || !targetClass) {
      return;
    }
    setClassMoveStatus("saving");
    setTimeout(() => {
      setClassMoveStatus("success");
      setTimeout(() => {
        setClassMoveOpen(false);
        setClassMoveStatus("idle");
        setSelectedIds([]);
        setTargetClass("");
        setClassMoveMemo("");
      }, 1000);
    }, 700);
  };

  const handleAlertSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeAlertStudent) {
      setAlertError("알림을 보낼 학생을 선택해 주세요.");
      return;
    }
    setAlertStatus("sending");
    setTimeout(() => {
      setAlertStatus("success");
      setTimeout(() => {
        setAlertOpen(false);
        setAlertStatus("idle");
        setActiveAlertStudent(null);
        onAlertComplete?.();
      }, 1000);
    }, 800);
  };

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {actions.map((action) => {
          const labelForMobile =
            action.id === "bulk-transfer" ||
            action.id === "add-student" ||
            action.id === "send-alert"
              ? action.label
              : action.label.replace(" ", "");

          const isInteractive =
            action.id === "bulk-transfer" ||
            action.id === "add-student" ||
            action.id === "send-alert";

          return (
            <button
              key={action.id}
              type="button"
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors sm:w-auto",
                action.variant === "primary"
                  ? "bg-primary text-white shadow-sm shadow-primary/30 hover:bg-[#1a6bbd]"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
                !isInteractive && "cursor-default"
              )}
              onClick={
                isInteractive ? () => handleActionClick(action.id) : undefined
              }
            >
              <span className={iconClass("text-[18px]")}>{action.icon}</span>
              <span className="hidden sm:inline">{action.label}</span>
              <span className="sm:hidden">{labelForMobile}</span>
            </button>
          );
        })}
      </div>
      {alertError ? (
        <p className="text-sm text-rose-400">{alertError}</p>
      ) : (
        <p className="text-sm text-slate-400">
          선택된 학생{" "}
          <span className="font-semibold text-white">
            {selectedStudents.length}
          </span>
          명
        </p>
      )}

      {registerOpen && (
        <Modal
          onClose={() => setRegisterOpen(false)}
          className="rounded-3xl border border-slate-800 bg-[#05090f] p-6 text-white"
        >
          <div className="flex flex-col gap-4">
            <header className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-primary">
                  학생 등록
                </p>
                <h3 className="text-2xl font-semibold text-white">
                  신규 학생 추가
                </h3>
                <p className="text-sm text-slate-400">
                  등록 후 학적과 수업 정보를 바로 연결할 수 있습니다.
                </p>
              </div>
              <button
                type="button"
                className="rounded-full border border-slate-800 p-2 text-slate-400 transition hover:text-white"
                onClick={() => setRegisterOpen(false)}
              >
                <span className={iconClass("text-[20px]")}>close</span>
              </button>
            </header>
            <form className="space-y-4" onSubmit={handleRegisterSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="학생 이름"
                  placeholder="김민준"
                  value={registerForm.name}
                  onChange={(value) => handleRegisterChange("name", value)}
                />
                <FormField
                  label="학생 ID"
                  placeholder="ST-2024001"
                  value={registerForm.studentId}
                  onChange={(value) => handleRegisterChange("studentId", value)}
                />
                <FormField
                  label="학교"
                  placeholder="서울고등학교"
                  value={registerForm.school}
                  onChange={(value) => handleRegisterChange("school", value)}
                />
                <FormField
                  label="학년"
                  placeholder="2학년"
                  value={registerForm.grade}
                  onChange={(value) => handleRegisterChange("grade", value)}
                />
                <FormField
                  label="연락처"
                  placeholder="010-1234-5678"
                  value={registerForm.contact}
                  onChange={(value) => handleRegisterChange("contact", value)}
                />
                <FormField
                  label="학부모 연락처"
                  placeholder="010-9876-5432"
                  value={registerForm.parentContact}
                  onChange={(value) =>
                    handleRegisterChange("parentContact", value)
                  }
                />
                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  <span>배정 수업</span>
                  <select
                    className="rounded-lg border border-slate-800 bg-[#0c1219] px-3 py-2 text-sm text-white outline-none focus:border-primary"
                    value={registerForm.classId}
                    onChange={(event) =>
                      handleRegisterChange("classId", event.target.value)
                    }
                  >
                    <option value="">선택하세요</option>
                    {classOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label ?? "미지정"}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-slate-300">추가 메모</label>
                <textarea
                  className="min-h-[90px] rounded-xl border border-slate-800 bg-[#0c1219] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none"
                  placeholder="상담 기록이나 배정 요청 사항을 입력하세요."
                />
              </div>
              <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
                {registerStatus === "success" ? (
                  <p className="text-sm text-emerald-400">
                    학생 등록이 완료되었어요.
                  </p>
                ) : (
                  <p className="text-sm text-slate-400">
                    저장 시 학사 담당자에게 자동으로 공유됩니다.
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:text-white"
                    onClick={() => setRegisterOpen(false)}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className={cn(
                      "rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition",
                      registerStatus === "saving"
                        ? "opacity-70"
                        : "hover:bg-[#1a6bbd]"
                    )}
                  >
                    {registerStatus === "saving" ? "등록 중..." : "학생 등록"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {classMoveOpen && (
        <Modal
          onClose={() => setClassMoveOpen(false)}
          className="rounded-3xl border border-slate-800 bg-[#05090f] p-6 text-white"
        >
          <div className="flex flex-col gap-4">
            <header className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-primary">
                  수업 이동
                </p>
                <h3 className="text-2xl font-semibold text-white">
                  선택 학생 수업 변경
                </h3>
                <p className="text-sm text-slate-400">
                  이동할 학생을 선택하고 새로운 수업을 지정하세요.
                </p>
              </div>
              <button
                type="button"
                className="rounded-full border border-slate-800 p-2 text-slate-400 transition hover:text-white"
                onClick={() => setClassMoveOpen(false)}
              >
                <span className={iconClass("text-[20px]")}>close</span>
              </button>
            </header>
            <form className="space-y-4" onSubmit={handleClassMoveSubmit}>
              <div className="rounded-2xl border border-slate-800 bg-[#0c1219] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-slate-300">
                    선택한 학생{" "}
                    <span className="font-semibold text-white">
                      {selectedIds.length}
                    </span>
                    명
                  </p>
                  <button
                    type="button"
                    className="text-sm text-primary transition hover:text-white"
                    onClick={handleSelectAll}
                  >
                    {selectedIds.length === students.length
                      ? "전체 선택 해제"
                      : "전체 선택"}
                  </button>
                </div>
                <div className="mt-3 max-h-48 overflow-y-auto rounded-xl border border-slate-800">
                  {students.map((student) => {
                    const checked = selectedIds.includes(student.id);
                    return (
                      <label
                        key={student.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 border-b border-slate-800 px-3 py-2 text-sm text-slate-300 last:border-none",
                          checked && "bg-slate-900/40"
                        )}
                      >
                        <input
                          type="checkbox"
                          className="size-4 rounded border-slate-500 text-primary focus:ring-primary"
                          checked={checked}
                          onChange={() => toggleStudentSelection(student.id)}
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">
                            {student.name}
                          </span>
                          <span className="text-xs text-slate-400">
                            {student.className}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  <span>이동할 수업</span>
                  <select
                    className="rounded-lg border border-slate-800 bg-[#0c1219] px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                    value={targetClass}
                    onChange={(event) => setTargetClass(event.target.value)}
                  >
                    <option value="">선택하세요</option>
                    {classOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label ?? "미지정"}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  <span>적용 일자</span>
                  <input
                    type="date"
                    className="rounded-lg border border-slate-800 bg-[#0c1219] px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-2 text-sm text-slate-300">
                <span>메모</span>
                <textarea
                  className="min-h-[100px] rounded-xl border border-slate-800 bg-[#0c1219] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none"
                  placeholder="수업 이동 사유나 전달 사항을 입력하세요."
                  value={classMoveMemo}
                  onChange={(event) => setClassMoveMemo(event.target.value)}
                />
              </label>
              <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
                {classMoveStatus === "success" ? (
                  <p className="text-sm text-emerald-400">
                    수업 변경이 완료되었습니다.
                  </p>
                ) : (
                  <p className="text-sm text-slate-400">
                    선택 학생과 담당 강사에게 알림이 전송됩니다.
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:text-white"
                    onClick={() => setClassMoveOpen(false)}
                  >
                    닫기
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedIds.length || !targetClass}
                    className={cn(
                      "rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition",
                      (!selectedIds.length || !targetClass) &&
                        "cursor-not-allowed opacity-50",
                      classMoveStatus === "saving"
                        ? "opacity-70"
                        : "hover:bg-[#1a6bbd]"
                    )}
                  >
                    {classMoveStatus === "saving"
                      ? "적용 중..."
                      : "수업 변경 적용"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {alertOpen && activeAlertStudent && (
        <Modal onClose={() => setAlertOpen(false)} className="w-full max-w-4xl">
          <form
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#3b4754] bg-[#1e2329] text-white shadow-2xl"
            onSubmit={handleAlertSubmit}
          >
            <header className="flex items-center justify-between border-b border-[#3b4754] bg-[#232930] px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                  <span className={iconClass("text-[22px]")}>campaign</span>
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                    수업 알림 발송
                  </p>
                  <h3 className="text-lg font-bold">
                    {activeAlertStudent.name} 학생 카카오 알림
                  </h3>
                </div>
              </div>
              <button
                type="button"
                className="rounded-lg p-1 text-slate-400 transition hover:bg-[#3b4754] hover:text-white"
                onClick={() => setAlertOpen(false)}
              >
                <span className={iconClass("text-[22px]")}>close</span>
              </button>
            </header>
            <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto px-6 py-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold uppercase text-slate-400">
                    발송 채널
                  </label>
                  <div className="flex flex-col gap-2">
                    {[
                      {
                        id: "kakao",
                        label: "카카오톡",
                        icon: "chat_bubble",
                        accent: "text-yellow-300",
                      },
                      {
                        id: "sms",
                        label: "SMS (문자)",
                        icon: "sms",
                        accent: "text-slate-400",
                      },
                    ].map((channel) => (
                      <label
                        key={channel.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-xl border border-[#3b4754] bg-[#111418] px-3 py-3 text-sm transition hover:border-emerald-400/60",
                          alertChannel === channel.id && "border-emerald-400/70"
                        )}
                      >
                        <input
                          type="radio"
                          name="alert-channel"
                          className="size-4 border-[#3b4754] text-emerald-500 focus:ring-emerald-500"
                          checked={alertChannel === channel.id}
                          onChange={() =>
                            setAlertChannel(channel.id as "kakao" | "sms")
                          }
                        />
                        <span className="font-medium">{channel.label}</span>
                        <span
                          className={cn(
                            iconClass("ml-auto text-[18px]"),
                            channel.accent
                          )}
                        >
                          {channel.icon}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold uppercase text-slate-400">
                    발송 대상
                  </label>
                  <div className="flex h-full flex-col gap-3 rounded-xl border border-[#3b4754] bg-[#111418] p-4">
                    <select
                      className="rounded-lg border border-[#3b4754] bg-[#1e2329] px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                      value={alertTargetRecipient}
                      onChange={(event) =>
                        setAlertTargetRecipient(
                          event.target.value as "all" | "student" | "parent"
                        )
                      }
                    >
                      <option value="all">전체 (학생 + 학부모)</option>
                      <option value="student">학생만</option>
                      <option value="parent">학부모만</option>
                    </select>
                    <div className="mt-auto flex items-center gap-2 text-xs text-slate-400">
                      <span
                        className={iconClass("text-emerald-400 text-[18px]")}
                      >
                        group
                      </span>
                      예상 수신:{" "}
                      <span className="font-semibold text-white">
                        {expectedRecipients}명
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-[#3b4754] bg-[#111418] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">
                      대상 학생
                    </p>
                    <h4 className="mt-1 text-base font-semibold">
                      {activeAlertStudent.name}
                    </h4>
                    <p className="text-xs text-slate-400">
                      연락처: {activeAlertStudent.contact}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                    {alertChannel === "kakao" ? "카카오톡" : "SMS"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold uppercase text-slate-400">
                        메시지 내용
                      </label>
                      <select
                        className="w-48 rounded-lg border border-[#3b4754] bg-[#111418] px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                        value={alertTemplate}
                        onChange={(event) =>
                          setAlertTemplate(event.target.value)
                        }
                      >
                        <option value="absent-reminder">
                          미제출/결석 안내
                        </option>
                        <option value="grade-update">성적/상담 안내</option>
                        <option value="custom">직접 작성</option>
                      </select>
                    </div>
                    <div className="flex gap-2 text-xs">
                      {[
                        { token: "{수업명}", label: "+ 수업명" },
                        { token: "{시간}", label: "+ 시간" },
                        { token: "{학생명}", label: "+ 학생명" },
                      ].map((chip) => (
                        <button
                          key={chip.token}
                          type="button"
                          className="rounded bg-[#3b4754] px-2 py-1 text-white transition hover:bg-primary/60"
                          onClick={() =>
                            setAlertMessage((prev) => `${prev}${chip.token}`)
                          }
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    className="custom-scrollbar min-h-[150px] rounded-xl border border-[#3b4754] bg-[#111418] px-3 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
                    value={alertMessage}
                    onChange={(event) =>
                      setAlertMessage(event.target.value.slice(0, 500))
                    }
                    placeholder="[Academix] 수업 알림..."
                  />
                  <div className="text-right text-xs text-slate-400">
                    {alertMessage.length}자 / 500자
                  </div>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  <span className="text-xs font-bold uppercase text-slate-400">
                    발송 일정
                  </span>
                  <select
                    className="rounded-lg border border-[#3b4754] bg-[#111418] px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                    value={alertSchedule}
                    onChange={(event) => setAlertSchedule(event.target.value)}
                  >
                    <option value="before-1hour">
                      수업 시작 1시간 전 (추천)
                    </option>
                    <option value="before-30min">수업 시작 30분 전</option>
                    <option value="before-24h">수업 24시간 전</option>
                    <option value="now">지금 즉시 발송</option>
                  </select>
                </label>
                <div className="flex items-center justify-between rounded-lg border border-[#3b4754] bg-[#111418] p-4">
                  <div>
                    <p className="text-sm font-semibold">자동 발송</p>
                    <p className="text-xs text-slate-400">
                      선택한 일정으로 매 회차 자동 알림
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={alertAutoSend}
                      onChange={(event) =>
                        setAlertAutoSend(event.target.checked)
                      }
                    />
                    <div className="peer h-6 w-11 rounded-full border border-[#3b4754] bg-[#111418] after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-slate-400 after:transition-all peer-checked:border-emerald-500 peer-checked:bg-emerald-500 peer-checked:after:translate-x-5 peer-checked:after:bg-white"></div>
                  </label>
                </div>
              </div>
            </div>
            <footer className="flex items-center justify-end gap-3 border-t border-[#3b4754] bg-[#232930] px-6 py-4">
              {alertStatus === "success" && (
                <p className="mr-auto text-sm text-emerald-400">
                  카카오 발송이 완료되었습니다.
                </p>
              )}
              <button
                type="button"
                className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-[#3b4754] hover:text-white"
                onClick={() => setAlertOpen(false)}
              >
                취소
              </button>
              <button
                type="submit"
                className={cn(
                  "flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600",
                  alertStatus === "sending" && "opacity-70"
                )}
              >
                <span className={iconClass("text-[18px]")}>
                  {alertStatus === "sending" ? "hourglass_top" : "send"}
                </span>
                {alertStatus === "sending" ? "발송 중..." : "알림 예약하기"}
              </button>
            </footer>
          </form>
        </Modal>
      )}
    </>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-slate-300">
      <span>{label}</span>
      <input
        className="rounded-lg border border-slate-800 bg-[#0c1219] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function Modal({
  children,
  onClose,
  className,
}: {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4 py-10">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-3xl shadow-2xl",
          className ??
            "rounded-3xl border border-slate-800 bg-[#05090f] p-6 text-white"
        )}
      >
        {children}
      </div>
    </div>
  );
}
