"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthButton } from "@/components/AuthButton";
import { AuthField, AuthForm } from "@/components/AuthForm";
import { useAuthForm } from "@/hooks/useAuthForm";
import { loginSchema } from "@/types/auth";
import type { LoginFormValues } from "@/types/auth";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useAuthForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: LoginFormValues) => {
    console.log("[login form]", values);
  };

  return (
    <AuthForm
      title="로그인"
      subtitle="Sign in"
      footer={
        <>
          계정이 없다면{" "}
          <Link
            href="/register"
            className="font-semibold text-slate-900 hover:underline"
          >
            회원가입
          </Link>
          을 진행하세요.
        </>
      }
      onSubmit={handleSubmit(onSubmit)}
    >
      <AuthField
        type="email"
        placeholder="you@example.com"
        label="이메일"
        error={errors.email?.message}
        {...register("email")}
      />
      <AuthField
        type="password"
        placeholder="••••••••"
        label="비밀번호"
        error={errors.password?.message}
        {...register("password")}
      />
      <AuthButton
        label="로그인"
        loadingLabel="로그인 중..."
        isLoading={isSubmitting}
      />
    </AuthForm>
  );
}
