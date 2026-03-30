import { Request, Response, NextFunction } from "express"
import { param, validationResult } from "express-validator"
import Task from "../models/Task.model"
import { ITask } from "../types"

declare global {
  namespace Express {
    interface Request {
      task: ITask
    }
  }
}

export async function taskExist(req: Request, res: Response, next: NextFunction) {
  try {
    await param('taskId')
      .notEmpty().withMessage('El ID de la tarea es obligatorio')
      .isMongoId().withMessage('El ID  debe ser un id de MongoDB válido')
      .run(req)
    
      const errors = validationResult(req)
  
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array(), message: 'Error en validaciones'})
      }

    const { taskId } = req.params

    const task = await Task.findById(taskId)

    if(!task) {
      const error = new Error('Tarea no encontrada')
      
      return res.status(404).json({error: error.message})
    }

    req.task = task

    next()

  } catch (error: any) {
    res.send(500).json({ message: error.message })
  }
  
}

export function taskBelongsToProject(req: Request, res: Response, next: NextFunction) {
  if(req.task.project.toString() !== req.project.id) {
    const error = new Error('Acción no válida')
    return res.status(400).json({ message: error.message })
  }
  next()
}


