import { HydratedDocument, Types } from "mongoose"
import { taskPriority, taskStatus } from "./task.constants"

export type TaskStatus =  typeof taskStatus[keyof typeof taskStatus]

export type TaskPriority = typeof taskPriority[keyof typeof taskPriority] 

export interface ITask {
  taskName: string
  description: string
  projectId: Types.ObjectId
  status: TaskStatus
  priority: TaskPriority
  parentTask: Types.ObjectId | null
  assignedProjectTeams: Types.ObjectId[] 
  assignedProjectCollaborator: Types.ObjectId[]
  startDate: Date | null
  dueDate: Date | null
  completedAt: Date | null
  startedAt: Date | null
  isOverdue: boolean //Si el plazo esta vencido
  createdAt: Date
  updatedAt: Date
}

export type TaskDocument = HydratedDocument<ITask>

export type TaskInput = {
  taskName: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  parentTask?: Types.ObjectId | null
  assignedProjectTeams?: Types.ObjectId[] 
  assignedProjectCollaborator?: Types.ObjectId[]
  startDate?: Date | null
  dueDate?: Date | null
}

export type TaskSummary = Pick<TaskDocument, '_id' | 'taskName' | 'projectId' | 'status' | 'priority' | 'parentTask' | 'assignedProjectTeams' | 'assignedProjectCollaborator' | 'startDate' | 'dueDate' | 'completedAt' | 'startedAt' | 'createdAt' >


export type TaskEditableFields = Pick<TaskInput,  "taskName" | "description" | "status" | "priority" | "startDate" | "dueDate">

