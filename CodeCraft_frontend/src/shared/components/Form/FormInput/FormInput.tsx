import { forwardRef, type InputHTMLAttributes } from "react"
import FormFieldError from "../FormFieldError/FormFieldError"


type FormInputProps = {
  id: string
  label?: string
  error?: string
} & InputHTMLAttributes<HTMLInputElement>

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({ id, label, type, error, ...props }, ref) => {

  return (
    <div className='input-field-column'>
      {
        label &&
        <label htmlFor={id}>
          {label}
        </label>
      }
      
      <input 
        type={type}
        id={id}
        ref={ref} 
        aria-invalid={!!error}
        aria-describedby={error ? error : undefined}
        {...props}
      />
      {
        error && (
        <FormFieldError 
          message={error}
        />
        )
      }
    </div>
  )
})

export default FormInput