import { IUser } from "../user.types"

export const sanitizeUser = (user : IUser) => {
  const { password: _, ...sanitizeUser } = user
  return sanitizeUser
}

