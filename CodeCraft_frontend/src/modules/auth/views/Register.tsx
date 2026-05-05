import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { RegisterFormData, AuthViewConfig } from "../types"
import { RegisterFormSchema} from "../schemas"
import { FormInput } from "@/shared/components/form"
import Button from "@/shared/components/buttons/button/Button"
import { checkEmailExist, createAccount } from "../services"
import { useMutation } from "@tanstack/react-query"
import useAppStore from "@/shared/stores/useAppStore"
import type { AppError } from "@/shared/error/AppError"
import { useEffect, useState } from "react"
import './FormStyles.scss'

export const registerConfig : AuthViewConfig = {
  mode: "register",
  cta: {
    text: "¿Ya tienes cuenta?",
    to: '/auth/login',
    linkText: 'Iniciar sesión.'
  },
}

const defaultValues = () => {
  return ({
    name: '',
    email: '',
    password: '',
    repeatPassword: ''
  })
}

const Register = () => {

  const { openErrorBanner, closeErrorBanner, showErrorBanner } = useAppStore()

  const [checkingEmail, setCheckingEmail] = useState(false)

  const { register, handleSubmit, trigger, setError, clearErrors, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: defaultValues(),
    mode: "onChange"
  })

  const { mutate } = useMutation({
    mutationFn: createAccount,
    onError: (error : AppError ) => {
      if(error.status === 400 && Array.isArray(error.details)) {
        error.details.map(error=>{
          setError(error.path, {
            message: error.msg
          })
        }) 
      }
      openErrorBanner(error.userMessage ?? "Ocurrió un error inesperado")
    }, 
    onSuccess: (message) => {
      console.log(message)
    }
  })

  const onSubmit = (formData : RegisterFormData) => {
    mutate(formData)
  }

  useEffect(() => {
    if(showErrorBanner && isValid) {
      closeErrorBanner()
    }
  }, [isValid])
  
  
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
                  setCheckingEmail(false)
                } else if (exist === undefined) {
                  setError("email", {
                    message: "No fue posible validar el email"
                  })
                  setCheckingEmail(false)

                } else {
                  clearErrors("email")
                  setCheckingEmail(true)
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
            disabled={!isValid || !checkingEmail }
          />
        
      </form>
    </div>
  )
}

export default Register