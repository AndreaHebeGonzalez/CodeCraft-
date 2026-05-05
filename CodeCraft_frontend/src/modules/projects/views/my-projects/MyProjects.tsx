import { useQuery } from '@tanstack/react-query'
import ProjectsCard from '../../components/project-card/ProjectsCard'
import { getProjects } from '../../services'
import useAppStore from '@/shared/stores/useAppStore'
import { Link, Outlet } from 'react-router-dom'
import './MyProjects.scss'

const MyProjects = () => {

  const { showNotification } = useAppStore()

  const { data } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  })

  if(data) return (
    <div className="my-projects">
      <div className='my-projects__headers'>
        <h2>Mis proyectos</h2>
      </div>

      <div className='my-projects__list'>
        { 
          data.length > 0 ? 
          data.map(project => (
            <ProjectsCard 
              key={project._id}
              project={project}
            />)) : 
            <p>
              No hay proyectos aún {''}
              <Link to={showNotification ? '#' : location.pathname + '?modalType=newProyect'} >
                <span 
                  className= {`my-projects__crate-project ${showNotification ? 'my-projects__crate-project--desabled':''}`}
                >
                  Crear un proyecto
                </span>
              </Link>
            </p>
        }
      </div>
      <Outlet />
    </div>
  )
}

export default MyProjects
