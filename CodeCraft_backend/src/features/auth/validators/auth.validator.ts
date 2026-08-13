import { body, param, ValidationChain } from "express-validator";


export const passwordValidation : ValidationChain[] = [
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe contener como minimo 8 caracteres')
]

export const repeatPasswordValidation : ValidationChain[] = [
  body('repeatPassword')
    .notEmpty().withMessage('Debes confirmar la contraseña')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Las contraseñas no coinciden')
      }

      return true
    })
]

export const validateCreateAccount = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio'),
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Email no valido')
    .normalizeEmail(),
  ...passwordValidation,
  ...repeatPasswordValidation
  /* body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({min:8}).withMessage('La contraseña debe contener como minimo 8 caracteres'),
  body('repeatPassword')
    .notEmpty().withMessage('Debes confirmar la contraseña')
    .custom((value, { req }) => {
      if(value !== req.body.password) {
        throw new Error('Las contraseñas no coinciden')
      }
      return true
    }), */
]

export const validateRegisterGoogle = [
  body('credential')
    .notEmpty().withMessage('Token de Google requerido')
];

export const validateToken = [
  body('token')
  .matches(/^\d{6}$/).withMessage('Token no válido')
]

export const validateTokenParam = [
  param('token')
  .matches(/^\d{6}$/).withMessage('Token no válido')
]

export const validateLogin = [
  body('email')
  .notEmpty().withMessage('El email es obligatorio')
  .isEmail().withMessage('Formato de email inválido')
  .normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es obligatoria')
]



export const validatePassword = [
  ...passwordValidation,
  ...repeatPasswordValidation
]