import { type RefObject } from "react"
import { Controller, type Control } from "react-hook-form"
import CalendarField from "../CalendarField/CalendarField"
import type { ProjectFormData } from "@/modules/projects/types"
import FormFieldError from "../../../../../shared/components/Form/FormFieldError/FormFieldError"


type FormDateFieldProps = {
  openCalendar: boolean
  handleOpenCalendar: () => void
  calendarIconRef: RefObject<HTMLDivElement | null>
  calendarRef: RefObject<HTMLDivElement | null>
  inputRef: RefObject<HTMLInputElement | null>
  control: Control<ProjectFormData>
  errorStart: string | undefined
  errorDue: string | undefined
}

const FormDateField = ({ openCalendar, handleOpenCalendar, calendarIconRef, calendarRef, inputRef, control, errorStart, errorDue } : FormDateFieldProps) => {

  return (
    <div className='form-date__field'>
      <label>
        Fecha de entrega
      </label>
      <Controller
        name="startDate"
        control={control}
        render={({ field : startField }) => {
          return (
            <Controller 
              name="dueDate"
              control={control}
              render={({ field: dueField }) => 
                <CalendarField 
                  openCalendar={openCalendar}
                  handleOpenCalendar={handleOpenCalendar}
                  calendarIconRef={calendarIconRef}
                  calendarRef={calendarRef}
                  inputRef={inputRef}
                  startField={startField}
                  dueField={dueField}
                  errorStart={errorStart}
                  errorDue={errorDue}
              />
              }
              
            />
          )}}
      />
      {errorStart && <FormFieldError message={errorStart} />}
      {errorDue && <FormFieldError message={errorDue} />}

    </div>
  )
}


export default FormDateField