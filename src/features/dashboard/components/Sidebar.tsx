import Link from "next/link";

import type {
  DashboardNavLink,
  ProfileSummary,
  SidebarFooterLink,
} from "@/features/dashboard/types";
import { iconClass } from "@/lib/icon-class";
import { cn } from "@/lib/utils";

type SidebarProps = {
  profile: ProfileSummary;
  navLinks: DashboardNavLink[];
  footerLinks: SidebarFooterLink[];
};

export function Sidebar({ profile, navLinks, footerLinks }: SidebarProps) {
  return (
    <aside className="flex h-full w-64 flex-shrink-0 flex-col border-r border-border-light bg-surface-light transition-colors duration-200 dark:border-border-dark dark:bg-surface-dark">
      <div className="p-6">
        <div className="mb-8 flex items-center gap-3">
          <div
            role="img"
            aria-label={`${profile.name} 프로필 사진`}
            className="size-12 overflow-hidden rounded-full bg-gray-200 bg-cover bg-center shadow-sm"
            style={{ backgroundImage: `url("${profile.avatarUrl}")` }}
          />
          <div className="flex flex-col">
            <span className="text-base font-bold text-slate-900 dark:text-white">
              {profile.name}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {profile.title}
            </span>
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <SidebarLink key={link.label} link={link} />
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t border-border-light p-6 dark:border-border-dark">
        {footerLinks.map((link) => (
          <SidebarLink key={link.label} link={link} />
        ))}
      </div>
    </aside>
  );
}

type SidebarLinkProps = {
  link: DashboardNavLink | SidebarFooterLink;
};

function SidebarLink({ link }: SidebarLinkProps) {
  const isActive = "active" in link && link.active;
  const intent = "intent" in link ? link.intent : undefined;

  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300"
          : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
        intent === "danger"
          ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
          : undefined
      )}
    >
      <span
        className={cn(
          iconClass(),
          isActive ? "icon-filled" : undefined,
          intent === "danger" ? "text-red-500" : undefined
        )}
      >
        {link.icon}
      </span>
      <span>{link.label}</span>
    </Link>
  );
}
