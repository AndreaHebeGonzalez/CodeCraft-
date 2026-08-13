import { useQuery } from "@tanstack/react-query"
import { getProjects } from "@/modules/projects/services"
import type { Projects } from "@/modules/projects/types"
import type { AppError } from "@/shared/error/AppError"
import { Link } from "react-router-dom"
import ProjectName from "@/shared/components/tags/project-name/ProjectName"
import { ProjectRole } from "@/shared/components/tags/project-rol/ProjectRole"



const ProjectsList = () => {


  const { data, isError } = useQuery<
    Projects,
    AppError
  >({
    queryKey: ['projects'],
    queryFn: getProjects
  })

  return (
    <ul className='sidebar__projects-list'>
      {
        isError || !data ?
        <li className="sidebar__error">
          No se pudieron cargar los proyectos
        </li> :
      
        data.map(project => (
          <li className='sidebar__item' key={project._id}>
            <Link to={`/projects/${project._id}/summary`} className='sidebar__link-project'>
              <ProjectName 
                text={project.projectName}
                variant='#0000ff'
              />
              <ProjectRole
                role= 'dev'
              />
            </Link>
          </li>
        ))
      }
    </ul>
  )
}

export default ProjectsList