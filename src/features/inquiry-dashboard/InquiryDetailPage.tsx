"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import {
  addInquiryMessage,
  deleteInquiryMessage,
  setInquiryStatus,
  useInquiryById,
  type InquiryActor,
  type InquiryAttachment,
  type InquiryMessage,
  type InquiryStatus,
} from "@/features/inquiry-dashboard/inquiryStore";

type StatusOption = {
  value: InquiryStatus;
  label: string;
  textClass: string;
  dotClass: string;
};

type TimelineEntryData = {
  id: string;
  iconBg: string;
  iconColor: string;
  roleLabel: string;
  name: string;
  timestamp: string;
  badge?: string;
  badgeClass?: string;
  content: string;
  attachments?: InquiryAttachment[];
  highlight?: boolean;
  deletable?: boolean;
  changesStatus?: InquiryMessage["changesStatus"];
  role?: InquiryActor;
  visibility?: InquiryMessage["visibility"];
};

const STATUS_FLOW: InquiryStatus[] = [
  "강사 검토",
  "답변 완료",
  "학생/학부모 확인 완료",
  "종료",
];

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: "강사 검토",
    label: "강사 검토",
    textClass: "text-primary",
    dotClass: "bg-primary",
  },
  {
    value: "답변 완료",
    label: "답변 완료",
    textClass: "text-green-600",
    dotClass: "bg-green-500",
  },
  {
    value: "학생/학부모 확인 완료",
    label: "학생/학부모 확인 완료",
    textClass: "text-[#617589]",
    dotClass: "bg-[#617589]",
  },
  {
    value: "종료",
    label: "종료",
    textClass: "text-[#617589]",
    dotClass: "bg-[#617589]",
  },
];

const QUICK_ACTIONS = [{ label: "학생 문의 복사", icon: "share" }] as const;

const DEFAULT_ANSWER_TEXT = [
  "철수 학생 반가워요! 탄젠트 함수의 점근선 공식에 대해 질문을 주셨네요.",
  "",
  "먼저 탄젠트 함수의 정의부터 살펴볼까요? tan x = sin x / cos x 입니다.",
  "여기서 분모인 cos x가 0이 되는 지점에서는 탄젠트 값이 정의될 수 없겠죠?",
  "",
  "1) cos x = 0이 되는 지점 찾기",
  "2) x = π/2, 3π/2, ... 즉 x = nπ + π/2 (단, n은 정수)",
  "",
  "이 지점들이 바로 그래프에서 함숫값이 무한히 커지거나 작아지는 점근선이 됩니다.",
].join("\n");

const DEFAULT_ANSWER_HTML = [
  "철수 학생 반가워요! 탄젠트 함수의 점근선 공식에 대해 질문을 주셨네요.<br /><br />",
  '먼저 탄젠트 함수의 정의부터 살펴볼까요? <span class="font-serif italic">tan x = sin x / cos x</span> 입니다.<br />',
  '여기서 분모인 <span class="font-serif italic">cos x</span>가 0이 되는 지점에서는 탄젠트 값이 정의될 수 없겠죠?<br /><br />',
  '1) <span class="font-serif italic">cos x = 0</span>이 되는 지점 찾기<br />',
  '2) <span class="font-serif italic">x = &pi;/2, 3&pi;/2, ...</span> 즉 <span class="font-serif italic">x = n&pi; + &pi;/2</span> (단, n은 정수)<br /><br />',
  "이 지점들이 바로 그래프에서 함숫값이 무한히 커지거나 작아지는 <strong>점근선</strong>이 됩니다.",
].join("");

const ROLE_STYLES: Record<
  InquiryActor,
  { label: string; iconBg: string; iconColor: string }
> = {
  student: { label: "학생", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  parent: {
    label: "학부모",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  assistant: {
    label: "조교",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-400",
  },
  instructor: { label: "강사", iconBg: "bg-primary", iconColor: "text-white" },
  system: {
    label: "시스템",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-400",
  },
};

const STAFF_ROLES = new Set<InquiryActor>(["assistant", "instructor"]);

function buildTimelineEntry(message: InquiryMessage): TimelineEntryData {
  const roleStyle = ROLE_STYLES[message.role];
  const isInstructor = message.role === "instructor";
  const isAssistant = message.role === "assistant";
  const isSystem = message.role === "system";
  const isAnswer = isInstructor && message.changesStatus?.to === "답변 완료";
  const badge = isAnswer
    ? "공식 답변 등록"
    : isAssistant
      ? "업무 기록"
      : isSystem
        ? "상태 변경"
        : undefined;
  const badgeClass = isAnswer
    ? "text-green-600 bg-green-100"
    : isAssistant || isSystem
      ? "text-primary bg-primary/10"
      : undefined;

  return {
    id: message.id,
    iconBg: roleStyle.iconBg,
    iconColor: roleStyle.iconColor,
    roleLabel: roleStyle.label,
    name: message.author,
    timestamp: message.createdAt,
    content: message.content,
    attachments: message.attachments,
    highlight: isAnswer,
    badge,
    badgeClass,
    deletable: STAFF_ROLES.has(message.role),
    changesStatus: message.changesStatus,
    role: message.role,
    visibility: message.visibility,
  };
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function textToHtml(text: string) {
  return escapeHtml(text).replace(/\n/g, "<br />");
}

async function copyToClipboard(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  if (typeof document === "undefined") {
    return false;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  document.body.removeChild(textarea);
  return copied;
}

function formatTime(date = new Date()) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`;
}

export function InquiryDetailPage({ inquiryId }: { inquiryId: string }) {
  const inquiry = useInquiryById(inquiryId);
  const status = inquiry?.status ?? "강사 검토";
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [answerModalOpen, setAnswerModalOpen] = useState(false);
  const [answerDraft, setAnswerDraft] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [attachmentOpen, setAttachmentOpen] = useState(false);
  const [activeAttachment, setActiveAttachment] =
    useState<InquiryAttachment | null>(null);
  const [visibleToParents, setVisibleToParents] = useState(true);
  const [faqCandidate, setFaqCandidate] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<TimelineEntryData | null>(
    null
  );
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [answerRole, setAnswerRole] = useState<InquiryActor>("instructor");
  const feedbackTimerRef = useRef<number | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const answerHtmlRef = useRef<string>(DEFAULT_ANSWER_HTML);

  const initialMessage = useMemo(() => {
    if (!inquiry) return undefined;
    return (
      inquiry.messages.find((message) => message.kind === "initial") ??
      inquiry.messages[0]
    );
  }, [inquiry]);

  const timelineEntries = useMemo(() => {
    if (!inquiry) return [];
    return inquiry.messages
      .filter((message) => message.kind !== "initial")
      .map(buildTimelineEntry)
      .reverse();
  }, [inquiry]);

  const studentCopyMessage = useMemo(() => {
    if (!inquiry) return undefined;
    return inquiry.messages.find((message) => message.role === "student");
  }, [inquiry]);

  const initialRoleLabel =
    initialMessage?.role === "parent" ? "학부모 원문" : "학생 원문";
  const initialAuthor =
    initialMessage?.author ??
    (inquiry ? `${inquiry.student.name} 학생` : "학생");
  const initialTimestamp =
    initialMessage?.createdAt ?? inquiry?.createdAt ?? "";
  const initialAttachments = initialMessage?.attachments ?? [];
  const previewAttachment = initialAttachments.find(
    (attachment) => attachment.kind === "image" && attachment.url
  );

  const statusMeta = useMemo(
    () =>
      STATUS_OPTIONS.find((option) => option.value === status) ??
      STATUS_OPTIONS[0],
    [status]
  );

  const statusMenuOptions = useMemo(() => {
    const currentIndex = STATUS_FLOW.indexOf(status);
    const nextStatus =
      currentIndex >= 0 ? STATUS_FLOW[currentIndex + 1] : undefined;
    return STATUS_OPTIONS.filter(
      (option) => option.value === status || option.value === nextStatus
    );
  }, [status]);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        window.clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!answerModalOpen || !editorRef.current) {
      return;
    }
    editorRef.current.innerHTML = answerHtmlRef.current;
    editorRef.current.focus();
  }, [answerModalOpen]);

  const showFeedback = (message: string) => {
    setFeedbackMessage(message);
    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }
    feedbackTimerRef.current = window.setTimeout(() => {
      setFeedbackMessage(null);
    }, 2200);
  };

  const setAnswerContent = (text: string, html?: string) => {
    const nextHtml = html ?? textToHtml(text);
    setAnswerDraft(text);
    answerHtmlRef.current = nextHtml;
    if (editorRef.current) {
      editorRef.current.innerHTML = nextHtml;
    }
  };

  const handleEditorInput = () => {
    if (!editorRef.current) return;
    answerHtmlRef.current = editorRef.current.innerHTML;
    setAnswerDraft(editorRef.current.innerText);
  };

  const handleDraftSave = () => {
    const content = editorRef.current?.innerText ?? answerDraft;
    if (!content.trim()) {
      showFeedback("저장할 내용이 없습니다.");
      return;
    }
    setLastSavedAt(formatTime());
    showFeedback("임시 저장되었습니다.");
  };

  const handleStatusChange = (nextStatus: InquiryStatus) => {
    if (!inquiry) return;
    const allowedValues = new Set(
      statusMenuOptions.map((option) => option.value)
    );
    if (!allowedValues.has(nextStatus) || nextStatus === status) {
      setStatusMenuOpen(false);
      return;
    }
    setStatusMenuOpen(false);
    showFeedback("상태가 업데이트되었습니다.");
    setInquiryStatus(inquiry.id, nextStatus, {
      actor: { role: "system", name: "상태 변경" },
    });
  };

  const openAnswerModal = (preset?: string) => {
    if (preset) {
      setAnswerContent(preset);
    } else {
      setAnswerContent(DEFAULT_ANSWER_TEXT, DEFAULT_ANSWER_HTML);
    }
    setLastSavedAt(null);
    setAnswerModalOpen(true);
  };

  const handleAnswerSubmit = () => {
    const nextContent = (editorRef.current?.innerText ?? answerDraft).trim();
    if (!inquiry) return;
    if (!nextContent) {
      showFeedback("답변 내용을 입력해주세요.");
      return;
    }
    const previousStatus = status;
    setAnswerModalOpen(false);
    setAnswerDraft("");
    showFeedback("답변이 등록되었습니다.");
    const responder =
      answerRole === "assistant" ? "조교 담당자" : "강사 담당자";
    addInquiryMessage(inquiry.id, {
      role: answerRole,
      author: responder,
      content: nextContent,
      visibility: visibleToParents ? "all" : "staff",
      changesStatus:
        previousStatus === "답변 완료"
          ? undefined
          : { from: previousStatus, to: "답변 완료" },
    });
  };

  const handleQuickAction = () => {
    void handleShareCopy();
  };

  const requestDelete = (entry: TimelineEntryData) => {
    setPendingDelete(entry);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!pendingDelete || !inquiry) return;
    const latestReply = inquiry.messages
      .filter((entry) => entry.changesStatus)
      .at(-1);
    const shouldRevertStatus =
      pendingDelete.changesStatus &&
      status === pendingDelete.changesStatus.to &&
      latestReply?.id === pendingDelete.id;

    deleteInquiryMessage(inquiry.id, pendingDelete.id);
    if (shouldRevertStatus) {
      setInquiryStatus(
        inquiry.id,
        pendingDelete.changesStatus?.from ?? "강사 검토",
        {
          recordMessage: false,
          actor: { role: "system", name: "상태 변경" },
        }
      );
    }

    setDeleteConfirmOpen(false);
    setPendingDelete(null);
    showFeedback("답변이 삭제되었습니다.");
  };

  const handleShareCopy = async () => {
    if (!inquiry || !studentCopyMessage) {
      showFeedback("학생 문의가 없습니다.");
      return;
    }
    const copyText = `문의 제목: ${inquiry.title}\n\n${studentCopyMessage.content}`;
    const copied = await copyToClipboard(copyText);
    showFeedback(
      copied
        ? "학생 문의가 클립보드에 복사되었습니다."
        : "클립보드 복사에 실패했습니다."
    );
  };

  if (!inquiry) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background-light text-sm text-[#617589] dark:bg-background-dark dark:text-gray-400">
        문의 정보를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-background-light text-[#111418] dark:bg-background-dark dark:text-white">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-6 px-6 py-6 pb-28 lg:px-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-[#617589] dark:text-gray-400">
            <Link className="hover:text-primary" href="/inquiry-dashboard">
              소통
            </Link>
            <span className="material-symbols-outlined text-xs">
              chevron_right
            </span>
            <span className="font-medium text-[#111418] dark:text-white">
              문의 ID: {inquiry.id}
            </span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#fce8e6] px-2.5 py-1 text-xs font-bold text-[#e73908]">
                  긴급
                </span>
                <h1 className="text-2xl font-black tracking-tight text-[#111418] dark:text-white sm:text-3xl">
                  {inquiry.title}
                </h1>
              </div>
              <p className="text-sm text-gray-500">
                문의 번호 #{inquiry.id} | 분류: {inquiry.category}
              </p>
            </div>
            <Link
              className="flex items-center gap-2 rounded-lg border border-[#dbe0e6] bg-white px-4 py-2 text-sm font-bold text-[#111418] transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              href="/inquiry-dashboard"
            >
              <span className="material-symbols-outlined text-lg">
                arrow_back
              </span>
              목록으로 돌아가기
            </Link>
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row">
          <section className="flex flex-1 flex-col gap-6 overflow-y-auto pb-24">
            <article className="overflow-hidden rounded-xl border border-[#dbe0e6] bg-white shadow-sm dark:border-gray-700 dark:bg-[#1a242d]">
              <header className="flex items-center justify-between border-b border-[#dbe0e6] bg-[#f8f9fa] px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-[#f0f2f4] px-2 py-0.5 text-xs font-bold text-[#617589] dark:bg-gray-800 dark:text-gray-300">
                    {initialRoleLabel}
                  </span>
                  <span className="text-sm font-medium text-[#111418] dark:text-white">
                    {initialAuthor}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {initialTimestamp} 작성
                </span>
              </header>
              <div className="flex flex-col gap-6 p-6 lg:flex-row">
                <div className="flex-1 text-sm leading-relaxed text-[#111418] dark:text-gray-200 whitespace-pre-line">
                  {initialMessage?.content ?? "문의 내용이 없습니다."}
                  {initialAttachments.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {initialAttachments.map((attachment) => (
                        <button
                          key={attachment.id}
                          type="button"
                          className="flex items-center gap-3 rounded-lg border border-[#dbe0e6] bg-[#f0f2f4] p-2 text-xs font-medium transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
                          onClick={() => {
                            if (attachment.kind === "image" && attachment.url) {
                              setActiveAttachment(attachment);
                              setAttachmentOpen(true);
                              return;
                            }
                            if (attachment.embedUrl || attachment.url) {
                              const target =
                                attachment.embedUrl ?? attachment.url;
                              if (!target) {
                                showFeedback("첨부 파일을 열 수 없습니다.");
                                return;
                              }
                              window.open(
                                target,
                                "_blank",
                                "noopener,noreferrer"
                              );
                            } else {
                              showFeedback("첨부 파일을 열 수 없습니다.");
                            }
                          }}
                        >
                          <span className="material-symbols-outlined text-primary">
                            {attachment.kind === "image"
                              ? "image"
                              : "attachment"}
                          </span>
                          {attachment.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
                {previewAttachment ? (
                  <button
                    type="button"
                    className="h-32 w-full rounded-lg bg-cover bg-center transition hover:opacity-90 md:w-60"
                    style={{
                      backgroundImage: `url(${previewAttachment.url})`,
                    }}
                    onClick={() => {
                      setActiveAttachment(previewAttachment);
                      setAttachmentOpen(true);
                    }}
                    aria-label="첨부 이미지 미리보기"
                  />
                ) : null}
              </div>
            </article>
            <section className="flex flex-col gap-4">
              <h3 className="flex items-center gap-2 px-1 text-lg font-bold">
                <span className="material-symbols-outlined">history</span>
                업무 기록 및 답변 내역
              </h3>
              {timelineEntries.map((entry) => (
                <TimelineEntry
                  key={entry.id}
                  iconBg={entry.iconBg}
                  iconColor={entry.iconColor}
                  roleLabel={entry.roleLabel}
                  name={entry.name}
                  timestamp={entry.timestamp}
                  badge={entry.badge}
                  badgeClass={entry.badgeClass}
                  content={entry.content}
                  attachments={entry.attachments}
                  highlight={entry.highlight}
                  onDelete={
                    entry.deletable ? () => requestDelete(entry) : undefined
                  }
                />
              ))}
            </section>
          </section>
          <aside className="w-full flex-shrink-0 space-y-6 lg:w-80">
            <div className="rounded-xl border border-[#dbe0e6] bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-[#1a242d]">
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#617589]">
                관리 정보
              </h4>
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#617589]">
                    책임 강사
                  </label>
                  <div className="flex items-center gap-3">
                    <div
                      className="size-8 rounded-full bg-[#dbe0e6] bg-cover bg-center"
                      style={{
                        backgroundImage: inquiry.instructor.avatarUrl
                          ? `url(${inquiry.instructor.avatarUrl})`
                          : undefined,
                      }}
                    />
                    <div>
                      <p className="text-sm font-bold text-[#111418] dark:text-white">
                        {inquiry.instructor.name}
                      </p>
                      <p className="text-[10px] text-[#617589]">
                        {inquiry.category}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 border-t border-[#dbe0e6] pt-4 dark:border-gray-700">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#617589]">현재 상태</span>
                    <span
                      className={`flex items-center gap-1 ${statusMeta.textClass}`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${statusMeta.dotClass}`}
                      />
                      {statusMeta.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#617589]">처리기한</span>
                    <span className="font-bold text-red-500">
                      2023-10-27 18:00 (D-Day)
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-[#dbe0e6] bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-[#1a242d]">
              <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#617589]">
                신속 처리
              </h4>
              <div className="flex flex-col gap-2 text-xs font-medium text-[#617589]">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    className="flex items-center gap-2 rounded px-3 py-2 text-left transition-colors hover:bg-gray-50 dark:text-gray-400"
                    onClick={handleQuickAction}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {action.icon}
                    </span>
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
      <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-[#dbe0e6] bg-white px-4 py-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] dark:border-gray-700 dark:bg-[#1a242d]">
        <div className="mx-auto flex max-w-[1920px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-[#f0f2f4] px-3 py-1.5 dark:bg-gray-800">
              <span className="text-xs font-bold text-[#617589]">내 권한:</span>
              <span className="flex items-center gap-1 text-xs font-bold text-primary">
                <span className="material-symbols-outlined text-sm">
                  verified_user
                </span>
                강사/조교 공통
              </span>
            </div>
            {feedbackMessage ? (
              <span className="text-xs font-semibold text-[#617589] dark:text-gray-400">
                {feedbackMessage}
              </span>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-[#dbe0e6] px-5 py-2 text-sm font-bold text-[#111418] hover:bg-gray-50 dark:text-white"
                aria-expanded={statusMenuOpen}
                aria-haspopup="menu"
                onClick={() => setStatusMenuOpen((prev) => !prev)}
              >
                상태 변경
                <span className="material-symbols-outlined text-lg">
                  arrow_drop_down
                </span>
              </button>
              {statusMenuOpen ? (
                <div className="absolute right-0 bottom-full mb-2 w-48 rounded-lg border border-[#dbe0e6] bg-white p-2 text-sm shadow-lg dark:border-gray-700 dark:bg-[#1a242d]">
                  {statusMenuOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[#111418] transition hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800"
                      onClick={() => handleStatusChange(option.value)}
                    >
                      <span
                        className={`size-2 rounded-full ${option.dotClass}`}
                      />
                      <span className="flex-1">{option.label}</span>
                      {status === option.value ? (
                        <span className="material-symbols-outlined text-sm text-primary">
                          check
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              className="rounded-lg bg-primary px-8 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
              onClick={() => openAnswerModal()}
            >
              <span className="material-symbols-outlined text-lg">
                edit_note
              </span>
              답변 작성하기
            </button>
          </div>
        </div>
      </footer>
      <Modal
        open={answerModalOpen}
        onClose={() => setAnswerModalOpen(false)}
        ariaLabel="문의 답변 작성 에디터"
        sizeClass="max-w-[1200px]"
      >
        <div className="flex flex-col gap-6 bg-background-light px-6 py-6 dark:bg-background-dark">
          <div className="rounded-xl border border-[#dbe0e6] bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#1a242d]">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                    답변 작성 중
                  </span>
                  <h1 className="text-xl font-bold tracking-tight text-[#111418] dark:text-white">
                    {inquiry.title}
                  </h1>
                </div>
                <div className="text-xs text-gray-400">
                  문의 번호 #{inquiry.id}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 rounded-lg border border-dashed border-[#dbe0e6] bg-[#f8f9fa] px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#617589]">
                    학생 정보:
                  </span>
                  <span className="text-sm font-medium text-[#111418] dark:text-white">
                    {inquiry.student.name}
                    {inquiry.student.grade ? ` (${inquiry.student.grade})` : ""}
                  </span>
                </div>
                <span className="hidden h-3 w-px bg-gray-300 md:block" />
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#617589]">
                    문의 분류:
                  </span>
                  <span className="text-sm font-medium text-[#111418] dark:text-white">
                    {inquiry.category}
                  </span>
                </div>
                <span className="hidden h-3 w-px bg-gray-300 md:block" />
                <label className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#617589]">
                    답변자:
                  </span>
                  <select
                    value={answerRole}
                    onChange={(event) =>
                      setAnswerRole(event.target.value as InquiryActor)
                    }
                    className="rounded-md border border-[#dbe0e6] bg-white px-2 py-1 text-xs font-semibold text-[#111418] shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-[#1f2a37] dark:text-white"
                  >
                    <option value="instructor">강사</option>
                    <option value="assistant">조교</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
          <div className="flex min-h-[360px] flex-1 flex-col overflow-hidden rounded-xl border border-[#dbe0e6] bg-white shadow-lg dark:border-gray-700 dark:bg-[#1a242d]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dbe0e6] bg-[#f8f9fa] px-4 py-2 dark:border-gray-700 dark:bg-gray-800/30">
              <div className="flex flex-wrap items-center gap-1">
                {[
                  { icon: "format_bold", label: "굵게" },
                  { icon: "format_italic", label: "기울임" },
                  { icon: "format_underlined", label: "밑줄" },
                ].map((button) => (
                  <button
                    key={button.icon}
                    type="button"
                    title={button.label}
                    className="rounded p-1.5 text-[#617589] transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {button.icon}
                    </span>
                  </button>
                ))}
                <span className="mx-1 hidden h-6 w-px bg-gray-300 dark:bg-gray-600 sm:block" />
                {[
                  { icon: "format_list_bulleted", label: "글머리 기호" },
                  { icon: "format_list_numbered", label: "번호 매기기" },
                ].map((button) => (
                  <button
                    key={button.icon}
                    type="button"
                    title={button.label}
                    className="rounded p-1.5 text-[#617589] transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {button.icon}
                    </span>
                  </button>
                ))}
                <span className="mx-1 hidden h-6 w-px bg-gray-300 dark:bg-gray-600 sm:block" />
                {[
                  { icon: "link", label: "링크" },
                  { icon: "image", label: "이미지 삽입" },
                ].map((button) => (
                  <button
                    key={button.icon}
                    type="button"
                    title={button.label}
                    className="rounded p-1.5 text-[#617589] transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {button.icon}
                    </span>
                  </button>
                ))}
                <div className="flex items-center gap-1 rounded border border-blue-100 bg-blue-50 px-2 py-0.5 dark:border-blue-800 dark:bg-blue-900/20">
                  <button
                    type="button"
                    title="수학 기호"
                    className="rounded p-1 text-primary transition hover:bg-white/80 dark:text-blue-200 dark:hover:bg-blue-900/40"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      functions
                    </span>
                  </button>
                  {["√", "π", "¼", "Σ"].map((symbol) => (
                    <button
                      key={symbol}
                      type="button"
                      title={symbol}
                      className="rounded px-1 text-xs font-serif text-[#111418] transition hover:bg-white/80 dark:text-gray-200 dark:hover:bg-blue-900/40"
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2" />
            </div>
            <div className="flex-1 p-6">
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleEditorInput}
                aria-label="답변 내용 입력"
                className="min-h-[280px] w-full text-base leading-relaxed text-gray-800 outline-none dark:text-gray-200"
              />
            </div>
            <div className="flex flex-wrap items-center gap-6 border-t border-[#dbe0e6] bg-[#f8f9fa]/50 px-6 py-4 text-sm dark:border-gray-700 dark:bg-gray-800/20">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  checked={visibleToParents}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  type="checkbox"
                  onChange={(event) => {
                    setVisibleToParents(event.target.checked);
                    showFeedback(
                      event.target.checked
                        ? "학부모 노출이 활성화되었습니다."
                        : "학부모 노출이 해제되었습니다."
                    );
                  }}
                />
                <span className="text-sm font-semibold text-[#617589] transition group-hover:text-primary dark:text-gray-300">
                  학부모에게 노출
                </span>
                <span
                  className="material-symbols-outlined text-sm text-gray-400"
                  title="체크 시 학부모용 대시보드에서도 답변 확인이 가능합니다."
                >
                  info
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  checked={faqCandidate}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  type="checkbox"
                  onChange={(event) => {
                    setFaqCandidate(event.target.checked);
                    showFeedback(
                      event.target.checked
                        ? "FAQ 후보로 등록했습니다."
                        : "FAQ 후보에서 제외했습니다."
                    );
                  }}
                />
                <span className="text-sm font-semibold text-[#617589] transition group-hover:text-primary dark:text-gray-300">
                  FAQ 등록 후보
                </span>
                <span
                  className="material-symbols-outlined text-sm text-gray-400"
                  title="우수 답변으로 분류되어 나중에 FAQ 라이브러리에 등록됩니다."
                >
                  star
                </span>
              </label>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#dbe0e6] bg-white px-2 pt-4 dark:border-gray-700 dark:bg-[#1a242d]">
            <button
              type="button"
              className="flex h-11 items-center gap-2 rounded-lg border border-[#dbe0e6] px-6 text-sm font-bold text-[#617589] transition hover:bg-gray-50 dark:text-gray-300"
              onClick={() => setAnswerModalOpen(false)}
            >
              취소
            </button>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-gray-400">
                최종 임시 저장: {lastSavedAt ?? "없음"}
              </span>
              {feedbackMessage ? (
                <span className="text-xs font-semibold text-[#617589] dark:text-gray-300">
                  {feedbackMessage}
                </span>
              ) : null}
              <button
                type="button"
                className="flex h-11 items-center gap-2 rounded-lg border border-primary px-6 text-sm font-bold text-primary transition hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={handleDraftSave}
              >
                <span className="material-symbols-outlined text-lg">save</span>
                임시 저장
              </button>
              <button
                type="button"
                className="flex h-11 items-center gap-2 rounded-lg bg-primary px-8 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
                onClick={handleAnswerSubmit}
              >
                <span className="material-symbols-outlined text-lg">
                  check_circle
                </span>
                답변 등록
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={attachmentOpen}
        onClose={() => {
          setAttachmentOpen(false);
          setActiveAttachment(null);
        }}
        ariaLabel="첨부 이미지 미리보기"
        sizeClass="max-w-3xl"
      >
        <div className="flex items-center justify-between border-b border-[#dbe0e6] px-6 py-4 dark:border-gray-700">
          <div>
            <p className="text-xs font-semibold text-[#617589]">첨부 파일</p>
            <h3 className="text-lg font-bold text-[#111418] dark:text-white">
              미리보기
            </h3>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-[#617589] transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            onClick={() => setAttachmentOpen(false)}
            aria-label="첨부 미리보기 닫기"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        <div className="space-y-4 px-6 py-4">
          {activeAttachment?.url ? (
            <>
              <img
                src={activeAttachment.url}
                alt={activeAttachment.label}
                className="h-auto w-full rounded-xl border border-[#dbe0e6] object-cover dark:border-gray-700"
              />
              <a
                href={activeAttachment.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[#dbe0e6] px-4 py-2 text-xs font-bold text-[#111418] hover:bg-gray-50 dark:text-white"
              >
                <span className="material-symbols-outlined text-sm">
                  open_in_new
                </span>
                새 창에서 열기
              </a>
            </>
          ) : (
            <p className="text-sm text-[#617589]">
              미리보기 가능한 첨부 파일이 없습니다.
            </p>
          )}
        </div>
      </Modal>
      <Modal
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setPendingDelete(null);
        }}
        ariaLabel="답변 삭제 확인"
      >
        <div className="flex items-center justify-between border-b border-[#dbe0e6] px-6 py-4 dark:border-gray-700">
          <div>
            <p className="text-xs font-semibold text-[#617589]">답변 삭제</p>
            <h3 className="text-lg font-bold text-[#111418] dark:text-white">
              답변을 삭제할까요?
            </h3>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-[#617589] transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            onClick={() => {
              setDeleteConfirmOpen(false);
              setPendingDelete(null);
            }}
            aria-label="답변 삭제 모달 닫기"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        <div className="space-y-3 px-6 py-4 text-sm text-[#617589] dark:text-gray-300">
          <p>삭제하면 해당 답변과 기록이 타임라인에서 제거됩니다.</p>
          {pendingDelete ? (
            <div className="rounded-lg border border-[#dbe0e6] bg-[#f8f9fa] p-3 text-xs text-[#111418] dark:border-gray-700 dark:bg-gray-800/50 dark:text-white">
              <p className="font-semibold">
                {pendingDelete.roleLabel} · {pendingDelete.name}
              </p>
              <p className="mt-1 text-[11px] text-[#617589]">
                {pendingDelete.timestamp}
              </p>
            </div>
          ) : null}
          {pendingDelete?.changesStatus ? (
            <p className="text-xs text-[#e73908]">
              답변을 삭제하면 상태가 이전 단계로 되돌아갑니다.
            </p>
          ) : null}
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-[#dbe0e6] px-6 py-4 dark:border-gray-700">
          <button
            type="button"
            className="rounded-lg border border-[#dbe0e6] px-4 py-2 text-sm font-bold text-[#111418] hover:bg-gray-50 dark:text-white"
            onClick={() => {
              setDeleteConfirmOpen(false);
              setPendingDelete(null);
            }}
          >
            취소
          </button>
          <button
            type="button"
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-red-500/20"
            onClick={confirmDelete}
          >
            삭제
          </button>
        </div>
      </Modal>
    </div>
  );
}

function Modal({
  open,
  onClose,
  ariaLabel,
  sizeClass = "max-w-lg",
  children,
}: {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  sizeClass?: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8"
      onClick={onClose}
    >
      <div
        className={`w-full ${sizeClass} overflow-hidden rounded-2xl border border-[#dbe0e6] bg-white shadow-2xl dark:border-gray-700 dark:bg-[#1a242d]`}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function TimelineEntry({
  iconBg,
  iconColor,
  roleLabel,
  name,
  timestamp,
  badge,
  badgeClass,
  content,
  attachments,
  highlight,
  onDelete,
}: {
  iconBg: string;
  iconColor: string;
  roleLabel: string;
  name: string;
  timestamp: string;
  badge?: string;
  badgeClass?: string;
  content: string;
  attachments?: InquiryAttachment[];
  highlight?: boolean;
  onDelete?: () => void;
}) {
  return (
    <div className="relative flex flex-col gap-2 pl-8 before:absolute before:left-[11px] before:top-4 before:bottom-0 before:w-0.5 before:bg-[#dbe0e6]">
      <div
        className={`absolute left-0 top-1 z-10 flex size-6 items-center justify-center rounded-full border-2 border-white ${iconBg}`}
      >
        <span className={`material-symbols-outlined text-xs ${iconColor}`}>
          person
        </span>
      </div>
      <div
        className={`rounded-lg border p-5 shadow-sm ${
          highlight
            ? "border-primary/30 bg-primary/5 dark:bg-primary/10"
            : "border-[#dbe0e6] bg-white dark:border-gray-700 dark:bg-[#1a242d]"
        }`}
      >
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                highlight ? "bg-primary text-white" : "bg-[#617589] text-white"
              }`}
            >
              {roleLabel}
            </span>
            <span className="text-sm font-bold text-[#111418] dark:text-white">
              {name}
            </span>
            <span className="text-xs text-gray-400">{timestamp}</span>
          </div>
          <div className="flex items-center gap-2">
            {badge ? (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeClass ?? ""}`}
              >
                {badge}
              </span>
            ) : null}
            {onDelete ? (
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full border border-[#f3d1cc] px-2 py-0.5 text-[10px] font-bold text-[#e73908] transition hover:bg-[#fce8e6]"
                onClick={onDelete}
              >
                <span className="material-symbols-outlined text-[12px]">
                  delete
                </span>
                삭제
              </button>
            ) : null}
          </div>
        </div>
        <p className="text-sm leading-relaxed text-[#111418] dark:text-gray-200 whitespace-pre-line">
          {content}
        </p>
        {attachments?.length ? (
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-[#617589] dark:text-gray-300">
            {attachments.map((attachment) => (
              <button
                key={attachment.id}
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-[#dbe0e6] bg-[#f8f9fa] px-3 py-2 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
                onClick={() => {
                  const target = attachment.embedUrl ?? attachment.url;
                  if (target) {
                    window.open(target, "_blank", "noopener,noreferrer");
                  }
                }}
              >
                <span className="material-symbols-outlined text-[16px] text-primary">
                  {attachment.kind === "image" ? "image" : "attachment"}
                </span>
                {attachment.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
