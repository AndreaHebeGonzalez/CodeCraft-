import AuthEmailForm from "../components/AuthEmailForm"
import AccountActionLayout from "../layout/account-action-layout/AccountActionLayout"
import { forgotPassword } from "../services"

const ForgotPassword = () => {
  return (
    <AccountActionLayout
      title= 'Reestablecer contraseña'
      text= 'Coloca tu email '
      accentText='y reestablece tu contraseña'
    >
      <AuthEmailForm 
        mutationFn={forgotPassword}
        submitText="Enviar instrucción"
        redirectTo="/auth/new-password"
      />
    </AccountActionLayout>
  )
}

export default ForgotPassword