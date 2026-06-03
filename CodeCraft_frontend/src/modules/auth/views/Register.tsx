import RegisterForm from "../components/RegisterForm"
import { AuthFormLayout } from "../layout/auth-form-layout/AuthFormLayout"


const Register = () => {

  return (
    <AuthFormLayout
      ctaText='¿Ya tienes cuenta?'
      ctaLinkText='Iniciar sesión.'
      ctaTo='/auth/login'
    >
      <RegisterForm />
    </AuthFormLayout>
  )
}

export default Register