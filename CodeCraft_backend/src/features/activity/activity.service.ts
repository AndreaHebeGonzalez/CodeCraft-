import { Activity } from "./activity.model"
import { activityMetadataMapSchemas } from "./schemas/activity.metadataMap.schemas"
import { ActivityMetadataMap } from "./types/activity.types"
import { ActivityTypes, ActivityDataCreate } from "./types/activity.types"


export async function createActivity<T extends ActivityTypes>(type: T, data: ActivityDataCreate, metadata: ActivityMetadataMap[T]) {
  
  const schema = activityMetadataMapSchemas[type]

  const result = schema.safeParse(metadata)

  if(!result.success) {
    throw new Error("Error en la estructura de metadata")
  }
  
  const newActivity = {
    ...data,
    type,
    metadata: result.data
  }

  await Activity.create(newActivity)
}