import { HydratedDocument, Types } from "mongoose"

export interface IUser {
  _id: Types.ObjectId
  name: string
  email: string
  password?: string
  confirmed: boolean
  provider: string
  googleId?: string
  //resetPasswordToken: string
  //resetPasswordExpires: Date
  //lastLogin: Date //Ultima conexion
  //loginAttempts: number //Contador de intentos fallidos para decidir cuándo bloquear. 
  //lockUntil: Date//hasta cuándo la cuenta está bloqueada.
  createdAt: Date
  updatedAt: Date
} 

export type UserDocument = HydratedDocument<IUser>