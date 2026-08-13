import type { Request, Response, NextFunction } from "express"
import { Types } from "mongoose"
import User from "./User.model"
import { IUser } from "./user.types"

declare global {
  namespace Express {
    interface Request {
      targetUser?: Pick<IUser, 'name'>
    }
  }
}

export const loadTargetUser = (getUserId: (req: Request) => Types.ObjectId) => { //loadUser(req => req.projectTeamMember.userId)

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = getUserId(req)

      const user = await User.findById(userId)
        .select('_id name').lean()

      if (!user) {
        return res.status(404).json({
          message: 'Usuario no encontrado'
        })
      }

      req.targetUser = user

      next()

    } catch (error) {
      console.error(error)
      res.status(500).json({
        message: 'Error interno del servidor'
      })
    }
  }
}
