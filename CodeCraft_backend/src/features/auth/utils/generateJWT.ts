import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'

type UserPayload = {
  id: Types.ObjectId
}

export const generateJWT = (payload : UserPayload) => {
  
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '180d'
  })
  return token
  
}

/* 

Si no ves el correo electrónico en tu bandeja de entrada, comprueba la carpeta de spam y la pestaña de promociones. Si sigues sin verlo,

*/