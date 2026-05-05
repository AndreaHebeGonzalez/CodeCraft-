import type { Task } from '@/modules/tasks/types'
import DateSelector from '@/shared/components/date-selector/DateSelector'
import { formatDate } from '@/shared/utils/dateUtils'
import './TaskDates.scss'

type TaskDatesProps = {
  task: Task
  onSave: (field: string, value: string | {
    from?: Date | undefined;
    to?: Date | undefined;
  }) => void
}

const TaskDates = ({ task, onSave } : TaskDatesProps) => {

  const rangeDate = {
    from: formatDate(task.startDate),
    to: formatDate(task.dueDate)
  } 


  return (
    <div className='task-dates'>
      <div className='task-dates__box'>
        <p className='task-dates__text'>
          Fecha de entrega: 
        </p>
        <DateSelector 
          rangeDates={rangeDate}
          field='rangeDate'
          onSave={onSave}
        />
      </div>
      {
        <div className='task-dates__last-updated-box'>
          <p className='task-dates__text'>
            Última actualización: 
          </p>
          <p className='task-dates__last-updated'>
            21 de noviembre
          </p>
        </div>
      }
    </div>
  )
}

export default TaskDates