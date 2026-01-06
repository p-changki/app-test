"use client";

import { useForm } from "react-hook-form";
import type { FieldValues, UseFormProps, UseFormReturn } from "react-hook-form";

export function useAuthForm<TValues extends FieldValues>(
  props: UseFormProps<TValues>
): UseFormReturn<TValues> {
  return useForm<TValues>({
    mode: "onChange",
    reValidateMode: "onBlur",
    ...props,
  });
}
