import { cn } from "@/lib/utils";

type BreadcrumbItem = { label: string; href?: string };

export function RegistrationBreadcrumbs({
  items,
}: {
  items: readonly BreadcrumbItem[];
}) {
  return (
    <nav className="mb-4 flex flex-wrap gap-2 text-sm text-slate-500 dark:text-slate-400">
      {items.map((crumb, index) => (
        <div
          key={`${crumb.label}-${index}`}
          className="flex items-center gap-2"
        >
          {crumb.href ? (
            <a href={crumb.href} className="font-medium hover:text-primary">
              {crumb.label}
            </a>
          ) : (
            <span
              className={cn("font-medium", "text-slate-900 dark:text-white")}
            >
              {crumb.label}
            </span>
          )}
          {index < items.length - 1 && <span>/</span>}
        </div>
      ))}
    </nav>
  );
}
