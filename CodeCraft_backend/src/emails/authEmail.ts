import { transporter } from "../config/nodemailer"


interface IEmail {
  name: string
  email: string,
  token: string
}

export class AuthEmail {
  static sendConfirmationEmail = async (userData : IEmail) => {
    const info = await transporter.sendMail({
      from: 'CodeCraft <admin@codecraft.com>',
      to: userData.email,
      subject: 'CodeCraft - Confirma tu cuenta',
      text: 'CodeCraft - Confirma tu cuenta',
      html: `<p>Hola: ${userData.name}, has creado tu cunta en CodeCraft, ya casi está todo listo, solo debes confirmar tu cuenta.</p>
        <p>Visita el siguiente enlace</p>
        <a href="">Confirma la cuenta</a>
        <p>Ingresando el código: <b>${userData.token}</b></p>
        <p>Este token expira en 10 minutos</p> 
      `
    })

    console.log('Mensaje enviado', info.messageId)
  }
}