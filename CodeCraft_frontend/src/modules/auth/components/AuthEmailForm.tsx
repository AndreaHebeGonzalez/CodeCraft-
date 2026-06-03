import useAppStore from "@/shared/stores/useAppStore"
import type { AsyncFeedbackContextType } from "@/shared/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useOutletContext } from "react-router-dom"
import { EmailFormSchema } from "../schemas"
import { useMutation } from "@tanstack/react-query"
import { FormInput } from "@/shared/components/form"
import Button from "@/shared/components/buttons/button/Button"
import { useEffect } from "react"
import type { AppError } from "@/shared/error/AppError"
import successSend from "@/assets/animations/SuccessSend.json"
import type { EmailFormData } from "../types"

const defaultValues = () => {
  return ({
    email: '',
  })
}

type AuthEmailFormProps = {
  mutationFn: (data: EmailFormData) => Promise<string>
  submitText: string
  redirectTo: string
}

const AuthEmailForm = ({ mutationFn, submitText, redirectTo } : AuthEmailFormProps) => {

  const { openErrorBanner, closeErrorBanner, showErrorBanner } = useAppStore()

  const { setFeedback } = useOutletContext<AsyncFeedbackContextType>()

  const { watch, register, handleSubmit, formState: { errors, isValid }, setError} = useForm({
    resolver: zodResolver(EmailFormSchema),
    defaultValues: defaultValues(),
    mode: "onChange"
  })

  const email = watch('email')

  const { mutate } = useMutation({

    mutationFn: mutationFn,
    onMutate: () => {
      setFeedback(prev => ({
        ...prev,
        activeOverlay: true,
        isLoading: true,
        lottieAnimation: successSend,
        animationVariantStyles: 'static'
      }))
    },
    onError: (error: AppError) => {
      setFeedback(prev=>({
        ...prev,
        activeOverlay: false, 
        isLoading: false
      }))

      if(error.status === 400 && Array.isArray(error.details)) {
        if(error.details.length > 0) {
          error.details.forEach(err => {
            console.log(err)
            setError(err.path, {
              message: err.msg
            })
          })
        }
      } else if(error.status === 404) {
        openErrorBanner(error.userMessage ?? "Ocurrió un error inesperado")
      } else {
        openErrorBanner(error.userMessage ?? "Ocurrió un error inesperado")
      }

      
    }, 
    onSuccess: (message) => {
      console.log(message)
      setFeedback(prev=>({
        ...prev,
        isLoading: false,
        isSuccess: true,
        redirectTo: redirectTo,
        message
      }))
    }
  })

  useEffect(() => {
    if(showErrorBanner) {
      closeErrorBanner()
    }
  }, [email])

  const onSubmit = (formData : EmailFormData) => {
    mutate(formData)    
  }

  return (
    <div className="auth-forms">
      <form onSubmit={handleSubmit(onSubmit)} className="auth-forms__form"  noValidate>
        <FormInput 
          id='email'
          label='Email'
          type="email"
          error={errors.email?.message}
            {...register('email')}
        />

        <Button 
          text={submitText}
          type="submit"
          variant="outline"
          disabled={!isValid || showErrorBanner}
        />
      </form>
      <div className="auth-view__call-to-actions auth-view__call-to-actions--flex-right">
        <p className="auth-view__text auth-view__text--small">
          ¿Ya tienes cuenta?
          {' '}
          <Link to={'/auth/login'} className="auth-view__text auth-view__text--small auth-view__text--accent">Iniciar sesión</Link>
        </p>
        <p className="auth-view__text">
          ¿No tienes cuenta?
          {' '}
          <Link to={'/auth/register'} className="auth-view__text auth-view__text--small auth-view__text--accent">Regístrate</Link>
        </p>
      </div>
    </div>
  )
}

export default AuthEmailForm