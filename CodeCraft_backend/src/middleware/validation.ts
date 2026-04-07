import { Request, Response, NextFunction } from "express"
import { validationResult } from "express-validator"

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body)
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), message: 'Error en validaciones' })
  }
  next()
}


/* 
Refinar de esta forma para evitar que se envien cosas innecesarias al front:
errors: errors.array().map(err => ({ → mostrar por campo (si aplica)
  field: err.path,
  message: err.msg
}))

y mostrar esto en el front
*/