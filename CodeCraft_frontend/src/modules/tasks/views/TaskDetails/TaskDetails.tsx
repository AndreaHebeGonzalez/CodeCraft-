import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Navigate, useParams } from 'react-router-dom'
import { getTaskById, updateTaskField } from '../../services'
import type { Project } from '@/modules/projects/types'
import { AddButton } from '@/shared/components/Buttons/AddButton/AddButton'
import Subtasks from '../../components/Subtasks/Subtasks'
import EditableField from '@/shared/components/Form/EditableField/EditableField'
import { CommentsSection } from '../../components/CommentsSection/CommentsSection'
import { HistorySection } from '@/shared/components/HistorySection/HistorySection'
import Avatar from '@/shared/components/Avatar/Avatar'
import TaskIndicators from './TaskIndicators/TaskIndicators'
import TaskDates from './TaskDates/TaskDates'
import TaskBreadcrumb from '../../components/TaskBreadcrumb/TaskBreadcrumb'
import './TaskDetails.scss'


type TaskDetailsProps = {
  taskId: string
}

const TaskDetails = ({ taskId } : TaskDetailsProps) => {

  const [editingTitle, setEditingTitle] = useState(false)

  const [newTitle, setNewTitle] = useState('')

  const { projectId } = useParams<{projectId: Project['_id']}>()

  if (!projectId) {
    // Esta vista no existe sin projectId, MANEJAR CON ERROR BOUNDARY
    throw new Error('Parámetro de ruta faltante: projectId. Esta vista depende de /projects/:projectId')
  }

  const [activeTab, setActiveTab] = useState<'comments' | 'history'>('comments')

  const queryClient = useQueryClient()
  
  const { data , isError, isLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTaskById(projectId!, taskId!),
    retry: 2
  })

  const { mutate } = useMutation({
    mutationFn: updateTaskField,

    onMutate: async (newData) => {
      const { taskId, field, value } = newData

      await queryClient.cancelQueries({queryKey: ['task', taskId]})

      const previousTask = queryClient.getQueryData(['task', taskId])

      queryClient.setQueryData(['task', taskId], (old : any) => {

        if (!old) return old

        if (field === 'rangeDate' && typeof value !== 'string') {

          return {
            ...old,
            startDate: value.from ?? null,
            dueDate: value.to ?? null
          }

          /* 
          onMutate →
            setQueryData →
              cambia cache →
                TaskDetails re-render →
                  TaskDates re-render →
                    DateSelector re-render →
                      useCalendarField se vuelve a ejecutar
          */

        }
      
        return {
          ...old,
          [field]: value
        }
      })

      return {
        previousTask
      }
    },
    onError: (error, variables, context) => {
      if(context?.previousTask) {
        queryClient.setQueryData(['task', variables.taskId], context.previousTask)
      }
      console.log(error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tasks', projectId]})
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({queryKey: ['task', variables.taskId]})
    }
  })


  const handleSetTitle = (value: string) => {
    setNewTitle(value)
  }
  
  const handleSetEditing = (value: boolean) => {
    setEditingTitle(value)
  }

  const onSave = (field: string, value: string | {
      from?: Date | undefined;
      to?: Date | undefined;
    }) => {
    const data = {
      projectId: projectId!,
      taskId: taskId!,
      field,
      value
    }
    mutate(data)
  }

  if(isLoading) return 'Cargando tarea ...'
  if(isError) return <Navigate to='/404' />

  
  if(data)
  return (
    <div className="task">
      <div className='task__meta'>
        <div className="task__meta-top">
          {
            data.task.parentTask !== null &&
            <TaskBreadcrumb 
              breadcrumbs={data.breadcrumbs}
            />
          }
          
          <TaskIndicators 
            task={data.task}
            onSave={onSave}
          />
        </div>
        
        {
          editingTitle ? 
          <EditableField 
            value={data.task.taskName}
            field='taskName'
            onSave={onSave}
            className='task__name'
            /* onFocus={() => console.log('se hizo focus')} */
            setEditing={handleSetEditing}
            setNewValue={handleSetTitle}
            
          /> : 
          <h1
            className="task__name"
            onClick={() => setEditingTitle(true)}
          >
            { newTitle || data.task.taskName }
          </h1>
        }
        
        <div className='task__description-box'>
          <EditableField 
            value={data.task.description || ''}
            field='description'
            onSave={onSave}
            placeholder='Agrega una descripcion'
            className= {'task__description'}
            shouldTruncateText={true}
            MAX_HEIGHT={110}
            /* onFocus={() => console.log("foco en el input")} */
          />
        </div>
        

        <TaskDates 
          task={data.task}
          onSave={onSave}
        />

      </div>

      <div className='task__assignees'>
        <h4 className='task__title'>Responsables:</h4>
        <div className='task__assignees-content'>
          <div className='task__assignees-wrapper'>
            <Avatar 
              nameDev='Bruno Vidales'
              text="BV"
              variant="#bbbb0fff"
              width="2.5rem"
              height="2.5rem"
            />
            <Avatar 
              nameDev='Bruno Vidales'
              text="BV"
              variant="#044DBC"
              width="2.5rem"
              height="2.5rem"
            />
            <Avatar 
              nameDev='Bruno Vidales'
              text="BV"
              variant="#044DBC"
              width="2.5rem"
              height="2.5rem"
            />
            <Avatar 
              nameDev='Bruno Vidales'
              text="BV"
              variant="#044DBC"
              width="2.5rem"
              height="2.5rem"
            />
            <Avatar 
              nameDev='Bruno Vidales'
              text="BV"
              variant="#044DBC"
              width="2.5rem"
              height="2.5rem"
            />
            <Avatar 
              nameDev='Bruno Vidales'
              text="BV"
              variant="#044DBC"
              width="2.5rem"
              height="2.5rem"
            />
            <Avatar 
              nameDev='Bruno Vidales'
              text="BV"
              variant="#044DBC"
              width="2.5rem"
              height="2.5rem"
            />
          </div>
          
          <div className='task__add-assignees'>
            <AddButton 
              text='Agregar responsable'
            />
          </div>
        </div>
      </div>
      
    {

      data.depth < 3 &&
        <div className='task__subtasks'>
          <h4 className='task__title'>Subtareas:</h4>
          <div className='task__content'>
            <Subtasks 
              projectId={projectId}
              taskId={taskId}
              subtasks={data.subtasks}
            />
          </div>
        </div>
      }
      <div className='task__footer-tabs'>
        <div className='task__tabs-header'>
          <button
            className={['task__tab-button', activeTab === 'comments' && 'button-active'].filter(Boolean).join(' ')}
            onClick={() => setActiveTab('comments')}
          >
            Comentarios
          </button>
          <button
            className={['task__tab-button', activeTab === 'history' && 'button-active'].filter(Boolean).join(' ')}
            onClick={() => setActiveTab('history')}
          >
            Historial de cambios
          </button>
        </div>
        <div className='task__tab-wrapper'>
          {activeTab === 'comments' && <CommentsSection />}
          {activeTab === 'history' && <HistorySection />}
        </div>
      </div>
    </div>
  )
}

export default TaskDetails 