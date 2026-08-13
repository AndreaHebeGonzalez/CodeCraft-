import { Request, Response, NextFunction } from "express"
import { isCollaboratorAdmin, isOwner } from "../utils/authorization"
import ProjectCollaborator from "../../projectCollaborators/Collaborator.model"


export function isProjectOwner(req: Request, res: Response, next: NextFunction) {
  const project = req.project
  const user = req.user

  if(!isOwner(user._id, project.owner)) {
    return res.status(403).json({ message: 'Solo el owner puede acceder al proyecto' })
  }

  next()
}

export async function isProjectAdminOrOwner (req: Request, res: Response, next: NextFunction) {
  const project = req.project
  const user = req.user

  try {

    if(isOwner(user._id, project.owner)) {
      return next()
    }

    const collaborator = await ProjectCollaborator.findOne({
      projectId: project._id,
      userId: user._id
    })

    if(!isCollaboratorAdmin(collaborator)) {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta operacion' })
    }

    next()

  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Hubo un error'})
  }
}

export async function isProjectMember (req: Request, res: Response, next: NextFunction) {
  const project = req.project
  const user = req.user

  try {

    if(isOwner(user._id, project.owner)) {
      return next()
    }

    const collaborator = await ProjectCollaborator.findOne({
      projectId: project._id,
      userId: user._id
    })

    if(!collaborator) {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta operacion' })
    }

    next()

  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Hubo un error'})
  }
}

