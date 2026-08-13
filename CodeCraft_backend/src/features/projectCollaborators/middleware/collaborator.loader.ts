import { Request, Response, NextFunction } from "express"
import { IProjectCollaborator, ProjectCollaboratorDocument } from "../collaborator.types"
import { validateObjectIdParam } from "../../../validators/ids.validator"
import { validationResult } from "express-validator"
import ProjectCollaborator from "../Collaborator.model"


declare global {
  namespace Express {
    interface Request {
      collaborator: ProjectCollaboratorDocument
    }
  }
}

export const collaboratorExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validateObjectIdParam('collaboratorId', 'El ID del colaborador')
    .run(req)

    const errors = validationResult(req)

    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: 'Los datos enviados no son válidos' })
    }

    const { collaboratorId } = req.params

    const collaborator = await ProjectCollaborator.findOne({
      _id: collaboratorId
    })

    if(!collaborator) {
      return res.status(404).json({ message: 'Colaborador no encontrado' })
    }

    req.collaborator = collaborator

    next()
    
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}
