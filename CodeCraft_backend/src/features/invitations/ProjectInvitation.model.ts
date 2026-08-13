import mongoose, { Schema, Types } from "mongoose"
import { invitationStatus } from "./invitation.constants"
import { IProjectInvitation } from "./invitation.types"

const ProjectInvitationSchema : Schema = new Schema(
  {
    projectId: {
      type: Types.ObjectId,
      ref: 'Project',
      required: true
    },
    projectTeamId: {
      type: Types.ObjectId,
      ref: 'ProjectTeam'
    },
    email: {
      type: String,
      trim: true,
      required: true
    },
    invitedBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    },
    token: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: Object.values(invitationStatus),
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now, 
      expires: "10d"  
    }
  }
)

ProjectInvitationSchema.index(
  {
    projectId: 1,
    email: 1
  },
  {
    unique: true
  }
)

const ProjectInvitation = mongoose.model<IProjectInvitation>('ProjectInvitation', ProjectInvitationSchema)

export default ProjectInvitation