import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { LoginFormData } from "../types"
import { LoginFormSchema } from "../schemas"
import Button from "@/shared/components/buttons/button/Button"
import { FormFieldError, FormInput } from "@/shared/components/form"
import { authenticateUser } from "../services"
import type { AppError } from "@/shared/error/AppError"
import type { AsyncFeedbackContextType } from "@/shared/types"
import successAnimation from "@/assets/animations/greenCheckmark.json"
import useAppStore from "@/shared/stores/useAppStore"


const defaultValues = () => ({
  email: '',
  password: ''
})

const LoginForm = () => {

  const navigate = useNavigate()
  const location = useLocation()

  const title = location.state?.title


  const { setFeedback } = useOutletContext<AsyncFeedbackContextType>()
  const { openErrorBanner, closeErrorBanner, showErrorBanner } = useAppStore()

  const [inputError, setInputError] = useState<string | undefined>(undefined)
  const [inputErrorMsg, setInputErrorMsg] = useState('')


  const { register, handleSubmit, setError, formState: { errors, isValid }, watch } = useForm({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: defaultValues(),
    mode: "onChange"
  })

  const email = watch('email')
  const password = watch('password')

  const { mutate } = useMutation({
    mutationFn: authenticateUser,
    onMutate: () => {
      setFeedback(prev => ({
        ...prev,
        activeOverlay: true,
        isLoading: true,
        lottieAnimation: successAnimation,
        animationVariantStyles: 'static'
      }))
    },
    onError: (error : AppError) => {
      setFeedback(prev=>({
        ...prev,
        activeOverlay: false, 
        isLoading: false
      }))

      if(error.status === 400 && Array.isArray(error.details)) {
        if(error.details.length > 0) {
          error.details.forEach(err => {
            setError(err.path, {
              message: err.msg
            })
          })
        }
      } else if(error.status === 401) {
        setInputErrorMsg(error.userMessage || 'Email o contraseña incorrectos')
        setInputError('error')
      } else if(error.status === 403) {
        openErrorBanner(error.userMessage || 'Necesitas confirmar la cuenta, hemos enviado un e-mail de confirmación')
        setTimeout(() => {
          navigate("/auth/confirm-account")
        }, 2000);
      } else {
        openErrorBanner(error.userMessage || "Ocurrió un error inesperado")
      }
      
    },
    onSuccess: () => {
      
      setFeedback(prev=>({
        ...prev,
        isLoading: false,
        isSuccess: true,
        redirectTo: "/",
        message: "Iniciando sesión..."
      }))
      
    }
  })

  useEffect(() => {
    if(inputError) {
      setInputError(undefined)
      setInputErrorMsg('')
    }
    if(showErrorBanner) {
      closeErrorBanner()
    }
  }, [email, password])


  const onSubmit = (formData : LoginFormData) => {
    mutate(formData)
  }

  return (
    <div className="auth-forms">
      <h2 className="auth-forms__title">{title ? title : "¡Te damos la bienvenida de nuevo!"}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="auth-forms__form">
        
        <FormInput 
          inputVariant={inputError}
          id='email'
          label='Email'
          type="email"
          error={errors.email?.message}
            {...register('email')}
        />

        <FormInput 
          inputVariant={inputError}
          id='password'
          label='Contraseña'
          /* placeholder="Nombre completo" */
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />

        {
          inputErrorMsg && (
          <FormFieldError 
            message={inputErrorMsg}
          />
          )
        }
        <Button 
          text="Iniciar sesión"
          type="submit"
          variant="outline"
          disabled={!isValid}
        />
      </form>

      <p className="auth-forms__text auth-forms__text--cta">
        ¿Olvidaste tu contraseña?
        {' '}
        <Link to='/auth/forgot-password' className="auth-forms__text auth-forms__text--cta auth-forms__text--accent">Reestablecer</Link>
      </p>
    </div>
  )
}

export default LoginForm