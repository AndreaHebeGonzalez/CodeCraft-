import { Document, Types } from "mongoose"
import { taskPriority, taskStatus } from "../data"



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