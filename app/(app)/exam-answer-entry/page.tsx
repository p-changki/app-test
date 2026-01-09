import type { Metadata } from "next";

import { AssistantSubNav } from "@/components/layout/AssistantSubNav";
import { examSubNavLinks } from "@/constants/examSubNavLinks";
import { lexend, notoSansKr } from "@/lib/fonts";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

const examOptions = [
  "2023년 2학기 중간고사 - 수학 I",
  "2023년 2학기 기말고사 - 수학 I",
  "주간 테스트 14회차",
] as const;

const studentOptions = [
  "김민수 (고2 A반)",
  "이서연 (고2 A반)",
  "박지훈 (고2 B반)",
] as const;

type QuestionVariant = "mcq" | "subjective" | "ox";

type Question = {
  id: number;
  type: QuestionVariant;
  label: string;
  score: number;
  prompt: string;
  status: "correct" | "incorrect" | "partial";
  correct: string;
  student: string;
};

const questions: Question[] = [
  {
    id: 1,
    type: "mcq",
    label: "객관식",
    score: 5,
    prompt: "다음 중 지수함수의 성질로 옳지 않은 것은?",
    status: "correct",
    correct: "3",
    student: "3",
  },
  {
    id: 2,
    type: "mcq",
    label: "객관식",
    score: 5,
    prompt: "로그부등식 log₂(x-1) < 3 의 해는?",
    status: "incorrect",
    correct: "4",
    student: "2",
  },
  {
    id: 3,
    type: "subjective",
    label: "주관식",
    score: 10,
    prompt:
      "삼각함수 sin(x)의 그래프를 x축 방향으로 π/2만큼 평행이동한 식을 구하시오.",
    status: "partial",
    correct: "y = cos(x)",
    student: "y = cos(x) + 1",
  },
  {
    id: 4,
    type: "ox",
    label: "O / X",
    score: 5,
    prompt: "모든 실수는 복소수에 포함된다.",
    status: "correct",
    correct: "O",
    student: "O",
  },
];

export const metadata: Metadata = {
  title: "정답지 등록 - EduTrack",
  description: "학생 답안을 입력하고 자동 채점 결과를 확인하는 화면",
};

export default function ExamAnswerEntryPage() {
  return (
    <div
      className={cn(
        notoSansKr.className,
        "bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200"
      )}
    >
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex text-sm text-slate-500 dark:text-slate-400"
        >
          <ol className="flex items-center space-x-2">
            <li>
              <a className="hover:text-primary" href="/dashboard">
                홈
              </a>
            </li>
            <li>
              <span>/</span>
            </li>
            <li>
              <a className="hover:text-primary" href="/exam-dashboard">
                시험/과제 관리
              </a>
            </li>
            <li>
              <span>/</span>
            </li>
            <li className="font-medium text-slate-900 dark:text-white">
              정답지 등록
            </li>
          </ol>
        </nav>
        <AssistantSubNav
          activeHref="/exam-answer-entry"
          links={examSubNavLinks}
          className="mb-6"
        />
        <header className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <h1
              className={cn(
                lexend.className,
                "text-3xl font-black text-slate-900 dark:text-white md:text-4xl"
              )}
            >
              학생 답안 입력 및 채점
            </h1>
            <p className="text-base text-slate-500 dark:text-slate-400">
              시험을 선택하고 학생별 답안을 입력하여 자동으로 채점하세요.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600">
              <span className={iconClass("text-lg")}>arrow_back</span>
              이전 학생
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white shadow-md transition hover:bg-blue-600">
              다음 학생
              <span className={iconClass("text-lg")}>arrow_forward</span>
            </button>
          </div>
        </header>
        <FilterBar />
        <StatsCard />
        <QuestionList />
      </main>
    </div>
  );
}

function FilterBar() {
  return (
    <section className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-surface-dark md:flex-row">
      <FilterSelect label="시험 선택" options={examOptions} />
      <FilterSelect label="학생 선택" options={studentOptions} />
    </section>
  );
}

function FilterSelect({
  label,
  options,
}: {
  label: string;
  options: readonly string[];
}) {
  return (
    <label className="flex flex-1 flex-col gap-2">
      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
        {label}
      </span>
      <div className="relative">
        <select className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white">
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <span
          className={iconClass(
            "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          )}
        >
          expand_more
        </span>
      </div>
    </label>
  );
}

function StatsCard() {
  return (
    <section className="sticky top-4 z-10 mb-6 rounded-xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-surface-dark/90">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-wrap gap-6 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          <Stat
            label="총점"
            value={<StatValue primary="85" secondary="/ 100" />}
          />
          <Divider />
          <Stat
            label="진행률"
            value={
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <span className="text-2xl font-bold">100%</span>
                <div className="h-2 w-24 rounded-full bg-slate-100 dark:bg-slate-700">
                  <div className="h-full rounded-full bg-green-500" />
                </div>
              </div>
            }
          />
          <Divider />
          <Stat
            label="채점 현황"
            value={
              <div className="flex gap-2 text-xs font-medium">
                <span className="rounded bg-green-50 px-2 py-1 text-green-600 dark:bg-green-900/30 dark:text-green-300">
                  정답 17
                </span>
                <span className="rounded bg-rose-50 px-2 py-1 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300">
                  오답 3
                </span>
              </div>
            }
          />
        </div>
        <button className="hidden rounded-lg bg-slate-800 px-6 py-2 text-sm font-bold text-white transition hover:bg-slate-900 dark:bg-slate-600 dark:hover:bg-slate-500 sm:flex">
          <span className={iconClass("mr-2 text-lg")}>save</span>
          채점 완료 및 저장
        </button>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p>{label}</p>
      {value}
    </div>
  );
}

function StatValue({
  primary,
  secondary,
}: {
  primary: string;
  secondary: string;
}) {
  return (
    <div className="flex items-baseline gap-1 text-slate-900 dark:text-slate-100">
      <span className="text-3xl font-black text-primary">{primary}</span>
      <span className="text-lg font-bold text-slate-400">{secondary}</span>
    </div>
  );
}

function Divider() {
  return (
    <div className="hidden h-10 w-px bg-slate-200 dark:bg-slate-700 sm:block" />
  );
}

function QuestionList() {
  return (
    <section className="space-y-4 pb-10">
      {questions.map((question) => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </section>
  );
}

function QuestionCard({ question }: { question: Question }) {
  const statusStyles = {
    correct: {
      container: "border-l-green-500",
      label:
        "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300",
      icon: "check_circle",
      iconColor: "text-green-500",
    },
    incorrect: {
      container: "border-l-rose-500",
      label: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-300",
      icon: "cancel",
      iconColor: "text-rose-500",
    },
    partial: {
      container: "border-l-amber-400",
      label:
        "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300",
      icon: "remove_circle",
      iconColor: "text-amber-500",
    },
  }[question.status];

  return (
    <article
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-surface-dark",
        `border-l-4 ${statusStyles.container}`
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold dark:bg-slate-700">
              {question.id}
            </span>
            <span className="rounded bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              {question.label}
            </span>
            <span className="text-xs text-slate-400">
              배점 {question.score}점
            </span>
          </div>
          <p className="pl-11 text-base font-medium text-slate-900 dark:text-white">
            {question.prompt}
          </p>
          {question.type === "subjective" ? (
            <div className="pl-11">
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                학생 답안
              </label>
              <input
                type="text"
                defaultValue={question.student}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
              <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm dark:border-blue-900/40 dark:bg-blue-900/10">
                <span className="mb-1 block text-xs font-bold text-blue-700 dark:text-blue-300">
                  모범 답안
                </span>
                <p className="font-mono text-blue-900 dark:text-blue-100">
                  {question.correct}
                </p>
              </div>
            </div>
          ) : question.type === "mcq" ? (
            <McqOptions correct={question.correct} student={question.student} />
          ) : (
            <OxOptions student={question.student} correct={question.correct} />
          )}
        </div>
        <div className="flex min-w-[150px] flex-col items-end justify-between border-t pt-4 dark:border-slate-700 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <div
            className={cn(
              "flex items-center gap-1 rounded px-2 py-1 text-sm font-bold",
              statusStyles.label
            )}
          >
            <span
              className={cn(
                iconClass("text-base"),
                statusStyles.iconColor,
                "filled"
              )}
            >
              {statusStyles.icon}
            </span>
            {question.status === "correct" && "정답"}
            {question.status === "incorrect" && "오답"}
            {question.status === "partial" && "부분 점수"}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              defaultValue={
                question.status === "incorrect"
                  ? 0
                  : question.score === 10 && question.status === "partial"
                    ? 5
                    : question.score
              }
              className="w-20 rounded border border-slate-200 bg-slate-50 py-1.5 text-right text-lg font-bold text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            <span className="text-sm font-medium text-slate-400">
              / {question.score}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function McqOptions({
  student,
  correct,
}: {
  student: string;
  correct: string;
}) {
  const options = ["1", "2", "3", "4", "5"];
  return (
    <div className="flex flex-wrap gap-3 pl-11">
      {options.map((option) => {
        const isSelected = student === option;
        const isCorrect = correct === option;
        return (
          <button
            key={option}
            className={cn(
              "size-10 rounded-full border text-sm font-bold transition",
              isCorrect
                ? "border-primary bg-primary text-white"
                : isSelected
                  ? "border-rose-500 bg-rose-50 text-rose-600 dark:border-rose-600 dark:bg-rose-900/30 dark:text-rose-300"
                  : "border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function OxOptions({ student, correct }: { student: string; correct: string }) {
  return (
    <div className="flex gap-3 pl-11">
      {["O", "X"].map((choice) => {
        const isSelected = student === choice;
        const isCorrect = correct === choice;
        return (
          <button
            key={choice}
            className={cn(
              "flex items-center gap-2 rounded-lg px-6 py-2 font-bold transition",
              isCorrect
                ? "bg-primary text-white shadow"
                : isSelected
                  ? "border border-rose-500 bg-rose-50 text-rose-600 dark:border-rose-600 dark:bg-rose-900/30 dark:text-rose-300"
                  : "border border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
            )}
          >
            <span className={iconClass("text-lg")}>
              {choice === "O" ? "circle" : "close"}
            </span>
            {choice}
          </button>
        );
      })}
    </div>
  );
}
