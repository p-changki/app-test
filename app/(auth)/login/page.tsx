"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { IconCircleButton } from "@/components/ui/IconCircleButton";
import { useAuthForm } from "@/features/auth/hooks/useAuthForm";
import { loginRoles, loginSchema } from "@/features/auth/schemas";
import type { LoginFormValues } from "@/features/auth/schemas";

const socialProviders = [
  {
    name: "Kakao",
    ariaLabel: "Kakao Login",
    className: "bg-[#fae100] hover:bg-[#fae100]/90",
    icon: (
      <Image
        src="/icons/kakao-talk.svg"
        alt="KakaoTalk"
        width={28}
        height={28}
        className="h-7 w-7 object-contain"
      />
    ),
  },
  {
    name: "Naver",
    ariaLabel: "Naver Login",
    className: "bg-[#03C75A] hover:bg-[#03C75A]/90",
    icon: (
      <Image
        src="/icons/naver-icon.svg"
        alt="Naver"
        width={28}
        height={28}
        className="h-7 w-7 object-contain"
      />
    ),
  },
  {
    name: "Google",
    ariaLabel: "Google Login",
    className: "bg-white hover:bg-gray-100",
    icon: (
      <svg
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    ),
  },
];

export default function LoginPage() {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useAuthForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
      role: loginRoles[0],
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: LoginFormValues) => {
    console.log("[login form]", values);
  };

  return (
    <div className="flex w-full max-w-[480px] flex-col gap-6 rounded-[32px] bg-[#1e1933]/50 p-6 backdrop-blur-xl lg:bg-transparent lg:p-0 lg:backdrop-blur-0">
      <header className="flex flex-col gap-2 text-[#111418] dark:text-white">
        <h2 className="text-3xl font-bold">환영합니다! 👋</h2>
        <p className="text-base text-[#635c84] dark:text-[#9b92c9]">
          계속하려면 로그인 정보를 입력해주세요.
        </p>
      </header>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full">
          <div className="flex h-14 w-full items-center justify-center rounded-full bg-[#292348] p-1.5">
            {loginRoles.map((role) => (
              <label
                key={role}
                className="group relative flex h-full grow cursor-pointer items-center justify-center overflow-hidden rounded-full px-2 text-[#9b92c9] transition-all duration-300 hover:bg-white/5 has-[:checked]:bg-primary has-[:checked]:text-white has-[:checked]:shadow-lg"
              >
                <span className="truncate text-sm font-bold tracking-wide">
                  {role}
                </span>
                <input
                  type="radio"
                  value={role}
                  className="absolute inset-0 z-[-1] size-full opacity-0"
                  {...register("role")}
                />
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <label className="flex flex-col gap-2 text-[#111418] dark:text-white">
            <span className="ml-1 text-sm font-medium">아이디</span>
            <div className="relative flex items-center">
              <input
                type="email"
                inputMode="email"
                placeholder="example@edutrack.com"
                autoComplete="email"
                className="flex h-14 w-full rounded-2xl border border-slate-300 bg-white px-5 text-base font-normal leading-normal text-[#111418] outline-none ring-primary/50 placeholder:text-slate-400 focus:border-primary focus:ring-2 transition-all dark:border-[#3b3267] dark:bg-[#1e1933]/50 dark:text-white"
                {...register("email")}
              />
              <div className="pointer-events-none absolute right-4 text-[#9b92c9]">
                <span className="material-symbols-outlined text-[20px]">
                  person
                </span>
              </div>
            </div>
            {errors.email ? (
              <p className="text-sm text-red-300">{errors.email.message}</p>
            ) : null}
          </label>
          <label className="flex flex-col gap-2 text-[#111418] dark:text-white">
            <div className="flex items-center justify-between">
              <span className="ml-1 text-sm font-medium">비밀번호</span>
              <Link
                href="#"
                className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                비밀번호 찾기?
              </Link>
            </div>
            <div className="relative flex items-center">
              <input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                className="flex h-14 w-full rounded-2xl border border-slate-300 bg-white px-5 text-base font-normal leading-normal text-[#111418] outline-none ring-primary/50 placeholder:text-slate-400 focus:border-primary focus:ring-2 transition-all dark:border-[#3b3267] dark:bg-[#1e1933]/50 dark:text-white"
                {...register("password")}
              />
              <button
                type="button"
                aria-label={
                  isPasswordVisible ? "비밀번호 숨기기" : "비밀번호 표시하기"
                }
                className="absolute right-4 text-[#7f799f] transition-colors hover:text-[#111418] dark:text-[#9b92c9] dark:hover:text-white"
                onClick={() => setPasswordVisible((prev) => !prev)}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isPasswordVisible ? "visibility" : "visibility_off"}
                </span>
              </button>
            </div>
            {errors.password ? (
              <p className="text-sm text-red-300">{errors.password.message}</p>
            ) : null}
          </label>
        </div>
        <button
          type="submit"
          className="flex h-14 w-full items-center justify-center rounded-full bg-primary px-8 text-lg font-bold text-white transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 shadow-[0_4px_20px_rgba(75,43,238,0.3)]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "로그인 중..." : "로그인"}
          <span className="material-symbols-outlined ml-2 text-white">
            arrow_forward
          </span>
        </button>
      </form>
      <div className="relative flex items-center py-2 text-[#7f799f] dark:text-[#9b92c9]">
        <div className="flex-grow border-t border-[#292348]" />
        <span className="mx-4 text-sm">소셜 계정으로 로그인</span>
        <div className="flex-grow border-t border-[#292348]" />
      </div>
      <div className="flex justify-center gap-4">
        {socialProviders.map((provider) => (
          <IconCircleButton
            key={provider.name}
            ariaLabel={provider.ariaLabel}
            className={provider.className}
          >
            {provider.icon}
          </IconCircleButton>
        ))}
      </div>
      <footer className="mt-2 text-center text-base text-[#7f799f] dark:text-[#9b92c9]">
        계정이 없으신가요?
        <Link
          href="/register"
          className="ml-1 font-bold text-[#111418] underline decoration-primary decoration-2 underline-offset-4 transition-colors hover:text-primary dark:text-white"
        >
          회원가입 하기
        </Link>
      </footer>
    </div>
  );
}
