import type z from "zod";
import type { EmailExistsResponseSchema, EmailFormSchema, RegisterFormSchema, ForgotPasswordSchema } from "../schemas";


export type RegisterFormData = z.infer<typeof RegisterFormSchema>

export type LoginFormData = Pick<RegisterFormData, 'email' | 'password'>

export type TokenFormData = {
  token: string
}

export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>

export type TokenType = {
  token: string
}

export type SendNewPasswordData = {
  formData: ForgotPasswordFormData,
  token: TokenFormData['token']
}
/* Respuestas */

export type EmailExistsResponse = z.infer<typeof EmailExistsResponseSchema>

export type EmailFormData = z.infer<typeof EmailFormSchema>

