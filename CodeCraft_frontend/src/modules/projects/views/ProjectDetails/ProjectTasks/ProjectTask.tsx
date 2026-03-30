import { useParams } from "react-router-dom"
import { TaskBoard } from "@/modules/tasks/components/TaskBoard/TaskBoard"
import { getTasksByProject } from "@/modules/tasks/services"
import { useQuery } from "@tanstack/react-query"



const ProjectTask = () => {

  const { projectId } = useParams<{projectId: string}>()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => getTasksByProject(projectId!)
  })

  if(isLoading) return 'Cargando...'
  if(isError) return (<div>Hubo un error al cargar las tareas, intentelo denuevo más tarde - Boton de reportar</div>)
  
  if(data) return (
    <div className="project-task">
      <TaskBoard 
        projectTasks = {data}
      />
    </div>
  )
}

export default ProjectTask
