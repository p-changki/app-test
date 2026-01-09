import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";
import {
  ANSWER_OPTIONS,
  CLASS_OPTIONS,
  SUBJECT_OPTIONS,
} from "@/features/exam-management/registration/constants";
import type {
  BannerState,
  DraftQuestion,
  FormState,
} from "@/features/exam-management/registration/types";

export function ExamInfoSection({
  form,
  onChange,
}: {
  form: FormState;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-[var(--surface-background)] shadow-sm dark:border-slate-700 dark:bg-[var(--surface-background)]">
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
            value={form.title}
            onChange={(event) => onChange("title", event.target.value)}
            placeholder="예: 2024년 1학기 중간고사 수학"
            className="w-full rounded-lg border-slate-300 bg-white text-slate-900 shadow-sm focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
        </div>
        <SelectField
          id="subject"
          label="과목"
          options={SUBJECT_OPTIONS}
          value={form.subject}
          onChange={(value) => onChange("subject", value)}
        />
        <SelectField
          id="class-target"
          label="대상 학급"
          options={CLASS_OPTIONS}
          value={form.targetClass}
          onChange={(value) => onChange("targetClass", value)}
        />
        <DateField
          label="시험일"
          value={form.examDate}
          onChange={(value) => onChange("examDate", value)}
        />
        <ScoreField
          label="통과 기준 점수"
          value={form.passScore}
          onChange={(value) => onChange("passScore", value)}
        />
        <FileUploadField />
        <label className="md:col-span-2 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm dark:border-blue-800 dark:bg-blue-900/20">
          <input
            type="checkbox"
            checked={form.autoRetest}
            onChange={(event) => onChange("autoRetest", event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-500 dark:bg-slate-700"
          />
          <div>
            <p className="font-medium text-slate-900 dark:text-white">
              재시험 대상 자동 분류 활성화
            </p>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              통과 기준 점수에 미달하는 학생을 자동으로 재시험 대상 그룹으로
              분류합니다.
            </p>
          </div>
        </label>
      </div>
    </section>
  );
}

export function QuestionSetupSection({
  totalQuestions,
  totalScore,
  onQuestionCountChange,
}: {
  totalQuestions: number;
  totalScore: number;
  onQuestionCountChange: (value: number) => void;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-primary/20 bg-[var(--surface-background)] shadow-lg shadow-primary/5 ring-1 ring-primary/10 dark:bg-[var(--surface-background)]">
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
          <QuestionCountInput
            totalQuestions={totalQuestions}
            onChange={onQuestionCountChange}
          />
          <div className="hidden pb-10 text-slate-300 dark:text-slate-600 md:block">
            <span className={iconClass("text-4xl")}>arrow_forward</span>
          </div>
          <TotalScoreDisplay totalScore={totalScore} />
        </div>
      </div>
    </section>
  );
}

export function QuestionList({
  questions,
  onChange,
  onRemove,
  onAdd,
}: {
  questions: DraftQuestion[];
  onChange: (id: string, updates: Partial<Omit<DraftQuestion, "id">>) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <section className="space-y-6 rounded-xl border border-slate-200 bg-[var(--surface-background)] p-4 shadow-sm dark:border-slate-700 dark:bg-[var(--surface-background)]">
      <div className="flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between sm:px-0">
        <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
          문항별 정답 및 배점 설정
        </h2>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
        >
          문항 추가
        </button>
      </div>
      {questions.map((question, index) => (
        <QuestionCard
          key={question.id}
          index={index}
          question={question}
          onChange={onChange}
          onRemove={onRemove}
        />
      ))}
    </section>
  );
}

export function SummarySection({
  form,
  onChange,
}: {
  form: FormState;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-[var(--surface-background)] p-4 shadow-sm dark:border-slate-700 dark:bg-[var(--surface-background)]">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
        <span className={iconClass("text-primary")}>notes</span>
        요약 및 전달 사항
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <textarea
          rows={3}
          value={form.summary}
          onChange={(event) => onChange("summary", event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-[var(--surface-background)] p-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[var(--surface-background)] dark:text-white"
          placeholder="시험 요약"
        />
        <textarea
          rows={3}
          value={form.notes}
          onChange={(event) => onChange("notes", event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-[var(--surface-background)] p-3 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[var(--surface-background)] dark:text-white"
          placeholder="후속 작업 메모 (줄바꿈 구분)"
        />
      </div>
    </section>
  );
}

export function StickyActions({
  onSubmit,
  submitting,
  message,
}: {
  onSubmit: () => void;
  submitting: boolean;
  message: BannerState;
}) {
  return (
    <>
      <div className="sticky bottom-4 z-40 mt-12">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-xl backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className={iconClass("text-green-500 text-lg")}>
              check_circle
            </span>
            {message
              ? message.text
              : "작성 중 변경사항이 자동으로 임시 저장됩니다."}
          </div>
          <div className="ml-auto flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onSubmit}
              disabled={submitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-500/30 transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70 sm:flex-none"
            >
              {submitting ? "등록 중..." : "등록 및 성적 연동"}
              <span className={iconClass("text-lg")}>send</span>
            </button>
          </div>
        </div>
      </div>
      <div className="h-8" />
    </>
  );
}

function QuestionCard({
  index,
  question,
  onChange,
  onRemove,
}: {
  index: number;
  question: DraftQuestion;
  onChange: (id: string, updates: Partial<Omit<DraftQuestion, "id">>) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-[var(--surface-background)] shadow-md ring-1 ring-slate-200 transition hover:ring-primary/50 dark:border-slate-700 dark:bg-[var(--surface-background)] dark:ring-slate-700">
      <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800/80 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-slate-900 font-display text-lg font-bold text-white dark:bg-white dark:text-slate-900">
            {index + 1}
          </span>
          <select
            value={question.type}
            onChange={(event) =>
              onChange(question.id, {
                type: event.target.value as DraftQuestion["type"],
              })
            }
            className="w-full cursor-pointer rounded-lg border border-slate-300 bg-white p-2 pr-8 text-sm font-medium text-slate-900 focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-700 dark:text-white sm:w-32"
          >
            <option value="객관식">객관식</option>
            <option value="주관식">주관식</option>
          </select>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              배점
            </label>
            <div className="relative w-20">
              <input
                type="number"
                min={1}
                value={question.points}
                onChange={(event) =>
                  onChange(question.id, {
                    points: Number(event.target.value) || 1,
                  })
                }
                className="w-full rounded-md border-slate-300 bg-white py-1.5 pl-3 pr-8 text-right font-bold text-slate-900 focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              />
              <span className="pointer-events-none absolute right-2 top-1.5 text-xs text-slate-400">
                점
              </span>
            </div>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={question.allowPartial}
              onChange={(event) =>
                onChange(question.id, { allowPartial: event.target.checked })
              }
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
            onClick={() => onRemove(question.id)}
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
            value={question.label}
            onChange={(event) =>
              onChange(question.id, { label: event.target.value })
            }
            className="w-full rounded-lg border-slate-300 bg-slate-50 p-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-700/30 dark:text-white"
            placeholder="문제를 직접 입력하거나 비워두세요..."
          />
        </div>
        {question.type === "주관식" ? (
          <SubjectiveAnswerForm
            value={question.answer}
            onChange={(value) => onChange(question.id, { answer: value })}
          />
        ) : (
          <ObjectiveAnswerForm
            name={`objective-${question.id}`}
            selectedAnswer={question.answer}
            onChange={(value) => onChange(question.id, { answer: value })}
          />
        )}
      </div>
    </div>
  );
}

function ObjectiveAnswerForm({
  name,
  selectedAnswer,
  onChange,
}: {
  name: string;
  selectedAnswer: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-5 dark:border-blue-800 dark:bg-blue-900/10">
      <label className="mb-3 flex items-center gap-2 text-sm font-bold text-primary">
        <span className={iconClass("text-lg")}>check_circle</span>
        객관식 정답 설정
      </label>
      <div className="flex flex-wrap gap-2">
        {ANSWER_OPTIONS.map((option) => (
          <label key={option} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              checked={selectedAnswer === String(option)}
              onChange={() => onChange(String(option))}
              className="peer sr-only"
            />
            <div className="flex size-10 items-center justify-center rounded-full border-2 border-slate-300 bg-white font-bold text-slate-500 transition peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white dark:border-slate-600 dark:bg-slate-800">
              {option}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

function SubjectiveAnswerForm({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-4 rounded-lg border border-blue-100 bg-blue-50/50 p-5 dark:border-blue-800 dark:bg-blue-900/10">
      <label className="flex items-center gap-2 text-sm font-bold text-primary">
        <span className={iconClass("text-lg")}>edit</span>
        주관식 정답 설정
      </label>
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-500">
          모범 답안
        </label>
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-md border-slate-300 bg-white text-sm focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-800"
          placeholder="정확히 일치해야 하는 정답 입력"
        />
      </div>
    </div>
  );
}

function QuestionCountInput({
  totalQuestions,
  onChange,
}: {
  totalQuestions: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="w-full flex-1 space-y-3 md:max-w-xs">
      <label
        className="block text-base font-bold text-slate-800 dark:text-slate-200"
        htmlFor="total-questions"
      >
        총 문항 수
      </label>
      <div className="group relative">
        <input
          id="total-questions"
          type="number"
          min={1}
          max={100}
          value={totalQuestions}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full rounded-xl border-2 border-slate-300 bg-white py-4 text-center text-4xl font-black text-slate-900 shadow-sm transition group-hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
        />
        <span className="pointer-events-none absolute right-4 bottom-5 text-lg font-medium text-slate-400">
          문항
        </span>
      </div>
      <p className="text-center text-xs text-slate-500">
        문항 수를 조정하면 아래 리스트가 자동 생성됩니다.
      </p>
    </div>
  );
}

function TotalScoreDisplay({ totalScore }: { totalScore: number }) {
  return (
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
          value={totalScore}
          className="w-full rounded-xl border border-slate-300 bg-slate-50 py-4 text-center text-4xl font-bold text-slate-700 shadow-sm dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-200"
        />
        <span className="pointer-events-none absolute right-4 bottom-5 text-lg font-medium text-slate-400">
          점
        </span>
      </div>
      <p className="text-center text-xs text-slate-500">
        문항 배점 합계가 자동으로 계산됩니다.
      </p>
    </div>
  );
}

function SelectField({
  id,
  label,
  options,
  value,
  onChange,
}: {
  id: string;
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
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
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border-slate-300 bg-white text-slate-900 shadow-sm focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-700 dark:text-white"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
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
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border-slate-300 bg-white pl-10 pr-4 text-slate-900 shadow-sm focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
      </div>
    </div>
  );
}

function ScoreField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border-slate-300 bg-white pr-12 text-right text-slate-900 shadow-sm focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
        <span className="pointer-events-none absolute right-4 top-2.5 text-sm text-slate-500 dark:text-slate-400">
          점
        </span>
      </div>
    </div>
  );
}

function FileUploadField() {
  return (
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
  );
}
