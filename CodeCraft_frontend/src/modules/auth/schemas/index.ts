import z from "zod";


export const RegisterFormSchema = z.object({
  name: z.string()
  .trim()
  .min(1, 'Se requiere nombre completo'),
  email:  z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "El email es obligatorio")
  .email({
      message: "Formato de email inválido"
    }),
  password: z
  .string()
  .trim()
  .min(8, "Debe tener al menos 8 caracteres")
  .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
  .regex(/[0-9]/, "Debe contener al menos un número")
  .regex(/[^A-Za-z0-9]/, "Debe contener un carácter especial"),
  repeatPassword: z
    .string()
}).refine(
  (data) => data.password === data.repeatPassword, {
    message: "Las contraseñas deben coincidir",
    path: ["repeatPassword"]
  }
)

export const LoginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "El email es obligatorio")
    .email({
      message: "Formato de email inválido"
    }),
  password: z
    .string()
    .trim()
})

export const EmailExistsResponseSchema = z.object({
  exist: z.boolean()
})