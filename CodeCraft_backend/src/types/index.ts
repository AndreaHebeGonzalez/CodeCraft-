import { Document, Types, PopulatedDoc } from "mongoose"
import { taskPriority, taskStatus } from "../data"

export const projectStatus = {
  NOT_STARTED: 'notStarted',
  IN_PROGRESS: 'inProgress',
  AT_RISK: 'atRisk',
  COMPLETED: 'completed'
} as const 

export type ProjectStatus = typeof projectStatus[keyof typeof projectStatus]

export interface IProject extends Document  {
  projectName: string
  clientName: string
  description: string
  startDate: Date | null
  dueDate: Date | null
  isOverdue: boolean
  /* owner: mongoose.Types.ObjectId
  collaborators: mongoose.Types.ObjectId[] */
  tasks: PopulatedDoc<ITask & Document>[]
  status: ProjectStatus,
  
}

export type TaskStatus =  typeof taskStatus[keyof typeof taskStatus]

export type TaskPriority = typeof taskPriority[keyof typeof taskPriority] 

export interface ITask extends Document {
  taskName: string
  description: string
  project: Types.ObjectId
  status: TaskStatus
  priority: TaskPriority
  parentTask: Types.ObjectId | null
  startDate: Date | null
  dueDate: Date | null
  isOverdue: boolean //Si el plazo esta vencido
  createdAt: Date
  updatedAt: Date
}

export type TaskType = {
  taskName: string
  description?: string
  project: Types.ObjectId
  status?: TaskStatus
  priority?: TaskPriority
  parentTask: Types.ObjectId | null
  startDate: Date | null
  dueDate: Date | null
}

export interface IUser extends Document {
  _id: Types.ObjectId
  name: string
  email: string
  password?: string
  confirmed: boolean
  povider: string
  googleId?: string
  //confirmationToken: string
  //resetPasswordToken: string
  //resetPasswordExpires: Date
  //lastLogin: Date //Ultima conexion
  //loginAttempts: number //Contador de intentos fallidos para decidir cuándo bloquear. 
  //lockUntil: Date//hasta cuándo la cuenta está bloqueada.
  createdAt: Date
  updatedAt: Date
} 

export type ResisterDTO = {
  name: string,
  email: string,
  password: string
}

export type LoginDTO = {
  email: string,
  password: string
}

export interface IToken extends Document {
  token: string,
  user: Types.ObjectId,
  createdAt: Date
}