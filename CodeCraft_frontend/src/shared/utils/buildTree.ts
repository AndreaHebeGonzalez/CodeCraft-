import type { TaskNode, Tasks } from "@/modules/tasks/types"


/* Construccion de la estructura para el la vista panel de tareas */

export function buildTree(tasks : Tasks) {
  const map = new Map<string, TaskNode>()

  tasks.forEach(t => map.set(t._id.toString(), { ...t, children: [] }))

  const tree : TaskNode[] = []

  
  for (const task of map.values()) {

    if (task.parentTask) {
      map.get(task.parentTask.toString())?.children.push(task)
    } else {
      tree.push(task)
    }
  }

  return {
    tree,
    mapTasks: map
  }
}









