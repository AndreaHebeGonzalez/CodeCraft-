import { IUser } from "../types";

export const sanitizeUser = (user : IUser) => {
  const { password: _, ...sanitizeUser } = user
  return sanitizeUser
}