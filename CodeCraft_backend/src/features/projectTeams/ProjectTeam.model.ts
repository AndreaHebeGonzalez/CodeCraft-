import mongoose, { Schema, Types } from "mongoose"
import { IProjectTeam } from "./projectTeams.types"

const ProjectTeamSchema : Schema = new Schema(
  {
    projectId: {
      type: Types.ObjectId,
      ref: 'Project',
      required: true
    },
    projectTeamName: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true
    },
    baseTeamId: {
      type: Types.ObjectId,
      ref: 'Team',
    },
    projectTeamMembers: [
      {
        type: Types.ObjectId,
        ref: "ProjectTeamMember"
      }
    ]
  },
  {
    timestamps: true
  }
)

ProjectTeamSchema.index(
  { projectId: 1, projectTeamName: 1 },
  { unique: true }
)


const ProjectTeam = mongoose.model<IProjectTeam>('ProjectTeam', ProjectTeamSchema)

export default ProjectTeam