import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { RegisterFormData, AuthViewConfig } from "../types"
import { RegisterFormSchema} from "../schemas"
import { FormInput } from "@/shared/components/Form"
import Button from "@/shared/components/Buttons/Button/Button"
import { checkEmailExist } from "../services"
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


  const { register, handleSubmit, trigger, setError, clearErrors, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: defaultValues(),
    mode: "onChange"
  })

  const onSubmit = (formData : RegisterFormData) => {
    console.log(formData)
  }
  
  return (
    <div className="auth-forms">
      <h2 className="auth-forms__title">Regístrate en segundos</h2>
      <p className="auth-forms__text">Llena el formulario para <span className="auth-forms__text auth-forms__text--accent">crear tu cuenta.</span></p>

      <form onSubmit={handleSubmit(onSubmit)} className="auth-forms__form">
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
              
              const isValid = await trigger("email") /* Ejecuta la validación de Zod SOLO para ese campo Devuelve true si es válido Devuelve false si falla */

              if (!isValid) return

              const exists = await checkEmailExist(email)

              if(exists) {
                setError("email", {
                  type: "manual",
                  message: "El email ya está registrado"
                })
              } else {
                clearErrors("email")
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
            disabled={!isValid}
          />
        
      </form>
    </div>
  )
}

export default Register