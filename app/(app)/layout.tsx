import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/AppHeader";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-background)] text-[color:var(--surface-text)] transition-colors duration-200">
      <AppHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
