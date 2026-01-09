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
        "flex items-center gap-2 rounded-full bg-slate-100 px-2 py-1 text-sm font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400",
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
              "rounded-full px-4 py-1.5 transition",
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
