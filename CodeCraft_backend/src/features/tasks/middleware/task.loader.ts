import { Request, Response, NextFunction } from "express"
import { param, validationResult } from "express-validator"
import Task from "../Task.model"
import { ITask, TaskDocument } from "../tasks.types"

declare global {
  namespace Express {
    interface Request {
      task: TaskDocument
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



