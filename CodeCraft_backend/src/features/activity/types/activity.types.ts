import { Document, Types } from "mongoose"
import { activityEntityType } from "../activity.constants"
import { activityMetadataMapSchemas } from "../schemas/activity.metadataMap.schemas"
import z from "zod"

export type ActivityTypes = keyof typeof activityMetadataMapSchemas
export type ActivityEntityType =  typeof activityEntityType[keyof typeof activityEntityType]

export type ActivityMetadataMap = {
  [K in keyof typeof activityMetadataMapSchemas]: z.infer<typeof activityMetadataMapSchemas[K]>
}

export type ActivityMetadata = ActivityMetadataMap[keyof ActivityMetadataMap]

export interface IActivity extends Document {
  projectId: Types.ObjectId,
  projectTeamId?: Types.ObjectId,
  actorId: Types.ObjectId,
  targetUser?: Types.ObjectId,//usuario afectado por la accion
  entityType: ActivityEntityType,
  entityId: Types.ObjectId,
  type: ActivityTypes,
  metadata?: ActivityMetadata
}

export type ActivityDataCreate = Pick<IActivity, 'projectId' | 'projectTeamId' | 'actorId' |  'targetUser' | 'entityType' | 'entityId'>