import { Request, Response, NextFunction } from "express";
import { ProjectTeamMemberDocument } from "../projectTeamMember.types";
import { validateObjectIdParam } from "../../../../validators/ids.validator";
import { validationResult } from "express-validator";
import { ProjectTeamMember } from "../ProjectTeamMember.model";

declare global {
  namespace Express {
    interface Request {
      projectTeamMember: ProjectTeamMemberDocument
    }
  }
}

export const projectTeamMemberExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validateObjectIdParam("projectTeamMemberId", "El ID del miembro del proyecto").run(req)

    const errors = validationResult(req)

    if(!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array(),  message: "Los datos enviados no son válidos" })
    }

    const { projectTeamMemberId } = req.params
    console.log('Parametros de la consulta', req.params)

    const projectTeamMember = await ProjectTeamMember.findById(projectTeamMemberId)

    if(!projectTeamMember) {
      return res.status(404).json({ message: "El miembro del equipo no fue encontrado" })
    }

    next()

  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Error interno del servidor'})
  }
}