import { useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Avatar from "@/shared/components/avatar/Avatar"
import { AddButton } from "@/shared/components/buttons/add-button/AddButton"
import { formatDate, formatDateToWords } from "@/shared/utils/dateUtils"
import { ProjectMetrics } from "@/modules/projects/components/project-metrics/ProjectMetrics"
import { HistorySection } from "@/shared/components/history-section/HistorySection"
import DateSelector from "@/shared/components/date-selector/DateSelector"
import { getProjectById, updateProjectField } from "@/modules/projects/services"
import './ProjectSummary.scss'


const ProjectSummary = () => {

  const queryClient = useQueryClient()

  const { projectId } = useParams<{ projectId: string}>()

  if(!projectId) {
    throw new Error('Parámetro de ruta faltante: projectId. Esta vista depende de /projects/:projectId')
  }

  const { data : project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById(projectId),
    retry: 2
  })

  const {mutate} = useMutation({
    mutationFn: updateProjectField,

    onMutate: async (newData) => {
      const { projectId, field, value } = newData

      // 1. Cancelar queries en curso
      await queryClient.cancelQueries({ queryKey: ['project', projectId] })
      
      // 2. Snapshot previo (rollback)
      const previousProject = queryClient.getQueryData(['project', projectId])

      queryClient.setQueryData(['project', projectId], (old : any) => {

        //old es el valor actual en cache
        if (!old) return old

        if (field === 'rangeDate' && typeof value !== 'string') {
          
          return {
            ...old,
            startDate: value.from ?? null,
            dueDate: value.to ?? null
          }
        }
        return {
          ...old,
          [field]: value
        }
      })

      return {
        previousProject
      }

    },

    onError: (error, variables, context) => {
      if(context?.previousProject) {
        queryClient.setQueryData(['project', variables.projectId], context.previousProject)
      }
      console.log(error)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['projects']})
    },

    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({queryKey: ['project', variables.projectId]})
    }
  })

  const rangeDate = {
    from: formatDate(project?.startDate),
    to: formatDate(project?.dueDate)
  }

  const onSave = (field: string, value: string | {
      from?: Date | undefined;
      to?: Date | undefined;
    }) => {
    const data = {
      projectId: projectId!,
      field,
      value
    }
    mutate(data)
  }

  return (
    <div className="summary">
      <div className="summary__first-row">
        <div className="summary__content summary__content--dates">
          <h4>Fechas claves</h4>
          <ul className="summary__list-dates">
            
            <li className="summary__date-item">
              <p className="summary__date-text">Plazo</p> 
              <div className="summary__date-selector">
                <DateSelector 
                  field="rangeDate"
                  rangeDates={rangeDate}
                  onSave={onSave}
                  variant="light"
                  buttonVariant="split"
                />
              </div>
            </li>
            {
              project?.updatedAt && 
              <li className="summary__date-item">
                <p className="summary__date-text">Última actualización</p> 
                <p className="summary__date">{formatDateToWords(project.updatedAt)}</p>
              </li>
            }

            {
              project?.createdAt && 
              <li className="summary__date-item">
                <p className="summary__date-text">Fecha de creación</p> 
                <p className="summary__date">{formatDateToWords(project.createdAt)}</p>
              </li>
            }
          </ul>
        </div>
        <div className="summary__content summary__content--roles">
          <h4>Roles del proyecto</h4>
          <div className="summary__roles-list">
            <div className="summary__role">
              <Avatar
                text="BV"
                variant="#04BC41"
                width="3rem"
                height="3rem"
              />
              <div className="summary__role-content">
                <span className="summary__collaborator">Bruno Vidales</span>
                <span className="summary__role-name">Encargado del proyecto</span>
              </div>
            </div>
            <div className="summary__role">
              <Avatar
                text="BV"
                variant="#044DBC"
                width="3rem"
                height="3rem"
              />
              <div className="summary__role-content">
                <span className="summary__collaborator">Andrea Gonzalez</span>
                <span className="summary__role-name">Encargado del proyecto</span>
              </div>
            </div>
            <div className="summary__role">
              <Avatar
                text="BV"
                variant="#0F2648"
                width="3rem"
                height="3rem"
              />
              <div className="summary__role-content">
                <span className="summary__collaborator">Lía Hebe Gonzalez</span>
                <span className="summary__role-name">Desarrollador</span>
              </div>
            </div>
            <div className="summary__role">
              <Avatar
                text="BV"
                variant="#04BC41"
                width="3rem"
                height="3rem"
              />
              <div className="summary__role-content">
                <span className="summary__collaborator">Bruno Vidales</span>
                <span className="summary__role-name">Encargado del proyecto</span>
              </div>
            </div>
            <div className="summary__role">
              <Avatar
                text="BV"
                variant="#044DBC"
                width="3rem"
                height="3rem"
              />
              <div className="summary__role-content">
                <span className="summary__collaborator">Andrea Gonzalez</span>
                <span className="summary__role-name">Encargado del proyecto</span>
              </div>
            </div>
            <div className="summary__role">
              <Avatar
                text="BV"
                variant="#0F2648"
                width="3rem"
                height="3rem"
              />
              <div className="summary__role-content">
                <span className="summary__collaborator">Lía Hebe Gonzalez</span>
                <span className="summary__role-name">Desarrollador</span>
              </div>
            </div>
            <div className="summary__role">
              <Avatar
                text="BV"
                variant="#04BC41"
                width="3rem"
                height="3rem"
              />
              <div className="summary__role-content">
                <span className="summary__collaborator">Bruno Vidales</span>
                <span className="summary__role-name">Encargado del proyecto</span>
              </div>
            </div>
            <div className="summary__role">
              <Avatar
                text="BV"
                variant="#044DBC"
                width="3rem"
                height="3rem"
              />
              <div className="summary__role-content">
                <span className="summary__collaborator">Andrea Gonzalez</span>
                <span className="summary__role-name">Encargado del proyecto</span>
              </div>
            </div>
            <div className="summary__add-role">
              <AddButton
                text="Agregar miembro"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="summary__content">
        <h4>Métricas</h4>
        <ProjectMetrics />
      </div>
      
      <div className="summary__content">
        <h4>Actividad reciente</h4>
        <HistorySection />
      </div>
    </div>
  )
}

export default ProjectSummary