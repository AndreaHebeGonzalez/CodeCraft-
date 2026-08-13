import { Request, Response, NextFunction } from "express"


export const collaboratorBelongsToProject = async (req: Request, res: Response, next: NextFunction) => {
  if (req.collaborator.projectId.toString() !== req.project.id.toString()) {
    return res.status(400).json({ message: 'Acción no válida' })
  }
  next()
}