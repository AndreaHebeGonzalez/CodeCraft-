import { priorityTranslations, statusTranslations } from "@/shared/locales/es";
import z from "zod";

export const taskStatusSchema = z.enum(Object.keys(statusTranslations) as Array<keyof typeof statusTranslations>)
export const taskPrioritySchema = z.enum(Object.keys(priorityTranslations) as Array<keyof typeof priorityTranslations>)

/* Como viene de la base de datos genera el tipo Task */
export const TaskSchema = z.object({
  _id: z.string(),
  taskName: z.string(),
  description: z.string().optional(),
  projectId: z.string(),
  parentTask: z.string().nullable(),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  startDate: z.string().nullable(),
  dueDate: z.string().nullable(),
  completedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string()
})

/* Esquema zod para validacion con RHF en formulario de creacion de tarea, no se agregan fechas aca */
export const taskFormSchema = z.object({
  taskName: z.string().min(1, 'El nombre de la tarea es obligatorio'),
  description: z.string().max(500, 'Máximo 500 caracteres').optional(),
  rangeDates: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }).optional()
})

export const GetTaskByIdResponseSchema = z.object({
  task: TaskSchema,
  breadcrumbs: z.array(TaskSchema.pick({
    _id: true,
    taskName: true,
    parentTask: true
  })),
  subtasks: z.array(TaskSchema.pick({
    _id: true,
    taskName: true,
    status: true
  })),
  depth: z.number()
})

/* Esquemas para servicio "obtener tareas por proyecto" */

export const TaskByProjectSchema = z.object({
  task: TaskSchema,
  breadcrumbs: z.array(TaskSchema.shape.taskName)
})

export const GetTasksByProjectResponseSchema = z.array(TaskByProjectSchema)

