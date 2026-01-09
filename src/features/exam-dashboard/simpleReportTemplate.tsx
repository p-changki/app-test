"use client";

import { cn } from "@/lib/utils";

export type SimpleReportData = {
  studentName: string;
  examName: string;
  examType?: string;
  className: string;
  academyName?: string;
  academyEnglishName?: string;
  testDate?: string;
  roundLabel?: string;
  score: number | string;
  rank: number | string;
  averageScore: number | string;
  attendance?: string;
  nextLesson?: string;
  assignments: string[];
};

export const DEFAULT_ACADEMY_NAME = "서하늘영어";
export const DEFAULT_ACADEMY_EN_NAME = "Seohaneul English";

type QuestionRow = {
  no: number;
  source: string;
  type: string;
  status: string;
  rate: string;
};

export function buildQuestionRows(data: SimpleReportData): QuestionRow[] {
  if (!data.assignments.length) {
    return [];
  }

  return data.assignments.slice(0, 10).map((assignment, index) => ({
    no: index + 1,
    source: assignment,
    type: data.examType ?? "시험",
    status: "O",
    rate:
      typeof data.averageScore === "number"
        ? `${data.averageScore}%`
        : String(data.averageScore ?? "-"),
  }));
}

const assignmentPlaceholders = ["미응시", "등록 준비 중", "등록 준비 중"];

export function SimpleReportPreview({
  data,
  className,
  scale = 1,
}: {
  data: SimpleReportData;
  className?: string;
  scale?: number;
}) {
  const year = data.testDate
    ? new Date(data.testDate).getFullYear()
    : new Date().getFullYear();
  const academy = data.academyName ?? DEFAULT_ACADEMY_NAME;
  const academyEn = data.academyEnglishName ?? DEFAULT_ACADEMY_EN_NAME;
  const brandInitials = academy
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  const questionRows = buildQuestionRows(data);
  const assignmentColumns = assignmentPlaceholders.map(
    (_, index) => data.assignments[index] ?? assignmentPlaceholders[index]
  );
  const chipItems = [
    data.className && `클래스 ${data.className}`,
    data.examType,
    data.testDate,
    data.roundLabel && `${data.roundLabel}`,
  ].filter(Boolean) as string[];
  const highlightStats = [
    {
      label: "원점수",
      value: data.score ?? "-",
      helper: data.rank ? `${data.rank}` : "총점 기준",
    },
    {
      label: "석차",
      value: data.rank ?? "-",
      helper: "반 기준 순위",
    },
    {
      label: "평균점수",
      value: data.averageScore ?? "-",
      helper: "누적 평균",
    },
  ];
  const infoCards = [
    { label: "시험 종류", value: data.examType ?? "-" },
    { label: "시험 일정", value: data.testDate ?? "-" },
    { label: "회차", value: data.roundLabel ?? "-" },
  ];
  const scaled = scale && scale !== 1;
  const outerClass = cn(scaled ? "inline-block" : "", className);
  const outerStyle = scaled
    ? { transform: `scale(${scale})`, transformOrigin: "top center" }
    : undefined;

  const content = (
    <div className="rounded-3xl border border-slate-200 bg-[#f8fafc] p-4 text-slate-800 shadow-sm dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100">
      <div className="mx-auto max-w-[640px] space-y-5">
        <header className="rounded-3xl bg-gradient-to-br from-[#5c88da] via-[#7ca2e9] to-[#a4c1f7] p-6 text-white shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/70">
                Edu Report {year}
              </p>
              <p className="text-2xl font-bold leading-tight md:text-3xl">
                {data.examName}
              </p>
              <p className="text-sm font-medium text-white/80">
                {data.studentName} · {academy}
              </p>
            </div>
            <div className="text-right">
              <div className="ml-auto flex size-12 items-center justify-center rounded-full bg-white/15 text-lg font-black text-white shadow-lg">
                {brandInitials}
              </div>
              <p className="mt-2 text-sm font-semibold">{academy}</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/80">
                {academyEn}
              </p>
            </div>
          </div>
          {chipItems.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {chipItems.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        <section className="grid gap-3 sm:grid-cols-3">
          {highlightStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {stat.helper}
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="grid gap-4 sm:grid-cols-3">
            {infoCards.map((info) => (
              <div key={info.label}>
                <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                  {info.label}
                </p>
                <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                  {info.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                    출결
                  </p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {data.attendance ?? "정보 없음"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                    다음 수업
                  </p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {data.nextLesson ?? "일정 미정"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
                {["단어", "과제", "추가 과제"].map((label, index) => (
                  <div
                    key={label}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200"
                  >
                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                      {assignmentColumns[index]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              과제 현황
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {data.assignments.length ? (
                data.assignments.map((assignment) => (
                  <li
                    key={assignment}
                    className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-800/60"
                  >
                    {assignment}
                  </li>
                ))
              ) : (
                <li className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-xs text-slate-500 dark:border-slate-700">
                  등록된 과제가 없습니다.
                </li>
              )}
            </ul>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="bg-primary/80 py-2 text-center font-semibold text-white">
            문항별 응시 결과
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 dark:bg-slate-800/70 dark:text-slate-200">
                  <th className="w-16 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide">
                    No.
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                    출처
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                    유형
                  </th>
                  <th className="w-20 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide">
                    O/X
                  </th>
                  <th className="w-24 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide">
                    오답률
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900/70">
                {questionRows.length ? (
                  questionRows.map((row) => (
                    <tr
                      key={row.no}
                      className="border-b border-slate-100 dark:border-slate-800"
                    >
                      <td className="px-4 py-2 text-center">{row.no}</td>
                      <td className="px-4 py-2">{row.source}</td>
                      <td className="px-4 py-2">{row.type}</td>
                      <td className="px-4 py-2 text-center">{row.status}</td>
                      <td className="px-4 py-2 text-center">{row.rate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400"
                    >
                      세부 문항 데이터가 등록되지 않았습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            전달 사항
          </p>
          <div className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100">
                수업 내용
              </p>
              <p>{data.examName}</p>
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100">
                다음 단계
              </p>
              <p>
                {data.nextLesson ?? "다음 일정/안내가 등록되지 않았습니다."}
              </p>
            </div>
          </div>
        </section>

        <footer className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
          <div className="flex size-9 items-center justify-center rounded-full bg-slate-800 font-semibold text-white dark:bg-slate-200 dark:text-slate-900 md:size-10">
            {brandInitials}
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">{academy}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
              {academyEn}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );

  return (
    <div className={outerClass} style={outerStyle}>
      {content}
    </div>
  );
}

function sanitize(value: string | number | undefined | null) {
  if (value === undefined || value === null) {
    return "";
  }
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function buildSimpleTemplateHtml(data: SimpleReportData) {
  const year = data.testDate
    ? new Date(data.testDate).getFullYear()
    : new Date().getFullYear();
  const academy = sanitize(data.academyName ?? DEFAULT_ACADEMY_NAME);
  const academyEn = sanitize(
    data.academyEnglishName ?? DEFAULT_ACADEMY_EN_NAME
  );
  const examName = sanitize(data.examName);
  const studentName = sanitize(data.studentName);
  const questionRows = buildQuestionRows(data);
  const questionRowsHtml = questionRows.length
    ? questionRows
        .map(
          (row) => `
          <tr class="border-b border-slate-100">
            <td class="px-4 py-2 text-center">${sanitize(row.no)}</td>
            <td class="px-4 py-2">${sanitize(row.source)}</td>
            <td class="px-4 py-2">${sanitize(row.type)}</td>
            <td class="px-4 py-2 text-center">${sanitize(row.status)}</td>
            <td class="px-4 py-2 text-center">${sanitize(row.rate)}</td>
          </tr>`
        )
        .join("")
    : '<tr><td colspan="5" class="px-4 py-6 text-center text-sm text-slate-500">세부 문항 데이터가 등록되지 않았습니다.</td></tr>';

  const assignmentItemsHtml = data.assignments.length
    ? data.assignments
        .map(
          (assignment) => `
      <li class="rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 text-slate-700">${sanitize(assignment)}</li>`
        )
        .join("")
    : '<li class="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-xs text-slate-500">등록된 과제가 없습니다.</li>';

  const assignmentColumns = assignmentPlaceholders.map((_, index) =>
    sanitize(data.assignments[index] ?? assignmentPlaceholders[index])
  );
  const assignmentBoxesHtml = ["단어", "과제", "추가 과제"]
    .map(
      (label, index) => `
      <div class="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center font-semibold text-slate-600">
        <p class="text-xs uppercase tracking-wide text-slate-500">${label}</p>
        <p class="mt-1 text-sm font-bold text-slate-900">${assignmentColumns[index]}</p>
      </div>`
    )
    .join("");

  const chipItemsHtml = [
    data.className && `클래스 ${data.className}`,
    data.examType,
    data.testDate,
    data.roundLabel,
  ]
    .filter(Boolean)
    .map(
      (chip) =>
        `<span class="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">${sanitize(
          chip
        )}</span>`
    )
    .join("");

  const highlightStats = [
    {
      label: "원점수",
      value: data.score ?? "-",
      helper: data.rank ? `${data.rank}` : "총점 기준",
    },
    { label: "석차", value: data.rank ?? "-", helper: "반 기준 순위" },
    { label: "평균점수", value: data.averageScore ?? "-", helper: "누적 평균" },
  ];
  const highlightStatsHtml = highlightStats
    .map(
      (stat) => `
      <div class="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
        <p class="text-xs font-semibold uppercase text-slate-500">${stat.label}</p>
        <p class="mt-2 text-2xl font-extrabold text-slate-900">${sanitize(stat.value)}</p>
        <p class="text-xs text-slate-500">${sanitize(stat.helper)}</p>
      </div>`
    )
    .join("");

  const infoCards = [
    { label: "시험 종류", value: data.examType ?? "-" },
    { label: "시험 일정", value: data.testDate ?? "-" },
    { label: "회차", value: data.roundLabel ?? "-" },
  ];
  const infoCardsHtml = infoCards
    .map(
      (info) => `
      <div>
        <p class="text-xs font-semibold uppercase text-slate-500">${info.label}</p>
        <p class="mt-1 text-base font-bold text-slate-900">${sanitize(info.value)}</p>
      </div>`
    )
    .join("");

  const attendance = sanitize(data.attendance ?? "정보 없음");
  const nextLesson = sanitize(data.nextLesson ?? "일정 미정");
  const nextStep = sanitize(
    data.nextLesson ?? "다음 일정/안내가 등록되지 않았습니다."
  );

  return `<!DOCTYPE html>
<html class="light" lang="ko"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>${studentName} 성적 리포트</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,typography"></script>
<link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
<script>
  tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        colors: {
          primary: "#76c7c0",
          "background-light": "#f8fafc",
          "background-dark": "#0f172a",
        },
        fontFamily: {
          display: ["Pretendard", "sans-serif"],
        },
        borderRadius: {
          DEFAULT: "0.5rem",
        },
      },
    },
  };
</script>
<style>
  *, *::before, *::after { box-sizing: border-box; }
  html, body { width: 700px; margin: 0 auto; background: #f8fafc; color: #0f172a; }
  body { min-height: 100%; font-family: 'Pretendard', sans-serif; padding: 18px; }
  .report-canvas { width: 100%; max-width: 640px; margin: 0 auto; }
  @page { size: A4; margin: 15mm; }
</style>
</head>
<body class="bg-background-light text-slate-800 min-h-screen">
<div class="report-canvas mx-auto space-y-5 p-6">
  <header class="rounded-3xl bg-gradient-to-br from-[#5c88da] via-[#7ca2e9] to-[#a4c1f7] p-6 text-white shadow-lg">
    <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.4em] text-white/70">Edu Report ${sanitize(year)}</p>
        <p class="text-3xl font-bold leading-tight">${examName}</p>
        <p class="text-sm font-medium text-white/80">${studentName} · ${academy}</p>
      </div>
      <div class="text-right">
        <div class="ml-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-lg font-black text-white shadow-lg">
          ${academy.slice(0, 3)}
        </div>
        <p class="mt-2 text-sm font-semibold">${academy}</p>
        <p class="text-[10px] uppercase tracking-[0.3em] text-white/80">${academyEn}</p>
      </div>
    </div>
    ${chipItemsHtml ? `<div class="mt-4 flex flex-wrap gap-2">${chipItemsHtml}</div>` : ""}
  </header>

  <section class="grid gap-3 sm:grid-cols-3">
    ${highlightStatsHtml}
  </section>

  <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div class="grid gap-4 sm:grid-cols-3">
      ${infoCardsHtml}
    </div>
  </section>

  <section class="grid gap-4 md:grid-cols-2">
    <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold uppercase text-slate-500">출결</p>
          <p class="text-lg font-bold text-slate-900">${attendance}</p>
        </div>
        <div class="text-right">
          <p class="text-xs font-semibold uppercase text-slate-500">다음 수업</p>
          <p class="text-sm font-semibold text-slate-800">${nextLesson}</p>
        </div>
      </div>
      <div class="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
        ${assignmentBoxesHtml}
      </div>
    </div>
    <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p class="text-xs font-semibold uppercase text-slate-500">과제 현황</p>
      <ul class="mt-3 space-y-2 text-sm text-slate-600">
        ${assignmentItemsHtml}
      </ul>
    </div>
  </section>

  <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white text-sm shadow-sm">
    <div class="bg-primary/80 py-2 text-center font-semibold text-white">문항별 응시 결과</div>
    <div class="overflow-x-auto">
      <table class="min-w-full border-collapse">
        <thead>
          <tr class="bg-slate-50 text-slate-600">
            <th class="w-16 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide">No.</th>
            <th class="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide">출처</th>
            <th class="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide">유형</th>
            <th class="w-20 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide">O/X</th>
            <th class="w-24 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide">오답률</th>
          </tr>
        </thead>
        <tbody>
          ${questionRowsHtml}
        </tbody>
      </table>
    </div>
  </section>

  <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <p class="text-xs font-semibold uppercase text-slate-500">전달 사항</p>
    <div class="mt-3 space-y-3 text-sm text-slate-600">
      <div>
        <p class="font-bold text-slate-800">수업 내용</p>
        <p>${examName}</p>
      </div>
      <div>
        <p class="font-bold text-slate-800">다음 단계</p>
        <p>${nextStep}</p>
      </div>
    </div>
  </section>

  <footer class="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
    <div class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 font-semibold text-white">
      ${academy.slice(0, 3)}
    </div>
    <div class="text-right">
      <p class="text-lg font-bold">${academy}</p>
      <p class="text-[10px] uppercase tracking-[0.2em] text-slate-500">${academyEn}</p>
    </div>
  </footer>
</div>
</body></html>`;
}
