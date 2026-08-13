import { Request, Response } from "express"
import mongoose, { startSession } from "mongoose"
import { MongoServerError } from 'mongodb'
import ProjectTeam from "./ProjectTeam.model"
import { getAdminCount, getProjectTeamMemberTaskCounts } from "./projectTeam.utils"
import { getTaskCountByPriority, getTaskCountByStatus, calculateTaskCompletionMetrics, getAverageAssignedTasksPerMember, getAverageCycleTime, getAverageLeadTime } from "../projectAnalytics/metrics/taskMetrics"
import { getDateRange } from "../projectAnalytics/projectAnalytics.utils"
import { StatisticsQuery } from "../projectAnalytics/projectAnalytics.types"
import { getProjectTeamMembers, getProjectTeamTasks, getTeamMembersWithTasks } from "../projectTeams/projectTeams.services"
import { ProjectTeamMember } from "./projectTeamMembers.ts/ProjectTeamMember.model"
import { createActivity } from "../activity/activity.service"
import { getActivityData } from "../activity/activity.utils"
import Project from "../projects/Project.model"
import { ProjectTeamEditableFields } from "./projectTeams.types"

export class ProjectTeamController {

  static createProjectTeam = async (req: Request, res: Response) => {
    const { ProjectTeamName, description, baseTeamId } = req.body
    
    const session = await startSession()

    try {

      session.startTransaction()
      
      const exists =  await ProjectTeam.findOne({
        projectId: req.project._id,
        ProjectTeamName
      }).session(session)

      if(exists) {
        await session.abortTransaction()
        return res.status(409).json({ message: 'Ya existe un equipo con ese nombre en este proyecto' })
      }

      const projectTeam = new ProjectTeam({
        projectId: req.project._id,
        ProjectTeamName,
        description
      })

      await projectTeam.save({ session })

      const result = await Project.updateOne(
        {
          _id: req.project._id
        },
        {
          $push:{
            projectTeams: projectTeam._id
          },
        },
        {
          session
        }
      )

      if(result.matchedCount === 0) {
        await session.abortTransaction()
        return res.status(404).json("El proyecto no existe")
      }

      await session.commitTransaction()

      const activityDate = getActivityData(req.project._id, req.user.id, "PROJECT_TEAM", projectTeam._id)

      await createActivity("PROJECT_TEAM_CREATED", activityDate, {
        projectTeamName: projectTeam.projectTeamName
      })
      
      res.json({ message: 'Equipo creado correctamente', data: projectTeam })

    } catch (error) {
      if(session.inTransaction()) {
        await session.abortTransaction()
      }
      if (error instanceof MongoServerError && error.code === 11000) {
        return res.status(409).json({
          message: 'Ya existe un equipo con ese nombre en este proyecto'
        })
      }
      res.status(500).json({ message: 'Error interno del servidor' })
    } finally {
      await session.endSession()
    }
  }

  static updateProjectTeam = async (req: Request, res: Response) => {

    const { projectTeamName, description } = req.body  

    const editableField = Object.keys(req.body) as Array<keyof ProjectTeamEditableFields>

    const previousProjectTeam = req.projectTeam.toObject()

    try {
      Object.assign(req.projectTeam, {
        ...(projectTeamName !== undefined && { projectTeamName }),
        ...('description' in req.body && { description }),
      })

      const projectTeam = await req.projectTeam.save()

      const activityData = getActivityData(req.project._id, req.user._id, "PROJECT_TEAM", projectTeam._id)

      for(const field of editableField) {
        await createActivity("PROJECT_TEAM_UPDATED", activityData, {
          field: field,
          previousValue: previousProjectTeam[field],
          currentValue: projectTeam[field]
        })
      }
      
      res.json({ message: 'Equipo actualizado correctamente' })

    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        return res.status(409).json({
          message: 'Ya existe un equipo con ese nombre en este proyecto'
        })
      }
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static deleteProjectTeam = async (req: Request, res: Response) => {

    const session = await mongoose.startSession()

    try {
      session.startTransaction()

      await ProjectTeamMember.deleteMany({ 
        projectId: req.project._id,
        projectTeamId: req.projectTeam._id 
      }, { session })

      await req.projectTeam.deleteOne({ session })

      const result = await Project.updateOne(
        {
          _id: req.project._id
        },
        {
          $pull: {
            projectTeams: req.projectTeam._id
          }
        },
        {
          session
        }
      )

      if(result.matchedCount === 0) {
        await session.abortTransaction()
        return res.status(404).json({ message: 'Proyecto no encontrado' })
      }

      await session.commitTransaction()

      const activityData = getActivityData(req.project._id, req.user._id, "PROJECT_TEAM", req.projectTeam._id)

      await createActivity("PROJECT_TEAM_DELETED", activityData, {
        projectTeamName: req.projectTeam.projectTeamName
      })

      res.json({ message: 'Equipo eliminado correctamente' })

    } catch (error) {
      await session.abortTransaction() 
      
      console.error(error)
      res.status(500).json({ message: 'Error interno del servidor' })
    } finally {
      await session.endSession()
    }
  }

  static getProjectTeamDashboard = async (req: Request, res: Response) => {
  
    const project = { 
      ...req.project.toObject()
    }
    const projectTeam = { 
      ...req.projectTeam.toObject()
    }

    try {
      
      const projectTeamMembers = await getTeamMembersWithTasks(project._id, projectTeam._id)

      const projectTeamTasks = await getProjectTeamTasks(project._id, projectTeam._id)

      const tasksCountByStatus = getTaskCountByStatus(projectTeamTasks)
      
      const projectTeamMemberTaskCounts = getProjectTeamMemberTaskCounts(projectTeamMembers)

      const dashboardData = {
        projectTeam: {
          ...projectTeam,
          memberCount: projectTeamMembers.length
        },
        kpis: {
          members: {
            memberCount: projectTeamMembers.length,
            adminCount: getAdminCount(projectTeamMembers)
          },
          tasks: {
            tasksCountByStatus,
            count: projectTeamTasks.length
          }
        },
        projectTeamMembers,
        taskDistribution: projectTeamMemberTaskCounts
      }


      res.json({ data: { dashboardData } })
      
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static getTaskStats = async (req: Request<{}, {}, {}, StatisticsQuery>, res: Response) => {
    const project = { 
        ...req.project.toObject()
      }
    const projectTeam = { 
      ...req.projectTeam.toObject()
    }

    const { analysisPeriod } = req.query

    try {

      // 1 Obetener todas las tareas de un team

      const projectTeamTasks = await getProjectTeamTasks(project._id, projectTeam._id)
      const projectTeamMembersWidthTasks = await getTeamMembersWithTasks(project._id, projectTeam._id)

      /* completedTasksTrend */

      const dateRange = getDateRange(analysisPeriod)
      
      const tasks = projectTeamTasks.filter(task => task.completedAt !== null).filter(task => task.completedAt <= dateRange.endDate && task.completedAt >= dateRange.startDate)

      const completedTasksTrend = calculateTaskCompletionMetrics(tasks, dateRange.startDate, dateRange.endDate)

      /* tasks analytics*/

      const taskCountByPriority = getTaskCountByPriority(projectTeamTasks)
      const tasksByStatus = getTaskCountByStatus(projectTeamTasks)
      const averageAssignedTasksPerMember = getAverageAssignedTasksPerMember(projectTeamMembersWidthTasks)
      const averageCycleTime = getAverageCycleTime(projectTeamTasks)
      const averageLeadTime = getAverageLeadTime(projectTeamTasks)

      res.json({ data: { 
        completedTasksTrend,
        taskCountByPriority,
        tasksByStatus,
        averageAssignedTasksPerMember, //
        averageCycleTime, //Cuánto tiempo pasó desde que alguien empezó realmente a trabajar en ella hasta que terminó.
        averageLeadTime // cuánto tiempo pasó desde que la tarea fue creada hasta que terminó. lead time tiempo total 
      }})
      
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  } 
}