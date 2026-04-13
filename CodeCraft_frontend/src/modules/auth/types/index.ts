import type z from "zod";
import type { EmailExistsResponseSchema, LoginFormSchema, RegisterFormSchema } from "../schemas";

export type AuthViewConfig = {
  mode: "login" | "register"
  cta: {
    text: string;
    linkText: string;
    to: string;
  },
  forgotPassword?: {
    text: string,
    linkText: string,
    to: string
  }
}

export type RegisterFormData = z.infer<typeof RegisterFormSchema>

export type LoginFormData = z.infer<typeof LoginFormSchema>

export type EmailExistsResponse = z.infer<typeof EmailExistsResponseSchema>


