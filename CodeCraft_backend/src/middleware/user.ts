import type { Request, Response, NextFunction } from "express";
import { IUser } from "../types";

declare global {
  namespace Express {
    interface Request {
      user: IUser
    }
  }
}

export async function userExist(req: Request, res: Response, next: NextFunction) {
    try {
      
    } catch (error) {
      console.log(error)
      res.status(500).json({message: 'Error interno del servidor'})
    }
}