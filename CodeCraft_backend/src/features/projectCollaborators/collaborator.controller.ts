import { Request, Response } from "express";
import ProjectCollaborator from "./Collaborator.model";
import { startSession } from "mongoose";
import { ProjectTeamMember } from "../projectTeams/projectTeamMembers.ts/ProjectTeamMember.model";
import ProjectTeam from "../projectTeams/ProjectTeam.model";
import Project from "../projects/Project.model";
import { getActivityData } from "../activity/activity.utils";
import { createActivity } from "../activity/activity.service";

export class CollaboratorController {

  static getCollaboratorByProject = async (req: Request, res: Response) => {
    try {
      const collaborator = await ProjectCollaborator.find({ projectId: req.project })
      res.json({ data: collaborator })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static getCollaboratorById = async (req: Request, res: Response) => {
    res.json({ 
      data: req.collaborator 
    })
  }

  static changeProjectRole = async (req: Request, res: Response) => {
    const { projectRole } = req.body

    const previousRole = req.collaborator.projectRole

    try {
      req.collaborator.projectRole = projectRole

      await req.collaborator.save()

      const activityData = getActivityData(req.project._id, req.user._id, "PROJECT_COLLABORATOR", req.collaborator._id, req.collaborator.userId)

      await createActivity("PROJECT_COLLABORATOR_ROLE_CHANGED", activityData, {
        previousProjectRole: previousRole,
        currentProjectRole: projectRole
      })

      res.json({ message: "El rol del colaborador fue actualizado" })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static deleteCollaborator = async (req: Request, res: Response) => {
    const session = await startSession()
    try {
      session.startTransaction()

      const projectTeamMembersToDelete = await ProjectTeamMember.find({
        projectId: req.project._id,
        userId: req.collaborator.userId
      }).session(session).select('_id projectTeamId')


      for (const teamMember of projectTeamMembersToDelete) {
        await ProjectTeam.updateOne(
          {
            _id: teamMember.projectTeamId
          },
          {
            $pull: {
              projectTeamMembers: teamMember._id
            }
          },
          { 
            session 
          }
        )
      }

      await ProjectTeamMember.deleteMany({
        projectId: req.project._id,
        userId: req.collaborator.userId
      }, { session })

      await Project.updateOne(
        {
          _id: req.project._id
        },
        {
          $pull: {
            collaborators: req.collaborator._id
          }
        },
        {
          session
        }
      )

      await req.collaborator.deleteOne({ session })

      await session.commitTransaction()

      const activityData = getActivityData(req.project._id, req.user._id, "PROJECT_COLLABORATOR", req.collaborator._id, req.collaborator.userId)

      await createActivity("PROJECT_COLLABORATOR_REMOVED", activityData, {})
      
      res.json({ message: 'El colaborador fue eliminado del proyecto' })
    } catch (error) {
      if(session.inTransaction()) {
        await session.abortTransaction()
      }
      console.log(error)
      res.status(500).json({ message: 'Error interno del servidor' })
    } finally {
      await session.endSession()
    }
  }
}