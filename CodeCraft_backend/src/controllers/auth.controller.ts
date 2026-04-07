import type { Request, Response } from "express" 
import mongoose from "mongoose"
import User from "../models/User"
import { hashPassword, verifyPassword } from "../utils/hash"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/authEmail"
import { sanitizeUser } from "../utils/user"

export class AuthController {

  static createAccount = async (req: Request, res: Response) => {
    const session = await mongoose.startSession()
    try {
      const { name, email, password } = req.body

      const userExists = await User.findOne({ email }).lean()
    
      if(userExists) {
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

      //Enviar el email

      AuthEmail.sendConfirmationEmail({
        name: user.name,
        email: user.email,
        token: token.token
      })

      await session.commitTransaction()
      res.status(201).json({ message: 'Cuenta creada, revisa tu email para confirmarla.' })
        
    } catch (error) {
      await session.abortTransaction()
      if(error.code === 11000) {
        return res.status(409).json({ message: 'El email ingresado ya esta registrado'})
      }
      console.error(error)
      res.status(500).json({ message: 'Error interno del servidor' })

    } finally {
      session.endSession()
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
      await session.abortTransaction()
      console.error(error)
      res.status(500).json({ message: 'Error interno del servidor' })

    } finally {
      session.endSession()
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

      const user = await User.findOne({ email }).select('+password').lean()
    
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
        return res.status(401).json({  message: 'Debes confirmar tu cuenta antes de iniciar sesión'/* , errorKind: 'unconfirmed_account' */ }) //Forbidden : el servidor entiende la solicitud del usuario, pero se niega a autorizarla
      }

      const safeUser = sanitizeUser(user)

      res.status(200).json({ message: "Inicio de sesion exitosa", data: safeUser })

    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static googleAuth  = async (req: Request , res: Response) => {
    console.log(req.body)
    res.send('desde api/auth')
  }

}