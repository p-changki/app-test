import type { BreadcrumbItem, FilterChip, ResourceItem } from "./types";

export const breadcrumbs: BreadcrumbItem[] = [
  { label: "홈", href: "/dashboard" },
  { label: "수학", href: "#" },
  { label: "미적분", href: "#" },
  { label: "학습 자료실" },
];

export const resourceFilters: FilterChip[] = [
  { label: "전체 자료", icon: "grid_view", active: true },
  { label: "PDF 문서", icon: "picture_as_pdf" },
  { label: "동영상 강의", icon: "smart_display" },
  { label: "과제/워크시트", icon: "assignment" },
  { label: "즐겨찾기", icon: "star", pinRight: true },
];

export const resources: ResourceItem[] = [
  {
    id: "calc-2024",
    title: "2024 미적분 중간고사 대비 기출문제집",
    description: "핵심 유형 50선 포함",
    icon: {
      name: "picture_as_pdf",
      className: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    },
    subject: {
      label: "수학 (고2)",
      className:
        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    },
    uploader: {
      name: "김수학 T",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCAANLf3q-W99ap1aO9CAwldFCtw19cGhBVRaScI1HPkM5TubaPtsDtK1tditjJUIHSYjvtGrS1Vp-T3GLrYFver-7tZdYk5u5flS0r1EIMxEzeIraqWStLffK2EtqjRvEhTIG7DEjedvQ5j3-089mdPfIv4Umpey8Sd7IsApnuPJYU9fXW6cUQ-EBktCMXSZ_bJw1pDrM4CdIrcUftIM6SbpP5wr56RnLv2P81Bw_kSBho6qSLYXziRYtRi7YBoVFluHVIyzzL8V4",
    },
    date: "2023.10.25",
    size: "2.4 MB",
    previewIcon: { name: "visibility", title: "미리보기" },
    downloadIcon: { name: "download", title: "다운로드" },
  },
  {
    id: "limit-handout",
    title: "함수의 극한 개념 정리 (Word)",
    description: "빈칸 채우기 활동지",
    icon: {
      name: "description",
      className:
        "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    },
    subject: {
      label: "수학 (고2)",
      className:
        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    },
    uploader: {
      name: "박영어 T",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA2F8-iHjK-23GRqG6ZdnoD3Pc7OrmtvZ2vq6V1TB0KUoL3ZYhbz7Y-MsxpT4uderOMZIcI_HW5VRntHVl1DLfYqOqbcUVIBmxtAsMs81pfz9oKzpgzyRZVcRxCFIr2bF1HOexoQtWt91FqIKt_Q3BqLHvXaMDtNt7Tb_27HSTza1s1ON697VeySQke9W-qzyeN2k3QWqymbPXvl1zXuJnYznfX4WurvPEjJpOGeTSz8G0qd4PFL11Eg3LZ2-6eLr1B-iVbNrL6wOM",
    },
    date: "2023.10.24",
    size: "850 KB",
    previewIcon: { name: "visibility", title: "미리보기" },
    downloadIcon: { name: "download", title: "다운로드" },
  },
  {
    id: "derivative-lecture",
    title: "3주차: 미분계수와 도함수 강의",
    description: "보충 심화 강의 영상",
    icon: {
      name: "play_circle",
      className:
        "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    },
    subject: {
      label: "수학 (고2)",
      className:
        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    },
    uploader: {
      name: "김수학 T",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDx_0g65UCfigm3a4OcfN9RCnIsVBsBHodm4fyf1vCnNgp3wuaIXQKlN2AU4sOTY5tmOAYvW8AOSw0VDACqnwxJhGtC2Ss9ggzN19mTyisGCsehQAgBse_B2KQsxwGwIeofBmuSqmy5puFQESmTnx0gA2QutQqIt_8N_TGhq5Q-DBuOt3fh8xWwQL7PjS8yWX3EXtL4ym3iFri_BG2YuXobgBnjb4Y0xhbwPXLC2dETgjsv-1GsrpeeJm12zKioF1W3PuFvPR2w784",
    },
    date: "2023.10.22",
    size: "145 MB",
    previewIcon: { name: "play_arrow", title: "재생" },
    downloadIcon: { name: "download", title: "다운로드" },
  },
  {
    id: "english-grammar",
    title: "영어 문법 정리: 가정법",
    description: "핵심 문법 요약 노트",
    icon: {
      name: "picture_as_pdf",
      className: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    },
    subject: {
      label: "영어 (고1)",
      className:
        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    },
    uploader: {
      name: "박영어 T",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA-EyfthbM-McMKLzL-HsfUCqqR947r9LXF5WLBBcAM5PNKSMOP5saRvdvQjJtIBJwrN9Q43jOHW9P-XV530zkIoj2JE6P9OtxX56Y2K7UDRRhJ2hR0KH-YtPMzxJ5CVY3SnxKn0Mdnm6UCinRMv3hYKBuV9aXn6i5R20IeHuYMQ-gloGL--lDZiDaPEEqpl9GtXTg7QLJSKyDsqFm-bk_QKPEJugKm7pdPEZjLgNkNm5U251xF2WpcHspo2Atybui1vnRlm1scom0",
    },
    date: "2023.10.20",
    size: "3.1 MB",
    previewIcon: { name: "visibility", title: "미리보기" },
    downloadIcon: { name: "download", title: "다운로드" },
  },
  {
    id: "september-analysis",
    title: "9월 모의고사 분석 자료 전체",
    description: "국어, 영어, 수학 분석 파일 압축",
    icon: {
      name: "folder_zip",
      className:
        "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300",
    },
    subject: {
      label: "종합",
      className:
        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    },
    uploader: {
      name: "교무팀",
      fallbackIcon: "school",
    },
    date: "2023.10.15",
    size: "12.5 MB",
    previewIcon: { name: "visibility_off", title: "비공개" },
    downloadIcon: { name: "download", title: "다운로드" },
  },
];

export const pagination = ["1", "2", "3", "...", "9"];
