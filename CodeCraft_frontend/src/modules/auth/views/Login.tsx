import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginFormSchema } from "../schemas"
import type { AuthViewConfig, LoginFormData } from "../types"
import Button from "@/shared/components/Buttons/Button/Button"
import { FormInput } from "@/shared/components/Form"
import './FormStyles.scss'

export const loginConfig : AuthViewConfig = {
  mode: "login",
  cta: {
    text: "¿No tienes cuenta?",
    to: '/auth/register',
    linkText: 'Regístrate.'
  }
}

const defaultValues = () => ({
  email: '',
  password: ''
})

const Login = () => {

  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: defaultValues(),
    mode: "onChange"
  })

  const onSubmit = (formData : LoginFormData) => {
    console.log(formData)
  }

  return (
    <div className="auth-forms">
      <h2 className="auth-forms__title">¡Te damos la bienvenida de nuevo!</h2>
      {/* <p className="auth-forms__text">Llena el formulario para <span className="auth-forms__text auth-forms__text--accent">crear tu cuenta.</span></p> */}

      <form onSubmit={handleSubmit(onSubmit)} className="auth-forms__form">
        
        <FormInput 
          id='email'
          label='Email'
          type="email"
          error={errors.email?.message}
            {...register('email')}
        />

        <FormInput 
          id='password'
          label='Contraseña'
          /* placeholder="Nombre completo" */
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />

          <Button 
            text="Crear cuenta"
            type="submit"
            variant="outline"
            disabled={!isValid}
          />
        
      </form>
      <p className="auth-forms__text auth-forms__text--cta">
        ¿Olvidaste tu contraseña?
        {' '}
        <Link to='#' className="auth-forms__text auth-forms__text--cta auth-forms__text--accent">Reestablecer</Link>
        
      </p>
    </div>
  )
}

export default Login