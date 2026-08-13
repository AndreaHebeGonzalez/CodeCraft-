import { activityType } from "../activity.constants"
import { 
  projectCreatedMetadataSchema, 
  projectUpdatedMetadataSchema, 
  projectTeamCreatedMetadataSchema, 
  projectTeamUpdatedMetadataSchema, 
  projectTeamDeletedMetadataSchema, 
  projectTeamMemberAddedMetadataSchema,
  projectTeamMemberRemovedMetadataSchema,
  projectTeamMemberRoleChangedMetadataSchema,
  projectCollaboratorAddedMetadataSchema,
  projectCollaboratorRemovedMetadataSchema,
  projectCollaboratorRoleChangedMetadataSchema,
  projectInvitationSendMetadataSchema,
  projectInvitationAcceptedMetadataSchema,
  projectInvitationRejectedMetadataSchema,
  projectInvitationCancelledMetadataSchema,
  taskCreatedMetadataSchema,
  taskUpdatedMetadataSchema,
  taskDeletedMetadataSchema,
  taskStatusChangedMetadataSchema,
  taskPriorityChangedMetadataSchema,
  taskAssignedMetadataSchema,
  taskUnassignedMetadataSchema,
  taskStartDateChangedMetadataSchema,
  taskDueDateChangedMetadataSchema,
  taskCompletedMetadataSchema,
  taskReopenedMetadataSchema,
  commentCreatedMetadataSchema,
  commentDeletedMetadataSchema,
  commentUpdatedMetadataSchema,
  projectStartDateChangedMetadataSchema,
  projectDueDateChangedMetadataSchema,
  projectStatusChangedMetadataSchema
} from "./activity.metadata.schemas"


export const activityMetadataMapSchemas = {

  //PROJECT
    [activityType.PROJECT_CREATED]: projectCreatedMetadataSchema,
    [activityType.PROJECT_UPDATED]: projectUpdatedMetadataSchema,
    [activityType.PROJECT_START_DATE_CHANGED]: projectStartDateChangedMetadataSchema,
    [activityType.PROJECT_DUE_DATE_CHANGED]: projectDueDateChangedMetadataSchema,
    [activityType.PROJECT_STATUS_CHANGED]: projectStatusChangedMetadataSchema,

  //PROJECT_TEAM
    [activityType.PROJECT_TEAM_CREATED]:  projectTeamCreatedMetadataSchema,
    [activityType.PROJECT_TEAM_UPDATED]:  projectTeamUpdatedMetadataSchema,
    [activityType.PROJECT_TEAM_DELETED]:  projectTeamDeletedMetadataSchema,

  //PROJECT_TEAM_MEMBER

    [activityType.PROJECT_TEAM_MEMBER_ADDED]: projectTeamMemberAddedMetadataSchema,
    [activityType.PROJECT_TEAM_MEMBER_REMOVED]: projectTeamMemberRemovedMetadataSchema,
    [activityType.PROJECT_TEAM_MEMBER_ROLE_CHANGED]: projectTeamMemberRoleChangedMetadataSchema,

  //PROJECT_COLLABORATOR

    [activityType.PROJECT_COLLABORATOR_ADDED]: projectCollaboratorAddedMetadataSchema,
    [activityType.PROJECT_COLLABORATOR_REMOVED] :  projectCollaboratorRemovedMetadataSchema,
    [activityType.PROJECT_COLLABORATOR_ROLE_CHANGED]: projectCollaboratorRoleChangedMetadataSchema,

  //PROJECT_INVITATION

    [activityType.PROJECT_INVITATION_SEND]: projectInvitationSendMetadataSchema,
    [activityType.PROJECT_INVITATION_ACCEPTED]: projectInvitationAcceptedMetadataSchema,
    [activityType.PROJECT_INVITATION_REJECTED]: projectInvitationRejectedMetadataSchema,
    [activityType.PROJECT_INVITATION_CANCELLED]: projectInvitationCancelledMetadataSchema,

  //TASK

    [activityType.TASK_CREATED]: taskCreatedMetadataSchema,
    [activityType.TASK_UPDATED] : taskUpdatedMetadataSchema,
    [activityType.TASK_DELETED]: taskDeletedMetadataSchema,
    [activityType.TASK_STATUS_CHANGED]: taskStatusChangedMetadataSchema,
    [activityType.TASK_PRIORITY_CHANGED]: taskPriorityChangedMetadataSchema,
    [activityType.TASK_ASSIGNED]: taskAssignedMetadataSchema,
    [activityType.TASK_UNASSIGNED]: taskUnassignedMetadataSchema,
    [activityType.TASK_START_DATE_CHANGED]: taskStartDateChangedMetadataSchema,
    [activityType.TASK_DUE_DATE_CHANGED]: taskDueDateChangedMetadataSchema,
    [activityType.TASK_COMPLETED]: taskCompletedMetadataSchema,
    [activityType.TASK_REOPENED]:  taskReopenedMetadataSchema,

  //COMMENT

    [activityType.COMMENT_CREATED]: commentCreatedMetadataSchema,
    [activityType.COMMENT_DELETED]: commentDeletedMetadataSchema,
    [activityType.COMMENT_UPDATED]: commentUpdatedMetadataSchema 
} as const