import { Router } from "express"
import { validateRequest } from "../../middleware/validation"
//Project
import { ProjectController } from "./project.controller"
import { validateCreateProyect, validateUpdateProject } from "./project.validator"
import { projectExist } from "./middleware/project.loader" 
import { isProjectAdminOrOwner,  isProjectMember, isProjectOwner } from "./middleware/project.authorization"
//Tasks
import { TaskControllers } from "../tasks/task.controller"
import { validateCreateTasks, validateUpdateTask } from "../tasks/task.validator"
import { taskBelongsToProject } from "../tasks/middleware/taskBelongsToProject"
import { taskExist } from "../tasks/middleware/task.loader"
import { checkMaxSubtaskDepth } from "../tasks/middleware/checkMaxSubtaskDepth"

import { authenticate } from "../auth/auth.middleware"

import { emailBodyValidator } from "../../mails/email.validator"

import { InvitationController } from "../invitations/invitations.controller"
import { invitationBelongsToProject } from "../invitations/middleware/invitationBelongsToProject"
import { invitationExist } from "../invitations/middleware/invitation.loader"

import { validateObjectIdBody, validateOptionalObjectIdBody } from "../../validators/ids.validator"

import { CollaboratorController } from "../projectCollaborators/collaborator.controller"

import { ProjectTeamController } from "../projectTeams/projectTeam.controller"
import { validateCreateProyectTeam, validateUpdateProyectTeam } from "../projectTeams/projectTeam.validator"
import { collaboratorBelongsToProject } from "../projectCollaborators/middleware/collaboratorBelongsToProject"
import { collaboratorExist } from "../projectCollaborators/middleware/collaborator.loader"
import { projectTeamBelongsToProject, projectTeamExist } from "../projectTeams/projectTeam.middleware"
import { validateRangeDateQuery } from "../projectAnalytics/projectAnalytics.validators"
import { ProjectTeamMemberController } from "../projectTeams/projectTeamMembers.ts/projectTeamMember.controller"
import { validateChangeProjectRole } from "../projectCollaborators/collaborator.validator"
import { validateChangeProjectTeamRole } from "../projectTeams/projectTeamMembers.ts/projectTeamMember.validator"
import { projectTeamMemberExist } from "../projectTeams/projectTeamMembers.ts/middleware/projectTeamMember.loader"
import { projectTeamMemberBelongsToProjectTeam } from "../projectTeams/projectTeamMembers.ts/middleware/projectTeamMemberBelongsToProjectAndProjectTeam"
import { loadTargetUser } from "../users/user.middleware"





const router = Router()

router.use(authenticate) // "A partir de este punto, todas las rutas de este router deben pasar primero por el middleware authenticate."
router.param('projectId', projectExist) 

/* Project */ 

router.post('/', validateCreateProyect, validateRequest, ProjectController.createProjects)

router.get('/', ProjectController.getAllProjects)

router.get('/:projectId', isProjectMember, ProjectController.getProjectById)

router.patch('/:projectId', isProjectOwner, validateUpdateProject, validateRequest, ProjectController.updateProject)

router.delete('/:projectId', isProjectOwner, ProjectController.deleteProject)

/* Task */

router.param('taskId', taskExist) 
router.param('taskId', taskBelongsToProject)


router.post('/:projectId/tasks', isProjectAdminOrOwner, validateCreateTasks, validateRequest, checkMaxSubtaskDepth, TaskControllers.createTask)

router.get('/:projectId/tasks', isProjectMember, TaskControllers.getProjectTasks)

router.get('/:projectId/tasks/:taskId', isProjectMember, TaskControllers.getTaskByID)

router.patch('/:projectId/tasks/:taskId', isProjectAdminOrOwner, validateUpdateTask, validateRequest, TaskControllers.updateTask)

router.delete('/:projectId/tasks/:taskId', isProjectAdminOrOwner, TaskControllers.deleteTask)

/* Invitation */
router.param('invitationId', invitationExist)
router.param('invitationId', invitationBelongsToProject)

router.post('/:projectId/invitations', isProjectAdminOrOwner, validateOptionalObjectIdBody('projectTeamId', 'El ID del equipo'), emailBodyValidator, validateRequest, InvitationController.inviteCollaborator)
router.patch('/:projectId/invitations/:invitationId/cancel', isProjectAdminOrOwner, InvitationController.cancelInvitation)
router.get('/:projectId/invitations/pending', isProjectAdminOrOwner, InvitationController.getPendingInvitations) //Verificar permisos aca


/* Collaborator */
router.param('collaboratorId', collaboratorExist)
router.param('collaboratorId', collaboratorBelongsToProject)

router.get('/:projectId/collaborators', isProjectMember, CollaboratorController.getCollaboratorByProject)
router.get('/:projectId/collaborators/:collaboratorId', isProjectMember, CollaboratorController.getCollaboratorById)
router.patch('/:projectId/collaborators/:collaboratorId', isProjectAdminOrOwner, validateChangeProjectRole, validateRequest, CollaboratorController.changeProjectRole)
router.delete('/:projectId/collaborators/:collaboratorId', isProjectAdminOrOwner, CollaboratorController.deleteCollaborator)

/* Project Team */
router.param('projectTeamId', projectTeamExist)
router.param('projectTeamId', projectTeamBelongsToProject)

router.post('/:projectId/project-team', isProjectAdminOrOwner, validateCreateProyectTeam, validateRequest, ProjectTeamController.createProjectTeam)
router.patch('/:projectId/project-team/:projectTeamId', isProjectAdminOrOwner, validateUpdateProyectTeam, validateRequest, ProjectTeamController.updateProjectTeam)
router.get('/:projectId/project-team/:projectTeamId/dashboard', isProjectMember, ProjectTeamController.getProjectTeamDashboard)

/* Project Team Member*/
router.param('projectTeamMemberId', projectTeamMemberExist)
router.param('projectTeamMemberId', projectTeamMemberBelongsToProjectTeam)

router.post('/:projectId/project-team/:projectTeamId/members', isProjectAdminOrOwner, loadTargetUser(req => req.projectTeamMember.userId), validateObjectIdBody('userId', 'El ID del usuario'), validateRequest, ProjectTeamMemberController.createProjectTeamMember)

router.get('/:projectId/project-team/:projectTeamId/members', isProjectMember, ProjectTeamMemberController.getProjectTeamMember)

router.get('/:projectId/project-team/:projectTeamId/statitics', isProjectMember, validateRangeDateQuery, validateRequest, ProjectTeamController.getTaskStats)

router.patch('/:projectId/project-team/:projectTeamId/project-team-members/:projectTeamMemberId', isProjectAdminOrOwner, validateChangeProjectTeamRole, validateRequest, ProjectTeamMemberController.changeProjectTeamRole)

router.delete('/:projectId/project-team/:projectTeamId/project-team-members/:projectTeamMemberId', isProjectAdminOrOwner, loadTargetUser(req => req.projectTeamMember.userId), ProjectTeamMemberController.deleteProjectTeamMember)


export default router