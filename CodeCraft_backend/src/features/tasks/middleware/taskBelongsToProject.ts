import { Request, Response, NextFunction } from "express"

export function taskBelongsToProject(req: Request, res: Response, next: NextFunction) {
  if(req.task.projectId.toString() !== req.project.id) {
    const error = new Error('Acción no válida')
    return res.status(400).json({ message: error.message })
  }
  next()
}
