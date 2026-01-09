import type { FilterChip } from "@/features/learning-resources/types";
import { cn } from "@/lib/utils";

type FiltersPanelProps = {
  filters: FilterChip[];
  iconClass: (extra?: string, filled?: boolean) => string;
};

const FiltersPanel = ({ filters, iconClass }: FiltersPanelProps) => {
  return (
    <section className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#1a2632]">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <span
            className={iconClass(
              "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            )}
          >
            search
          </span>
          <input
            type="text"
            placeholder="제목, 태그 또는 키워드로 검색..."
            className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-slate-900 transition-all placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <SelectField
          iconClass={iconClass}
          icon="category"
          placeholder="과목 선택"
          options={[
            { label: "수학 (전체)", value: "math" },
            { label: "영어", value: "eng" },
            { label: "과학", value: "sci" },
          ]}
        />
        <SelectField
          iconClass={iconClass}
          icon="calendar_today"
          placeholder="등록일순"
          options={[
            { label: "최신순", value: "new" },
            { label: "오래된순", value: "old" },
            { label: "다운로드순", value: "down" },
          ]}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((chip) => (
          <button
            key={chip.label}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              chip.active
                ? "border border-primary/20 bg-primary/10 text-primary"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700",
              chip.pinRight ? "ml-auto" : undefined
            )}
          >
            <span className={iconClass("text-[18px]")}>{chip.icon}</span>
            {chip.label}
          </button>
        ))}
      </div>
    </section>
  );
};

type SelectFieldProps = {
  iconClass: (extra?: string, filled?: boolean) => string;
  icon: string;
  placeholder: string;
  options: Array<{ label: string; value: string }>;
};

const SelectField = ({
  iconClass,
  icon,
  placeholder,
  options,
}: SelectFieldProps) => (
  <div className="relative w-full md:w-48">
    <span
      className={iconClass(
        "absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400"
      )}
    >
      {icon}
    </span>
    <select
      className="h-12 w-full cursor-pointer rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-8 text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
      defaultValue=""
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <span
      className={iconClass(
        "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400"
      )}
    >
      expand_more
    </span>
  </div>
);

export default FiltersPanel;
