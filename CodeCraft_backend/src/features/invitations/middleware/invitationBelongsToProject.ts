import { Request, Response, NextFunction } from "express";


export async function invitationBelongsToProject(req: Request, res: Response, next: NextFunction) {
  if (req.invitation.projectId.toString() !== req.project._id.toString()) {
    return res.status(400).json({ message: 'Acción no válida' })
  }
  next()
}