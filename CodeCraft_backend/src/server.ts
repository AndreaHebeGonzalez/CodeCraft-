import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db'
import projectRoutes from './features/projects/project.routes'
import authRoutes from './features/auth/auth.routes'
import dashboardRoutes from './features/dashboard/dashboard.routes'
import invitationRoutes from './features/invitations/invitation.routes'
import cors, { CorsOptions } from 'cors'
import morgan from 'morgan'

dotenv.config()

connectDB()

//Instancia
const app = express()

const corsConfig : CorsOptions = {
  origin: function(origin, callback) {
    console.log('origen', origin) 
    const whiteList = [process.env.FRONTEND_URL]
    if(!origin || whiteList.includes(origin)) {
      callback(null, true) 
    } else { 
      callback(new Error('Error de CORS'), false)
    }
  }
}

//Logs
app.use(morgan('dev'))

//Leer datos 
app.use(express.json())

//Cors
app.use(cors(corsConfig))

//Routes
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/invitations', invitationRoutes)



export default app