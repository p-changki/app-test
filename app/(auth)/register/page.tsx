"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthButton } from "@/components/AuthButton";
import { AuthField, AuthForm } from "@/components/AuthForm";
import { useAuthForm } from "@/hooks/useAuthForm";
import { registerSchema } from "@/types/auth";
import type { RegisterFormValues } from "@/types/auth";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useAuthForm<RegisterFormValues>({
    defaultValues: { name: "", email: "", password: "" },
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (values: RegisterFormValues) => {
    console.log("[register form]", values);
  };

  return (
    <AuthForm
      title="회원가입"
      subtitle="Sign up"
      footer={
        <>
          이미 계정이 있다면{" "}
          <Link
            href="/login"
            className="font-semibold text-slate-900 hover:underline"
          >
            로그인
          </Link>
          을 진행하세요.
        </>
      }
      onSubmit={handleSubmit(onSubmit)}
    >
      <AuthField
        type="text"
        placeholder="홍길동"
        label="이름"
        error={errors.name?.message}
        {...register("name")}
      />
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
        label="회원가입"
        loadingLabel="회원가입 중..."
        isLoading={isSubmitting}
      />
    </AuthForm>
  );
}
