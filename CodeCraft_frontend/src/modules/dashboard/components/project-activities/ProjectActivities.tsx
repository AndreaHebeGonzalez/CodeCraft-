import ProjectName from '../../../../shared/components/tags/project-name/ProjectName'
import './ProjectActivities.scss'

type ProjectActivitiesProps = {
  projectName: string
  projectId: string
  activities: []
}

const ProjectActivities = ({ projectName, projectId, activities } : ProjectActivitiesProps) => {
  
  
  return (
    <div className='project-activities'>
      <ProjectName 
          text= {projectName}
          variant='#00ffff'
      />

      <ul className='project-activities__list'>
        <li className='project-activities__item'>
          <div className='history-section__text'>
            {/* name dev */}
            <span className='history-section__name-dev'>Andrea</span>
            <span>{' '}</span>
            {/* action */}
            <span className='history-section__action'>completó la tarea</span>
            <span>{' '}</span>
            {/* Name element */}
            <span className='history-section__name-element'>"Mejora el módulo de autenticación"</span>
          </div>
            {/* Time */}
          <span className='history-section__time'>hace 1 hora</span>
        </li>

        <li className='project-activities__item'>
          <div className='history-section__text'>
            {/* name dev */}
            <span className='history-section__name-dev'>Andrea</span>
            <span>{' '}</span>
            {/* action */}
            <span className='history-section__action'>completó la tarea</span>
            <span>{' '}</span>
            {/* Name element */}
            <span className='history-section__name-element'>"Mejora el módulo de autenticación"</span>
          </div>
            {/* Time */}
          <span className='history-section__time'>hace 1 hora</span>
        </li>
        
        <li className='project-activities__item'>
          <div className='history-section__text'>
            {/* name dev */}
            <span className='history-section__name-dev'>Andrea</span>
            <span>{' '}</span>
            {/* action */}
            <span className='history-section__action'>completó la tarea</span>
            <span>{' '}</span>
            {/* Name element */}
            <span className='history-section__name-element'>"Mejora el módulo de autenticación"</span>
          </div>
            {/* Time */}
          <span className='history-section__time'>hace 1 hora</span>
        </li>
      </ul>
    </div>
  )
}

export default ProjectActivities