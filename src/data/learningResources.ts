import { assistantEntities } from "@/data/assistants";
import { classEntities } from "@/data/classes";
import { examDefinitions } from "@/data/exams";
import type {
  BreadcrumbItem,
  FilterChip,
  ResourceItem,
} from "@/features/learning-resources/types";

const primaryClass = classEntities[0];
const secondaryClass = classEntities[1] ?? classEntities[0];
const primaryExam = examDefinitions[0];
const backupExam = examDefinitions[1] ?? primaryExam;

const avatarPlaceholder = "https://i.pravatar.cc/80?img=55";

export const learningResourceBreadcrumbs: BreadcrumbItem[] = [
  { label: "홈", href: "/dashboard" },
  { label: primaryClass?.subject ?? "공통", href: "#" },
  { label: primaryClass?.name ?? "통합반", href: "#" },
  { label: "학습 자료실" },
];

export const learningResourceFilters: FilterChip[] = [
  { label: "전체 자료", icon: "grid_view", active: true },
  { label: "시험지", icon: "picture_as_pdf" },
  { label: "동영상 강의", icon: "smart_display" },
  { label: "강사 요청 자료", icon: "assignment" },
  { label: "즐겨찾기", icon: "star", pinRight: true },
];

const resourceItems: ResourceItem[] = [
  {
    id: primaryExam.id,
    title: primaryExam.title,
    description: `시험지 • ${primaryExam.targetClass}`,
    icon: {
      name: "picture_as_pdf",
      className: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    },
    subject: {
      label: primaryExam.subject,
      className:
        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    },
    uploader: {
      name: "강사 등록",
      avatarUrl: assistantEntities[0]?.avatarUrl ?? avatarPlaceholder,
    },
    date: primaryExam.examDate.replaceAll("-", "."),
    size: "3.4 MB",
    fileLink: `https://example.com/exams/${primaryExam.id}.pdf`,
    details: primaryExam.summary,
    previewIcon: { name: "visibility", title: "미리보기" },
    downloadIcon: { name: "download", title: "다운로드" },
  },
  {
    id: `${secondaryClass.id}-video`,
    title: `${secondaryClass.name} 라이브 복습`,
    description: "동영상 강의 • 실시간 유튜브 스트리밍",
    icon: {
      name: "smart_display",
      className:
        "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    },
    subject: {
      label: secondaryClass.subject,
      className:
        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
    },
    uploader: {
      name: secondaryClass.teacher,
      avatarUrl: assistantEntities[1]?.avatarUrl ?? avatarPlaceholder,
    },
    date: "2025.01.22",
    size: "스트리밍",
    videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    videoDescription:
      "실시간 풀이 수업이며 방송 종료 후 동일 링크로 다시보기가 제공됩니다.",
    isLive: true,
    details: `${secondaryClass.name} 실시간 강의입니다. 수업 시작 ${secondaryClass.schedule.time} 이전 10분부터 입장이 가능합니다.`,
    previewIcon: { name: "play_arrow", title: "스트리밍 보기" },
    downloadIcon: { name: "link", title: "링크 복사" },
  },
  {
    id: `${primaryClass.id}-assistant-brief`,
    title: `${primaryClass.name} 조교 브리핑`,
    description: "강사 요청 자료 • 운영 공지 및 과제 전달",
    icon: {
      name: "assignment",
      className:
        "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    },
    subject: {
      label: "강사 요청 자료",
      className:
        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    },
    uploader: {
      name: backupExam.subject,
      avatarUrl: assistantEntities[2]?.avatarUrl ?? avatarPlaceholder,
    },
    date: "2025.01.25",
    size: "1.2 MB",
    fileLink: `https://example.com/resources/${primaryClass.id}-brief.pdf`,
    details: `${primaryClass.name} 수업 전 준비물, 안내 멘트, 인쇄물 수량을 정리한 문서입니다.`,
    previewIcon: { name: "visibility", title: "미리보기" },
    downloadIcon: { name: "download", title: "다운로드" },
  },
];

export const learningResources: ResourceItem[] = resourceItems;

export const learningResourcePagination = ["1", "2", "3", "...", "9"];
