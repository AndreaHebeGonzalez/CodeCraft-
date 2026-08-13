/* Dashboard ProjectTeam*/
import { Types } from "mongoose"
import { ProjectTeamMemberWidthTask } from "./projectTeamMembers.ts/projectTeamMember.types"

/* Obtener cantidad de admin del proyecto que pertenece al equipo*/

export const getAdminCount = (teamMembers : ProjectTeamMemberWidthTask[]) : number => {
  let count = 0
  teamMembers.forEach(member => {
    if(member.projectRole === "admin") {
      count++
    }
  })
  return count
}


//Obtener cantidad de tareas por miembro del equipo

type TeamMemberTaskSummary = {
  userId: Types.ObjectId
  userName: string
  userEmail: string
  taskCount: number
}

export const getProjectTeamMemberTaskCounts = (teamMembers: ProjectTeamMemberWidthTask[])  : TeamMemberTaskSummary[] => {
  const memberTaskCounts = teamMembers.reduce<TeamMemberTaskSummary[]>((result, member) => {
    const memberData = {
      userId: member.userId,
      userName: member.userData.name, 
      userEmail: member.userData.email,
      taskCount: member.tasks.length
    }

    result.push(memberData)
    return result 

  }, [] as TeamMemberTaskSummary[])

  return memberTaskCounts
}

