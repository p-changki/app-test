import Link from "next/link";

import { cn } from "@/lib/utils";

export type SubNavLink = {
  label: string;
  href: string;
};

const ASSISTANT_LINKS: readonly SubNavLink[] = [
  { label: "조교 관리", href: "/assistant-management" },
  { label: "조교 승인", href: "/assistant-approvals" },
] as const;

type AssistantSubNavProps = {
  activeHref: string;
  className?: string;
  links?: readonly SubNavLink[];
};

export function AssistantSubNav({
  activeHref,
  className,
  links = ASSISTANT_LINKS,
}: AssistantSubNavProps) {
  return (
    <nav
      className={cn(
        "flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400 sm:gap-2 sm:text-sm",
        className
      )}
      aria-label="조교 관련 페이지"
    >
      {links.map((link) => {
        const isActive = activeHref === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-full px-3 py-1 transition text-[0.75rem] sm:px-4 sm:py-1.5 sm:text-[0.875rem]",
              isActive
                ? "bg-white text-slate-900 shadow-sm dark:bg-[#1f2735] dark:text-white"
                : "hover:text-primary"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
