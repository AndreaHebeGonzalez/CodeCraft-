import { dateAtEndOfDay, dateAtStartOfDay, formatDateShortMonth } from "@/shared/utils/dateUtils"
import { useEffect, useRef, useState } from "react"
import type { DateRange } from "react-day-picker"

type FormattedRange = {
  from: string,
  to: string,
}

export function useCalendarField(startDate: Date | undefined, dueDate: Date | undefined, buttonVariant: 'inline' | 'split' = 'inline') {

   //Mantener la fecha seleccionada en un estado
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>(undefined)

  //Para forms sin RHF
  const [rangeDate, setRangeDate] = useState<DateRange | undefined>(undefined)

  //Mantener el valor de entrada en un estado para button inline
  const [inputValue, setInputValue] = useState('')

  //Mantener el valor de entrada en un estado para button split
  const [formattedRange, setFormattedRange] = useState<FormattedRange>({
      from: '',
      to: '',
  })

  const [startDateInputValue, setStartDateInputValue] = useState('')

  const [dueDateInputValue, setDueDateInputValue] = useState('')

  

  const [isStartDateFocused, setIsStartDateFocused] = useState(false)

  const [isDueDateFocused, setIsDueDateFocused] = useState(false)

  //Activa rango en calendario
  const [useRange, setUseRange] = useState(false)

  //Flag que evita re-inicializaciones después de la primera
  const [initialized, setInitialized] = useState(false)

  const startDateInputRef = useRef<HTMLInputElement | null>(null)
  const dueDateInputRef = useRef<HTMLInputElement | null>(null)


  /* Effecto que se ejecuta al cargar los valores que vienen de la BD */
  useEffect(() => {
    
    if (startDate === undefined && dueDate === undefined) {
      resetRange()
      return
    }

    if(initialized) return


    /* Setea los valores de arranque para mostrar en DayPicker */
    setSelectedDate(getSelectedDateRange(startDate, dueDate))
    setRangeDate(getFormDateRange(startDate, dueDate))

    setInputValue(getInputValue(startDate, dueDate))
    
    setStartDateInputValue(formatDateForInput(startDate))
    setDueDateInputValue(formatDateForInput(dueDate))

    if(startDate && dueDate) {
      setUseRange(true)
    } 
  
    setInitialized(true)

  }, [startDate, dueDate])

  useEffect(() => {
    if (buttonVariant === 'inline') {
      setInputValue(getInputValue(startDate, dueDate))
      
    } else if(buttonVariant === 'split') {
      setFormattedRange({
        from: formatDateForInput(startDate),
        to: formatDateForInput(dueDate)
      })
    }
  }, [startDate, dueDate])
  

  /* Se obtene el valor para selectedDate */
  function getSelectedDateRange(startDate: Date | undefined, dueDate: Date | undefined) :  DateRange  | undefined {
    if(!dueDate && !startDate) return undefined
    if(!startDate && dueDate) {
      return ({
        from: dueDate,
        to: dueDate
      })
    } else if(startDate && !dueDate) {
      return ({
        from: startDate,
        to: startDate
      })
    } else {
      return ({
        from: startDate,
        to: dueDate
      })
    }
  }

  function getFormDateRange(startDate: Date | undefined, dueDate: Date | undefined) :  DateRange  | undefined {
    if(!dueDate && !startDate) {
      return ({
        from: undefined,
        to: undefined
      })
    }
    if(!startDate && dueDate) {
      return ({
        from: undefined,
        to: dueDate
      })
    } else if(startDate && !dueDate) {
      return ({
        from: startDate,
        to: undefined
      })
    } else {
      return ({
        from: startDate,
        to: dueDate
      })
    }
  }

  
  /* Se obtiene el valor a mostrar en el campo de texto del boton --> puede generarse al final */
  function getInputValue(startDate: Date | undefined, dueDate: Date | undefined) : string {
    if(!dueDate && !startDate) return ''
    if(!startDate && dueDate) {
      return formatDateShortMonth(dueDate.toISOString())

    } else if(startDate && !dueDate) {
      return formatDateShortMonth(startDate.toISOString())

    } else if(startDate && dueDate) {
      return `${formatDateShortMonth(startDate.toISOString())} al ${formatDateShortMonth(dueDate.toISOString())}`

    } else return ''
  }

  function formatDateForInput(date: Date | undefined) : string {
    if(!date) return ''
    return `${formatDateShortMonth(date.toISOString())}`
  }

  function resetRange() {
    setStartDateInputValue('')
    setDueDateInputValue('')
    setSelectedDate({
      from: undefined,
      to: undefined
    })
    setRangeDate({
      from: undefined,
      to: undefined
    })
  }

    function handleFocusStartDate () {
      if(isDueDateFocused) setIsDueDateFocused(false)
      setIsStartDateFocused(true)
    }

    function handleFocusDueDate () {
      if(isStartDateFocused) setIsStartDateFocused(false)
      setIsDueDateFocused(true)
    }

    function clearSelectedFrom () {
      setUseRange(true)
      if(!rangeDate?.from) return 
      if(!rangeDate?.to) {
        setSelectedDate(undefined)
        setRangeDate({
          from: undefined,
          to: undefined
        })
        setStartDateInputValue('')
        return
      }
      dueDateInputRef.current?.focus()
      setSelectedDate({
        from: rangeDate?.to,
        to: rangeDate?.to
      })
      setRangeDate({
        from: undefined,
        to: dateAtEndOfDay(rangeDate?.to)
      })
      setStartDateInputValue('')
    }

    function clearSelectedTo () {
      setUseRange(false)
      if(!rangeDate?.to) return
      if(!rangeDate.from) {
        setSelectedDate(undefined)
        setRangeDate({
          from: undefined,
          to: undefined
        })
        setDueDateInputValue('')
        return
      }

      setSelectedDate({
        from: rangeDate?.from,
        to: rangeDate?.from
      })
      setRangeDate({
        from: rangeDate?.from,
        to: undefined
      })
      setDueDateInputValue('')
      dueDateInputRef.current?.focus()
    }

    /* Se ejecuta cada vez que el usuario selecciona una fecha */
  function onSelect (range: DateRange | undefined) {
    if(!range) {
      return
    } else if(range.to && range.from) {
      let adjustRange = {
        from: range.from,
        to: range.to
      }
      
      if(isStartDateFocused) {
        setUseRange(true)
        
        if(selectedDate?.from && selectedDate?.from > range.from) {
          setSelectedDate({
            from: range.from,
            to: range.from
          })
          setStartDateInputValue(formatDateShortMonth(adjustRange.from.toISOString()))
          setRangeDate({
            from: dateAtStartOfDay(range.from),
            to: undefined
          })

        } else if(selectedDate?.from && selectedDate.from < range.to) {
          setSelectedDate({
            from: range.to,
            to: range.to
          }) 
          setStartDateInputValue(formatDateShortMonth(range.to.toISOString()))
          setRangeDate({
            from: dateAtStartOfDay(range.to),
            to: undefined
          })
        } else if(selectedDate?.from === undefined) {
          setSelectedDate({
            from: range.from,
            to: range.from
          })
          setStartDateInputValue(formatDateShortMonth(adjustRange.from.toISOString()))
          setRangeDate({
            from: dateAtStartOfDay(range.from),
            to: undefined
          })
        }
        setDueDateInputValue('')
        dueDateInputRef.current?.focus()
        return
      } else if (isDueDateFocused) {
        if(rangeDate?.from === undefined) {
          setUseRange(false)
          if(selectedDate?.to && range.to > selectedDate?.to) {
            adjustRange = {
              from: dateAtEndOfDay(range.to),
              to: dateAtEndOfDay(range.to)
            } 
          } else if(selectedDate?.to && range.from < selectedDate?.to) {
            adjustRange = {
              from: dateAtEndOfDay(range.from),
              to: dateAtEndOfDay(range.from)
            }
          } else if(selectedDate === undefined) {
            adjustRange = {
              from: dateAtEndOfDay(range.to),
              to: dateAtEndOfDay(range.to)
            }
          }
          setSelectedDate(adjustRange)
          setRangeDate({from: undefined, to: adjustRange?.to})
          setDueDateInputValue(formatDateShortMonth(adjustRange.to.toISOString()))

        } else {
          setUseRange(true)
          setSelectedDate(adjustRange)
          setRangeDate({
            from: dateAtStartOfDay(adjustRange.from),
            to: dateAtEndOfDay(adjustRange.to)
          })
          setStartDateInputValue(formatDateShortMonth(adjustRange.from.toISOString()))
          setDueDateInputValue(formatDateShortMonth(adjustRange.to.toISOString()))
        }
      }
    }
  }


  return {
    selectedDate,
    inputValue,
    setInputValue,
    formattedRange, 
    setFormattedRange,
    onSelect,
    rangeDate,
    startDateInputValue,
    dueDateInputValue,
    startDateInputRef,
    dueDateInputRef,
    isStartDateFocused,
    isDueDateFocused,
    handleFocusStartDate,
    handleFocusDueDate,
    clearSelectedFrom,
    clearSelectedTo,

  }
}


/* import { dateAtEndOfDay, dateAtStartOfDay, formatDateShortMonth } from "@/shared/utils/dateUtils"
import { useEffect, useState } from "react"
import type { DateRange } from "react-day-picker"

export function useCalendarField(startDate: Date | undefined, dueDate: Date | undefined, openCalendar: boolean, startDateFocused: boolean, dueDateFocused: boolean ) {


  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>(undefined)


  const [rangeDate, setRangeDate] = useState<DateRange | undefined>(undefined)


  const [inputValue, setInputValue] = useState('')

  const [startDateInputValue, setStartDateInputValue] = useState('')

  const [dueDateInputValue, setDueDateInputValue] = useState('')


  const [useRange, setUseRange] = useState(false)


  const [initialized, setInitialized] = useState(false)


  useEffect(() => {
    
    if (startDate === undefined && dueDate === undefined) {
      resetRange()
      return
    }

    if(initialized) return

    setSelectedDate(getRange(startDate, dueDate))
    setInputValue(getInputValue(startDate, dueDate))
    

    if(startDate && dueDate) {
      setUseRange(true)
    } 
  
    setInitialized(true)

  }, [startDate, dueDate])
  

  useEffect(() => {
    if(!openCalendar) return
    if(!selectedDate) return

    //Debe ejecutar con inicializado true
    if(selectedDate.from && selectedDate.to) {
      const inputValue = useRange ? `${formatDateShortMonth(selectedDate.from.toISOString())} ${'  '} al ${'  '} ${formatDateShortMonth(selectedDate.to.toISOString())}`: formatDateShortMonth(selectedDate.to.toISOString())
      setInputValue(inputValue)
  
      if(!useRange) {
        setSelectedDate({
          from: dateAtEndOfDay(selectedDate.to),
          to: dateAtEndOfDay(selectedDate.to)
        })
        setRangeDate({
          from: undefined,
          to: dateAtEndOfDay(selectedDate.to)
        })
      } else if(useRange) {
        setSelectedDate({
          from: dateAtStartOfDay(selectedDate.to),
          to: selectedDate.to
        })
        setRangeDate({
          from: dateAtStartOfDay(selectedDate.to),
          to: dateAtEndOfDay(selectedDate.to)
        })
      }
    }
  }, [useRange])

  
  function getRange(startDate: Date | undefined, dueDate: Date | undefined) :  DateRange  | undefined {
    if(!dueDate && !startDate) return undefined
    if(!startDate && dueDate) {
      return ({
        from: dueDate,
        to: dueDate
      })
    } else {
        return ({
          from: startDate,
          to: dueDate
        })
    }
  }
  
  
  function getInputValue(startDate: Date | undefined, dueDate: Date | undefined) : string {
    if(!dueDate && !startDate) return ''
    if(!startDate && dueDate) {
      return formatDateShortMonth(dueDate.toISOString())
    } else if(startDate && dueDate) {
      return `${formatDateShortMonth(startDate.toISOString())} al ${formatDateShortMonth(dueDate.toISOString())}`
    } else return ''
  }

  function getInputStartDate(startDate: Date | undefined) : string {
    if(!startDate) return ''
    return `${formatDateShortMonth(startDate.toISOString())}`
  }

  function getInputDueDate(dueDate: Date | undefined) : string {
    if(!dueDate) return ''
    return `${formatDateShortMonth(dueDate.toISOString())}`
  }

  function resetRange() {
    setInputValue('')
    setStartDateInputValue('')
    setDueDateInputValue('')
    setSelectedDate(undefined)
    setRangeDate({
      from: undefined,
      to: undefined
    })
  }


  function onSelect (range: DateRange | undefined) {
    console.log(range)
    if(!range) {
      resetRange()

    } else if(range.to && range.from) {
        let adjustRange = {
          from: range.from,
          to: range.to
        }

        if(startDateFocused) {
          
        }

        if(!useRange) {
          if(selectedDate?.to && range.to > selectedDate?.to) {
              adjustRange = {
              from: dateAtEndOfDay(range.to),
              to: dateAtEndOfDay(range.to)
            } 

          } else if(selectedDate?.to && range.from < selectedDate?.to) {
            adjustRange = {
              from: dateAtEndOfDay(range.from),
              to: dateAtEndOfDay(range.from)
            }
          } else if(selectedDate === undefined) {
            adjustRange = {
              from: dateAtEndOfDay(range.to),
              to: dateAtEndOfDay(range.to)
            }
          }
        } else {
          adjustRange = {
            from: range.from,
            to: dateAtEndOfDay(range.to)
          }

          
        }
        setSelectedDate(adjustRange)

        const inputValue = useRange ? 
          `${formatDateShortMonth(adjustRange.from.toISOString())} ${' '} al ${' '} ${formatDateShortMonth(adjustRange.to.toISOString())}`
          : 
          formatDateShortMonth(adjustRange.to.toISOString())
        setInputValue(inputValue)

        const fieldsValues = useRange ? {from: adjustRange?.from, to: adjustRange?.to} : { from: undefined, to: adjustRange?.to}

        setRangeDate(fieldsValues)
    }
  }

  return {
    getRange,
    getInputValue,
    selectedDate,
    setSelectedDate,
    inputValue,
    setInputValue,
    useRange,
    setUseRange,
    initialized,
    setInitialized,
    onSelect,
    rangeDate,
    getInputStartDate,
    getInputDueDate,
    startDateInputValue,
    dueDateInputValue
  }
}
 */

/* 

function onSelect (range: DateRange | undefined) {
    console.log(range)
    if(!range) {
      resetRange()

    } else if(range.to && range.from) {
        let adjustRange = {
          from: range.from,
          to: range.to
        }

        if(!useRange) {
          if(selectedDate?.to && range.to > selectedDate?.to) {
              adjustRange = {
              from: dateAtEndOfDay(range.to),
              to: dateAtEndOfDay(range.to)
            } 

          } else if(selectedDate?.to && range.from < selectedDate?.to) {
            adjustRange = {
              from: dateAtEndOfDay(range.from),
              to: dateAtEndOfDay(range.from)
            }
          } else if(selectedDate === undefined) {
            adjustRange = {
              from: dateAtEndOfDay(range.to),
              to: dateAtEndOfDay(range.to)
            }
          }
        } else {
          adjustRange = {
            from: range.from,
            to: dateAtEndOfDay(range.to)
          }

          
        }
        setSelectedDate(adjustRange)

        const inputValue = useRange ? 
          `${formatDateShortMonth(adjustRange.from.toISOString())} ${' '} al ${' '} ${formatDateShortMonth(adjustRange.to.toISOString())}`
          : 
          formatDateShortMonth(adjustRange.to.toISOString())
        setInputValue(inputValue)

        const fieldsValues = useRange ? {from: adjustRange?.from, to: adjustRange?.to} : { from: undefined, to: adjustRange?.to}

        setRangeDate(fieldsValues)
    }
  }

*/