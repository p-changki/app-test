"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  addInquiryMessage,
  setInquiryStatus,
  useInquiryById,
  type InquiryActor,
  type InquiryAttachment,
  type InquiryMessage,
  type InquiryStatus,
} from "@/features/inquiry-dashboard/inquiryStore";

type SenderRole = "student" | "parent";

type StatusMeta = {
  label: string;
  badgeClass: string;
};

const STATUS_META: Record<InquiryStatus, StatusMeta> = {
  "강사 검토": {
    label: "처리 중",
    badgeClass: "bg-amber-100 text-amber-700",
  },
  "답변 완료": {
    label: "답변 완료",
    badgeClass: "bg-primary/10 text-primary",
  },
  "학생/학부모 확인 완료": {
    label: "답변 완료",
    badgeClass: "bg-primary/10 text-primary",
  },
  종료: {
    label: "종료",
    badgeClass: "bg-slate-200 text-slate-500",
  },
};

const ROLE_LABELS: Record<InquiryActor, string> = {
  student: "학생",
  parent: "학부모",
  assistant: "조교",
  instructor: "강사",
  system: "시스템",
};

function getVisibleMessages(messages: InquiryMessage[]) {
  return messages.filter(
    (message) =>
      message.kind !== "initial" &&
      message.visibility !== "staff" &&
      message.role !== "system"
  );
}

function getAttachmentLabel(attachment: InquiryAttachment) {
  return attachment.label ?? "첨부파일";
}

function renderAttachments({
  attachments,
  onAttachmentClick,
}: {
  attachments: InquiryAttachment[];
  onAttachmentClick: (attachment: InquiryAttachment) => void;
}) {
  const videos = attachments.filter(
    (attachment) => attachment.kind === "video" && attachment.embedUrl
  );
  const files = attachments.filter(
    (attachment) => attachment.kind !== "video" || !attachment.embedUrl
  );

  return (
    <>
      {files.length ? (
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-3">
          {files.map((attachment) => (
            <button
              key={attachment.id}
              type="button"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onAttachmentClick(attachment)}
            >
              <span className="material-symbols-outlined text-[16px]">
                {attachment.kind === "image" ? "image" : "attachment"}
              </span>
              <span>{getAttachmentLabel(attachment)}</span>
            </button>
          ))}
        </div>
      ) : null}
      {videos.map((attachment) => (
        <div
          key={attachment.id}
          className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-300">
                실시간 라이브
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {getAttachmentLabel(attachment)}
              </p>
            </div>
            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              Live
            </span>
          </div>
          <div className="mt-3 overflow-hidden rounded-xl bg-black">
            <iframe
              src={attachment.embedUrl}
              title={getAttachmentLabel(attachment)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-64 w-full"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      ))}
    </>
  );
}

export function StudentInquiryDetailPage({ inquiryId }: { inquiryId: string }) {
  const inquiry = useInquiryById(inquiryId);
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [senderRoleOverride, setSenderRoleOverride] =
    useState<SenderRole | null>(null);
  const [formNotice, setFormNotice] = useState<string | null>(null);

  const statusMeta = inquiry
    ? STATUS_META[inquiry.status]
    : STATUS_META["강사 검토"];
  const initialMessage = inquiry?.messages.find(
    (message) => message.kind === "initial"
  );
  const visibleMessages = useMemo(
    () => (inquiry ? getVisibleMessages(inquiry.messages) : []),
    [inquiry]
  );
  const hasParent = Boolean(inquiry?.parent?.name);
  const isClosed = inquiry?.status === "종료";
  const isStaffShare =
    inquiry?.category === "자료 공유" &&
    (initialMessage?.role === "assistant" ||
      initialMessage?.role === "instructor");

  useEffect(() => {
    if (!inquiry) return;
    if (inquiry.status !== "답변 완료") return;
    setInquiryStatus(inquiry.id, "학생/학부모 확인 완료", {
      recordMessage: false,
      actor: { role: "system", name: "상태 변경" },
    });
  }, [inquiry]);

  const defaultSenderRole: SenderRole = inquiry?.parent?.name
    ? "parent"
    : "student";
  const senderRole = senderRoleOverride ?? defaultSenderRole;

  const handleSend = () => {
    if (!inquiry) return;
    if (isStaffShare) {
      setFormNotice("자료 공유 문의에는 추가 질문을 보낼 수 없습니다.");
      return;
    }
    if (isClosed) {
      setFormNotice("종료된 문의에는 추가 답변을 보낼 수 없습니다.");
      return;
    }
    const trimmed = draft.trim();
    if (!trimmed) {
      setFormNotice("내용을 입력해주세요.");
      return;
    }
    const author =
      senderRole === "parent"
        ? (inquiry.parent?.name ?? "학부모")
        : `${inquiry.student.name} 학생`;
    const nextStatus = inquiry.status === "강사 검토" ? undefined : "강사 검토";

    addInquiryMessage(inquiry.id, {
      role: senderRole,
      author,
      content: trimmed,
      changesStatus: nextStatus
        ? {
            from: inquiry.status,
            to: nextStatus,
          }
        : undefined,
    });
    setDraft("");
    setFormNotice("문의가 전송되었습니다.");
  };

  const handleCloseInquiry = () => {
    if (!inquiry || isClosed) return;
    const confirmed = window.confirm(
      "문의 종료 후에는 추가 답변을 보낼 수 없습니다. 종료할까요?"
    );
    if (!confirmed) return;
    setInquiryStatus(inquiry.id, "종료", {
      actor: { role: "system", name: "상태 변경" },
    });
  };

  const handleAttachmentClick = (attachment: InquiryAttachment) => {
    if (attachment.embedUrl) {
      window.open(attachment.embedUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (attachment.url) {
      window.open(attachment.url, "_blank", "noopener,noreferrer");
      return;
    }
    setFormNotice("첨부 파일을 열 수 없습니다.");
  };

  if (!inquiry) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background-light text-sm text-[#617589] dark:bg-background-dark dark:text-gray-400">
        문의 정보를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111418] dark:text-gray-100 min-h-screen">
      <main className="flex-1 flex justify-center py-8">
        <div className="layout-content-container flex flex-col w-full max-w-[1200px] px-6">
          <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            <button
              type="button"
              className="hover:text-primary"
              onClick={() => router.push("/student-inquiries")}
            >
              소통
            </button>
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
            <span className="text-[#111418] dark:text-white">
              문의 상세 내역
            </span>
          </div>
          <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                  {inquiry.category}
                </span>
                <span
                  className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${statusMeta.badgeClass}`}
                >
                  {statusMeta.label}
                </span>
                {isStaffShare ? (
                  <span className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-slate-200 text-slate-700">
                    자료 수신 전용
                  </span>
                ) : null}
              </div>
              <h1 className="text-3xl font-black leading-tight tracking-tight text-[#111418] dark:text-white">
                {inquiry.title}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-normal">
                등록일: {inquiry.createdAt} | 문의 번호: #{inquiry.id}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex h-10 px-5 items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[#111418] dark:text-white text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => router.push("/student-inquiries")}
              >
                <span className="material-symbols-outlined mr-2 text-[18px]">
                  list
                </span>
                목록으로 돌아가기
              </button>
              {!isStaffShare ? (
                <button
                  type="button"
                  className="flex h-10 px-5 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold border border-red-100 dark:border-red-900/30 hover:bg-red-100 transition-colors"
                  onClick={handleCloseInquiry}
                >
                  문의 종료하기
                </button>
              ) : null}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-4 rounded-xl p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[28px]">
                  school
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  책임 강사
                </p>
                <p className="text-lg font-bold text-[#111418] dark:text-white">
                  {inquiry.instructor.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="size-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                <span className="material-symbols-outlined text-[28px]">
                  support_agent
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  현재 담당자
                </p>
                <p className="text-lg font-bold text-[#111418] dark:text-white">
                  {inquiry.assistant?.name ?? inquiry.instructor.name}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2 px-1">
                <span className="material-symbols-outlined text-primary">
                  subject
                </span>
                <h2 className="text-lg font-bold">문의 원문</h2>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
                <div className="prose dark:prose-invert max-w-none text-base leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {initialMessage?.content ?? "문의 내용이 없습니다."}
                </div>
                {initialMessage?.attachments?.length
                  ? renderAttachments({
                      attachments: initialMessage.attachments,
                      onAttachmentClick: handleAttachmentClick,
                    })
                  : null}
              </div>
            </section>
            <section className="flex flex-col gap-4 mt-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    forum
                  </span>
                  <h2 className="text-lg font-bold">답변 및 진행 기록</h2>
                </div>
                {hasParent ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary text-[11px] font-bold tracking-tight">
                    <span className="material-symbols-outlined text-[14px]">
                      info
                    </span>
                    학부모 모드: 강사 최종 답변만 공개됩니다.
                  </div>
                ) : null}
              </div>
              <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-8 before:w-px before:bg-gray-200 dark:before:bg-gray-800">
                {visibleMessages.map((message) => {
                  const isInstructor = message.role === "instructor";
                  const roleLabel = ROLE_LABELS[message.role];
                  return (
                    <div key={message.id} className="relative pl-16">
                      <div
                        className={`absolute left-6 top-6 size-4 rounded-full border-4 border-background-light dark:border-background-dark z-10 ${
                          isInstructor ? "bg-primary" : "bg-gray-400"
                        }`}
                      ></div>
                      <div
                        className={`rounded-xl overflow-hidden shadow-sm border ${
                          isInstructor
                            ? "bg-white dark:bg-gray-900 border-primary/20"
                            : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                        }`}
                      >
                        <div
                          className={`px-6 py-3 border-b flex justify-between items-center ${
                            isInstructor
                              ? "bg-primary/5 dark:bg-primary/10 border-primary/10"
                              : "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider ${
                                isInstructor
                                  ? "bg-primary text-white"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                              }`}
                            >
                              {roleLabel}
                            </span>
                            <span className="text-sm font-bold text-[#111418] dark:text-white">
                              {message.author}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {message.createdAt}
                          </span>
                        </div>
                        <div className="p-6 text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                          {message.content}
                        </div>
                        {message.attachments?.length
                          ? renderAttachments({
                              attachments: message.attachments,
                              onAttachmentClick: handleAttachmentClick,
                            })
                          : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
            {isStaffShare ? (
              <section className="mt-8 mb-12">
                <div className="flex items-center gap-2 px-1 mb-4">
                  <span className="material-symbols-outlined text-gray-500">
                    lock
                  </span>
                  <h2 className="text-lg font-bold">추가 문의 작성</h2>
                </div>
                <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 p-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    <span className="material-symbols-outlined">
                      inventory_2
                    </span>
                    자료만 수신 가능
                  </div>
                  <p className="mt-2">
                    자료 공유 문의는 추가 질문이나 답변 작성이 불가능합니다.
                    전달된 자료를 확인해주세요.
                  </p>
                </div>
              </section>
            ) : (
              <section className="mt-8 mb-12">
                <div className="flex items-center justify-between px-1 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-500">
                      edit_note
                    </span>
                    <h2 className="text-lg font-bold">추가 문의 작성</h2>
                  </div>
                  {hasParent ? (
                    <div className="flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-800 p-1 text-xs">
                      {["student", "parent"].map((role) => {
                        const isActive = senderRole === role;
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() =>
                              setSenderRoleOverride(role as SenderRole)
                            }
                            className={`px-3 py-1 rounded-full font-bold transition-colors ${
                              isActive
                                ? "bg-primary text-white"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            {role === "student" ? "학생" : "학부모"}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
                <div
                  className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-1 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all ${
                    isClosed ? "opacity-60" : ""
                  }`}
                >
                  <textarea
                    className="w-full min-h-[160px] p-6 text-base border-none focus:ring-0 bg-transparent resize-none placeholder-gray-400"
                    placeholder="답변 내용을 입력하거나 추가 질문을 작성하세요..."
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    disabled={isClosed}
                  />
                  <div className="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg border-t border-gray-100 dark:border-gray-800">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        disabled={isClosed}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          attach_file
                        </span>
                        파일 첨부
                      </button>
                      <button
                        type="button"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        disabled={isClosed}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          image
                        </span>
                        사진
                      </button>
                    </div>
                    <button
                      type="button"
                      className="flex h-10 px-8 items-center justify-center rounded-lg bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-60"
                      disabled={isClosed}
                      onClick={handleSend}
                    >
                      문의 전송하기
                    </button>
                  </div>
                </div>
                {formNotice ? (
                  <p className="mt-3 text-center text-xs text-gray-400">
                    {formNotice}
                  </p>
                ) : (
                  <p className="mt-3 text-center text-xs text-gray-400">
                    문의가 종료되면 더 이상 답장을 보낼 수 없습니다. 종료 전
                    확인을 부탁드립니다.
                  </p>
                )}
              </section>
            )}
          </div>
        </div>
      </main>
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-10">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">security</span>
            <p>
              © 2023 Education Management System. 모든 데이터는 암호화되어
              안전하게 보호됩니다.
            </p>
          </div>
          <div className="flex gap-6">
            <button
              type="button"
              className="hover:text-primary transition-colors"
            >
              개인정보처리방침
            </button>
            <button
              type="button"
              className="hover:text-primary transition-colors"
            >
              이용약관
            </button>
            <button
              type="button"
              className="hover:text-primary transition-colors"
            >
              고객센터
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
