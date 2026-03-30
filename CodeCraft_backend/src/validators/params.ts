import { param } from "express-validator";

//No la estoy usando
export const validateObjectIdParam = (paramName: string) => [
  param(paramName)
  .notEmpty().withMessage(`${paramName} es obligatorio`)
  .isMongoId().withMessage(`${paramName} debe ser un id de MongoDB válido`)
]