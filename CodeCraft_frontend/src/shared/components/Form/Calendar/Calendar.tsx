import { useState } from 'react'
import { DayPicker, type DateRange } from 'react-day-picker'
import { CancelSmall, LeftArrow, RightArrow } from '@/assets/icon'
import './Calendar.scss'


type CalendarProps = {
  startDateInputRef: React.RefObject<HTMLInputElement | null>
  dueDateInputRef: React.RefObject<HTMLInputElement | null>
  clearSelectedFrom(): void 
  clearSelectedTo(): void
  startDateInputValue: string
  dueDateInputValue: string
  onSelect: (range: DateRange | undefined) => void
  selectedDate?: DateRange
  handleFocusStartDate(): void
  handleFocusDueDate(): void
}

const Calendar = ({ startDateInputRef, dueDateInputRef, clearSelectedFrom, clearSelectedTo, startDateInputValue, dueDateInputValue,  onSelect, selectedDate, handleFocusStartDate, handleFocusDueDate } : CalendarProps) => {

  const [isStartDateFocused, setIsStartDateFocused] = useState(false)
  const [isDueDateFocused, setIsDueDateFocused] = useState(false)


  function CustomChevron(props: any) {
    const { orientation, ...rest } = props

    if (orientation === 'left') {
      return <LeftArrow {...rest} />
    }

    return <RightArrow {...rest} />
  }


  return (
    <div className='calendar'>
      <div className='calendar__date-fields'>
        <div className={`calendar__date-field ${isStartDateFocused ? 'calendar__input-active':''}`} >
          <input 
            className='calendar__input'
            name='startDateInput'
            type="text" 
            ref={startDateInputRef}
            placeholder='Inicio'
            value={startDateInputValue} 
            onFocus={() => {
              handleFocusStartDate()
              setIsStartDateFocused(true)
            }}
            onBlur={() => setIsStartDateFocused(false)}
            readOnly
          />
          <div className='calendar__icon-wrapper'>
            <CancelSmall
              className='calendar__icon-md'
              onClick={clearSelectedFrom}
            />
          </div>
        </div>

        <div className={`calendar__date-field ${isDueDateFocused ? 'calendar__input-active':''}`} >
          <input 
            className='calendar__input'
            name='dueDateInput'
            type="text" 
            ref={dueDateInputRef}
            placeholder='Límite'
            value={dueDateInputValue} 
            onFocus={() => {
              handleFocusDueDate()
              setIsDueDateFocused(true)
            }}
            onBlur={() => setIsDueDateFocused(false)}
            readOnly
          />
          <div className='calendar__icon-wrapper'>
            <CancelSmall 
              className='calendar__icon-md'
              onClick={clearSelectedTo}
            />
          </div>
        </div>
      </div>

      <DayPicker
        mode="range"
        navLayout="around"
        onSelect={onSelect}
        selected={selectedDate}
        components={{
          Chevron: CustomChevron
        }}
      />
    </div>
  )
}

export default Calendar

