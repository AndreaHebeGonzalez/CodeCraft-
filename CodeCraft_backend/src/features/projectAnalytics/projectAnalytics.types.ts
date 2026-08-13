import { TaskPriority, TaskStatus } from "../tasks/tasks.types"
import { statisticsPeriodMap } from "./projectAnalytics.constants" 

export type StatisticsQuery = {
  analysisPeriod?: keyof typeof statisticsPeriodMap
}

export type CompletionTrendPoint = {
  date: Date
  completedTasks : number
}

export type TasksByStatus = Record<TaskStatus, number>
export type TasksByPriority = Record<TaskPriority, number>

export interface TaskStatistics {
  completedTasksTrend: CompletionTrendPoint[]
  averageAssignedTasksPerMember: number
  averageCycleTime: number
  averageLeadTime: number
  tasksByStatus: TasksByStatus
  tasksByPriority: TasksByPriority
}


