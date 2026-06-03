import { useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { RegisterFormData } from "../types"
import type { AsyncFeedbackContextType } from "@/shared/types/index"
import { RegisterFormSchema} from "../schemas"
import { FormInput } from "@/shared/components/form"
import Button from "@/shared/components/buttons/button/Button"
import { checkEmailExist, createAccount } from "../services"
import { useMutation } from "@tanstack/react-query"
import useAppStore from "@/shared/stores/useAppStore"
import type { AppError } from "@/shared/error/AppError"
import successAnimation from "@/assets/animations/greenCheckmark.json"


const defaultValues = () => ({
    name: '',
    email: '',
    password: '',
    repeatPassword: ''
  })


const RegisterForm = () => {

  const { openErrorBanner, closeErrorBanner, showErrorBanner } = useAppStore()

  const { setFeedback } = useOutletContext<AsyncFeedbackContextType>()

  const [isEmailAvailable, setIsEmailAvailable] = useState(false)

  const { watch, register, handleSubmit, trigger, setError, clearErrors, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: defaultValues(),
    mode: "onChange"
  })

  const name = watch('name')
  const email = watch('email')
  const password = watch('password')

  const { mutate } = useMutation({
    mutationFn: createAccount,
    onMutate: () => {
      setFeedback(prev => ({
        ...prev,
        activeOverlay: true,
        isLoading: true,
        lottieAnimation: successAnimation,
        animationVariantStyles: 'static'
      }))
    },
    onError: (error : AppError ) => {
      
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
        redirectTo: "/auth/confirm-account",
        message
      }))
    }
  })

  useEffect(() => {
    if(showErrorBanner) {
      closeErrorBanner()
    }
  }, [name, email, password])
  
  const onSubmit = (formData : RegisterFormData) => {
    mutate(formData)
  }
  
  return (
    <div className="auth-forms">
      <h2 className="auth-forms__title">Regístrate en segundos</h2>
      <p className="auth-forms__text">Llena el formulario para <span className="auth-forms__text auth-forms__text--accent">crear tu cuenta.</span></p>

      <form onSubmit={handleSubmit(onSubmit)} className="auth-forms__form" noValidate>
        <FormInput 
          id='name'
          label='Nombre'
          placeholder="Nombre completo"
          type="text"
          error={errors.name?.message}
          {...register('name')}
        />
        <FormInput 
          id='email'
          label='Email'
          type="email"
          error={errors.email?.message}
            {...register('email', {
              onBlur: async (e) => {
                const email = e.target.value

                if(!email) return

                const isValid = await trigger("email")

                if(!isValid) return
                
                const exist = await checkEmailExist(email)

                if (exist) {
                  setError("email", {
                    message: "El email ya esta registrado"
                  })
                  setIsEmailAvailable(false)
                } else if (exist === undefined) {
                  setError("email", {
                    message: "No fue posible validar el email"
                  })
                  setIsEmailAvailable(false)

                } else {
                  clearErrors("email")
                  setIsEmailAvailable(true)
                }
              }
            })}
        />
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
          disabled={!isValid || !isEmailAvailable || showErrorBanner }
        />
      </form>
    </div>
  )
}

export default RegisterForm