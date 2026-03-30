import { useEffect, useState, type RefObject } from 'react'
import { type ControllerRenderProps, useFormContext, useWatch } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarIcon } from '@/assets/icon/index'
import Calendar  from '../../../../../shared/components/Form/Calendar/Calendar'
import type { ProjectFormData } from '@/modules/projects/types'
import DueStatusTag from '../../../../../shared/components/Tags/DueStatusTag/DueStatusTag'
import type { DueStatus } from '@/shared/types'
import { useCalendarField } from '@/shared/hooks/useCalendarField'
import './CalendarField.scss'
import { getDueStatus } from '@/shared/utils/dateUtils'


type CalendarFieldProp = {
  openCalendar: boolean
  handleOpenCalendar: () => void
  calendarIconRef: RefObject<HTMLDivElement | null>
  calendarRef: RefObject<HTMLDivElement | null>
  inputRef: RefObject<HTMLInputElement | null>
  errorStart?: string
  errorDue?: string
  startField: ControllerRenderProps<ProjectFormData, "startDate">
  dueField: ControllerRenderProps<ProjectFormData, "dueDate">
}

const CalendarField = ({ openCalendar, handleOpenCalendar, calendarRef, calendarIconRef, inputRef, errorStart, errorDue,  startField, dueField } : CalendarFieldProp) => {

  const { control } = useFormContext()

  const startDate = useWatch({
    control,
    name: "startDate"
  })

  const dueDate = useWatch({
    control,
    name: "dueDate"
  })


  const { selectedDate, inputValue, useRange, setUseRange, onSelect } = useCalendarField(startDate, dueDate, openCalendar, startField, dueField)

  const [dueProjectStatus, setDueProjectStatus] = useState<DueStatus | ''>('')

  useEffect(() => {
    setDueProjectStatus(getDueStatus(dueDate))
  }, [dueDate])
  

  return (
    <div className='calendar-input'>
      <div className='calendar-input__box'>
        <div className='calendar-input__box-left'>
          <div ref={calendarIconRef} className='calendar-input__icon-box'>
            <CalendarIcon 
              className={`calendar-input__icon-calendar ${errorDue || errorStart ? "calendar-icon-error":""}`}
              width={15}
              height={15}
              onClick={ e => { 
                e.stopPropagation()
                handleOpenCalendar() 
              }}
            />
          </div>
          <input 
            className={errorDue || errorStart ? 'dateError':''}
            type="text" 
            id='dateRange'
            name='dateRange'
            value={inputValue}
            ref={inputRef}
            onClick={handleOpenCalendar}
            readOnly
          />
        </div>
        {
          (dueProjectStatus === 'dueSoon' || dueProjectStatus === 'overdue') &&
          <DueStatusTag 
            variant= {dueProjectStatus}
          />
        }
      </div>
      <AnimatePresence> 
        {
          openCalendar && (
          <motion.div
            className='calendar-input__calendar'
            onClick={(e) => e.stopPropagation()} 
            initial= {{opacity: 0, y: -10}}
            animate= {{opacity: 1, y: 0}}
            exit= {{opacity: 0, y: -10}}
            transition={{duration: 0.2}}
            ref= {calendarRef}                                                    
          >
            <Calendar 
              onSelect={onSelect}
              selectedDate={selectedDate}
              useRange={useRange}
              setUseRange={setUseRange}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CalendarField

