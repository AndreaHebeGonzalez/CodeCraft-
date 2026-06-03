import AccountActionLayout from "../layout/account-action-layout/AccountActionLayout"
import AuthEmailForm from "../components/AuthEmailForm"
import { requestConfirmationCode } from "../services"

const RequestNewCode = () => {
  
  

  return (
    <AccountActionLayout 
      title= 'Solicitar código de confirmación'
      text= 'Coloca tu email para recibir'
      accentText='un nuevo código'
    >
      <AuthEmailForm 
        mutationFn={requestConfirmationCode}
        submitText="Nuevo código"
        redirectTo="/auth/confirm-account"
      />
    </AccountActionLayout>
  )
}

export default RequestNewCode