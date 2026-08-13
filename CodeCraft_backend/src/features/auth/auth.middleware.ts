import { Request, Response , NextFunction } from "express"
import jwt from 'jsonwebtoken'
import User from "../users/User.model"
import { UserDocument } from "../users/user.types"

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument
    }
  }
}

/* Middleware que se ejecuta en cada ruta con recursos protegidos, verifica que el usuario que hace la consulta este autenticado */

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {

  const bearer = req.headers.authorization

  /* no envió credenciales */
  if(!bearer) {
    //Distingir mensaje para iniciar sesion de mensaje para registrarse
    return res.status(401).json({ message: 'No Autorizado' })
  }

  const token = bearer.replace('Bearer ', '')
  
  try {

    /* Verificamos el token que envia el cliente al crear un proyecto por ejemplo en el header, si es correcto decode devuelve el payload en este caso el id del usuario
    luego, debe verificarse que ese usuario exista aun en la BD */

    const decode = jwt.verify(token, process.env.JWT_SECRET) 

    /* Verificacion de user */

    if(typeof decode !== 'object' || !('id' in decode)) {
      return res.status(401).json({ message: 'Token no válido' })
    }

    const user = await User.findById(decode.id).select('_id name email')

      /* el token no contiene la información esperada. el user con ese id dejo de existir en la bd */
    if(!user) {
      return res.status(401).json({ message: 'Token no válido' })
    }

    req.user = user
    console.log(user)
    
    next()

  } catch (error) {
    /* si el error proviene de jwt.verify() (token expirado, firma inválida, token mal formado, etc.). */
    console.error(error)
    res.status(401).json({message: 'Token no válido'})
  }
}


/* en este middleware de autenticación pondría prácticamente todo en 401 Unauthorized, porque todos los casos representan un fallo de autenticación.  


*/