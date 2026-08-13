import { useQuery } from '@tanstack/react-query'
import Overview from '../../components/overview/Overview'
import ProjectsActivitiesFeed from '../../components/projects-activities-feed/ProjectsActivitiesFeed'
import UpcomingTasks from '../../components/upcoming-tasks/UpcomingTasks'
import { getProjects } from '../../../projects/services'
import type { Projects } from '@/modules/projects/types'
import type { AppError } from '@/shared/error/AppError'
import { Loading } from '@/shared/components/loading/Loading'
import QueryErrorHandler from '@/shared/components/errors/query-error-handler/QueryErrorHandler'
import './DashboardView.scss'


export default function DashboardView() {

  const { data, isError, isLoading, error } = useQuery<
    Projects,
    AppError
  >({
    queryKey: ['projects'],
    queryFn: getProjects,
    retry: 1,
    refetchOnWindowFocus: false
  })

  if(isLoading) return <Loading />


  if (isError && error) {
    return <QueryErrorHandler error={error} />
  }

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
          {/* Existirá la posibilidad de que el usuario decide que proyectos incluir en este apartado por eso esta vista solo se preocupa por qué proyectos mostrar y el componente busca la informacion de todos los id seleccionados y muetsra el mensaje de si hay o no atividades */}
        </div>
      </div>
    </section>
  )
}
