import { type RefObject } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import useAppStore from '@/shared/stores/useAppStore'

import './taskActionsMenu.scss'
import type { Task } from '../../types'
import { deleteTask } from '../../services'
import { Delete, Edit } from '@/assets/icon'

type TaskActionsMenu = {
  isOpen: boolean,
  ref: RefObject<HTMLUListElement | null>
  task: Task
} 

const openVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit:{ opacity: 0 }
}


const TaskActionsMenu = ({ isOpen, ref, task } : TaskActionsMenu) => {

  const { openNotification } = useAppStore()

  const location = useLocation()

  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: deleteTask,
    onError: (error) => {
      openNotification(error.message || 'Error inesperado', true)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['tasks', task.projectId]})
      openNotification(data.message)
    }
  })

  return (
    <AnimatePresence>
        {
          isOpen &&      
          <motion.ul 
            className='task-actions'
            variants={openVariant}
            initial= "hidden"
            animate="visible"
            exit="exit"
            transition={{ ease: "linear", duration: 0.1 }}
            ref= {ref}
            onClick={e=>e.stopPropagation()}
          > 
            <li className='task-actions__item'>
              <Link className='task-actions__link'  to={location.pathname + `?modalType=task&taskId=${task._id}`}>
                <Edit 
                  width={15}
                  height={15}
                />
                <span> Cambiar Nombre</span>
              </Link>
            </li>

            <li className='task-actions__item task-actions__item--deleted' onClick={() => mutate({projectId: task.projectId, taskId: task._id})}>
              <Delete 
                width={15}
                height={15}
                className='task-actions__delete-icon'
              />
              <span>Eliminar</span>
            </li>
          </motion.ul>
        }
    </AnimatePresence>
  )
}

export default TaskActionsMenu
