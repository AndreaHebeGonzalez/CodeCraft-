import { statusTranslations, taskStatusDetail } from '@/shared/locales/es'
import TaskStatus from '@/shared/components/tags/task-status/TaskStatus'
import './TaskSelectors.scss'

type StatusSelectorProps = {
  value: keyof typeof statusTranslations
  handleOpenSelectorStatus:  () => void
  onSave: (field: string, value: string) => void
}

type StatusEntries = {
  [k in keyof typeof statusTranslations] : [k, typeof statusTranslations[k]]
}[keyof typeof statusTranslations][]



export const StatusSelector = ({value, handleOpenSelectorStatus, onSave } : StatusSelectorProps) => {

  const handleClick = (value : keyof typeof statusTranslations) => {
    onSave('status', value)
    handleOpenSelectorStatus()
  }

  return (
    <div className='task-selector'>
      {
        (Object.entries(statusTranslations) as StatusEntries).map(([key, _]) =>
          <div onClick={() => handleClick(key)} key={key} className='task-selector__item'>
            <span className='task-selector__label'>{`(${taskStatusDetail[key]})`}</span>
            <div className='task-selector__status'>
              <TaskStatus
                onlyIcon={false}
                variant={key}
                isSelected = {key === value}
              />
            </div>
          </div>
        )
      }
    </div>
  )
}
