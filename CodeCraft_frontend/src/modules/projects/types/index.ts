import type z from "zod";
import type { ProjectFormSchema, ProjectSchemaDTO } from "../schemas";

export type ProjectDTO = z.infer<typeof ProjectSchemaDTO>

export type Project = Omit<ProjectDTO, 'startDate' | 'dueDate'> & {
  startDate: Date | null
  dueDate: Date | null
}

export type Projects = Project[]

export type ProjectFormData = z.infer<typeof ProjectFormSchema>

