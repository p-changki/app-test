"use client";

import { useEffect, useMemo, useState } from "react";

import {
  createInquiryForStudent,
  useInquiryStore,
  type InquiryAttachment,
  type InquiryActor,
} from "@/features/inquiry-dashboard/inquiryStore";
import type { ResourceItem } from "@/features/learning-resources/types";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

type ResourceTableProps = {
  initialResources: ResourceItem[];
};

const ResourceTable = ({ initialResources }: ResourceTableProps) => {
  const [items, setItems] = useState<ResourceItem[]>(initialResources);
  const [selected, setSelected] = useState<ResourceItem | null>(null);
  const [sendTarget, setSendTarget] = useState<ResourceItem | null>(null);
  useEffect(() => {
    setItems(initialResources);
  }, [initialResources]);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<ResourceItem>).detail;
      if (detail?.id) {
        setItems((prev) => [detail, ...prev]);
      }
    };
    window.addEventListener("resource-created", handler);
    return () => window.removeEventListener("resource-created", handler);
  }, []);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-primary focus:ring-primary/20"
                />
              </th>
              <th className="min-w-75 p-4 font-medium">자료명</th>
              <th className="min-w-30 p-4 font-medium">과목/분류</th>
              <th className="min-w-30 p-4 font-medium">등록자</th>
              <th className="min-w-[120px] p-4 font-medium">등록일</th>
              <th className="min-w-[100px] p-4 font-medium">크기</th>
              <th className="w-[120px] p-4 text-center font-medium">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm dark:divide-slate-700">
            {items.map((resource) => (
              <ResourceRow
                key={resource.id}
                resource={resource}
                onSelect={setSelected}
              />
            ))}
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-8 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                  등록된 자료가 없습니다.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {selected ? (
        <ResourceDetailModal
          resource={selected}
          onClose={() => setSelected(null)}
          onSend={(resource) => {
            setSelected(null);
            setSendTarget(resource);
          }}
        />
      ) : null}
      {sendTarget ? (
        <SendInquiryModal
          resource={sendTarget}
          onClose={() => setSendTarget(null)}
        />
      ) : null}
    </>
  );
};

type ResourceRowProps = {
  resource: ResourceItem;
  onSelect: (resource: ResourceItem) => void;
};

const ResourceRow = ({ resource, onSelect }: ResourceRowProps) => (
  <tr className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
    <td className="p-4">
      <input
        type="checkbox"
        className="rounded border-slate-300 text-primary focus:ring-primary/20"
      />
    </td>
    <td className="p-4">
      <div className="flex items-start gap-3">
        <div className={cn("shrink-0 rounded-lg p-2", resource.icon.className)}>
          <span className={iconClass("text-[24px]")}>{resource.icon.name}</span>
        </div>
        <div>
          <button
            type="button"
            onClick={() => onSelect(resource)}
            className="text-left font-bold text-slate-900 transition-colors hover:text-primary focus:outline-none dark:text-white"
          >
            {resource.title}
          </button>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {resource.description}
          </p>
        </div>
      </div>
    </td>
    <td className="p-4">
      <span className={resource.subject.className}>
        {resource.subject.label}
      </span>
    </td>
    <td className="p-4 text-slate-600 dark:text-slate-300">
      <div className="flex items-center gap-2">
        {resource.uploader.avatarUrl ? (
          <div
            className="size-6 shrink-0 rounded-full bg-cover bg-center"
            style={{
              backgroundImage: `url('${resource.uploader.avatarUrl}')`,
            }}
          />
        ) : (
          <div className="size-6 flex shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-600">
            <span className={iconClass("text-sm text-slate-500")}>
              {resource.uploader.fallbackIcon}
            </span>
          </div>
        )}
        <span>{resource.uploader.name}</span>
      </div>
    </td>
    <td className="p-4 text-slate-500 dark:text-slate-400">{resource.date}</td>
    <td className="p-4 text-slate-500 dark:text-slate-400">{resource.size}</td>
    <td className="p-4">
      <div className="flex items-center justify-center gap-2">
        <button
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-primary/10 hover:text-primary"
          title={resource.previewIcon.title}
        >
          <span className={iconClass("text-[20px]")}>
            {resource.previewIcon.name}
          </span>
        </button>
        <button
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-primary/10 hover:text-primary"
          title={resource.downloadIcon.title}
        >
          <span className={iconClass("text-[20px]")}>
            {resource.downloadIcon.name}
          </span>
        </button>
      </div>
    </td>
  </tr>
);

function ResourceDetailModal({
  resource,
  onClose,
  onSend,
}: {
  resource: ResourceItem;
  onClose: () => void;
  onSend?: (resource: ResourceItem) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <header className="flex items-start justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              자료 상세
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {resource.title}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {resource.description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span className={iconClass("text-lg")}>close</span>
          </button>
        </header>
        <div className="space-y-4 px-6 py-5 text-sm text-slate-600 dark:text-slate-200">
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-1 min-w-[200px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <div className={cn("rounded-lg p-2", resource.icon.className)}>
                <span className={iconClass("text-2xl")}>
                  {resource.icon.name}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-300">
                  분류
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {resource.subject.label}
                </p>
              </div>
            </div>
            <div className="flex flex-1 min-w-[200px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-600" />
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-300">
                  등록자
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {resource.uploader.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  등록일 {resource.date} · {resource.size}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-300">
              안내
            </p>
            <p className="mt-1 text-sm leading-relaxed">
              {resource.details ??
                "시험지를 다운로드하여 수업 자료 또는 평가에 활용할 수 있습니다. 등록된 강사 정보를 통해 최신 버전 여부를 확인하세요."}
            </p>
          </div>
          {resource.fileLink ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-300">
                파일 링크
              </p>
              <a
                href={resource.fileLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                <span className={iconClass("text-base")}>attach_file</span>
                {resource.fileLink}
              </a>
            </div>
          ) : null}
          {resource.videoEmbedUrl ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-300">
                    동영상 강의
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    실시간 라이브 방송
                  </p>
                </div>
                {resource.isLive ? (
                  <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Live
                  </span>
                ) : null}
              </div>
              <div className="mt-3 overflow-hidden rounded-xl bg-black">
                <iframe
                  src={resource.videoEmbedUrl}
                  title={resource.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-64 w-full"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
              {resource.videoDescription ? (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {resource.videoDescription}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
        <footer className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/40">
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            onClick={onClose}
          >
            닫기
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            onClick={() => onSend?.(resource)}
          >
            <span className={iconClass("text-base")}>send</span>
            학생 문의로 보내기
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              학생 전용
            </span>
          </button>
          {resource.videoEmbedUrl ? (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              onClick={() => {
                if (resource.videoEmbedUrl) {
                  navigator.clipboard
                    .writeText(resource.videoEmbedUrl)
                    .catch(() => undefined);
                }
              }}
            >
              <span className={iconClass("text-base")}>content_copy</span>
              링크 복사
            </button>
          ) : (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
            >
              <span className={iconClass("text-base")}>download</span>
              다운로드
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}

type StudentOption = {
  id: string;
  name: string;
  grade?: string;
};

function SendInquiryModal({
  resource,
  onClose,
}: {
  resource: ResourceItem;
  onClose: () => void;
}) {
  const inquiries = useInquiryStore();
  const [senderRole, setSenderRole] = useState<InquiryActor>("instructor");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const studentOptions = useMemo(() => {
    const map = new Map<string, StudentOption>();
    inquiries.forEach((inquiry) => {
      if (!map.has(inquiry.student.studentId)) {
        map.set(inquiry.student.studentId, {
          id: inquiry.student.studentId,
          name: inquiry.student.name,
          grade: inquiry.student.grade,
        });
      }
    });
    return Array.from(map.values());
  }, [inquiries]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return studentOptions;
    return studentOptions.filter((student) => {
      return (
        student.name.toLowerCase().includes(query) ||
        student.id.toLowerCase().includes(query) ||
        student.grade?.toLowerCase().includes(query)
      );
    });
  }, [search, studentOptions]);

  useEffect(() => {
    setMessage(
      `${resource.title} 자료를 공유드립니다.\n\n${resource.description}\n\n첨부된 자료를 확인해주세요.`
    );
  }, [resource]);

  const toggleStudent = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const buildAttachments = (): InquiryAttachment[] => {
    const attachments: InquiryAttachment[] = [];
    if (resource.fileLink) {
      attachments.push({
        id: `${resource.id}-file`,
        label: `${resource.title} 자료 링크`,
        url: resource.fileLink,
        kind: "file",
        size: resource.size,
      });
    }
    if (resource.videoEmbedUrl) {
      attachments.push({
        id: `${resource.id}-live`,
        label: `${resource.title} 라이브`,
        embedUrl: resource.videoEmbedUrl,
        url: resource.videoEmbedUrl,
        kind: "video",
      });
    }
    return attachments;
  };

  const handleSend = () => {
    if (!selectedIds.length) {
      setNotice("전송할 학생을 선택해주세요.");
      return;
    }
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setNotice("전송 메시지를 입력해주세요.");
      return;
    }
    const base = inquiries[0];
    const attachments = buildAttachments();
    const senderName =
      senderRole === "assistant"
        ? (base?.assistant?.name ?? "담당 조교")
        : resource.uploader.name;

    selectedIds.forEach((id) => {
      const student = studentOptions.find((option) => option.id === id);
      if (!student) return;
      createInquiryForStudent({
        title: `[자료 공유] ${resource.title}`,
        content: trimmedMessage,
        category: "자료 공유",
        role: senderRole,
        author: senderName,
        student: {
          name: student.name,
          studentId: student.id,
          grade: student.grade,
        },
        instructor: base?.instructor,
        attachments,
        status: "답변 완료",
      });
    });
    setNotice(`${selectedIds.length}명에게 전송했습니다.`);
    setSelectedIds([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <header className="flex items-start justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              학습 자료 전달
            </p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                학생 문의로 보내기
              </h3>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                학생 전용
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {resource.title} 자료를 선택한 학생에게 문의 메시지로 전달합니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span className={iconClass("text-lg")}>close</span>
          </button>
        </header>
        <div className="space-y-6 px-6 py-5 text-sm text-slate-600 dark:text-slate-200">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-300">
              발신자 선택
            </label>
            <div className="flex w-full max-w-md items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800/50">
              {(["assistant", "instructor"] as InquiryActor[]).map((role) => {
                const isActive = senderRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-slate-500 hover:text-primary"
                    }`}
                    onClick={() => setSenderRole(role)}
                  >
                    {role === "assistant" ? "조교" : "강사"}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-300">
              학생 선택
            </label>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="학생 이름 또는 학번 검색"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800/40">
              {filteredStudents.length ? (
                filteredStudents.map((student) => {
                  const isChecked = selectedIds.includes(student.id);
                  return (
                    <label
                      key={student.id}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition hover:bg-white/80 dark:hover:bg-slate-800"
                    >
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {student.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          학번 {student.id}
                          {student.grade ? ` · ${student.grade}` : ""}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleStudent(student.id)}
                        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                      />
                    </label>
                  );
                })
              ) : (
                <p className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                  검색 결과가 없습니다.
                </p>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              선택된 학생 {selectedIds.length}명
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-300">
              전송 메시지
            </label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="min-h-[140px] rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400">
            {resource.videoEmbedUrl
              ? "라이브 링크가 포함된 자료는 학생 문의 상세에서 바로 재생됩니다."
              : "첨부 자료는 학생 문의 상세 페이지에서 바로 확인할 수 있습니다."}
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              학부모는 전송 대상에서 제외됩니다.
            </p>
          </div>
          {notice ? (
            <p className="text-xs font-semibold text-primary">{notice}</p>
          ) : null}
        </div>
        <footer className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/40">
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            onClick={onClose}
          >
            닫기
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
            onClick={handleSend}
          >
            <span className={iconClass("text-base")}>send</span>
            문의 전송
          </button>
        </footer>
      </div>
    </div>
  );
}

export default ResourceTable;
