import mongoose, { Schema, Types } from 'mongoose'
import { ITeam } from './team.types'


const TeamSchema : Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Team = mongoose.model<ITeam>('Team', TeamSchema)

export default Team