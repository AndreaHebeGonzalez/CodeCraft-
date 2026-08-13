import { randomBytes } from 'crypto'

export const generateTokenInvitation = () => randomBytes(32).toString('hex')