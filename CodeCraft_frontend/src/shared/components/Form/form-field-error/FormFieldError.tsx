import './FormFieldError.scss'

type FormFieldErrorProps = {
  message: string
}

const FormFieldError = ( { message } : FormFieldErrorProps ) => {
  return (
    <div className="input-error">
      <p className='input-error__message'>{message}</p>
    </div>
  )
}

export default FormFieldError