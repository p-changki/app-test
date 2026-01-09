import { cn } from "@/lib/utils";

type PageHeroProps = {
  title: string;
  description: string;
  iconClass: (extra?: string, filled?: boolean) => string;
  titleClassName: string;
};

const PageHero = ({
  title,
  description,
  iconClass,
  titleClassName,
}: PageHeroProps) => {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-700 md:flex-row md:items-end">
      <div className="flex flex-col gap-2">
        <h1
          className={cn(
            titleClassName,
            "text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl"
          )}
        >
          {title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <button className="flex min-w-[140px] items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-bold text-white shadow-sm shadow-blue-200 transition-colors hover:bg-blue-600 dark:shadow-none">
        <span className={iconClass("text-[20px]")}>upload_file</span>
        <span>자료 업로드</span>
      </button>
    </div>
  );
};

export default PageHero;
