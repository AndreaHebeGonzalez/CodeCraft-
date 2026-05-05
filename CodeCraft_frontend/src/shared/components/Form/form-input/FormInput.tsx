import { forwardRef, useState, type InputHTMLAttributes } from "react"
import FormFieldError from "../form-field-error/FormFieldError"
import './FormInput.scss'
import { Eye, EyeClosed } from "@/assets/icon"


type FormInputProps = {
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> 
  onIconClick?: () => void
  id: string
  label?: string
  error?: string
} & InputHTMLAttributes<HTMLInputElement>

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({Icon, onIconClick, id, label, type, error, ...props }, ref) => {

  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(prev=>!prev)
  }

  return (
    <div className='field-column'>
      {
        label &&
        <label htmlFor={id}>
          {label}
        </label>
      }
      <div className={"field-column__input-wrapper"}>
        <input 
          className={id.includes('password') ? 'field-column__input-width-icon':''}
          type={id.includes('password') ? showPassword ? 'text':'password': type}
          id={id}
          ref={ref} 
          aria-invalid={!!error}
          aria-describedby={error ? error : undefined}
          {...props}
        />
        {
          id.includes('password') && 
          <div className="field-column__icon-wrapper" onClick={togglePasswordVisibility}>
            {
              showPassword ? 
              <Eye 
                className="field-column__icon-md"
              /> :
              <EyeClosed 
                className="field-column__icon-md"
              />
            }
          </div>
          
        }
      </div>
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