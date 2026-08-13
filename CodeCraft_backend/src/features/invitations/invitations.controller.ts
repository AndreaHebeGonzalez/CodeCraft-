import { Request, Response } from "express"
import { MongoServerError } from 'mongodb'
import User from "../users/User.model"
import ProjectCollaborator from "../projectCollaborators/Collaborator.model"
import { generateTokenInvitation } from '../auth/utils/generateSecureToken'
import ProjectInvitation from "./ProjectInvitation.model"
import { ProjectInvitationEmail } from "../../mails/projectInvitationEmail"
import Project from "../projects/Project.model"
import { ProjectTeamMember } from "../projectTeams/projectTeamMembers.ts/ProjectTeamMember.model"
import ProjectTeam from "../projectTeams/ProjectTeam.model"
import { IProjectTeam, ProjectTeamDocument } from "../projectTeams/projectTeams.types"
import { invitationStatus } from "./invitation.constants"
import { getActivityData } from "../activity/activity.utils"
import { createActivity } from "../activity/activity.service"
import { ClientSession, startSession } from "mongoose"
import { ActivityDataCreate } from "../activity/types/activity.types"

export class InvitationController {
  
  static inviteCollaborator = async (req: Request, res: Response) => {

    const { email, projectTeamId } = req.body

    try {
      

      //Se verifica posible autoinvitación
      if(req.user.email === email) {
        return res.status(409).json({ message: 'Hubo un error al procesar la invitación' })
      }

      const invitedUser = await User.findOne({ email }).select('_id').lean()

      if (invitedUser) {
        const existingCollaborator = await ProjectCollaborator.findOne({
          userId: invitedUser._id,
          projectId: req.project._id
        })



        // No es invitacion a team y es colaborador
        if(existingCollaborator) {
          return res.status(409).json({ message: 'El usuario ya es colaborador del proyecto' }) 
        }
      }

      if(projectTeamId) {
        const projectTeam = await ProjectTeam.findOne({
          _id: projectTeamId,
          projectId: req.project._id,
        })

        if(!projectTeam) {
          return res.status(404).json({ message: 'Equipo no encontrado, no fue posible enviar la invitación' })
        }
      }

      const hasPendingInvitation = await ProjectInvitation.exists({ 
        email, 
        projectId: req.project._id,
        status: 'pending'
      })

      if(hasPendingInvitation) {
        return res.status(409).json({ message: `El usuario ya tiene una invitación pendiente al proyecto` }) 
      }

      // Borramos todas las invitaciones previas

      await ProjectInvitation.deleteMany({
        email,
        projectId: req.project._id,
        status: {
          $in: ['cancelled', 'rejected', 'accepted']
        }
      })
      
      /* Se realiza la invitacion */
      
      //Genero el token

      const token = generateTokenInvitation()

      const projectInvitation = new ProjectInvitation({
        projectId: req.project._id,
        projectTeamId, //es undefined si no esta el parametro
        email,
        invitedBy: req.user._id,
        token
      })

      await projectInvitation.save()

      await ProjectInvitationEmail.sendProjectInvitations({
        invitedBy: req.user.name,
        email,
        token,
        projectName: req.project.projectName
      })

      const activityData = getActivityData(req.project._id, req.user._id, "PROJECT_INVITATION", projectInvitation._id)

      await createActivity("PROJECT_INVITATION_SEND", activityData, {
        email
      })

      return  res.status(200).json({ message: 'La invitacion se envió correctamente' })

    } catch (error) {
      console.error(error)
      if (error.code === 11000) {
        return res.status(409).json({ message: 'ya existe una invitación activa para ese usuario en este proyecto' })
      }
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static getPendingInvitations = async (req: Request, res: Response) => {
    try {
      
      const pendingInvitations = await ProjectInvitation.find({ 
        projectId: req.project._id, 
        status: invitationStatus.PENDING 
      }).lean()

      res.send({ data: pendingInvitations })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static cancelInvitation = async (req: Request, res: Response) => {
    
    const invitation = req.invitation

    try {
      // Verificar status

      if (invitation.status === 'accepted') {
        return res.status(409).json({ message: 'La solicitud ya fue aceptada'})
      }

      if (invitation.status === 'cancelled') {
        return res.status(409).json({ message: 'La solicitud ya fue cancelada'})
      }

      if (invitation.status === 'rejected') {
        return res.status(409).json({ message: 'La solicitud ya fue rechazada'})
      }

      invitation.status = "cancelled"
      await invitation.save()

      return res.status(200).json({ message: 'La invitación ha sido cancelada' })

    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  } 

  static rejectInvitation = async (req: Request, res: Response) => {
    const { token } = req.params

    try {
      const invitation = await ProjectInvitation.findOne( { token } )

      if (!invitation) {
        return res.status(404).json({ message: 'Invitacion no encontrada' })
      }

      //Verifico estado de invitacion

      if (invitation.status === 'accepted') {
        return res.status(409).json({ message: 'La solicitud ya fue aceptada'})
      }

      if (invitation.status === 'cancelled') {
        return res.status(409).json({ message: 'La solicitud ya ha sido cancelada'})
      }

      if (invitation.status === 'rejected') {
        return res.status(409).json({ message: 'La solicitud ya ha sido rechazada'})
      }

      const project = await Project.findById(invitation.projectId)

      if (!project) {
        await ProjectInvitation.deleteMany({
          projectId: invitation.projectId,
        })

        return res.status(404).json({
          message: 'El proyecto al que pertenecía la invitación ya no existe'
        })
      }

      //Verifico que el user invitado exista en la BD y sea el user autenticado

      const invitedUser = await User.findOne({ email: invitation.email })

      if (!invitedUser) {
        return res.status(404).json({
          message: 'El usuario invitado no existe'
        })
      }

      // Permisos

      if (req.user._id.toString() !== invitedUser._id.toString()) {
        return res.status(403).json({ message: 'No tienes permiso para realizar esta operacion' })
      }

      invitation.status = 'rejected' 
      await invitation.save()

      // Borro todas las invitaciones del user // El user no podrá tener mas de una pendiente a la vez

      await ProjectInvitation.deleteMany({
        _id: { $ne: invitation._id },
        projectId: invitation.projectId,
        email: invitation.email
      })

      return res.status(200).json({ message: 'La invitación fue rechazada' })

    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static acceptInvitation = async (req: Request, res: Response) => {

    const { token } = req.params

    let invitationResult:
      | 'project-only'
      | 'project-and-team'
      | 'project-team-deleted'
      | 'project-team-error'
    
    const sessionProject = await startSession()
    let sessionProjectTeam : ClientSession

    try {

      const invitation = req.invitation

      //Verifico estado de invitacion

      if (invitation.status === 'accepted') {
        return res.status(409).json({ message: 'La solicitud ya fue aceptada'})
      }

      if (invitation.status === 'cancelled') {
        return res.status(409).json({ message: 'La solicitud ya ha sido cancelada'})
      }

      if (invitation.status === 'rejected') {
        return res.status(409).json({ message: 'La solicitud ya ha sido rechazada'})
      }

      sessionProject.startTransaction()

      // Debo verificar que el proyecto exista 

      const project = await Project.findById(invitation.projectId).session(sessionProject)

      if (!project) {
        await sessionProject.abortTransaction()
        return res.status(404).json({ message: 'El proyecto al que fuiste invitado ha sido eliminado'})
      }

      //Verifico que el user invitado exista en la BD y sea el user autenticado

      const invitedUser = await User.findOne({ email: invitation.email }).session(sessionProject)

      if (!invitedUser) {
        await sessionProject.abortTransaction()
        return res.status(404).json({
          message: 'El usuario invitado no existe'
        })
      }

      // Permisos

      if (req.user._id.toString() !== invitedUser._id.toString()) {
        await sessionProject.abortTransaction()
        return res.status(403).json({ message: 'No tienes permiso para realizar esta operacion' })
      }

      //Agrega a colaboradores 
      let activityData : ActivityDataCreate

      try {
        const collaborator = new ProjectCollaborator({
          projectId: invitation.projectId,
          userId: invitedUser._id,
          addedBy: invitation.invitedBy
        })

        await collaborator.save({ session: sessionProject })

        const result = await Project.updateOne(
          {
            _id: project._id
          },
          {
            $push: {
              collaborators: collaborator._id
            }
          },
          {
            session: sessionProject
          }
        )

        if(result.matchedCount === 0) {
          await sessionProject.abortTransaction()
          return res.status(404).json({ message: 'Proyecto no encontrado' })
        }
        
        activityData = getActivityData(project._id, invitation.invitedBy, "PROJECT_COLLABORATOR",  collaborator._id, invitedUser._id)

      } catch (error) {
        await sessionProject.abortTransaction()
        if (
          error instanceof MongoServerError && 
          error.code === 11000 && 
          error.keyPattern?.projectId &&
          error.keyPattern?.userId

        ) {
            return res.status(409).json({
              message: `El usuario ya es colaborador del proyecto ${project.projectName}`
            })
        }
        throw error
      }
      
      invitation.status = 'accepted' 
      
      await invitation.save({ session: sessionProject })

      // Borro todas las invitaciones pendientes del user en el proyecto ya que no es posible el envio de una invitacion ya siendo colaborador del proyecto. Si se agrega a un team se hace automaticamente desde el endpoint de invitacion.

      await ProjectInvitation.deleteMany({
        _id: { $ne: invitation._id },
        projectId: invitation.projectId,
        email: invitation.email
      }, { session: sessionProject })

      sessionProjectTeam = await startSession()

      await sessionProject.commitTransaction()

      await createActivity("PROJECT_COLLABORATOR_ADDED", activityData, {
        projectRole: "dev"
      })
      //Agregar a ProjectTeamMember si es necesario

      sessionProjectTeam.startTransaction()

      let team : ProjectTeamDocument | null = null

      if(!invitation.projectTeamId) {
        invitationResult = 'project-only'
      } else {

        team = await ProjectTeam.findById(invitation.projectTeamId).session(sessionProjectTeam)

        if(!team) {
          await sessionProjectTeam.abortTransaction()
          invitationResult = 'project-team-deleted'
        } else {
          try {
            const projectTeamMember = new ProjectTeamMember({
              projectId: invitation.projectId,
              projectTeamId: invitation.projectTeamId,
              userId: invitedUser._id
            })
            
            await projectTeamMember.save({ session: sessionProjectTeam })

            const result = await ProjectTeam.updateOne(
              {
                _id: team._id
              },
              {
                $push: {
                  projectTeamMembers: projectTeamMember._id
                }
              },
              {
                session: sessionProjectTeam
              }
            )

            if(result.matchedCount === 0) {
              await sessionProjectTeam.abortTransaction()
              invitationResult = 'project-only'
            } else {
              invitationResult = 'project-and-team'
            }

            await sessionProjectTeam.commitTransaction()

            const activityData = getActivityData(project._id, invitation.invitedBy, "PROJECT_TEAM_MEMBER", projectTeamMember._id, invitedUser._id )

            await createActivity("PROJECT_TEAM_MEMBER_ADDED", activityData, {
              projectTeamRole: "miembro"
            })

          } catch (error) {
            await sessionProjectTeam.abortTransaction()
            if (
              error instanceof MongoServerError && 
              error.code === 11000 
            ) {
              invitationResult = 'project-and-team'
            } else {
              console.error('Error agregando ProjectTeamMember', {
                projectId: invitation.projectId,
                projectTeamId: invitation.projectTeamId,
                userId: invitedUser._id,
                error
              })
              invitationResult = 'project-team-error'
            }
          }
        }
      }
      
      switch (invitationResult) {
        case 'project-only':
          return res.status(200).json({
            message: `Invitación aceptada. Sos colaborador del proyecto ${project.projectName}`
          })

        case 'project-and-team':
          return res.status(200).json({
            message: `Sos colaborador del proyecto ${project.projectName} y ahora formás parte del equipo ${team.projectTeamName}`
          })

        case 'project-team-deleted':
          return res.status(200).json({
            message:
              `La invitación fue aceptada. El equipo al que pertenecía la invitación ya no existe, por lo que fuiste agregado únicamente al proyecto ${project.projectName}. Podrás ser agregado al equipo más adelante por un administrador.`
          })
        case 'project-team-error':
          return res.status(200).json({
            message:
              `La invitación fue aceptada. Sos colaborador del proyecto ${project.projectName}, pero no pudimos agregarte al equipo ${team.projectTeamName}`
          })
      }

    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Error interno del servidor' })
    } finally {
      await sessionProject.endSession()
      await sessionProjectTeam.endSession()
    }
  }

  static getInvitationByToken =  (req: Request, res: Response) => {
    res.json({ 
      data: req.invitation 
    })
  }
}