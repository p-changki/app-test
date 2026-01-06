"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { memo, useState } from "react";

type AuthFormProps = {
  title: string;
  subtitle: ReactNode;
  footer: ReactNode;
  children: ReactNode;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
};

type AuthFieldProps = {
  label: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const AuthForm = memo(function AuthForm({
  title,
  subtitle,
  footer,
  children,
  onSubmit,
}: AuthFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-slate-500">
          {subtitle}
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500">{footer}</p>
      </div>
      <form className="space-y-5" onSubmit={onSubmit}>
        {children}
      </form>
    </div>
  );
});

export const AuthField = memo(function AuthField({
  label,
  error,
  ...inputProps
}: AuthFieldProps) {
  const [isSecureVisible, setSecureVisible] = useState(false);
  const inputType =
    inputProps.type === "password" && isSecureVisible
      ? "text"
      : inputProps.type;

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="relative">
        <input
          {...inputProps}
          type={inputType}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />
        {inputProps.type === "password" ? (
          <button
            type="button"
            onClick={() => setSecureVisible((prev) => !prev)}
            className="absolute inset-y-0 right-3 text-xs font-semibold text-slate-500 underline"
          >
            {isSecureVisible ? "숨기기" : "보기"}
          </button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </label>
  );
});
