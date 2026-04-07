import { Request, Response, NextFunction } from "express";
import { param, validationResult } from "express-validator";
import Project from "../models/Project.model"
import { IProject } from "../types";

//Reescribir el scope global desde este modulo

declare global {
  namespace Express {
    interface Request {
      project: IProject
    }
  }
}

export async function projectExist(req: Request, res: Response, next: NextFunction) {
  try {
    await param('projectId')
      .notEmpty().withMessage('El ID del proyecto es obligatorio')
      .isMongoId().withMessage('El ID  debe ser un id de MongoDB válido')
      .run(req)

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array(), message: 'Error en validaciones'})
    }

    const { projectId } = req.params
    //Verificar que el proyecto exista
    const project = await Project.findById(projectId)

    if(!project) {
      const error = new Error('Proyecto no encontrado') 
      return res.status(404).json({message: error.message})
    }

    req.project = project
    next()

  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Hubo un error'})
  }
}