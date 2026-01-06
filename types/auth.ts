import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력하세요.")
    .email("올바른 이메일을 입력하세요."),
  password: z.string().min(8, "비밀번호는 최소 8자입니다."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, "이름은 최소 2자입니다."),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
