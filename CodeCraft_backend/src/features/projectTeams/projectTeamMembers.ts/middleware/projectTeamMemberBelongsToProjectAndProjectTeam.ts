import { Request, Response, NextFunction } from "express"

export const projectTeamMemberBelongsToProjectTeam = async (req: Request, res: Response, next: NextFunction) => {
  if(req.projectTeamMember.projectTeamId.toString() !== req.projectTeam._id.toString()) {
    return res.status(400).json({ message: 'Acción no válida' })
  }
  next()
}