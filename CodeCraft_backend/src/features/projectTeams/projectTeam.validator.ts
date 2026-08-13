import { body } from "express-validator";

export const validateCreateProyectTeam = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre del equipo es obligatorio')
    .customSanitizer(value => {
      return value.slice(0, 1).toUpperCase() + value.slice(1)
    }),
  body('description')
    .optional()
    .trim()
    .customSanitizer(value => value==="" ? undefined : value),
  body('baseTeamId')
    .optional()
    .isMongoId().withMessage('El id debe ser un id de Mongo válido')
]

export const validateUpdateProyectTeam = [
  body('name')
    .optional()
    .trim()
    .customSanitizer(value => value==="" ? undefined : value)
    .customSanitizer(value => {
      return value.slice(0, 1).toUpperCase() + value.slice(1)
    }),
  body('description')
    .optional()
    .trim()
    .customSanitizer(value => value==="" ? undefined : value)
]