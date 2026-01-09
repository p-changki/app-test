"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { memo } from "react";

type IconCircleButtonProps = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const IconCircleButton = memo(function IconCircleButton({
  ariaLabel,
  children,
  className = "",
  type = "button",
  ...props
}: IconCircleButtonProps) {
  const baseClass =
    "size-14 flex items-center justify-center rounded-full transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      className={`${baseClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
});
