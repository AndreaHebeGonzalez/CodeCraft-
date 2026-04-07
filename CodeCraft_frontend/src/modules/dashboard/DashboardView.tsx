import { useQuery } from '@tanstack/react-query'
import { Navigate } from 'react-router-dom'
import Overview from './components/Overview/Overview'
import ProjectsActivitiesFeed from './components/ProjectsActivitiesFeed/ProjectsActivitiesFeed'
import UpcomingTasks from './components/UpcomingTasks/UpcomingTasks'
import { getProjects } from '../projects/services'
import './DashboardView.scss'



export default function DashboardView() {

  const { data, isError, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })

  if(isLoading) return 'Cargando...'
  if(isError) return <Navigate to='/404' />

  if(data) return (
    <section className='dashboard'>
      <div className='dashboard__wrapper'>
        <div className='dashboard__headers'>
          <h2>Hola Andrea, ¿Lista para Empezar?</h2>
          <p>Hoy tenes 3 tareas urgentes y dos atrasadas. </p>
        </div>
        <Overview />
        <div className='dashboard__upcoming-tasks'>
          <h3>Tareas por vencer</h3>
          <UpcomingTasks />
        </div>
        <div className='dashboard__recent-activity'>
          <h3>Últimos movimientos</h3>
          <ProjectsActivitiesFeed 
            projectsId={[]}
          />
          {/* Existirála posibilidad de que el usuario decide que proyectos incluir en este apartado por eso esta vista solo se preocupa por qué proyectos mostrar y el componente busca la informacion de todos los id seleccionados y muetsra el mensaje de si hay o no atividades */}
        </div>
      </div>
    </section>
  )
}
