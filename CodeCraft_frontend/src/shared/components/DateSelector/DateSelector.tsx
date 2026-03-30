import { useEffect, useRef } from 'react'
import useOpenElement from '@/shared/hooks/useOpenElement'
import useClickOutside from '@/shared/hooks/useClickOutside'
import useCreateRef from '@/shared/hooks/useCreateRef'
import { Calendar } from '../Form'
import { useCalendarField } from '@/shared/hooks/useCalendarField'
import { CalendarAdd, Cancel } from '@/assets/icon'
import './DateSelector.scss'


type DateSelectorProps = {
  rangeDates: {
    from?: Date | undefined,
    to?: Date | undefined,
  }
  field: string
  onSave: (field: string, value: string | {
    from?: Date | undefined,
    to?: Date | undefined,
  }) => void
  buttonVariant?: 'inline' | 'split'
  variant?: 'light' | 'dark'
}

const DateSelector = ({ rangeDates, field, onSave, variant = 'dark', buttonVariant = 'inline' } : DateSelectorProps) => {

  const {isOpen : openCalendar, handleOpenElement : handleOpenCalendar, closeElement: handleCloseCalendar} = useOpenElement()

  const { 
    calendarRef,
    buttonRef
  } = useCreateRef()

  useClickOutside([calendarRef, buttonRef] , handleCloseCalendar, true)

  const { selectedDate, inputValue, formattedRange, onSelect, rangeDate, startDateInputValue, dueDateInputValue,startDateInputRef, dueDateInputRef, handleFocusStartDate, handleFocusDueDate, clearSelectedFrom, clearSelectedTo } =  useCalendarField(rangeDates?.from, rangeDates?.to, buttonVariant)

  // Guardamos la última selección que el usuario hizo
  const lastSelected = useRef<{
    from?: Date | undefined;
    to?: Date | undefined;
  }>(rangeDate)

  // Cada vez que el usuario selecciona algo, lo guardamos en el ref
  useEffect(() => {
    lastSelected.current = rangeDate;
  }, [rangeDate])
  

  // GUARDADO AUTOMÁTICO CUANDO SE CIERRA EL CALENDARIO
  useEffect(() => {
    if (!openCalendar) {
      // Solo guardamos si realmente había algo seleccionado
      if (lastSelected.current) {
        onSave(field, lastSelected.current);
      }

    } else {
      dueDateInputRef.current?.focus()
    }
  }, [openCalendar])


  function handleDeleteDate() {
    onSave('rangeDate', {
      from: undefined,
      to: undefined
    })
  }


  return (
    <div className='date-selector'>
      
      <div className= {`date-selector__button-trigger date-selector__button-trigger--${variant}`}  ref={buttonRef} onClick={handleOpenCalendar}>

      {/* INLINE */}
      {
        buttonVariant === 'inline' &&

        <button className= 'date-selector__button'>
          <span className={`date-selector__label ${!inputValue ? 'date-selector__label--muted' : ''}`}>
            {
              inputValue || 'Agregar fecha'
            }
          </span>
        </button> 
      }
      {/* SPLIT */}
      {
        buttonVariant === 'split' &&

        <div className={`date-selector__button date-selector__button--${buttonVariant}`}>

          <div className='date-selector__segment'>
            <CalendarAdd
              className='date-selector__icon-sm date-selector__icon-sm--color-muted'
            />
            {
              <span className={`date-selector__label ${!formattedRange.from ? 'date-selector__label--muted' : ''}`}>
                {formattedRange.from || 'Inicio'}
              </span> 
            }
          </div>

          <span className="date-selector__separator">-</span>
          
          <div className='date-selector__segment'>
            <CalendarAdd
              className='date-selector__icon-sm date-selector__icon-sm--color-muted'
            />

            <span className={`date-selector__label ${!formattedRange.to ? 'date-selector__label--muted' : ''}`}>
              {formattedRange.to || 'Entrega'}
            </span> 
          </div>
        </div>
      }
        
        <button 
          aria-label="Clear date"
          className="date-selector__clear"
          onClick={(e) => {
          e.stopPropagation()
          handleDeleteDate()
        }}>
          <Cancel 
            className='date-selector__icon-sm'
            width={16}
            height={16}
          />
        </button>
      </div>
        
      {
        openCalendar && 
        <div className='date-selector__calendar' ref={calendarRef}>
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
    </div>
  )
}

export default DateSelector

