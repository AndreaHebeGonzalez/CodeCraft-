import { body, query } from "express-validator";

export const validateCreateAccount = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio'),
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Email no valido')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({min:8}).withMessage('La contraseña debe contener como minimo 8 caracteres'),
  body('repeatPassword')
    .notEmpty().withMessage('Debes confirmar la contraseña')
    .custom((value, { req }) => {
      if(value !== req.body.password) {
        throw new Error('Las contraseñas no coinciden')
      }
      return true
    }),
]

export const validateRegisterGoogle = [
  body('credential')
    .notEmpty().withMessage('Token de Google requerido')
];

export const validateToken = [
  body('token').notEmpty().withMessage('El token no puede ir vacio')
]

export const validateLogin = [
  body('email')
  .notEmpty().withMessage('El email es obligatorio')
  .isEmail().withMessage('Formato de email inválido')
  .normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es obligatoria')
]

export const validateEmail = [
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Formato de email inválido')
    .normalizeEmail()
]

export const validateEmailQuery = [
  query('email')
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Formato de email inválido')
    .normalizeEmail()
]