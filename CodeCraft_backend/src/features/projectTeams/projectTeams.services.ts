import { ProjectTeamMember } from "./projectTeamMembers.ts/ProjectTeamMember.model"
import { TaskSummary } from "../tasks/tasks.types"
import { Types } from "mongoose"
import { ProjectTeamMemberSummary, ProjectTeamMemberWidthTask } from "./projectTeamMembers.ts/projectTeamMember.types"


export async function getTeamMembersWithTasks (projectId: Types.ObjectId, projectTeamId: Types.ObjectId) : Promise<ProjectTeamMemberWidthTask[]> {
  try {
    const teamMembers = await ProjectTeamMember.aggregate<ProjectTeamMemberWidthTask>([
      {
        $match: {
          projectId,
          projectTeamId: projectTeamId
        }
      },
      {
        $lookup: {
          from: 'projectcollaborators',
          let: {
            projectId: '$projectId',
            userId: '$userId'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$userId', '$$userId']
                    },
                    {
                      $eq: ['$projectId', '$$projectId']
                    }
                  ]
                }
              }
            },
            {
              $project: {
                projectRole: 1,
                _id: 1
              }
            }
          ],
          as: 'collaboratorData'
        }
      },
      {
        $unwind: '$collaboratorData'
      },
      {
        $project: {
          _id: 1,
          projectId: 1,
          projectTeamId: 1,
          userId: 1,
          teamRole: 1,
          projectRole: '$collaboratorData.projectRole',
          collaboratorId: '$collaboratorData._id'
        }
      },
      {
        $lookup: {
          from: 'users',
          let: {
            userId: '$userId'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$userId']
                }
              }
            },
            {
              $project: {
                _id: 0,
                name: 1,
                email: 1
              }
            }
          ],
          as: 'userData'
        }
      },
      {
        $unwind: '$userData'
      },
      {
        $lookup: {
          from: 'tasks',
          let: {
            projectId: '$projectId',
            projectTeamId: '$projectTeamId',
            collaboratorId: '$collaboratorId'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$projectId', '$$projectId']
                    },
                    {
                      $or: [
                        {
                          $in: ['$$projectTeamId', '$assignedProjectTeams']
                        },
                        {
                          $in: ['$$collaboratorId', '$assignedProjectCollaborator']
                        }
                      ]
                    }
                  ]
                }
              }
            },
            {
              $project: {
                _id: 1,
                taskName: 1,
                projectId: 1,
                parentTask: 1,
                assignedProjectTeams: 1,
                individualCollaborators: 1,
                status: 1,
                priority: 1,
                startDate: 1,
                dueDate: 1,
              }
            }
          ],
          as: 'tasks'
        }
      }
    ])

    return teamMembers

  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getProjectTeamTasks (projectId: Types.ObjectId, projectTeamId: Types.ObjectId) : Promise<TaskSummary[]> {
  try {
    
    const projectTeamTasks = await ProjectTeamMember.aggregate<TaskSummary>([
      {
        $match: {
          projectId: projectId,
          projectTeamId: projectTeamId
        }
      },
      {
        $lookup: {
          from: 'projectcollaborators',
          let: {
            userId: '$userId'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$userId', '$$userId']
                }
              }
            },
            {
              $project: {
                _id: 1
              }
            }
          ],
          as: 'collaboratorId'
        }
      },
      {
        $unwind: '$collaboratorId'
      },
      {
        $project: {
          _id: 0,
          projectId: 1,
          projectTeamId: 1,
          collaboratorId: '$collaboratorId._id'
        }
      },
      {
        $lookup: {
          from: 'tasks',
          let: {
            projectId: '$projectId',
            projectTeamId: '$projectTeamId',
            collaboratorId: '$collaboratorId'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$projectId', '$$projectId']
                    },
                    {
                      $or: [
                        {
                          $in: ['$$projectTeamId','$assignedProjectTeams']
                        },
                        {
                          $in: ['$$collaboratorId', '$assignedProjectCollaborator']
                        }
                      ]
                    }
                  ]
                }
              }
            },
            {
              $project: {
                _id: 1,
                taskName: 1,
                projectId: 1,
                parentTask: 1,
                assignedProjectTeams: 1,
                individualCollaborators: 1,
                status: 1,
                priority: 1,
                startDate: 1,
                dueDate: 1,
                completedAt: 1,
                startedAt: 1,
                createdAt: 1
              }
            }
          ],
          as: 'tasks'
        }
      },
      {
        $unwind: '$tasks'
      },
      {
        $replaceRoot: {
          newRoot: '$tasks'
        }
      }
    ])

    return projectTeamTasks

  } catch (error) {
    throw error
  }
}

export async function getProjectTeamMembers (projectId: Types.ObjectId, projectTeamId: Types.ObjectId) : Promise<ProjectTeamMemberSummary[]>{
  try {
    const projectTeamMembers = await ProjectTeamMember.aggregate<ProjectTeamMemberSummary>([
      {
        $match: {
          projectId: projectId,
          projectTeamId: projectTeamId
        }
      },
      {
        $lookup: {
          from: 'users',
          let: {
            userId: '$userId'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$userId']
                }
              }
            },
            {
              $project: {
                _id: 0,
                name: 1,
                email: 1
              }
            },
          ],
          as: 'userData'
        }
      },
      {
        $unwind: '$userData'
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          name: '$userData.name',
          email: '$userData.email',
          teamRole: 1
        }
      }
    ])
    return projectTeamMembers
  } catch (error) {
    throw error
  }
}