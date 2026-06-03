import { initializeMailer } from './config/nodemailer'
import app from './server'
import colors from 'colors'

const PORT = process.env.PORT || 5000

const startServer = async () => {

  await initializeMailer()

  app.listen(PORT, () => {
    console.log(colors.cyan.bold(`REST API EN EL PUERTO ${PORT}`))
  })
}

startServer()