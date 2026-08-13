import type { Request, Response } from "express"
import Project from "./Project.model"
import Task from "../tasks/Task.model"
import { startSession } from "mongoose"
import { createActivity } from "../activity/activity.service"
import { ActivityDataCreate } from "../activity/types/activity.types"
import { IProject } from "./project.types"
import { isProjectUpdatedField } from "./project.typeGuard"
import { getActivityData } from "../activity/activity.utils"
import ProjectTeam from "../projectTeams/ProjectTeam.model"
import ProjectCollaborator from "../projectCollaborators/Collaborator.model"
import { ProjectTeamMember } from "../projectTeams/projectTeamMembers.ts/ProjectTeamMember.model"
import ProjectInvitation from "../invitations/ProjectInvitation.model"


export class ProjectController {

  static createProjects = async (req: Request, res: Response) => {
    const project = new Project(req.body)

    project.owner = req.user.id

    try { 
      const savedProject = await project.save() 

      const activityData  = getActivityData(savedProject._id, req.user._id, "PROJECT", savedProject._id) 

      await createActivity("PROJECT_CREATED", activityData, {
        projectName: savedProject.projectName
      })

      res.status(201).json({ message: 'Proyecto creado correctamente', data: { projectId: project._id } })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static getAllProjects = async (req: Request, res: Response) => {

    try {
      const projects = await Project.find({
        $or: [
          {
            owner: {
              $in: [req.user.id]
            }
          }
        ]
      })

      res.json({ data: projects })

    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static getProjectById = (req: Request, res: Response) => {
    res.json({ 
      data: req.project 
    })
  }

  static updateProject = async (req: Request, res: Response) => {

    type ProjectUpdatedField = keyof Pick<
      IProject,
      "projectName" | "clientName" | "description" | 'startDate' | 'dueDate' | 'status'
    >
    
    try {

      const changedFields = Object.keys(req.body) as Array<ProjectUpdatedField>

      const { startDate, dueDate, projectName, clientName, description, status } = req.body

      const previousProject = req.project.toObject()

      Object.assign(req.project, {
        ...(projectName !== undefined && projectName !== null && { projectName }),
        ...('clientName' in req.body &&  clientName !== null && { clientName }),
        ...('description' in req.body && description !== null && { description }),
        ...(status !== undefined && { status })
      })

      const touchStarDate = startDate !== undefined
      const touchDueDate = dueDate !== undefined

      if(touchStarDate || touchDueDate) {
        let startValue = startDate !== undefined ? startDate : req.project.startDate
        let dueValue = dueDate !== undefined ? dueDate : req.project.dueDate

        if(startValue) {
          const start = new Date(startValue)
          start.setHours(0, 0, 0, 0)
          startValue = start
        }

        if(dueValue) {
          const due = new Date(dueValue)
          due.setHours(23, 59, 59, 999)
          dueValue = due
        }

        if(startValue && dueValue && dueValue < startValue) {
          return res.status(400).json({ message: 'La fecha de entrega no puede ser anterior a la fecha de inicio del proyecto'})
        }

        if(startDate !== undefined) req.project.startDate = startValue
        if(dueDate !== undefined) req.project.dueDate = dueValue
      }
      
      const savedProject  = (await req.project.save()).toObject()

      const activityData  = getActivityData(savedProject ._id, req.user._id, "PROJECT", savedProject ._id) 

      for (const field of changedFields) {
        if(field === 'startDate' && previousProject.startDate?.getTime() !== savedProject.startDate?.getTime()) {
          await createActivity("PROJECT_START_DATE_CHANGED", activityData, {
            previousDate: previousProject.startDate,
            currentDate: savedProject.startDate
          })
        } 
        if(field === 'dueDate' && previousProject.dueDate?.getTime() !== savedProject.dueDate?.getTime()) {
          await createActivity("PROJECT_DUE_DATE_CHANGED", activityData, {
            previousDate: previousProject.dueDate,
            currentDate: savedProject.dueDate
          })
        } else if(field === 'status' && previousProject.status !== savedProject.status) {
          await createActivity("PROJECT_STATUS_CHANGED", activityData, {
            previousStatus: previousProject.status,
            newStatus: savedProject.status
          })
        } else if(isProjectUpdatedField(field)) {
          if(previousProject[field] !== savedProject[field]) {
            await createActivity("PROJECT_UPDATED", activityData, {
              field: field,
              previousValue: previousProject[field],
              currentValue: savedProject[field]
            })
          }
        }
      }

      res.json({ message: 'Proyecto actualizado correctamente' })
      
    } catch (error) {
      console.error(error)
      res.status(500).json({message: 'Error interno del servidor'})
    }
  }

  static deleteProject = async (req: Request, res: Response) => { 
    //Este controlador debe borrar todo lo que contenga el proyecto, tasks, collaboradores, teams, teamsMembers, invitaciones
    const session = await startSession()
    try {

      session.startTransaction()

      const project = await Project.findById(req.project._id).session(session)

      if (!project) {
        await session.abortTransaction()
        return res.status(404).json({
          message: 'El proyecto no existe'
        })
      }

      await Task.deleteMany({ 
        projectId: project._id 
      }, { session })

      await ProjectInvitation.deleteMany({ 
        projectId: project._id 
      }, { session })

      await ProjectTeam.deleteMany({
        projectId: project._id 
      }, { session })

      await ProjectTeamMember.deleteMany({
        projectId: project._id
      }, { session })

      await ProjectCollaborator.deleteMany({
        projectId: project._id 
      }, { session })

      await project.deleteOne({ session })

      await session.commitTransaction()

      res.json({ message: 'Proyecto eliminado' })

    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction()
      }
      console.error(error)
      res.status(500).json({message: 'Error interno del servidor'})
    } finally {
      await session.endSession()
    }
  }
}



/* 

6. Lo único que falta para cerrar el círculo
Pendiente clave (arquitectura)

👉 Middleware global de errores en backend

Ahora tienes:

try/catch en cada controller

lógica repetida

riesgo de inconsistencias

El siguiente paso natural es:

app.use(errorHandler)


Y lanzar errores desde controllers:

throw new AppError(404, 'Proyecto no encontrado')


No es obligatorio ahora, pero es el cierre correcto de todo lo que ya estás haciendo.


*/