"use client";

import type { ButtonHTMLAttributes } from "react";
import { memo } from "react";

type AuthButtonProps = {
  label: string;
  loadingLabel?: string;
  isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const AuthButton = memo(function AuthButton({
  label,
  loadingLabel = label,
  isLoading = false,
  ...props
}: AuthButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading || props.disabled}
      className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
      {...props}
    >
      {isLoading ? loadingLabel : label}
    </button>
  );
});
