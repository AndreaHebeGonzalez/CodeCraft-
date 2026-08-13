import { getTransporter } from "../config/nodemailer"
import nodemailer from 'nodemailer'

interface IEmail {
  name: string
  email: string,
  token: string
}

export class AuthEmail {
  static sendConfirmationEmail = async (userData : IEmail) => {
    try {
    const transporter = getTransporter()

    const info = await transporter.sendMail({
      from: 'CodeCraft <admin@codecraft.com>',
      to: userData.email,
      subject: 'CodeCraft - Confirma tu cuenta',
      text: 'CodeCraft - Confirma tu cuenta',
      html: `<p>Hola: ${userData.name}, has creado tu cuenta en CodeCraft, ya casi está todo listo, solo debes confirmar tu cuenta.</p>
        <p>Visita el siguiente enlace</p>
        <a href=${process.env.FRONTEND_URL}/auth/confirm-account>Confirma la cuenta</a>
        <p>Ingresando el código: <b>${userData.token}</b></p>
        <p>Este token expira en 10 minutos</p> 
      `
    })

    console.log('Mensaje enviado', info.messageId)
    console.log(
      nodemailer.getTestMessageUrl(info)
    )
    
    } catch (error) {
      console.error('Error al enviar email:', JSON.stringify(error, null, 2))
    }
  }
  static sendPasswordResetToken = async (userData : IEmail) => {
    try {
      const transporter = getTransporter()

      const info = await transporter.sendMail({
        from: 'CodeCraft <admin@codecraft.com>',
        to: userData.email,
        subject: 'CodeCraft - Reestablece tu contraseña',
        text: 'CodeCraft - Reestablece tu contraseña',
        html: `
          <p>Hola ${userData.name},</p>

          <p>
            Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.
          </p>

          <p>
            Haz clic en el siguiente enlace para continuar:
          </p>

          <a href="${process.env.FRONTEND_URL}/auth/new-password" target="_blank">
            Restablecer contraseña
          </a>

          <p>
            Ingresa el siguiente código de verificación:
            <b>${userData.token}</b>
          </p>

          <p>
            Este código expirará en 10 minutos.
          </p>

          <p>
            Si no solicitaste este cambio, puedes ignorar este mensaje.
          </p>
        `
      })

      console.log('Mensaje enviado', info.messageId)
      console.log(
        nodemailer.getTestMessageUrl(info)
      )
    
    } catch (error) {
      console.error('Error al enviar email:', JSON.stringify(error, null, 2))
    }
  }
}