import type { BreadcrumbItem } from "@/features/learning-resources/types";

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <div className="flex flex-wrap gap-2 text-sm text-slate-500 dark:text-slate-400">
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center gap-2">
          {item.href ? (
            <a
              href={item.href}
              className="transition-colors hover:text-primary"
            >
              {item.label}
            </a>
          ) : (
            <span className="font-medium text-slate-900 dark:text-white">
              {item.label}
            </span>
          )}
          {index < items.length - 1 && <span>/</span>}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumbs;
