import { Request, Response, NextFunction } from "express"
import { validationResult } from "express-validator"
import Project from "../Project.model"
import { IProject, ProjectDocument } from "../project.types"
import { validateObjectIdParam } from "../../../validators/ids.validator"



//Reescribir el scope global desde este modulo

declare global {
  namespace Express {
    interface Request {
      project: ProjectDocument
    }
  }
}

export async function projectExist (req: Request, res: Response, next: NextFunction) {
  try {
    await validateObjectIdParam('projectId', 'El ID del proyecto')
    .run(req)

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array(), message: 'Los datos enviados no son válidos' })
    }

    const { projectId } = req.params
    //Verificar que el proyecto exista
    const project = await Project.findById(projectId)

    if(!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' })
    }

    req.project = project

    next()

  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Hubo un error'})
  }
}


export const loadProjectFromProjectTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.projectTeam.projectId
    const project = await Project.findById(projectId)

    if(!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' })
    }

    req.project = project

    next()
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

