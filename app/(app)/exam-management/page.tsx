import type { Metadata } from "next";

import { AssistantSubNav } from "@/components/layout/AssistantSubNav";
import { examSubNavLinks } from "@/constants/examSubNavLinks";
import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "시험 등록 - EduTrack",
  description: "시험/과제를 등록하고 문항 및 배점을 구성하는 화면",
};

export default function ExamManagementPage() {
  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200"
      )}
    >
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex text-sm text-slate-500 dark:text-slate-400"
        >
          <ol className="flex items-center space-x-2">
            <li>
              <a className="hover:text-primary" href="/dashboard">
                홈
              </a>
            </li>
            <li>
              <span className="select-none">/</span>
            </li>
            <li>
              <a className="hover:text-primary" href="/exam-management">
                시험/과제 관리
              </a>
            </li>
            <li>
              <span className="select-none">/</span>
            </li>
            <li className="font-medium text-slate-900 dark:text-white">
              시험 상세 등록
            </li>
          </ol>
        </nav>
        <AssistantSubNav
          activeHref="/exam-management"
          links={examSubNavLinks}
          className="mb-6"
        />

        <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex-1 space-y-2">
            <h1
              className={cn(
                lexend.className,
                "text-3xl font-black text-slate-900 dark:text-white md:text-4xl"
              )}
            >
              시험/과제 제작
            </h1>
            <p className="text-base text-slate-500 dark:text-slate-400">
              시험지를 등록하고 문항별 상세 정답 및 배점을 설정합니다. 등록된
              정보는 성적표 생성 및 성적 분석에 활용됩니다.
            </p>
          </div>
          <div className="min-w-[320px] flex gap-4">
            <StatCard label="등록된 문항" value="20" suffix="문항" />
            <StatCard label="총점" value="100" suffix="점" accent />
          </div>
        </header>

        <form className="space-y-8">
          <ExamInfoSection />
          <QuestionSetupSection />
          <QuestionList />
          <StickyActions />
        </form>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  suffix,
  accent,
}: {
  label: string;
  value: string;
  suffix: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <span className="mb-1 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span
        className={cn(
          "font-display text-3xl font-bold",
          accent ? "text-primary" : "text-slate-900 dark:text-white"
        )}
      >
        {value}
        <span className="ml-1 text-lg font-normal text-slate-400">
          {suffix}
        </span>
      </span>
    </div>
  );
}

function ExamInfoSection() {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800/50">
        <h3 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900 dark:text-white">
          <span className={cn(iconClass("text-primary"))}>description</span>
          시험 정보 및 원본 파일
        </h3>
      </div>
      <div className="grid gap-6 p-6 md:grid-cols-2">
        <div className="md:col-span-2 space-y-2">
          <label
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
            htmlFor="exam-title"
          >
            시험/과제명
          </label>
          <input
            id="exam-title"
            type="text"
            placeholder="예: 2024년 1학기 중간고사 수학"
            className="w-full rounded-lg border-slate-300 bg-white text-slate-900 shadow-sm focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
        </div>
        <SelectField
          id="subject"
          label="과목"
          options={["수학", "영어", "국어", "과학"]}
        />
        <SelectField
          id="class-target"
          label="대상 학급"
          options={["고2 A반", "고2 B반", "고3 심화반"]}
        />
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
            htmlFor="deadline"
          >
            제출 기한
          </label>
          <div className="relative">
            <span
              className={cn(
                iconClass(
                  "absolute inset-y-0 left-3 flex items-center text-lg text-slate-400"
                )
              )}
            >
              event
            </span>
            <input
              id="deadline"
              type="datetime-local"
              className="w-full rounded-lg border-slate-300 bg-white pl-10 pr-4 text-slate-900 shadow-sm focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
            htmlFor="pass-score"
          >
            통과 기준 점수 (Cut-line)
          </label>
          <div className="relative">
            <input
              id="pass-score"
              type="number"
              placeholder="예: 80"
              className="w-full rounded-lg border-slate-300 bg-white pr-12 text-right text-slate-900 shadow-sm focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
            <span className="pointer-events-none absolute right-4 top-2.5 text-sm text-slate-500 dark:text-slate-400">
              점
            </span>
          </div>
        </div>
        <div className="md:col-span-2 space-y-2 pt-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            시험지 원본 파일 (PDF/HWP)
          </label>
          <label className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700/50 dark:hover:bg-slate-700">
            <div className="flex flex-row items-center gap-3 text-left">
              <span className={cn(iconClass("text-3xl text-slate-400"))}>
                upload_file
              </span>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  시험지 파일을 업로드하세요
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  학생들에게 제공될 문제지 원본 (최대 50MB)
                </p>
              </div>
            </div>
            <input type="file" className="hidden" />
          </label>
        </div>
        <div className="md:col-span-2 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <input
            id="retest-auto"
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-500 dark:bg-slate-700"
          />
          <div className="text-sm">
            <label
              className="font-medium text-slate-900 dark:text-white"
              htmlFor="retest-auto"
            >
              재시험 대상 자동 분류 활성화
            </label>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              성적 계산 후, 통과 기준 점수에 미달하는 학생을 자동으로
              &lsquo;재시험 대상&rsquo; 그룹으로 분류하고 알림을 발송합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SelectField({
  id,
  label,
  options,
}: {
  id: string;
  label: string;
  options: string[];
}) {
  return (
    <div className="space-y-2">
      <label
        className="text-sm font-medium text-slate-700 dark:text-slate-300"
        htmlFor={id}
      >
        {label}
      </label>
      <select
        id={id}
        className="w-full rounded-lg border-slate-300 bg-white text-slate-900 shadow-sm focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-700 dark:text-white"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function QuestionSetupSection() {
  return (
    <section className="overflow-hidden rounded-xl border border-primary/20 bg-white shadow-lg shadow-primary/5 ring-1 ring-primary/10 dark:bg-slate-800">
      <div className="flex items-center justify-between border-b border-primary/10 bg-primary/5 px-6 py-4 dark:bg-primary/10">
        <h3 className="flex items-center gap-2 font-display text-lg font-bold text-primary">
          <span className={iconClass()}>settings_suggest</span>
          문항 및 배점 구성
        </h3>
        <span className="rounded bg-white px-2 py-1 text-xs font-medium text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-300">
          성적 처리 연동
        </span>
      </div>
      <div className="p-8">
        <div className="flex flex-col items-end justify-center gap-8 md:flex-row">
          <div className="w-full flex-1 space-y-3 md:max-w-xs">
            <label
              className="block text-base font-bold text-slate-800 dark:text-slate-200"
              htmlFor="total-questions"
            >
              총 문항 수 <span className="text-primary">*</span>
            </label>
            <div className="group relative">
              <input
                id="total-questions"
                type="number"
                min={1}
                defaultValue={20}
                className="w-full rounded-xl border-2 border-slate-300 bg-white py-4 text-center text-4xl font-black text-slate-900 shadow-sm transition group-hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
              <span className="pointer-events-none absolute right-4 bottom-5 text-lg font-medium text-slate-400">
                문항
              </span>
            </div>
            <p className="text-center text-xs text-slate-500">
              문항 수를 입력하면 아래 리스트가 자동 생성됩니다.
            </p>
          </div>
          <div className="hidden pb-10 text-slate-300 dark:text-slate-600 md:block">
            <span className={iconClass("text-4xl")}>arrow_forward</span>
          </div>
          <div className="w-full flex-1 space-y-3 md:max-w-xs">
            <label
              className="block text-base font-bold text-slate-800 dark:text-slate-200"
              htmlFor="total-score"
            >
              총 배점 (만점)
            </label>
            <div className="relative">
              <input
                id="total-score"
                type="number"
                readOnly
                defaultValue={100}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-4 text-center text-4xl font-bold text-slate-700 shadow-sm dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-200"
              />
              <span className="pointer-events-none absolute right-4 bottom-5 text-lg font-medium text-slate-400">
                점
              </span>
            </div>
            <label className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <input
                id="auto-calc"
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-500 dark:bg-slate-700"
              />
              문항별 배점 합계 자동 적용
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuestionList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
          문항별 정답 및 배점 설정
        </h2>
        <button
          type="button"
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
        >
          엑셀로 일괄 업로드
        </button>
      </div>
      <QuestionCard
        number="1"
        typeLabel="객관식"
        points={5}
        answerOptions={[1, 2, 3, 4, 5]}
        selectedAnswer={2}
        partialCredit
      />
      <QuestionCard
        number="2"
        typeLabel="주관식"
        points={10}
        partialCredit
        subjectAnswer
      />
      <button
        type="button"
        className="group flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-6 text-slate-500 transition hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-slate-600 dark:hover:bg-primary/10"
      >
        <span className="rounded-full bg-slate-100 p-3 transition group-hover:bg-white group-hover:text-primary dark:bg-slate-700">
          <span className={iconClass("text-2xl")}>add</span>
        </span>
        <span className="font-medium">새 문항 추가</span>
      </button>
    </div>
  );
}

type QuestionCardProps = {
  number: string;
  typeLabel: string;
  points: number;
  answerOptions?: number[];
  selectedAnswer?: number;
  partialCredit?: boolean;
  subjectAnswer?: boolean;
};

function QuestionCard({
  number,
  typeLabel,
  points,
  answerOptions,
  selectedAnswer,
  partialCredit,
  subjectAnswer,
}: QuestionCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md ring-1 ring-slate-200 transition hover:ring-primary/50 dark:border-slate-700 dark:bg-slate-800 dark:ring-slate-700">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800/80">
        <div className="flex items-center gap-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-slate-900 font-display text-lg font-bold text-white dark:bg-white dark:text-slate-900">
            {number}
          </span>
          <select
            defaultValue={typeLabel}
            className="relative w-32 cursor-pointer appearance-none rounded-lg border border-slate-300 bg-white p-2 pr-8 text-sm font-medium text-slate-900 focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option>객관식</option>
            <option>주관식</option>
            <option>선택형 (다중)</option>
          </select>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              배점
            </label>
            <div className="relative w-20">
              <input
                type="number"
                defaultValue={points}
                className="w-full rounded-md border-slate-300 bg-white py-1.5 pl-3 pr-8 text-right font-bold text-slate-900 focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
              <span className="pointer-events-none absolute right-2 top-1.5 text-xs text-slate-400">
                점
              </span>
            </div>
          </div>
          <span className="hidden h-6 w-px bg-slate-200 dark:bg-slate-700 md:block" />
          <label className="inline-flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              defaultChecked={partialCredit}
              className="peer sr-only"
            />
            <div className="relative h-5 w-9 rounded-full bg-slate-200 transition peer-checked:bg-primary dark:bg-slate-700">
              <span className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-4" />
            </div>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              부분 점수
            </span>
          </label>
          <button
            type="button"
            className="rounded p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
          >
            <span className={iconClass("text-xl")}>delete</span>
          </button>
        </div>
      </div>
      <div className="space-y-6 p-6">
        <div className="space-y-2">
          <label className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-300">
            <span>문제 내용 (선택사항)</span>
            <span className="text-xs font-normal text-slate-400">
              시험지 파일을 업로드한 경우 생략 가능
            </span>
          </label>
          <textarea
            rows={2}
            className="w-full rounded-lg border-slate-300 bg-slate-50 p-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-700/30 dark:text-white"
            placeholder="문제를 직접 입력하거나 비워두세요..."
            defaultValue={
              number === "2"
                ? "다음 지문을 읽고 필자의 주장을 한 문장으로 요약하시오."
                : undefined
            }
          />
        </div>
        {subjectAnswer ? (
          <SubjectiveAnswerForm />
        ) : (
          <ObjectiveAnswerForm
            answerOptions={answerOptions ?? []}
            selectedAnswer={selectedAnswer}
          />
        )}
        <details className="pt-2">
          <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-primary dark:text-slate-400">
            <span className={iconClass("text-base transition")}>
              chevron_right
            </span>
            해설 입력 (오답 노트용)
          </summary>
          <div className="mt-3">
            <textarea
              rows={2}
              className="w-full rounded-lg border-slate-300 bg-slate-50 p-3 text-sm text-slate-900 focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-700/50 dark:text-white"
              placeholder="학생들이 확인할 해설을 입력하세요."
            />
          </div>
        </details>
      </div>
    </div>
  );
}

function ObjectiveAnswerForm({
  answerOptions,
  selectedAnswer,
}: {
  answerOptions: number[];
  selectedAnswer?: number;
}) {
  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-5 dark:border-blue-800 dark:bg-blue-900/10">
      <label className="mb-3 flex items-center gap-2 text-sm font-bold text-primary">
        <span className={iconClass("text-lg")}>check_circle</span>
        정답 설정
      </label>
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm font-medium text-slate-600 dark:text-slate-400">
          정답 선택:
        </span>
        <div className="flex gap-2">
          {answerOptions.map((option) => (
            <label key={option} className="cursor-pointer">
              <input
                type="radio"
                name="objective-answer"
                defaultChecked={option === selectedAnswer}
                className="peer sr-only"
              />
              <div className="flex size-10 items-center justify-center rounded-full border-2 border-slate-300 bg-white font-bold text-slate-500 transition peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white dark:border-slate-600 dark:bg-slate-800">
                {option}
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function SubjectiveAnswerForm() {
  return (
    <div className="space-y-4 rounded-lg border border-blue-100 bg-blue-50/50 p-5 dark:border-blue-800 dark:bg-blue-900/10">
      <label className="flex items-center gap-2 text-sm font-bold text-primary">
        <span className={iconClass("text-lg")}>check_circle</span>
        주관식 정답 설정
      </label>
      <div className="space-y-3">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-500">
              모범 답안 (Exact Match)
            </label>
            <input
              type="text"
              className="w-full rounded-md border-slate-300 bg-white text-sm focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-800"
              placeholder="정확히 일치해야 하는 정답 입력"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">
              유사 답안 허용
            </label>
            <select className="w-full rounded-md border-slate-300 bg-white text-sm focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-800">
              <option>띄어쓰기 무시</option>
              <option>대소문자 무시</option>
              <option>완전 일치만 허용</option>
            </select>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500">
            채점 키워드 (포함 시 점수 부여)
          </label>
          <div className="flex items-center gap-2">
            <span className={iconClass("text-slate-400")}>key</span>
            <input
              type="text"
              className="flex-1 rounded-md border-slate-300 bg-white text-sm focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-800"
              placeholder="예: 환경 보호, 지속 가능성 (쉼표로 구분)"
            />
          </div>
          <p className="text-xs text-slate-400">
            부분 점수 활성화 시 키워드 포함 여부로 자동 채점됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}

function StickyActions() {
  return (
    <>
      <div className="sticky bottom-4 z-40 mt-12">
        <div className="mx-auto flex max-w-5xl items-center gap-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-xl backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80">
          <div className="hidden items-center gap-1 text-sm text-slate-500 dark:text-slate-400 sm:flex">
            <span className={iconClass("text-green-500 text-lg")}>
              check_circle
            </span>
            모든 변경사항이 저장됨
          </div>
          <div className="ml-auto flex w-full items-center gap-3 sm:w-auto">
            <button
              type="button"
              className="flex-1 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 sm:flex-none"
            >
              임시 저장
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-500/30 transition hover:bg-blue-600 sm:flex-none"
            >
              <span>등록 및 성적 연동</span>
              <span className={iconClass("text-lg")}>send</span>
            </button>
          </div>
        </div>
      </div>
      <div className="h-8" />
    </>
  );
}
