import { forwardRef, type TextareaHTMLAttributes } from "react"
import FormFieldError from "../form-field-error/FormFieldError"

type FormTextareaProps = {
  id: string
  label: string,
  error: string | undefined
} & TextareaHTMLAttributes<HTMLTextAreaElement>

const FormTextArea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(({id, label, error, ...props}, ref) => {
  return (
    <div className='textarea-field-column'>
      <label htmlFor={id}>
        {label}
      </label>
      <textarea 
        id={id}
        ref={ref}
        {...props}
      ></textarea>
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

export default FormTextArea  