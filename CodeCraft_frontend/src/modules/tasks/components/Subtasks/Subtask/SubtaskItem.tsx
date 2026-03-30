import { useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Link } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Check, Close } from "@/assets/icon"
import type { SubtaskType } from "../../../types"
import { deleteTask, updateTaskField } from "../../../services"
import { TruncatedTextTooltip } from "@/shared/components/Tooltips/TruncatedTextTooltip/TruncatedTextTooltip"
import StatusBanner from "@/shared/components/StatusBanner/StatusBanner"

import './SubtaskItem.scss'


type SubtaskItemProps = {
  subtask: SubtaskType,
  projectId: string,
  taskId: string
}

const SubtaskItem = ({ subtask, projectId, taskId } : SubtaskItemProps) => {
  const queryClient = useQueryClient()

  const [showTooltip, setShowTooltip] = useState(false)
  const [isTextTruncated, setIsTextTruncated] = useState(false)
  const [showStatusBanner, setShowStatusBanner] = useState(false)

  const itemRef = useRef<HTMLSpanElement | null>(null)



  const isCompleted = subtask.status === 'completed'
  
  useLayoutEffect(() => {
    const el = itemRef.current
    if(!el) return

    setIsTextTruncated(el.scrollWidth > el.clientWidth)
    
  }, [subtask._id])
  

  /* Actualiza el status de la task */
  const { mutate } = useMutation({
    mutationFn: updateTaskField,
    onMutate: async (vars) => {
      const { taskId: subtaskId, value } = vars

      await queryClient.cancelQueries({ queryKey: ['task', taskId] })
      await queryClient.cancelQueries({ queryKey: ['tasks', projectId] })

      const previousTask = queryClient.getQueryData<any>(['task', taskId])
      const previousTasks = queryClient.getQueryData<any[]>(['tasks', projectId])
  
      queryClient.setQueryData(['task', taskId], (old: any) => {
        if (!old) return old

        return {
          ...old,
          subtasks: old.subtasks.map((t: any) =>
            t._id === subtaskId
              ? { ...t, status: value }
              : t
          )
        }
      })

      queryClient.setQueryData(['tasks', projectId], (old: any[]) =>
        old?.map(task =>
          task._id === subtaskId
            ? { ...task, status: value }
            : task
        )
      )

      // Contexto para rollback
      return { previousTask, previousTasks }
    },

    onError: (error, _vars, context) => {
      // Rollback completo
      if (context?.previousTask) {
        queryClient.setQueryData(['task', taskId], context.previousTask)
      }
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', projectId], context.previousTasks)
      }
      //Manejar el error correctamente
      console.log(error) 
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      setShowStatusBanner(true)
    }
  })

  const { mutate: deleteSubtask } = useMutation({
    mutationFn: deleteTask,
    onError: (err) => {
      console.log(err)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
    }
  })

  function updateSubtaskStatus() {
    const data = {
      projectId,
      taskId: subtask._id,
      field: 'status',
      value: isCompleted ? 'pending' : 'completed'
    }
    mutate(data)
  }

  function onClose() {
    setShowStatusBanner(false)
  }

  return (
    <li className='subtask'>
      {
        isCompleted &&
        createPortal(
          <StatusBanner 
            targetRef={itemRef}
            showStatusBanner={showStatusBanner}
            onClose= {onClose}
          >
            {'Completada'}
          </StatusBanner>,
          document.body
        )
      }
      <input 
        type="checkbox" 
        className='subtask__checkbox'
        checked={isCompleted}
        onChange={updateSubtaskStatus}
      />
      <div className='subtask__checkbox-mark'>
        <Check 
          className='subtask__checkbox-mark-icon-md'
        />
      </div>
      <div className="subtask__name-actions">
        <Link 
          to={location.pathname + `?modalType=task&taskId=${subtask._id}`} 
          className="subtask__name"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        > 
          <span 
            ref={itemRef}
          >
            {subtask.taskName}
          </span>
        </Link>
        {
          showTooltip && itemRef && isTextTruncated &&
          createPortal(
            <TruncatedTextTooltip targetRef={itemRef}>
              {subtask.taskName}
            </TruncatedTextTooltip>
          , document.body)
        }
        
        <div 
          className="subtask__delete"
          onClick={() => deleteSubtask({projectId, taskId: subtask._id})}
        >
          <Close 
            className="subtask__icon-xs"
          />
          <div className="subtask__hover"/> 
        </div>
      </div>
    </li>
  )
}

export default SubtaskItem