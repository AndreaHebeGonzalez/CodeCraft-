import { Request, Response, NextFunction } from "express"
import { validationResult } from "express-validator"
import { validateObjectIdParam } from "../../../validators/ids.validator"

import { ProjectInvitationDocument } from "../invitation.types"
import ProjectInvitation from "../ProjectInvitation.model"
import { invitationTokenValidator } from "../../auth/validators/token.validator" 

declare global {
  namespace Express {
    interface Request {
      invitation: ProjectInvitationDocument
    }
  }
}

export async function invitationExist(req: Request, res: Response, next: NextFunction) {


  try {
    await validateObjectIdParam('invitationId', 'El ID de la invitacion')
    .run(req)

    const errors = validationResult(req)

    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: 'Los datos enviados no son válidos' })
    }

    const { invitationId } = req.params

    const invitation = await ProjectInvitation.findOne({
      _id: invitationId
    })


    if(!invitation) {
      return res.status(404).json({ message: 'Invitacion no encontrada' })
    }

    req.invitation = invitation

    next()

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Hubo un error' })
  }
}

export async function invitationExistByToken(req: Request, res: Response, next: NextFunction) {

  try {
    await invitationTokenValidator.run(req)

    const errors = validationResult(req)

    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message: 'Los datos enviados no son válidos' })
    }

    const { token } = req.params

    const invitation = await ProjectInvitation.findOne({ token })

    if (!invitation) {
      return res.status(404).json({ message: 'Invitacion no encontrada' })
    }

    req.invitation = invitation

    next()

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Hubo un error' })
  }
}