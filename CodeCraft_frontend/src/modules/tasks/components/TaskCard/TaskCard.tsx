import { useRef, type RefObject } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useLocation } from "react-router-dom"
import { easeOut, motion } from "framer-motion"
import Avatar from "@/shared/components/Avatar/Avatar"
import { CalendarIcon, MoreOptions, TreeRounded } from "@/assets/icon"
import useOpenElement from "@/shared/hooks/useOpenElement"
import useClickOutside from "@/shared/hooks/useClickOutside"
import TaskActionsMenu from "../TaskActionsMenu/TaskActionsMenu"
import type {  TaskNode } from "@/modules/tasks/types"
import { formatDateShortMonth } from "@/shared/utils/dateUtils"

import SubtaskIndicators from "../SubtaskIndicators/SubtaskIndicators"

import { updateTaskField } from "@/modules/tasks/services"
import './TaskCard.scss'

const variantIconMore = {
  initial: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      type: "tween" as const,
      duration: 0.1,
      ease: easeOut
    }
  }
}

type TaskCardProps = {
  task: TaskNode,
  onOpenSubtasks:() => void
  lastChildRef?:  RefObject<HTMLDivElement | null> | null
  isSubtask: boolean
}

const TaskCard = ({ task, onOpenSubtasks, isSubtask } : TaskCardProps) => {

  const navigate = useNavigate()
  const location = useLocation()

  const { isOpen, handleOpenElement, closeElement } = useOpenElement()

  const optionRef = useRef<HTMLDivElement | null>(null)
  const actionMenuRef = useRef<HTMLUListElement | null>(null)

  useClickOutside([optionRef, actionMenuRef], closeElement, true)

  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: updateTaskField,
    onError: (error) => {
      console.error(error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['task', task._id]})
      queryClient.invalidateQueries({queryKey: ['tasks', task.project]})
    }
  })

  const openModal = () => {
    navigate(`${location.pathname}?modalType=task&taskId=${task._id}`)
  }

  const onSave = (field: string, value: string | {
      from?: Date | undefined;
      to?: Date | undefined;
    }) => {
    const data = {
      projectId: task.project,
      taskId: task._id,
      field,
      value
    }
    mutate(data)
  }

  return (   
    <motion.div 
      className='task-card' 
      onClick={openModal}
      initial='initial'
      whileHover='visible'
      animate={isOpen ? "visible" : "initial"}
    >
      <div className="task-card__header">
        
        <h4 className="task-card__title">{task.taskName}</h4>
        
        <div 
          className='task-card__options' 
          ref={optionRef}
          onClick={(e) => {
            e.stopPropagation()
            handleOpenElement()
          }}
        >   
          <motion.div 
            className="task-card__options-icon"
            variants={variantIconMore}
          >
            <MoreOptions
              width={15}
              height={5}
            />
          </motion.div>
        </div>
      </div>

      

      <div className='task-card__collaborators'>
        <Avatar 
          text='AG'
          variant='#0000ff'
        />
        <Avatar 
          text='BV'
          variant='#04BC41'
        />
        <Avatar 
          text='RM'
          variant='#85bc04ff'
        />
      </div>
        
      <div className= 'task-card__footer'>
        
        <div 
          className="task-card__subtasks" 
          onClick={(e) => {
              e.stopPropagation()
              onOpenSubtasks()
            }}
        >
          <TreeRounded
            className="task-card__icon-md"
          />
          <p className="task-card__subtasks-number">
            {
              task.children.length
            }
          </p>
        </div>

        <div className="task-card__date-select">
          <CalendarIcon 
            className="task-card__icon-md task-card__icon-md--color-muted"
          />
          {
            task.dueDate &&
            <p className="task-card__due-date">
              {formatDateShortMonth(task.dueDate.toISOString())} 
            </p> 
          }
        </div>

        {
          !isSubtask &&
          <div className="task-card__indicators task-card__indicators--relative" onClick={e=> e.stopPropagation()}>
            <SubtaskIndicators 
              task={task}
              onSave={onSave}
              isSubtask={isSubtask}
            />
          </div> 
        }
      </div>
      {
        isSubtask &&
        <div className="task-card__indicators" onClick={e=> e.stopPropagation()}>
          <SubtaskIndicators 
            task={task}
            onSave={onSave}
            isSubtask={isSubtask}
          />
        </div> 
      }
      <TaskActionsMenu 
        task={task}
        isOpen = {isOpen}
        ref={actionMenuRef}
      />


    </motion.div>  
  ) 
}

export default TaskCard