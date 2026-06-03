import nodemailer from 'nodemailer'


let transporter : nodemailer.Transporter


export const initializeMailer = async () => {

  const testAccount = await nodemailer.createTestAccount()

  console.log('Ethereal account')
  console.log(testAccount)

  transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  })
}



export const getTransporter = () => {

  if (!transporter) {
    throw new Error('Mailer no inicializado')
  }

  return transporter
}