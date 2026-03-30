import { type RefObject } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import type { ProjectData } from '../../types'
import useAppStore from '@/shared/stores/useAppStore'
import { deleteProject } from '../../services'
import './ProjectActionsMenu.scss'

type ProjectActionsMenu = {
  isOpen: boolean,
  ref: RefObject<HTMLUListElement | null>
  project: ProjectData
} 

const openVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit:{ opacity: 0 }
}


const ProjectActionsMenu = ({ isOpen, ref, project } : ProjectActionsMenu) => {

  const { openNotification } = useAppStore()

  const location = useLocation()

  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: deleteProject,
    onError: (error) => {
      openNotification(error.message || 'Error inesperado', true)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['projects']})
      queryClient.invalidateQueries({queryKey: ['project', project._id]})
      openNotification(data.message)
    }
  })

  return (
    <AnimatePresence>
        {
          isOpen &&      
          <motion.ul 
            className='project-actions'
            variants={openVariant}
            initial= "hidden"
            animate="visible"
            exit="exit"
            transition={{ ease: "linear", duration: 0.1 }}
            ref= {ref}
          > 
            <li className='project-actions__item'>
              <Link className='project-actions__link' to={`/projects/${project._id}/summary`}>
                Ver proyecto
              </Link>
            </li>
            
            <li className='project-actions__item'>
              <Link className='project-actions__link'  to={location.pathname + `?modalType=editProject&projectId=${project._id}`}  state={{ project: project }}>
                Editar proyecto
              </Link>
            </li>

            <li className='project-actions__item project-actions__item--deleted' onClick={() => mutate(project._id)}>
              Eliminar proyecto
            </li>
          </motion.ul>
        }
    </AnimatePresence>
    
  )
}

export default ProjectActionsMenu