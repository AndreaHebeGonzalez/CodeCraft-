import { body, query } from "express-validator"

export const emailBodyValidator = [
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Formato de email inválido')
    .normalizeEmail()
]

export const emailQueryValidator = [
  query('email')
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Formato de email inválido')
    .normalizeEmail()
]