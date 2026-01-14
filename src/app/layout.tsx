import type { Metadata } from "next";
import "./globals.css";

import { QueryProvider } from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ThemeScript } from "@/components/providers/ThemeScript";

export const metadata: Metadata = {
  title: "EduTrack",
  description: "강사/학부모를 위한 EduTrack 관리 화면",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen bg-background-light text-slate-900 transition-colors duration-200 dark:bg-background-dark dark:text-slate-100">
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
