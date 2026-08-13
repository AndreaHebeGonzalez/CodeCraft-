import { Types } from "mongoose"

export interface ITeamMember {
  teamId: Types.ObjectId
  userId: Types.ObjectId
  addedBy: Types.ObjectId
}
s