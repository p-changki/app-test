import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-12 px-4 py-24 text-center">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Welcome to
          </p>
          <h1 className="text-4xl font-semibold sm:text-5xl">
            App Test Starter
          </h1>
          <p className="text-base text-slate-300 sm:text-lg">
            빠르게 제품을 시작할 수 있도록 기본 라우팅과 인증 페이지 골격을
            제공합니다.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/login"
            className="rounded-full bg-white px-6 py-2 font-medium text-slate-900 transition hover:bg-slate-200"
          >
            로그인
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-slate-700 px-6 py-2 font-medium text-white transition hover:border-slate-500"
          >
            회원가입
          </Link>
        </div>
      </div>
    </main>
  );
}
