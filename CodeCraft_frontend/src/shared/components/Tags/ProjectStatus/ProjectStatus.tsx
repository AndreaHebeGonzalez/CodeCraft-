import './ProjectStatus.scss'

type ProjectStatusProps = {
  text: 'No iniciado' | 'En curso' | 'En riesgo' | 'Completado'
  variant: 'notStarted' | 'inProgress' | 'atRisk' | 'completed'
}

const ProjectStatus = ({ text, variant } : ProjectStatusProps) => {



  return (
    <div className={`project-status project-status--${variant}`}>
      <div></div>
      {text}
    </div>
  )
}

export default ProjectStatus