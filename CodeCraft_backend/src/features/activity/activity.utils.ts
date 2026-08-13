import { Types } from "mongoose";
import { ActivityDataCreate, ActivityEntityType } from "./types/activity.types";

export const getActivityData = (projectId: Types.ObjectId, actorId: Types.ObjectId, entityType: ActivityEntityType, entityId: Types.ObjectId, projectTeamId?: Types.ObjectId,  targetUser?: Types.ObjectId) : ActivityDataCreate  => {
  const activityData = {
    projectId,
    projectTeamId,
    actorId,
    targetUser, 
    entityType,
    entityId,
  }

  return activityData
}