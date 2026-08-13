import { differenceInDays } from "date-fns"
import { taskPriority, taskStatus } from "../../tasks/task.constants"
import { TasksByPriority, TasksByStatus } from "../projectAnalytics.types"
import { getDateRange } from "../projectAnalytics.utils"
import { TaskSummary } from "../../tasks/tasks.types"
import { ProjectTeamMemberWidthTask } from "../../projectTeams/projectTeamMembers.ts/projectTeamMember.types"


export const calculateTaskCompletionMetrics = (teamMemberTasks : TaskSummary[], startDate: Date, endDate: Date) => {

  const totalDays  = differenceInDays(endDate, startDate)
  
  let currentDate = new Date(startDate) 

  const dataPoints = Array.from({ length: totalDays }).map((_, index) => {
    const dayOffset = index + 1
    let completedTasks = 0

    teamMemberTasks.map(task => {
      if(currentDate.getDate() === task.completedAt.getDate()) {
        completedTasks = completedTasks + 1
      }
    })

    const dataPoint = {
      date: new Date(currentDate),
      completedTasks
    }

    currentDate.setDate(startDate.getDate() + dayOffset)
    return dataPoint
  }) 

  return dataPoints
}

/* Obtener cantidad de tasks del equipo por estado */

export const getTaskCountByStatus = (teamTasks: TaskSummary[]) : TasksByStatus => {
  const taskCountByStatus : TasksByStatus = Object.values(taskStatus).reduce((taskCountByStatus, status) => {
    taskCountByStatus[status] = 0
    return taskCountByStatus
  }, {} as TasksByStatus)
  teamTasks.forEach(task => {
    taskCountByStatus[task.status] = taskCountByStatus[task.status] + 1
  }) 
  return taskCountByStatus
}

export const getTaskCountByPriority = (teamTasks: TaskSummary[]) : TasksByPriority => {
  const taskCountByPriority : TasksByPriority = Object.values(taskPriority).reduce((taskCountByPriority, priority) => {
    taskCountByPriority[priority] = 0
    return taskCountByPriority
  }, {} as TasksByPriority)

  teamTasks.forEach(task => {
    taskCountByPriority[task.priority] = taskCountByPriority[task.priority] + 1
  }) 

  return taskCountByPriority
}

export const getCompletedTasksLast30Days = (teamTasks: TaskSummary[]) => {
  const rangeDate = getDateRange('30d')
  const task = teamTasks.filter(task => task.completedAt !== null).filter(task => task.completedAt < rangeDate.endDate && task.completedAt >= rangeDate.startDate)
  const taskLast30Days = task.length
  return taskLast30Days
}

export const getAverageAssignedTasksPerMember = (projectTeamMembers: ProjectTeamMemberWidthTask[]) => {
  
  // Debe contar las asignadas a todo el grupo y las asignadas individualmente, calcular el promedio
  if(projectTeamMembers.length === 0) {
    return 0
  }

  const averageAssignedTasksPerMember =  projectTeamMembers.reduce((sum, member) => sum + member.tasks.length, 0) / projectTeamMembers.length

  return averageAssignedTasksPerMember
}

export const getAverageCycleTime = (teamTasks: TaskSummary[]) => {

  const completedTasks = teamTasks.filter(
    task => task.startedAt !== null && task.completedAt !== null
  )

  if (completedTasks.length === 0) {
    return 0
  }

  const cycleTimeArray : number[] = teamTasks.map(task => {
    const cycleTime = differenceInDays(task.completedAt, task.startedAt)
    return cycleTime
  })


  const averageCycleTime = cycleTimeArray.reduce((sum, value) => sum + value, 0) / completedTasks.length

  return averageCycleTime
}

export const getAverageLeadTime = (teamTasks: TaskSummary[]) => {

  const completedTasks = teamTasks.filter(
    task => task.completedAt !== null
  )

  if (completedTasks.length === 0) {
    return 0
  }

  const leadTimeArray : number[] = teamTasks.map(task => {
    const leadTime = differenceInDays(task.completedAt, task.createdAt)
    return leadTime
  })


  const averageLeadTime = leadTimeArray.reduce((sum, value) => sum + value, 0) / completedTasks.length

  return averageLeadTime
}

export const getTaskCompletionRate = (teamTasks: TaskSummary[]) => {

  if (teamTasks.length === 0) {
    return 0;
  }

  const completedTasks = teamTasks.filter(
    task => task.completedAt !== null
  ) 

  const taskCompletionRate =  (completedTasks.length / teamTasks.length) * 100

  return taskCompletionRate
}