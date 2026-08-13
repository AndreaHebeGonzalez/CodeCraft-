import { HydratedDocument, Types } from "mongoose";
import { projectTeamRole } from "./projectTeamMember.constants";
import { projectRole } from "../../projectCollaborators/collaborator.types";
import { TaskSummary } from "../../tasks/tasks.types";

export type projectTeamRole = typeof projectTeamRole[keyof typeof projectTeamRole]

export interface IProjectTeamMember {
  projectId: Types.ObjectId,
  projectTeamId: Types.ObjectId,
  userId: Types.ObjectId,
  projectTeamRole: projectTeamRole
  /* source: 'inherit' | 'manual' */
}

export type ProjectTeamMemberDocument = HydratedDocument<IProjectTeamMember>

export type ProjectTeamMemberWidthTask = {
  _id: string
  projectId: string
  projectTeamId: string
  userId: Types.ObjectId
  projectRole: projectRole
  teamRole: projectTeamRole
  collaboratorId: string
  userData: {
    name: string,
    email: string
  },
  tasks: TaskSummary[]
} 

export type ProjectTeamMemberSummary = {
  _id: Types.ObjectId,
  userId: Types.ObjectId,
  name: string,
  email: string,
  teamRole: projectTeamRole
}