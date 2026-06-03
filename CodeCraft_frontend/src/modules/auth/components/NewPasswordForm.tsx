
import { useOutletContext } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { FormInput } from "@/shared/components/form"
import { ForgotPasswordSchema } from "../schemas"
import Button from "@/shared/components/buttons/button/Button"
import type { ForgotPasswordFormData, TokenType } from "../types"
import useAppStore from "@/shared/stores/useAppStore"
import { useMutation } from "@tanstack/react-query"
import { sendNewPassword } from "../services"
import type { AppError } from "@/shared/error/AppError"
import type { AsyncFeedbackContextType } from "@/shared/types"

import successAnimation from "@/assets/animations/greenCheckmark.json"
import { useEffect } from "react"

const defaultValues = () => ({
  password: '',
  repeatPassword: ''
})

type NewPasswordFormProps = {
  token: TokenType['token']
}

const NewPasswordForm = ({ token } : NewPasswordFormProps) => {

  const { showErrorBanner, openErrorBanner, closeErrorBanner } = useAppStore()
  const { setFeedback } = useOutletContext<AsyncFeedbackContextType>()

  const { register, handleSubmit, setError, formState :  { errors, isValid }, watch } = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: defaultValues(),
    mode: "onChange"
  })

  const { mutate } = useMutation({
    mutationFn: sendNewPassword,
    onMutate: () => {
      setFeedback(prev => ({
        ...prev,
        activeOverlay: true,
        isLoading: true,
        lottieAnimation: successAnimation,
        animationVariantStyles: 'static'
      }))
    },
    onError : (error : AppError) => {
      setFeedback(prev=>({
        ...prev,
        activeOverlay: false, 
        isLoading: false
      }))
      if(error.status === 400 && Array.isArray(error.details)) {
        error.details.forEach(error=>{
          setError(error.path, {
            message: error.msg
          })
        }) 
      } else {
        openErrorBanner(error.userMessage || "Ocurrió un error inesperado")
      }
    },
    onSuccess: (message) => {
      setFeedback(prev=>({
        ...prev,
        isLoading: false,
        isSuccess: true,
        redirectTo: "/auth/login",
        message
      }))
    }
  })


  const password = watch('password')
  const repeatPassword = watch('repeatPassword')
  
  useEffect(() => {
    if(showErrorBanner) {
      closeErrorBanner()
    }
  }, [password, repeatPassword])
  

  const onSubmit = (formData: ForgotPasswordFormData) => {
    const data = {
      formData,
      token
    }
    mutate(data)
  }


  return (
    
    
      <form onSubmit={handleSubmit(onSubmit)} className="auth-forms__form" noValidate>
        <FormInput 
          id='password'
          label='Contraseña'
          /* placeholder="Nombre completo" */
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />
        <FormInput 
          id='repeat-password'
          label='Repite contraseña'
          /* placeholder="Nombre completo" */
          type="password"
          error={errors.repeatPassword?.message}
          {...register('repeatPassword')}
        />
        <Button 
          text="Crear cuenta"
          type="submit"
          variant="outline"
          disabled={!isValid || showErrorBanner }
        />
      </form>
    
  )
}

export default NewPasswordForm