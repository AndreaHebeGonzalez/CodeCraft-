import type z from "zod";
import type { GetTaskByIdResponseSchema, TaskSchema, GetTasksByProjectResponseSchema, TaskByProjectSchema, taskStatusSchema } from "../schemas";

export type TaskStatusType = z.infer<typeof taskStatusSchema>

type TaskDTO = z.infer<typeof TaskSchema>

export type Task  = Omit<TaskDTO, 'startDate' | 'dueDate'> & {
  startDate: Date | null
  dueDate: Date | null
}

export type Tasks = Task[]

export type TaskFormData = Pick<Task, 'taskName' | 'description'> & {
  rangeDates?: {
    from?: Date | undefined
    to?: Date | undefined
  }
}

export type TaskFormDataNormalized = Omit<TaskFormData, "rangeDates"> & {
  parentTask?: string,
  startDate?: Date | null
  dueDate?: Date | null
}

export type TaskApiType = {
  normalizeFormData: TaskFormDataNormalized
  projectId: string
}

export type SubtaskType = Pick<Task, '_id' | 'taskName' | 'status'>

/* Tipo para el servicio de obtener task por ID */
export type GetTaskByIdResponseDTO = z.infer<typeof GetTaskByIdResponseSchema>

export type GetTaskByIdResponseDomain = Omit<GetTaskByIdResponseDTO, 'task'> & {
  task: Task
}

/* Tipo para el servicio obtener tareas por proyecto */

export type TaskByProjectDTO = z.infer<typeof TaskByProjectSchema>

export type GetTasksByProjectResponseDTO = z.infer<typeof GetTasksByProjectResponseSchema>



export type TaskByProjectDomain = Omit<TaskByProjectDTO, 'task'> & {
  task: Task
}

export type TasksByProjectResponseDomain = TaskByProjectDomain[]

export type TaskNode = Task & {
  children: TaskNode[]
}