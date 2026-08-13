import { z } from "zod"
import { taskPriority, taskStatus } from "../../tasks/task.constants"
import { projectRole } from "../../projectCollaborators/collaborator.constants"
import { projectTeamRole } from "../../projectTeams/projectTeamMembers.ts/projectTeamMember.constants"
import { projectStatus } from "../../projects/project.constants"


// BASE

export const fieldUpdatedMetadataSchema = <TField extends readonly [string, ...string[]],
TValue extends z.ZodTypeAny>(
  fields: TField, //"TField debe ser un tuple readonly que tenga al menos un string."
  valueSchema: TValue //"TValue puede ser cualquier esquema de Zod." ej z.string()
) =>
  z.object({
    field: z.enum(fields),
    previousValue: valueSchema,
    currentValue: valueSchema
  })


// PROJECT

export const projectCreatedMetadataSchema = z.object({
  projectName: z.string()
})

export const projectUpdatedMetadataSchema =
  fieldUpdatedMetadataSchema (
    ["projectName", "clientName", "description"] as const,
    z.string()
  )

  export const projectStartDateChangedMetadataSchema = z.object({
    previousDate: z.date().nullable(),
    currentDate: z.date().nullable()
  })

  export const projectDueDateChangedMetadataSchema = z.object({
    previousDate: z.date().nullable(),
    currentDate: z.date().nullable()
  })

  export const projectStatusChangedMetadataSchema = z.object({
    previousStatus: z.enum(projectStatus),
    newStatus: z.enum(projectStatus)
})

// PROJECT COLLABORATOR

export const projectCollaboratorAddedMetadataSchema = z.object({

  projectRole: z.enum(projectRole)
})

export const projectCollaboratorRemovedMetadataSchema = z.object({})

export const projectCollaboratorRoleChangedMetadataSchema = z.object({
  previousProjectRole: z.enum(projectRole),
  currentProjectRole: z.enum(projectRole)
})


// PROJECT TEAM

export const projectTeamCreatedMetadataSchema = z.object({
  projectTeamName: z.string()
})

export const projectTeamUpdatedMetadataSchema =
  fieldUpdatedMetadataSchema(
    ["projectTeamName", "description"] as const,
    z.string()
  )

export const projectTeamDeletedMetadataSchema = z.object({
  projectTeamName: z.string()
})


// PROJECT TEAM MEMBER

export const projectTeamMemberAddedMetadataSchema = z.object({
  projectTeamRole: z.enum(projectTeamRole)
})

export const projectTeamMemberRemovedMetadataSchema = z.object({
  projectTeamRole: z.enum(projectTeamRole)
})

export const projectTeamMemberRoleChangedMetadataSchema = z.object({
  previousProjectTeamRole: z.enum(projectTeamRole),
  currentProjectTeamRole: z.enum(projectTeamRole)
})

// INVITATION

export const projectInvitationSendMetadataSchema = z.object({
  email: z.email()
})

export const projectInvitationAcceptedMetadataSchema = z.object({})

export const projectInvitationRejectedMetadataSchema = z.object({})

export const projectInvitationCancelledMetadataSchema = z.object({})


// TASK

/* 
if (
  previousStatus === "completed" &&
  newStatus === "inProgress"
) {
  La tarea fue reabierta
}
*/

export const taskCreatedMetadataSchema = z.object({
  taskName: z.string()
})

export const taskUpdatedMetadataSchema = 
  fieldUpdatedMetadataSchema([
    "taskName",
    "description"
  ] as const, z.string())

export const taskDeletedMetadataSchema = z.object({
  taskName: z.string()
})

export const taskStatusChangedMetadataSchema = z.object({
  previousStatus: z.enum(taskStatus),
  newStatus: z.enum(taskStatus)
})

export const taskPriorityChangedMetadataSchema = z.object({
  previousPriority: z.enum(taskPriority),
  newPriority: z.enum(taskPriority)
})

export const taskAssignedMetadataSchema = z.object({
  taskName: z.string()
})

export const taskUnassignedMetadataSchema = z.object({
  taskName: z.string()
})

export const taskStartDateChangedMetadataSchema = z.object({
  previousDate: z.date().nullable(),
  currentDate: z.date().nullable()
})

export const taskDueDateChangedMetadataSchema = z.object({
  previousDate: z.date().nullable(),
  currentDate: z.date().nullable()
})

export const taskCompletedMetadataSchema = z.object({
  previousStatus: z.string(),
  newStatus: z.string()
})

export const taskReopenedMetadataSchema = z.object({
  previousStatus: z.string(),
  newStatus: z.string()
})


// COMMENT

export const commentCreatedMetadataSchema = z.object({
  taskId: z.string()
})

export const commentDeletedMetadataSchema = z.object({
  taskId: z.string()
})

export const commentUpdatedMetadataSchema = z.object({})