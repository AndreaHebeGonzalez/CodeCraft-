import mongoose, { Schema, Types } from "mongoose"
import { projectRole } from "./collaborator.constants"
import { IProjectCollaborator } from "../projectCollaborators/collaborator.types"

const ProjectCollaboratorSchema : Schema = new Schema(
  {
    projectId: {
      type: Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    projectRole: {
      type: String,
      enum: Object.values(projectRole),
      default: projectRole.DEV
    },
    addedBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    }
  },
  {
    timestamps: true
  }
)

ProjectCollaboratorSchema.index(
  {
    projectId: 1,
    userId: 1
  },
  {
    unique: true
  }
)

const ProjectCollaborator = mongoose.model<IProjectCollaborator>('ProjectCollaborator', ProjectCollaboratorSchema)

export default ProjectCollaborator