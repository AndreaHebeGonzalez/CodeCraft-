import { AddButton } from "@/shared/components/buttons/add-button/AddButton"
import { isBeforeToday } from "@/shared/utils/dateUtils"
import { formatDateToWords } from "@/shared/utils/dateUtils"
import { useMemo } from "react"
import { Link, useLocation } from "react-router-dom"
import type { Project } from "../../types"


type ProjectDateProps = {
  project: Project
}

const ProjectDate = ({ project } : ProjectDateProps) => {

  const location = useLocation()

  const text = useMemo(()=>{
    if(!project.startDate && !project.dueDate) return null
    
    if(project.startDate && project.dueDate) {
      if(!isBeforeToday(project.startDate.toISOString())) {
        return `Comienza el ${formatDateToWords(project.startDate.toISOString())} y finaliza el ${formatDateToWords(project.dueDate.toISOString())}`
      } else if(isBeforeToday(project.startDate.toISOString()) && !isBeforeToday(project.dueDate.toISOString())) {
        return `En curso: del ${formatDateToWords(project.startDate.toISOString())} al ${formatDateToWords(project.dueDate.toISOString())}`
      } else if(isBeforeToday(project.dueDate.toISOString())) { /* Verificar el estado del proyecto si esta o no marcado como completado */
        return `Con retraso: del ${formatDateToWords(project.startDate.toISOString())} al ${formatDateToWords(project.dueDate.toISOString())}`
      }
    } else if(project.startDate) {
      if(isBeforeToday(project.startDate.toISOString())) {
        return `Desde el ${formatDateToWords(project.startDate.toISOString())}`
      } else {
        return `Comienza el ${formatDateToWords(project.startDate.toISOString())}`
      }
    } else if(project.dueDate) {
      if(!isBeforeToday(project.dueDate.toISOString())) {
        return `Hasta el ${formatDateToWords(project.dueDate.toISOString())}`
      } else {
        return `Finalizo o con retraso el ${formatDateToWords(project.dueDate.toISOString())}`
      }
    }
  }, [project.startDate, project.dueDate, project._id])

  
  return (
    <>
      {
        text ? <span>{text}</span> :
        <span 
          className='project-card__undated'
        > 
          Sin fechas asignadas {' '}
          <Link 
            to={location.pathname + `?modalType=editProject&projectId=${project._id}`}  state={{ project: project }} 
            className='project-card__end-date'
          >
            <AddButton />
          </Link>
        </span>
      }
    </>
  )
}


export default ProjectDate

