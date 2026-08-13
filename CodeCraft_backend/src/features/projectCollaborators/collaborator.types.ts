import { HydratedDocument, Types } from "mongoose";
import { projectRole } from "./collaborator.constants";

export type projectRole =  typeof projectRole[keyof typeof projectRole]

export interface IProjectCollaborator {
  projectId: Types.ObjectId,
  userId: Types.ObjectId,
  projectRole: projectRole,
  addedBy: Types.ObjectId
}

export type ProjectCollaboratorDocument = HydratedDocument<IProjectCollaborator>