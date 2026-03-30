import { z } from "zod"

export const ProjectFormSchema =  z.object({
  projectName: z.string().min(1, 'Es necesario un nombre para el proyecto.'),
  clientName: z.string().optional(),
  description: z.string().max(500, 'Máximo 500 caracteres').optional()
})  


export const ProjectSchemaDTO = z.object({
  _id: z.string(),
  projectName: z.string(),
  clientName: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(), 
  createdAt: z.string().optional(), 
  updatedAt: z.string().optional(), 
  status: z.string().optional(), 
  tasks: z.array(z.string())
})


export const ProjectsSchemaDTO = z.array(ProjectSchemaDTO)

