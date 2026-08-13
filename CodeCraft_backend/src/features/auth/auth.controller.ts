import type { Request, Response } from "express" 
import mongoose from "mongoose"
import User from "../users/User.model"
import { hashPassword, verifyPassword } from "./utils/hashPassword"
import Token from "../token/Token.model"
import { generateToken } from "./utils/generateNumericToken"
import { AuthEmail } from "../../mails/authEmail"
import { sanitizeUser } from "../users/utils/sanitizeUser"
import { generateJWT } from "./utils/generateJWT"

export class AuthController {

  static createAccount = async (req: Request, res: Response) => {

    const session = await mongoose.startSession()

    try {
      const { name, email, password } = req.body
      const userExists = await User.findOne({ email }).lean()

      if (userExists) {
        return res.status(409).json({ message: 'El email ingresado ya esta registrado'}) 
      }

      session.startTransaction()

      const hashedPassword = await hashPassword(password)

      const user = new User({
        name,
        email,
        password: hashedPassword,
        provider: 'local'
      })

      await user.save({ session })
      
      const token = new Token({
        token: generateToken(),
        user: user._id
      })

      await token.save({ session })

      await session.commitTransaction()

      //Enviar el email

      AuthEmail.sendConfirmationEmail({
        name: user.name,
        email: user.email,
        token: token.token
      })

      res.status(201).json({ message: 'Cuenta creada, revisa tu email para confirmarla.' }) 
    
    } catch (error) {
      await session.abortTransaction()

      if(error.code === 11000) {
        return res.status(409).json({ message: 'El email ingresado ya esta registrado'})
      }

      console.error(error)
      res.status(500).json({ message: 'Error interno del servidor' })

    } finally {
      await session.endSession()
    }
  }

  static confirmAccount = async (req: Request, res: Response) => {

    const session = await mongoose.startSession()

    try {
      const { token } = req.body
      // Se consulta la BD para buscar el token,
      
      session.startTransaction()

      const tokenExists = await Token.findOne({ token }).session(session)

      if(!tokenExists) {
        await session.abortTransaction()
        return res.status(401).json({ message: 'Token no válido' })
      }

      const user = await User.findById(tokenExists.user).session(session)
    
      //Es una validación defensiva de integridad referencial en runtime
      if(!user) {
        await session.abortTransaction()
        return res.status(404).json({ message: 'Usuario no encontrado' })
      }

      user.confirmed = true
      
      await user.save({ session })

      await Token.deleteOne({ _id: tokenExists._id }, { session })

      await session.commitTransaction()

      res.send({ message: 'Cuenta confirmada correctamente' })
      // ver a que usuario le pertenece y confirmar la cuenta.

    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction()
      }
      console.error(error)
      res.status(500).json({ message: 'Error interno del servidor' })

    } finally {
      await session.endSession()
    }
  }

  static resendConfirmation = async (req: Request , res: Response) => {
    try {
      const { email } = req.body

      const user = await User.findOne({ email }).lean()

      if(!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
      }

      if(user.confirmed) {
        return res.status(400).json({ message: 'La cuenta ya esta confirmada' })
      }

      const tokenExists = await Token.findOne({ user: user._id })

      if(tokenExists && tokenExists.createdAt > new Date(Date.now() - 2 * 60 * 1000)) {
        return res.status(429).json({ message: 'Ya te enviamos un email recientemente. Esperá unos minutos antes de solicitar otro.'})
      }

      await Token.deleteMany({ user: user._id })

      const token = new Token({
        token: generateToken(),
        user: user._id
      }) 

      await token.save()

      await AuthEmail.sendConfirmationEmail({
        name: user.name,
        email: user.email,
        token: token.token
      })

      res.status(200).json({ message: 'Hemos enviado el mail de confirmación'})

    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body

      const user = await User.findOne({ email }).select('+password')
    
      if(!user) {
        const error = new Error('Email o contraseña incorrectos')
        return res.status(401).json({ message: error.message})
      }

      const isValid = await verifyPassword(user.password, password)

      if(!isValid) {
        const error = new Error('Email o contraseña incorrectos')
        return res.status(401).json({ message: error.message })
      }

      const isConfirmed = user.confirmed

      if(!isConfirmed) {

        const token = new Token({
          token: generateToken(),
          user: user._id
        })

        await token.save()

        //Enviar el email

        AuthEmail.sendConfirmationEmail({
          name: user.name,
          email: user.email,
          token: token.token
        })

        return res.status(403).json({  message: 'Debes confirmar tu cuenta, hemos enviado un e-mail de confirmacion'}) //Forbidden : el servidor entiende la solicitud del usuario, pero se niega a autorizarla
      }

      const safeUser = sanitizeUser(user)

      const token = generateJWT({ id: user._id })
      
      res.status(200).json({ message: "Inicio de sesion exitosa", data: { token } })

    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static requestConfirmationCode = async (req: Request, res: Response) => {

    try {
      const { email } = req.body
      const user = await User.findOne({ email }).lean()

      if (!user) {
        console.error({ message: 'El email ingresado no esta registrado'})
        return res.status(404).json({ message: 'El email ingresado no esta registrado. Registrate para continuar.'}) 
      }

      if (user.confirmed) {
        return res.status(403).json({
          message: 'La cuenta ya fue confirmada. Inicia sesión para continuar.'
        })
      }

      const token = new Token({
        token: generateToken(),
        user: user._id
      })

      //Enviar el email

      AuthEmail.sendConfirmationEmail({
        name: user.name,
        email: user.email,
        token: token.token
      })

      await token.save()

      res.status(201).json({ message: 'Se envió un nuevo token a tu e-mail' }) 
    
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static googleAuth  = async (req: Request , res: Response) => {
    console.log(req.body)
    res.send('desde api/auth')
  }

  static checkEmailExists = async (req: Request, res: Response) => {
    try {
      const { email } = req.query as { email: string }
      
      const emailExists = await User.exists({ email })

      return res.json({ exist: !!emailExists })
      
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static forgotPassword = async (req: Request, res: Response) => {

    try {
      const { email } = req.body
      const user = await User.findOne({ email }).lean()

      if (!user) {
        console.error({ message: 'El email ingresado no esta registrado'})
        return res.status(404).json({ message: 'El email ingresado no esta registrado. Registrate para continuar.'}) 
      }

      const token = new Token({
        token: generateToken(),
        user: user._id
      })

      //Enviar el email

      AuthEmail.sendPasswordResetToken({
        name: user.name,
        email: user.email,
        token: token.token
      })

      await token.save()

      res.status(201).json({ message: 'Revisa tu email para instrucciones' }) 
    
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  /* Validacion de token - no se elimina el token validado, ya que en la creacion del nuevo password, vuelve a enviarse para sumarle seguridad */

  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body
      
      const tokenExists = await Token.findOne({ token }) 

      if(!tokenExists) {
        return res.status(401).json({ message: 'Token no válido' })
      }

      res.send({ message: 'Token validado correctamente, define tu nueva contraseña' })
      // ver a que usuario le pertenece y confirmar la cuenta.

    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static updatePasswordWithToken = async (req: Request, res: Response) => {

    const session = await mongoose.startSession()
    
    try {
      const { token } = req.params
      const { password } = req.body

      session.startTransaction()
      
      const tokenExists = await Token.findOne({ token }).session(session) // Ejecuta la query dentro del contexto transaccional

      if(!tokenExists) {
        await session.abortTransaction()
        return res.status(401).json({ message: 'Token no válido' })
      }

      //Si encuentra el token el usuario existe
      const user = await User.findById(tokenExists.user).session(session)

      if(!user) {
        await session.abortTransaction()

        return res.status(404).json({
          message: 'Usuario no encontrado'
        })
      }

      user.password = await hashPassword(password)

      await user.save({ session })

      await Token.deleteOne({ _id: tokenExists._id }, { session })


      await session.commitTransaction()

      res.send({ message: 'La contraseña se modificó correctamente, inicia sesión nuevamente' })

      // ver a que usuario le pertenece y confirmar la cuenta.

    } catch (error) {
      //sesión actual tiene una transacción activa?
      if (session.inTransaction()) {
        await session.abortTransaction()
      }
      await session.abortTransaction()
      console.error(error)
      res.status(500).json({ message: 'Error interno del servidor' })
    } finally {
      await session.endSession()
    }
  } 

  static user = async (req : Request, res: Response) => {
    res.json({ data: req.user })
  }
  /* Cambiar contraseña */
}