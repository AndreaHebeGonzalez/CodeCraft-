import { Document, HydratedDocument, PopulatedDoc, Types } from "mongoose"
import { IUser } from "../users/user.types"
import { ITask } from "../tasks/tasks.types"
import { projectStatus } from "./project.constants"


export type ProjectStatus = typeof projectStatus[keyof typeof projectStatus]

export interface IProject {
  projectName: string
  clientName: string
  description: string
  startDate: Date | null
  dueDate: Date | null
  isOverdue: boolean
  owner: Types.ObjectId
  tasks: Types.ObjectId[]
  projectTeams: Types.ObjectId[]
  collaborators: Types.ObjectId[]
  status: ProjectStatus,
  structureVersion: number
}

export type ProjectDocument = HydratedDocument<IProject>

/* 

Saco el tipado PopulateDoc, cuando hago la consulta hago asi:

const project = await Project.findById(id).populate<{
  tasks: TaskDocument[];
}>("tasks");


*/