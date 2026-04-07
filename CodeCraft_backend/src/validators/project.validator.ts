import { body } from "express-validator"
import validator from "validator"
import { projectStatus } from "../types"


export const validateCreateProyect = [
  body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
  body('clientName').optional(),
  body('description')
  .optional(),

  //Fechas
  body('startDate')
  .optional({ nullable: true })
  .customSanitizer((startDate) => startDate === '' ? null : startDate )
  .custom((startDate) => {
    if(startDate === null) return true
    
    if(!validator.isISO8601(startDate, { strict: true }))  throw new Error('La fecha de debe tener formato ISO 8601 (YYYY-MM-DD)')
    return true 
  }),

  body('dueDate')
  .optional({ nullable: true })
  .customSanitizer((dueDate) => dueDate === '' ? null : dueDate)
  .custom((dueDate,  { req }) => {

    if(dueDate === null) return true

    if(!validator.isISO8601(dueDate, { strict: true })) throw new Error('La fecha de debe tener formato ISO 8601 (YYYY-MM-DD)')
    
    const parsed = new Date(dueDate)
    parsed.setHours(23, 59, 59, 999)

    const start = req.body.startDate && validator.isISO8601(req.body.startDate, { strict: true }) ? new Date(req.body.startDate) : null

    if(start) {
      start.setHours(0, 0, 0, 0)
      if(parsed < start) {
        throw new Error('La fecha de entrega no puede ser anterior a la fecha de inicio')
      } 
    } 
    return true
  }),

  body('status')
    .optional()
    .isIn(Object.values(projectStatus))
    .withMessage('Estado no válido')
]


export const validateUpdateProject = [
  body('projectName')
    .optional()
    .notEmpty().withMessage('El nombre del proyecto no puede estar vacío'),
  body('clientName')
    .optional(),
  body('description')
    .optional(),
  body('startDate')
    .optional({ nullable: true })
    .customSanitizer((startDate) => startDate === '' ? null : startDate )
    .custom(startDate => {
      if(startDate === null) return true

      if(!validator.isISO8601(startDate, { strict: true }))  throw new Error('La fecha de debe tener formato ISO 8601 (YYYY-MM-DD)')

      return true
  }),

  body('dueDate')
    .optional()
    .customSanitizer(dueDate => dueDate === '' ? null : dueDate)
    .custom((dueDate, { req }) => {
      if(dueDate === null) return true

      if(!validator.isISO8601(dueDate, { strict: true })) throw new Error('La fecha de debe tener formato ISO 8601 (YYYY-MM-DD)')

      const parsed = new Date(dueDate)
      parsed.setHours(23, 59 ,59 ,999)
      
      const start = req.body.startDate && validator.isISO8601(req.body.startDate, { strict: true }) ? new Date(req.body.startDate) : null

      if(start) {
        start.setHours(0, 0, 0, 0)
        if(parsed < start) throw new Error('La fecha de entrega no puede ser anterior a la fecha de inicio')
      }
      
      return true
    }),

  body('status')
    .optional()
    .isIn(Object.values(projectStatus))
    .withMessage('Estado no válido')
];
