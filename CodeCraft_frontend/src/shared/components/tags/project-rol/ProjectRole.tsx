import './ProjectRole.scss'

type ProjectRoleProps = {
  role: string
}

export const ProjectRole = ({ role } : ProjectRoleProps) => {
  return (
    <div className='project-role'><span>{role}</span></div>
  )
}
