import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { CalendarIcon, Add, Teams } from '@/assets/icon'
import { useCalendarField } from '@/shared/hooks/useCalendarField'
import useClickOutside from '@/shared/hooks/useClickOutside'
import AddCollaborator from '@/shared/components/AddCollaborator/AddCollaborator'
import Avatar from '@/shared/components/Avatar/Avatar'
import Button from '@/shared/components/Buttons/Button/Button'
import useCreateRef from '@/shared/hooks/useCreateRef'
import { Calendar } from '@/shared/components/Form'
import useOpenElement from '@/shared/hooks/useOpenElement'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask } from '../../services'
import { cleanFormData, normalizeTaskFormData } from '@/shared/utils/utils'
import SubtaskItem from './Subtask/SubtaskItem'
import type { SubtaskType, TaskFormData } from '../../types'
import './Subtasks.scss'

type SubtasksProps = {
  projectId: string,
  taskId: string,
  subtasks: SubtaskType[]
}

const initialValue = () : TaskFormData => ({
  taskName: '',
  rangeDates: {
    from: undefined,
    to: undefined,
  }
})

const Subtasks = ({ projectId, taskId, subtasks } : SubtasksProps ) => {

  const [subtask, setSubtask] = useState<TaskFormData>(initialValue())

  const elementIconRef = useRef(null)
  const containerRef = useRef(null)

  const {isOpen : openCalendar, handleOpenElement : handleOpenCalendar, closeElement: handleCloseCalendar} = useOpenElement()
  const {isOpen : openAddCollaborator, handleOpenElement : handleOpenAddCollaborator, closeElement: handleCloseAddCollaborator} = useOpenElement()

  const { calendarRef, iconRef } = useCreateRef() 

  const { selectedDate, inputValue, onSelect, rangeDate, startDateInputValue, dueDateInputValue,startDateInputRef, dueDateInputRef, handleFocusStartDate, handleFocusDueDate, clearSelectedFrom, clearSelectedTo } =  useCalendarField(subtask.rangeDates?.from, subtask.rangeDates?.to)
  

  useClickOutside([calendarRef, iconRef] , handleCloseCalendar, true)
  useClickOutside([containerRef, elementIconRef] , handleCloseAddCollaborator, true)

  const queryClient = useQueryClient()
  
  const { mutate }  = useMutation({
    mutationFn: createTask,
    onError: (error) => {
      console.log(error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['task', taskId]})
      queryClient.invalidateQueries({queryKey: ['tasks', projectId]})
    }
  })

  const lastSelected = useRef<{
    from?: Date | undefined;
    to?: Date | undefined;
  }>(rangeDate)

  useEffect(() => {
    lastSelected.current = rangeDate
  }, [rangeDate])
  
  useEffect(() => {
    if (!openCalendar) {
      if (lastSelected.current) {
        onSaveSubtask('rangeDates', lastSelected.current)
      }
    } else {
      dueDateInputRef.current?.focus()
    }
  }, [openCalendar])

  function isInputChangeEvent( value: unknown): value is ChangeEvent<HTMLInputElement> {
    return (
      typeof value === 'object' &&
      value !== null &&
      'target' in value &&
      (value as any).target instanceof HTMLInputElement
    )
  }

  function onSaveSubtask( field: string,
    value: ChangeEvent<HTMLInputElement> | { from?: Date; to?: Date }
  ) {
    if (isInputChangeEvent(value)) {
      setSubtask(prev => ({
        ...prev,
        [field]: value.target.value
      }))
    } else {
      setSubtask(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  function handleCreateSubtask(e : React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const taskFormData = normalizeTaskFormData(cleanFormData(subtask), taskId)

    const data = {
      taskFormData,
      projectId
    }
    mutate(data)
    setSubtask(initialValue())
  }

  return (
    <div className='subtasks'>
      <div className='subtasks__list-wrapper'>
        <ul className='subtasks__list'>
          {
            subtasks.map(subtask => (
              <SubtaskItem
                subtask={subtask}
                projectId={projectId}
                taskId={taskId}
              />
            ))
          }
        </ul>
      </div>
      
      <div className='subtasks__add-box'>
        <form className='subtasks__form' onSubmit={(e) => handleCreateSubtask(e)}>
          <div className='subtasks__input-add'>
            <input 
              className='subtasks__taskname'
              type="text" 
              name='taskName'
              value={subtask.taskName}
              onChange={e=> {
                onSaveSubtask(e.target.name, e)
              }}
              placeholder='Ingrese el nombre de la subtarea'
            />
            <div className='subtasks__add-actions'>
              <span className='subtasks__dueDate'>
                {
                  inputValue 
                }
              </span>

              <div ref={iconRef}>
                <CalendarIcon 
                  className='subtasks__icon-md'
                  onClick={handleOpenCalendar}
                />
              </div>

              <div ref={elementIconRef}>
                <Teams 
                  className='subtasks__icon-md'
                  onClick={handleOpenAddCollaborator}
                />
              </div>
            </div>
          </div>

          <div className='subtasks__footer'>
            <div className='subtasks__button-add'>
              <Button
                text='Agregar tarea'
                type='submit'
                variant='outline'
                Icon={Add}
              />
            </div>
            {
              <div className='subtasks__collaborators'>
                <Avatar 
                  text="RM"
                  variant='#044DBC'

                />
                <Avatar 
                  text="CG"
                  variant='#7cbc04ff'

                />
              </div>
            }
          </div>
          
          {
            openAddCollaborator &&
            <div ref={containerRef}>
              <AddCollaborator />
            </div>
          }

          {
            openCalendar && 
            <div className='subtasks__calendar' ref={calendarRef}>
              <Calendar
                startDateInputRef={startDateInputRef}
                dueDateInputRef={dueDateInputRef}
                clearSelectedFrom={clearSelectedFrom}
                clearSelectedTo={clearSelectedTo}
                onSelect={onSelect} /* Funcion que se ejecuta al seleccionar  */
                selectedDate={selectedDate} /* elemento seleccionado se muestra en el calendario */
                startDateInputValue={startDateInputValue}
                dueDateInputValue={dueDateInputValue}
                handleFocusStartDate={handleFocusStartDate}
                handleFocusDueDate={handleFocusDueDate}
              /> 
            </div>
          }
        </form>
      </div>
    </div>
  )
}

export default Subtasks
