import { priorityTranslations } from '@/shared/locales/es'
import { CheckSmall, PriorityFlag } from '@/assets/icon'
import './TaskPriority.scss'

type TaskPriorityProps = {
  onlyIcon: boolean
  variant: keyof typeof priorityTranslations
  onClick?: () =>  void
  isSelected?: boolean
}


const TaskPriority = ({ variant, onClick, onlyIcon, isSelected } : TaskPriorityProps) => {
  return (
    <div className='task-priority' {...(onClick && { onClick })}>
      <div className='task-priority__wrapper'>
        <div className='task-priority__icon-wrapper'>
          <PriorityFlag 
            className={`task-priority__icon-md task-priority__icon-md--${variant}`}
          />
        </div>  
        {
          !onlyIcon &&
        
          <span className='task-priority__text'>
            {priorityTranslations[variant]}
          </span>
        } 
      </div>
      {
        isSelected && 
        <CheckSmall 
          className='task-priority__icon-lg'
        />
      }
    </div>
    
  )
}

export default TaskPriority


