import { body } from "express-validator"
import { param } from "express-validator"


export const validateOptionalObjectIdBody = (fieldName: string, label: string) => 
  body(fieldName)
  .optional()
  .isMongoId().withMessage(`${label} debe ser un id de MongoDB válido`)


  export const validateObjectIdBody = (fieldName: string, label: string) => 
  body(fieldName)
  .notEmpty().withMessage(`${label} es obligatorio`)
  .isMongoId().withMessage(`${label} debe ser un id de MongoDB válido`)
  

export const validateObjectIdParam = (paramName: string, label: string) => 
  param(paramName)
  .notEmpty().withMessage(`${label} es obligatorio`)
  .isMongoId().withMessage(`${label} debe ser un id de MongoDB válido`)
