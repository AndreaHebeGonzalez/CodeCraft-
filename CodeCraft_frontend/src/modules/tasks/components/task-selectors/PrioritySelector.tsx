import { priorityTranslations } from '@/shared/locales/es'
import TaskPriority from '@/shared/components/tags/task-priority/TaskPriority'
import './TaskSelectors.scss'


type PrioritySelectorProps = {
  value: keyof typeof priorityTranslations
  handleOpenSelectorPriority:  () => void
  onSave: (field: string, value: string) => void
}

export const PrioritySelector = ({ value, handleOpenSelectorPriority, onSave } : PrioritySelectorProps) => {
  
  const handleClick = (value : keyof typeof priorityTranslations) => {
    onSave('priority', value)
    handleOpenSelectorPriority()
  }

  return (
    <div className='task-selector'>
      <span className='task-selector__priority-label'>Seleccione una prioridad: </span>
      {
        (Object.keys(priorityTranslations) as Array<keyof typeof priorityTranslations>).map(v =>
          <div onClick={() => handleClick(v)} className= 'task-selector__item task-selector__item--priority'>
            <TaskPriority 
              onlyIcon={false}
              variant={v}
              isSelected = {v === value}
            />

          </div>
        )
      }
    </div>
  )
}
