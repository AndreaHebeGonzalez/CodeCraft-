import { getTransporter } from "../config/nodemailer"
import nodemailer from 'nodemailer'

export interface IProjectInvitationEmail {
  invitedBy: string,
  email: string,
  token: string,
  projectName: string
  
}

export class ProjectInvitationEmail {

  static sendProjectInvitations = async (invitationData: IProjectInvitationEmail) => {
    try {
      const transporter = getTransporter()

      const info = await transporter.sendMail({
        from: 'CodeCraft <admin@codecraft.com>',
        to: invitationData.email,
        subject: `CodeCraft - Invitación a unirte al proyecto "${invitationData.projectName}"`,
        html:
          `
            <h1 style="font-size: 22px; color: #111827;">Invitación a un proyecto en CodeCraft</h1>
            
            <p style="font-size: 15px; color: #4b5563;">
              ${invitationData.invitedBy} te ha invitado a colaborar en el proyecto
              <strong>${invitationData.projectName}</strong>.
            </p>

            <a 
              href="${`${process.env.FRONTEND_URL}/invite/${invitationData.token}`}"
              style="
                display: inline-block;
                padding: 10px 20px;
                background-color: #2563eb;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
              "
            >
              Ver invitación
            </a>

            <p style="font-size: 14px; color: #6b7280;">
              Esta invitación expirará en 10 días.
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