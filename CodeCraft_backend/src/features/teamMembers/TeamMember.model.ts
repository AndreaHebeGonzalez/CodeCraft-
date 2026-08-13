import mongoose, { Schema, Types } from "mongoose"
import { ITeamMember } from "./teamMembers.types"


const TeamMemberSchema : Schema = new Schema(
  {
    teamId: {
      type: Types.ObjectId,
      ref: 'Team',
      required: true
    }, 
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    },
    addBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
)

TeamMemberSchema.index(
  {
    teamId: 1,
    userId: 1
  },
  {
    unique: true
  }
)
const TeamMember = mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema)

export default TeamMember