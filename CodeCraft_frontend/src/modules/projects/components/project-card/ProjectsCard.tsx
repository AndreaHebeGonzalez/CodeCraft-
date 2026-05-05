import { useRef } from 'react'
import type { Project } from '../../types'
import ProjectStatus from '@/shared/components/tags/project-status/ProjectStatus'
import ProjectActionsMenu from '../project-actions-menu/ProjectActionsMenu'
import useOpenElement from '@/shared/hooks/useOpenElement'
import useClickOutside from '@/shared/hooks/useClickOutside'
import { MoreOptions } from '@/assets/icon'
import ProjectDate from '../project-date/ProjectDate'
import './ProjectsCard.scss'
import { useNavigate } from 'react-router-dom'


type ProjectsCardProps = {
  project: Project
}

const ProjectsCard = ({ project } : ProjectsCardProps) => {

  const navigate = useNavigate()

  const { isOpen, handleOpenElement, closeElement } = useOpenElement()
  
  const firstRef = useRef<HTMLDivElement | null>(null)
  const secondRef = useRef<HTMLUListElement | null>(null)

  useClickOutside([firstRef, secondRef], closeElement, true)

  const handleNavigate = () => {
    navigate(`/projects/${project._id}/summary`)
  }

  return (
    <div className='project-card' onClick={handleNavigate}>
      <div className='project-card__left' onClick={e=>e.stopPropagation()}>
        <h3 className='project-card__name'>{project.projectName}</h3>
        <div className='project-card__date-coll'>
          <ProjectDate 
            project={project}
          />
        </div>
      </div>
      <div className='project-card__right'>
        <div 
          className='project-card__options' 
          ref={firstRef} 
          onClick={(e) => { 
            e.stopPropagation()
            handleOpenElement()
          }}
        > 
          <MoreOptions
            width={18}
            height={5}
          />
        </div>
      </div>
      <div 
        className='project-card__status' 
        onClick={e=>e.stopPropagation()}
      >
        <ProjectStatus 
          text='No iniciado'
          variant='notStarted'
        />
      </div>

      <ProjectActionsMenu 
        project={project}
        isOpen = {isOpen}
        ref={secondRef}
      />
    </div>
  )
}

export default ProjectsCard
