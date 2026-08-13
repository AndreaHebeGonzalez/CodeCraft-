import { HydratedDocument, Types } from "mongoose"

export interface IProjectTeam {
  projectId: Types.ObjectId,
  projectTeamName: string,
  description: string,
  baseTeamId?: Types.ObjectId,
  projectTeamMembers: Types.ObjectId[]
}

export type ProjectTeamDocument = HydratedDocument<IProjectTeam>

export type ProjectTeamEditableFields = {
  projectTeamName?: string,
  description?: string,
}