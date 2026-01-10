import Link from "next/link";

import { ThemeToggle } from "@/components/ui/ThemeToggle";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBasZeu9Ulfo5bjHS34eSd1zR9vPlSYWLyVCOuQUuR9MTPWdODZl0VD_BfIBDnDB9TJT7fB70HmGyGjh48cTPFVMdFSgiTx1S7N37mxYMyar-4UPXqx_SX8pQNjy5zkSPPtlo7fpfv4GVuVoqM_QModUOvxwb4eL-0yFUT_Cxdrrw7uEO4304OXDlEz4lZPAKgwzbiyg6AQ5T1epZRQihHPkUM9QGMlzCowwqkzoN7LsulE6_Zhlxy5lRM7plyjFKEhN5cWcP1jHPk";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-[#111418] transition-colors dark:bg-background-dark dark:text-white">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <aside className="relative hidden overflow-hidden bg-[#1e1933] p-12 text-white lg:flex lg:w-[45%] xl:w-[50%]">
          <div className="absolute inset-0 z-0">
            <div
              className="h-full w-full bg-cover bg-center opacity-60 mix-blend-overlay"
              style={{ backgroundImage: `url(${HERO_IMAGE})` }}
            />
            <div className="absolute inset-0 bg-linear-to-b from-[#131022]/40 via-[#4b2bee]/20 to-[#131022]" />
          </div>
          <div className="relative z-10 flex flex-col justify-between gap-12">
            <div className="flex items-center gap-3">
              <div className="size-10 text-primary">
                <svg
                  className="h-full w-full"
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  />
                  <path
                    clipRule="evenodd"
                    d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <Link
                href="/dashboard"
                className="text-2xl font-bold tracking-tight text-white"
              >
                EduTrack
              </Link>
            </div>
            <div className="space-y-4">
              <p className="text-lg font-medium uppercase tracking-wider text-[#9b92c9]">
                Education Intelligence
              </p>
              <h2 className="text-5xl font-black leading-tight tracking-[-0.033em]">
                성장의 시작,
                <br />
                데이터로 증명하는 실력.
              </h2>
              <p className="text-lg leading-relaxed text-white/80">
                학생의 학습 패턴을 분석하고 최적의 솔루션을 제공합니다.
                <br />
                지금 EduTrack과 함께 스마트한 교육 관리를 시작하세요.
              </p>
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-primary/30 blur-[100px]" />
        </aside>
        <section className="relative flex flex-1 flex-col items-center justify-center overflow-y-auto bg-background-light p-6 text-[#111418] transition-colors dark:bg-background-dark dark:text-white lg:p-12">
          <div className="absolute left-6 top-6 flex items-center gap-2 lg:hidden">
            <div className="size-8 text-primary">
              <svg
                className="h-full w-full"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
                <path
                  clipRule="evenodd"
                  d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <Link href="/dashboard" className="text-lg font-bold text-white">
              EduTrack
            </Link>
          </div>
          <div className="absolute right-6 top-6 lg:hidden">
            <ThemeToggle />
          </div>
          <div className="flex w-full max-w-[520px] justify-center lg:max-w-[480px]">
            {children}
          </div>
          <div className="absolute right-12 top-12 hidden lg:block">
            <ThemeToggle />
          </div>
        </section>
      </div>
    </div>
  );
}
