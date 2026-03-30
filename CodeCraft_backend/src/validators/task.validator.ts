import { body } from "express-validator";
import { taskPriority, taskStatus } from "../data";
import validator from 'validator'


export const validateCreateTasks = [
  body('taskName')
  .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
  body('description')
    .optional(),
  body('startDate')
  .optional({ nullable: true })  
  .customSanitizer((startDate) => startDate === '' ? null : startDate) 
  .custom(startDate => {
    if(startDate === null) return true 
    if(!validator.isISO8601(startDate, { strict: true })) throw new Error('La fecha de debe tener formato ISO 8601 (YYYY-MM-DD)')
    return true
  }),
  body('dueDate')
  .optional({ nullable: true })
  .customSanitizer(dueDate => dueDate === '' ? null : dueDate)
  .custom((dueDate, { req }) => {
    if(dueDate === null) return true

    if(!validator.isISO8601(dueDate, { strict: true })) throw new Error('La fecha de debe tener formato ISO 8601 (YYYY-MM-DD)')

    const parsed = new Date(dueDate)
    parsed.setHours(23, 59, 59, 999)

    const start = req.body.startDate && validator.isISO8601(req.body.startDate, { strict: true }) ? new Date(req.body.startDate) : null

    if(start) {
      start.setHours(0, 0, 0, 0)
      console.log(start)
      if(parsed < start)  throw new Error('La fecha de entrega no puede ser anterior a la fecha de inicio')
    }

    return true
  }),
]

export const validateUpdateTask = [
  body('taskName')
  .optional()
  .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
  body('description')
    .optional(),
  body('startDate')
    .optional({ nullable: true })  
    .customSanitizer((startDate) => startDate === '' ? null : startDate) 
    .custom(startDate => {
      if(startDate === null) return true 
      if(!validator.isISO8601(startDate, { strict: true })) throw new Error('La fecha de debe tener formato ISO 8601 (YYYY-MM-DD)')

      return true
    }),
    body('dueDate')
    .optional({ nullable: true })
    .customSanitizer(dueDate => dueDate === '' ? null : dueDate)
    .custom((dueDate, { req }) => {

      if(dueDate === null) return true
        
      if(!validator.isISO8601(dueDate, { strict: true })) throw new Error('La fecha de debe tener formato ISO 8601 (YYYY-MM-DD)')

      const parsed = new Date(dueDate)
      parsed.setHours(23, 59, 59, 999)

      const start = req.body.startDate && validator.isISO8601(req.body.startDate) ? new Date(req.body.startDate) : null

      if(start) {
        start.setHours(0, 0, 0, 0)
        if(parsed && parsed < start)  throw new Error('La fecha de entrega no puede ser anterior a la fecha de inicio')
      }
      
      return true
    }),

    body('status')
      .optional()
      .notEmpty().withMessage('El estado es obligatorio')
      .isIn(Object.values(taskStatus))
      .withMessage('Valor no válido'),
    body('priority')
      .optional()
      .notEmpty().withMessage('La prioridad es obligatoria')
      .isIn(Object.values(taskPriority))
      .withMessage('Valor no válido')
]