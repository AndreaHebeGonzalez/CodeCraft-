import LoginForm from "../components/LoginForm"
import { AuthFormLayout } from "../layout/auth-form-layout/AuthFormLayout"


const Login = () => {

  return (
    <AuthFormLayout
      ctaText= '¿No tienes cuenta?'
      ctaLinkText='Regístrate.'
      ctaTo='/auth/register'
    >
      <LoginForm />
    </AuthFormLayout>
  )
}

export default Login
