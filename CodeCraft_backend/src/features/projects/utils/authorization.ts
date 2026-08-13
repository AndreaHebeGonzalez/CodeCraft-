import { IProjectCollaborator } from "../../projectCollaborators/collaborator.types"
import { IUser } from "../../users/user.types"
import { IProject } from "../project.types"


export const isOwner = (userId: IUser['_id'], projectOwner: IProject['owner'])  => {
  if(userId.toString() !== projectOwner.toString()) {
    return false
  } else {
    return true
  }
}

export const isCollaboratorAdmin = (collaborator : IProjectCollaborator | null) => {
  if(!collaborator || collaborator.projectRole !== 'admin') {
    return false
  } else {
    return true
  }
}