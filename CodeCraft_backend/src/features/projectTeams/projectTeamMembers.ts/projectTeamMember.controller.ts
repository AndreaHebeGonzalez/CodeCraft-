import { Request, Response } from "express"
import { startSession } from "mongoose"
import { getProjectTeamMembers } from "../projectTeams.services"
import { getActivityData } from "../../activity/activity.utils"
import { createActivity } from "../../activity/activity.service"
import ProjectCollaborator from "../../projectCollaborators/Collaborator.model"
import { ProjectTeamMember } from "./ProjectTeamMember.model"
import User from "../../users/User.model"
import ProjectTeam from "../ProjectTeam.model"


export class ProjectTeamMemberController {

  static createProjectTeamMember = async (req: Request, res: Response) => {

    const { userId, projectTeamRole } = req.body

    const role = projectTeamRole ?? "miembro"

    const session = await startSession()

    try {

      session.startTransaction()

      const isCollaborator = await ProjectCollaborator.findOne({
        projectId: req.project._id,
        userId
      }).session(session)

      if(!isCollaborator) {
        await session.abortTransaction()
        return res.status(400).json({ message: 'El usuario debe ser colaborador del proyecto' })
      }

      const projectTeamMember = new ProjectTeamMember({
        projectId: req.project._id,
        projectTeamId: req.projectTeam._id,
        userId,
        projectTeamRole: role
      })

      await projectTeamMember.save({ session })

      const result = await ProjectTeam.updateOne(
        {
          _id: req.projectTeam._id
        },
        {
          $push: {
            projectTeamMembers: projectTeamMember._id
          }
        },
        {
          session
        }
      )

      if(result.matchedCount === 0) {
        await session.abortTransaction()
        return res.status(404).json({ message: 'No es posible realizar la operación. El equipo ya no existe' })
      }

      await session.commitTransaction()

      const activityData = getActivityData(req.project._id, req.user._id, "PROJECT_TEAM_MEMBER", projectTeamMember._id, userId)

      await createActivity("PROJECT_TEAM_MEMBER_ADDED", activityData, {
        projectTeamRole: role
      })

      res.json({ message: `${req.targetUser.name} fue agregado al equipo ${req.projectTeam.projectTeamName}`})
      
    } catch (error) {
      if(session.inTransaction()) {
        await session.abortTransaction()
      }
      console.error(error)
      res.status(500).json({ message: 'Error interno del servidor' })
    } finally {
      await session.endSession()
    }
  }

  static getProjectTeamMember = async (req: Request, res: Response) => {
    const project = { 
      ...req.project.toObject()
    }
    const projectTeam = { 
      ...req.projectTeam.toObject()
    }
    
    try {
      const projectTeamMembers = await getProjectTeamMembers(project._id, projectTeam._id)

      res.json({ data:  { projectTeamMembers } })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static changeProjectTeamRole = async (req: Request, res: Response) => {
    const { projectTeamRole } = req.body
    const previousRole = req.projectTeamMember.projectTeamRole
    try {
      req.projectTeamMember.projectTeamRole = projectTeamRole

      await req.projectTeamMember.save()

      const activityData = getActivityData(req.project._id, req.user._id, "PROJECT_TEAM_MEMBER", req.projectTeamMember._id, req.projectTeamMember.userId)
      
      await createActivity("PROJECT_TEAM_MEMBER_ROLE_CHANGED", activityData, {
        previousProjectTeamRole: previousRole,
        currentProjectTeamRole: projectTeamRole
      })

      res.json({ message: "El rol del miembro del equipo fue actualizado." })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static deleteProjectTeamMember = async(req: Request, res: Response) => {

    const session = await startSession()

    try {
      const user = await User.findById(req.projectTeamMember.userId).session(session).select('name').lean()

      await req.projectTeamMember.deleteOne({ session })

      const result = await ProjectTeam.updateOne(
        {
          _id: req.projectTeam._id
        },
        {
          $pull: {
            projectTeamMembers: req.projectTeamMember._id
          }
        },
        {
          session
        }
      )

      if(result.matchedCount === 0) {
        await session.abortTransaction()
        return res.status(404).json({ message: 'No es posible realizar la operación. El equipo ya no existe' })
      }

      const activityData = getActivityData(req.project._id, req.user._id, "PROJECT_TEAM_MEMBER", req.projectTeamMember._id, req.projectTeamMember.userId)

      await createActivity("PROJECT_TEAM_MEMBER_REMOVED", activityData, {
        projectTeamRole: req.projectTeamMember.projectTeamRole
      })

      res.json({ message: `${user.name} fue eliminado del equipo ${req.projectTeam.projectTeamName}`})

    } catch (error) {
      if(session.inTransaction()) {
        await session.abortTransaction()
      }
      console.error(error)
      res.status(500).json({ message: 'Error interno del servidor' })
    } finally {
      await session.endSession()
    }
  }
}