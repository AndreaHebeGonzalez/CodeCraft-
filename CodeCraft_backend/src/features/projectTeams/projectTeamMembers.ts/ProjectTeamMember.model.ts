import mongoose, { Schema, Types } from "mongoose"
import { IProjectTeamMember } from "./projectTeamMember.types"
import { projectTeamRole } from "./projectTeamMember.constants"


const ProjectTeamMemberSchema: Schema = new Schema({
  projectId: {
    type: Types.ObjectId,
    ref: 'Project',
    required: true
  },
  projectTeamId: {
    type: Types.ObjectId,
    ref: 'ProjectTeam',
    required: true
  },
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectTeamRole: {
    type: String,
    enum: Object.values(projectTeamRole),
    default: 'miembro'
  }
})

ProjectTeamMemberSchema.index(
  {
    projectId: 1,
    projectTeamId: 1,
    userId: 1
  },
  {
    unique: true
  }
)

ProjectTeamMemberSchema.index({ // ordenado en B-tree)
  projectId: 1
})

export const ProjectTeamMember = mongoose.model<IProjectTeamMember>('ProjectTeamMember', ProjectTeamMemberSchema)