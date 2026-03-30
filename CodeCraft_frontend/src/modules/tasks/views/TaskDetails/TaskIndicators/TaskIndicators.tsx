import { StatusSelector } from '@/modules/tasks/components/TaskSelectors/StatusSelector'
import { PrioritySelector } from '@/modules/tasks/components/TaskSelectors/PrioritySelector'
import type { Task } from '@/modules/tasks/types'
import TaskStatus from '@/shared/components/Tags/TaskStatus/TaskStatus'
import TaskPriority from '@/shared/components/Tags/TaskPriority/TaskPriority'
import { Line } from '@/assets/icon'
import useOpenElement from '@/shared/hooks/useOpenElement'
import './TaskIndicators.scss'
import useClickOutside from '@/shared/hooks/useClickOutside'
import useAnchoredMenuPosition from '@/shared/hooks/useAnchoredMenuPosition'
import useAppStore from '@/shared/stores/useAppStore'

type TaskIndicatorsProps = {
  task: Task
  onSave: (field: string, value: string) => void
}

const TaskIndicators = ({ task, onSave } : TaskIndicatorsProps) => {

  const { isMobile } = useAppStore()

  const { anchorRef: iconStatusRef, menuRef: selectorStatusRef } = useAnchoredMenuPosition() 
  const { anchorRef: iconPriorityRef, menuRef: selectorPriorityRef } = useAnchoredMenuPosition() 

  const { isOpen: isOpenSelectorStatus, handleOpenElement : openSelectorStatus, closeElement: closeSelectorStatus  } = useOpenElement()
  const { isOpen: isOpenSelectorPriority, handleOpenElement : openSelectorPriority, closeElement: closeSelectorPriority } = useOpenElement()

  useClickOutside([selectorStatusRef, iconStatusRef], closeSelectorStatus, true)
  useClickOutside([selectorPriorityRef, iconPriorityRef], closeSelectorPriority, true)
  
  return (
    <div className='task-indicators'>
      <div className='task-indicators__wrapper'>
        <div className='task-indicators__indicator'>
          <span className='task-indicators__item'>Estado:</span>
          <div ref={iconStatusRef}>
            <TaskStatus 
              onlyIcon={false}
              variant={task.status}
              onClick={openSelectorStatus}
            />
          </div>
          
          {
            isOpenSelectorStatus &&
            <div className='task-indicators__selector-wrapper' ref={selectorStatusRef}>
              <StatusSelector
                value={task.status} 
                handleOpenSelectorStatus={openSelectorStatus}
                onSave={onSave}
                
              />
            </div>
          }
        </div>
        {
          isMobile &&

          <div className='task-indicators__line'>
            <Line 
              width={15}
              height={15}
            />
          </div>
        }
        
        <div className='task-indicators__indicator'>
          <span className='task-indicators__item'>Prioridad:</span>
          <div ref={iconPriorityRef}>
            <TaskPriority 
              onlyIcon={false}
              variant={task.priority}
              onClick={openSelectorPriority}
            />
          </div>
          
          {
            isOpenSelectorPriority &&
            <div className='task-indicators__selector-wrapper' ref={selectorPriorityRef}>
              <PrioritySelector 
                value={task.priority}
                handleOpenSelectorPriority={openSelectorPriority}
                onSave={onSave}
              />
            </div>
          }
          
        </div>
      </div>
    </div>
    
  )
}

export default TaskIndicators