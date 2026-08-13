import { TaskEditableFields } from "./tasks.types"

type TaskUpdatedField = keyof Pick<TaskEditableFields, "taskName" | "description">

export function isTaskUpdatedField(field: string) : field is TaskUpdatedField {
  return [
    "taskName",
    "description"
  ].includes(field)
} 