import { Types } from "mongoose"
import { invitationStatus } from "./invitation.constants"
import { HydratedDocument } from "mongoose"

type InvitationStatus = typeof invitationStatus[keyof typeof invitationStatus]

export interface IProjectInvitation {
  projectId: Types.ObjectId,
  projectTeamId?: Types.ObjectId,
  email: string,
  invitedBy: Types.ObjectId,
  token: string,
  status: InvitationStatus
}

export type ProjectInvitationDocument = HydratedDocument<IProjectInvitation>