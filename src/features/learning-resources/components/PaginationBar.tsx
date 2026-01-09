type PaginationBarProps = {
  pages: string[];
  iconClass: (extra?: string, filled?: boolean) => string;
};

const PaginationBar = ({ pages, iconClass }: PaginationBarProps) => {
  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
      <span>
        전체{" "}
        <span className="font-semibold text-slate-900 dark:text-white">42</span>
        개 중{" "}
        <span className="font-semibold text-slate-900 dark:text-white">
          1-5
        </span>{" "}
        표시
      </span>
      <div className="flex items-center gap-1">
        <button
          className="size-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          disabled
        >
          <span className={iconClass("text-sm")}>chevron_left</span>
        </button>
        {pages.map((page) =>
          page === "..." ? (
            <span key={page} className="px-2 text-slate-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              className={
                page === "1"
                  ? "size-9 flex items-center justify-center rounded-lg border border-slate-200 bg-primary font-medium text-white shadow-sm transition-colors dark:border-slate-700"
                  : "size-9 flex items-center justify-center rounded-lg border border-slate-200 font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              }
            >
              {page}
            </button>
          )
        )}
        <button className="size-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
          <span className={iconClass("text-sm")}>chevron_right</span>
        </button>
      </div>
    </div>
  );
};

export default PaginationBar;
