import { z } from "zod";

const baseCredentialsSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력하세요.")
    .email("올바른 이메일을 입력하세요."),
  password: z.string().min(8, "비밀번호는 최소 8자입니다."),
});

export const loginRoles = ["학생/학부모", "조교", "강사"] as const;

export type LoginRole = (typeof loginRoles)[number];

export const loginSchema = baseCredentialsSchema.extend({
  role: z.enum(loginRoles),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = baseCredentialsSchema.extend({
  name: z.string().min(2, "이름은 최소 2자입니다."),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
