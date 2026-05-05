import type z from "zod";
import type { EmailExistsResponseSchema, RegisterFormSchema } from "../schemas";

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

export type LoginFormData = Pick<RegisterFormData, 'email' | 'password'>

/* Respuestas */

export type EmailExistsResponse = z.infer<typeof EmailExistsResponseSchema>


