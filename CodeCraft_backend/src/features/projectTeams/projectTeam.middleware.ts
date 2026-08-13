import { Request, Response, NextFunction } from 'express'
import { validateObjectIdParam } from '../../validators/ids.validator'
import { validationResult } from 'express-validator'
import ProjectTeam from './ProjectTeam.model'
import { IProjectTeam, ProjectTeamDocument } from './projectTeams.types'

declare global {
  namespace Express {
    interface Request {
      projectTeam: ProjectTeamDocument
    }
  }
}

export const projectTeamExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    await validateObjectIdParam('projectTeamId', 'El ID del equipo').run(req)

    const errors = validationResult(req)

    if(!errors.isEmpty()) {
      return res.status(400).json({ data: errors.array(),  message: 'Los datos enviados no son válidos' })
    }

    const { projectTeamId } = req.params

    const projectTeam = await ProjectTeam.findOne({
      _id: projectTeamId
    })

    if(!projectTeam) {
      return res.status(404).json({ message: 'Equipo no encontrado' })
    }

    req.projectTeam = projectTeam

    next()

  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Hubo un error'})
  }
}

export const projectTeamBelongsToProject = async (req: Request, res: Response, next: NextFunction) => {
  if (req.projectTeam.projectId.toString() !== req.project._id.toString()) {
    return res.status(400).json({ message: 'Acción no válida' })
  }
  next()
}