import { statusTranslations } from '@/shared/locales/es'
import { CheckSmall, statusIconMap } from '@/assets/icon'
import './TaskStatus.scss'

type TaskStatusProps = {
  onlyIcon: boolean
  variant: keyof typeof statusTranslations
  onClick?: () =>  void
  isSelected?: boolean
}


const TaskStatus = ({ variant, onClick, onlyIcon, isSelected } : TaskStatusProps) => {

  const Icon = statusIconMap[variant]

  return (
    <div className= 'task-status' {...(onClick && { onClick })}>
      <div className= 'task-status__wrapper'>
        <div className={`task-status__icon-wrapper`}>
          {Icon && 
            <Icon 
              className={`task-status__icon-md task-status__icon-md--${variant}`}
            />
          }
        </div>
        {!onlyIcon && <span className='task-status__text'>{statusTranslations[variant]}</span>}
      </div>
      {
        isSelected &&
        <CheckSmall
          width={20}
          height={20}
        />
      }
    </div>
  )
}

export default TaskStatus


