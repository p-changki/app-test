"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export type NavigationLink = {
  label: string;
  href: string;
};

type NavigationLinksProps = {
  links: NavigationLink[];
  className?: string;
};

export function NavigationLinks({ links, className }: NavigationLinksProps) {
  const pathname = usePathname();
  const normalizedPath =
    pathname !== "/" && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  return (
    <div
      className={cn(
        "flex items-center gap-5 text-sm text-[color:var(--surface-text-muted)]",
        className
      )}
    >
      {links.map((link) => {
        const normalizedHref =
          link.href !== "/" && link.href.endsWith("/")
            ? link.href.slice(0, -1)
            : link.href;
        const isActive =
          normalizedPath === normalizedHref ||
          (normalizedPath.startsWith(`${normalizedHref}/`) &&
            normalizedHref !== "/");

        return (
          <Link
            key={link.label}
            href={link.href}
            className={cn(
              "font-medium transition-colors",
              isActive
                ? "text-primary"
                : "text-[color:var(--surface-text-muted)] hover:text-primary"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
