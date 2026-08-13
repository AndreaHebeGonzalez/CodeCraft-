import { param } from "express-validator";


export const invitationTokenValidator = param('token')
.matches(/^[a-f0-9]{64}$/)
.withMessage('El token no es válido')