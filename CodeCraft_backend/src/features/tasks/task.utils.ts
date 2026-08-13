import { Types } from "mongoose"
import { TaskDocument } from "./tasks.types"

export const getAllSubtaskByTaskId = (projectTasks: TaskDocument[], taskId: Types.ObjectId) : Types.ObjectId[] => {

  let descendantTaskIds : Types.ObjectId[] = []

  let pendingDescendants : Types.ObjectId[] = []

  pendingDescendants.push(taskId)

  while(pendingDescendants.length > 0) {
    const currentParentId = pendingDescendants.shift()!
    
    descendantTaskIds.push(currentParentId)

    const subtasks : Types.ObjectId[] = projectTasks.filter(t=>t.parentTask?.equals(currentParentId)).map(t=>t._id)

    pendingDescendants.push(...subtasks)
  } 

  return descendantTaskIds
}