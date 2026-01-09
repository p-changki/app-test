"use client";

import { useEffect, useId, useState } from "react";

import type { ResourceItem } from "@/features/learning-resources/types";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

type ResourceRegisterModalProps = {
  onClose: () => void;
};

const RESOURCE_TYPES = [
  { value: "exam", label: "시험지", icon: "picture_as_pdf" },
  { value: "video", label: "동영상 강의", icon: "smart_display" },
  { value: "request", label: "강사 요청 자료", icon: "assignment" },
] as const;

const iconMap: Record<
  (typeof RESOURCE_TYPES)[number]["value"],
  { name: string; className: string }
> = {
  exam: {
    name: "picture_as_pdf",
    className: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
  },
  video: {
    name: "smart_display",
    className:
      "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  },
  request: {
    name: "assignment",
    className:
      "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  },
};

const subjectMap: Record<
  (typeof RESOURCE_TYPES)[number]["value"],
  { label: string; className: string }
> = {
  exam: {
    label: "수학 (고3)",
    className:
      "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  video: {
    label: "수학 (고3)",
    className:
      "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  request: {
    label: "강사 요청 자료",
    className:
      "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
};

const ResourceRegisterModal = ({ onClose }: ResourceRegisterModalProps) => {
  const [type, setType] =
    useState<(typeof RESOURCE_TYPES)[number]["value"]>("exam");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploader, setUploader] = useState("");
  const [subject, setSubject] = useState("");
  const [size, setSize] = useState("");

  const [examLink, setExamLink] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [videoDesc, setVideoDesc] = useState("");
  const [videoLive, setVideoLive] = useState(false);
  const [requestKind, setRequestKind] = useState("수업 준비 자료");
  const [requestLink, setRequestLink] = useState("");
  const [requestFileUrl, setRequestFileUrl] = useState("");
  const [requestFileName, setRequestFileName] = useState("");
  const requestFileInputId = useId();

  useEffect(() => {
    return () => {
      if (requestFileUrl) {
        URL.revokeObjectURL(requestFileUrl);
      }
    };
  }, [requestFileUrl]);

  const reset = () => {
    setTitle("");
    setDescription("");
    setUploader("");
    setSubject("");
    setSize("");
    setExamLink("");
    setVideoLink("");
    setVideoDesc("");
    setVideoLive(false);
    setRequestKind("수업 준비 자료");
    setRequestLink("");
    if (requestFileUrl) {
      URL.revokeObjectURL(requestFileUrl);
    }
    setRequestFileUrl("");
    setRequestFileName("");
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <header className="flex items-start justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              게시글 등록
            </p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              학습 자료실에 게시글을 등록합니다.
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span className={iconClass("text-lg")}>close</span>
          </button>
        </header>
        <div className="flex flex-col gap-6 px-6 py-5 text-sm text-slate-600 dark:text-slate-200">
          <section>
            <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              게시글 유형
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {RESOURCE_TYPES.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value)}
                  className={cn(
                    "flex flex-col gap-2 rounded-xl border p-4 text-left transition hover:border-primary/60",
                    type === option.value
                      ? "border-primary bg-primary/5 text-primary dark:border-primary dark:bg-primary/10"
                      : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40"
                  )}
                >
                  <span className={iconClass("text-2xl")}>{option.icon}</span>
                  <span className="text-sm font-semibold">{option.label}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {option.value === "exam" &&
                      "시험지/PDF 파일을 업로드합니다."}
                    {option.value === "video" &&
                      "동영상 강의를 YouTube 링크로 등록합니다."}
                    {option.value === "request" &&
                      "강사가 조교에게 전달할 업무 자료입니다."}
                  </span>
                </button>
              ))}
            </div>
          </section>
          <section className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="제목"
              placeholder="예: 2025 모의고사 1회차"
              value={title}
              onChange={setTitle}
            />
            <TextInput
              label="등록자"
              placeholder="예: 김수학 T"
              value={uploader}
              onChange={setUploader}
            />
            <TextInput
              label="과목/분류 라벨"
              placeholder="예: 수학 (고3)"
              value={subject}
              onChange={setSubject}
            />
            <TextInput
              label="파일 크기 / 설명"
              placeholder="예: 3.4 MB / 스트리밍"
              value={size}
              onChange={setSize}
            />
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                소개/세부 내용
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="h-28 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="게시글에 대한 안내 문구를 입력하세요."
              />
            </div>
          </section>
          {type === "exam" ? (
            <ExamFields link={examLink} onChangeLink={setExamLink} />
          ) : null}
          {type === "video" ? (
            <VideoFields
              link={videoLink}
              onChangeLink={setVideoLink}
              description={videoDesc}
              onChangeDescription={setVideoDesc}
              isLive={videoLive}
              onToggleLive={setVideoLive}
            />
          ) : null}
          {type === "request" ? (
            <RequestFields
              requestKind={requestKind}
              onChangeKind={setRequestKind}
              link={requestLink}
              onChangeLink={setRequestLink}
              fileName={requestFileName}
              inputId={requestFileInputId}
              onFileChange={(file) => {
                if (requestFileUrl) {
                  URL.revokeObjectURL(requestFileUrl);
                }
                if (file) {
                  setRequestFileUrl(URL.createObjectURL(file));
                  setRequestFileName(file.name);
                } else {
                  setRequestFileUrl("");
                  setRequestFileName("");
                }
              }}
            />
          ) : null}
        </div>
        <footer className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-900/40">
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            onClick={() =>
              handleSubmit({
                type,
                title,
                description,
                uploader,
                subject,
                size,
                examLink,
                videoLink,
                videoDesc,
                videoLive,
                requestKind,
                requestLink,
                requestFileUrl,
                requestFileName,
                onClose,
                reset,
              })
            }
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
          >
            <span className={iconClass("text-base")}>cloud_upload</span>
            게시글 등록
          </button>
        </footer>
      </div>
    </div>
  );
};

function handleSubmit({
  type,
  title,
  description,
  uploader,
  subject,
  size,
  examLink,
  videoLink,
  videoDesc,
  videoLive,
  requestKind,
  requestLink,
  requestFileUrl,
  requestFileName,
  onClose,
  reset,
}: {
  type: (typeof RESOURCE_TYPES)[number]["value"];
  title: string;
  description: string;
  uploader: string;
  subject: string;
  size: string;
  examLink: string;
  videoLink: string;
  videoDesc: string;
  videoLive: boolean;
  requestKind: string;
  requestLink: string;
  requestFileUrl: string;
  requestFileName: string;
  onClose: () => void;
  reset: () => void;
}) {
  if (!title.trim()) return;
  const id = `resource-${Date.now()}`;
  const today = new Date();
  const date = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}.${String(today.getDate()).padStart(2, "0")}`;
  const baseSubject = subjectMap[type];
  const resource: ResourceItem = {
    id,
    title: title.trim(),
    description:
      description.trim() ||
      (type === "video"
        ? "동영상 강의 자료"
        : type === "request"
          ? "강사 요청 자료"
          : "시험지"),
    icon: iconMap[type],
    subject: {
      label: subject.trim() || baseSubject.label,
      className: baseSubject.className,
    },
    uploader: {
      name: uploader.trim() || "강사 등록",
    },
    date,
    size: size.trim() || (type === "video" ? "스트리밍" : "1.0 MB"),
    previewIcon: {
      name: type === "video" ? "play_arrow" : "visibility",
      title: type === "video" ? "스트리밍 보기" : "미리보기",
    },
    downloadIcon: {
      name: type === "video" ? "content_copy" : "download",
      title: type === "video" ? "링크 복사" : "다운로드",
    },
  };

  if (type === "exam" && examLink.trim()) {
    resource.fileLink = examLink.trim();
  }
  if (type === "video") {
    const trimmed = videoLink.trim();
    if (trimmed) {
      resource.videoEmbedUrl = toEmbedUrl(trimmed);
      resource.fileLink = trimmed;
    }
    resource.videoDescription = videoDesc.trim();
    resource.isLive = videoLive;
  }
  if (type === "request") {
    if (requestLink.trim()) {
      resource.fileLink = requestLink.trim();
    }
    resource.details =
      description.trim() ||
      `${requestKind}에 대한 강사 요청 자료입니다. 첨부 파일과 링크를 확인하세요.`;
    if (requestFileUrl) {
      resource.fileLink = resource.fileLink ?? requestFileUrl;
    }
    if (!resource.size) {
      resource.size = requestFileName ? requestFileName : "첨부 파일";
    }
  }

  window.dispatchEvent(
    new CustomEvent<ResourceItem>("resource-created", { detail: resource })
  );
  reset();
  onClose();
}

function toEmbedUrl(link: string) {
  try {
    const url = new URL(link);
    if (url.hostname.includes("youtu.be")) {
      const videoId = url.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${url.searchParams.get("v")}`;
    }
  } catch {
    return link;
  }
  return link;
}

function TextInput({
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
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />
    </div>
  );
}

function ExamFields({
  link,
  onChangeLink,
}: {
  link: string;
  onChangeLink: (value: string) => void;
}) {
  return (
    <section>
      <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
        시험지 업로드
      </p>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            파일 업로드
          </label>
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-xs text-slate-500 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
            <span className={iconClass("text-2xl text-primary")}>
              upload_file
            </span>
            <p>PDF 시험지를 드래그하거나 클릭해서 업로드하세요.</p>
            <button className="rounded-lg border border-primary px-3 py-1 text-xs font-semibold text-primary">
              파일 선택
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            다운로드 링크
          </label>
          <input
            type="text"
            value={link}
            onChange={(event) => onChangeLink(event.target.value)}
            placeholder="https://..."
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>
    </section>
  );
}

function VideoFields({
  link,
  onChangeLink,
  description,
  onChangeDescription,
  isLive,
  onToggleLive,
}: {
  link: string;
  onChangeLink: (value: string) => void;
  description: string;
  onChangeDescription: (value: string) => void;
  isLive: boolean;
  onToggleLive: (value: boolean) => void;
}) {
  return (
    <section>
      <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
        동영상 강의 등록
      </p>
      <div className="mt-3 grid gap-4">
        <TextInput
          label="유튜브 링크"
          value={link}
          onChange={onChangeLink}
          placeholder="https://www.youtube.com/watch?v=..."
        />
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            방송 안내 문구
          </label>
          <textarea
            value={description}
            onChange={(event) => onChangeDescription(event.target.value)}
            className="h-20 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            placeholder="라이브 방송 일정 및 안내를 입력하세요."
          />
        </div>
        <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
          <input
            type="checkbox"
            checked={isLive}
            onChange={(event) => onToggleLive(event.target.checked)}
            className="rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600"
          />
          실시간 라이브 방송 여부
        </label>
      </div>
    </section>
  );
}

function RequestFields({
  requestKind,
  onChangeKind,
  link,
  onChangeLink,
  fileName,
  inputId,
  onFileChange,
}: {
  requestKind: string;
  onChangeKind: (value: string) => void;
  link: string;
  onChangeLink: (value: string) => void;
  fileName: string;
  inputId: string;
  onFileChange: (file: File | null) => void;
}) {
  return (
    <section>
      <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
        강사 요청 자료
      </p>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            요청 종류
          </label>
          <select
            value={requestKind}
            onChange={(event) => onChangeKind(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="수업 준비 자료">수업 준비 자료</option>
            <option value="운영 안내">운영 안내</option>
            <option value="과제/공지">과제/공지</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            첨부 파일 링크
          </label>
          <input
            type="text"
            value={link}
            onChange={(event) => onChangeLink(event.target.value)}
            placeholder="https://..."
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            로컬 파일 업로드
          </span>
          <label
            htmlFor={inputId}
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-xs text-slate-500 transition hover:border-primary dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-300"
          >
            <span className={iconClass("text-2xl text-primary")}>upload</span>
            {fileName ? (
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {fileName}
              </span>
            ) : (
              <span>첨부할 파일을 선택해주세요.</span>
            )}
            <span className="rounded-lg border border-primary px-3 py-1 text-xs font-semibold text-primary">
              파일 선택
            </span>
          </label>
          <input
            id={inputId}
            type="file"
            className="hidden"
            onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
          />
        </div>
      </div>
    </section>
  );
}

export default ResourceRegisterModal;
