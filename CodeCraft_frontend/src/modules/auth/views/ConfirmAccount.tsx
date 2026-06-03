import VerifyCode from "../components/verify-code/VerifyCode"
import AccountActionLayout from "../layout/account-action-layout/AccountActionLayout"
import { confirmAccount } from "../services"


const ConfirmAccount = () => {

  return (
    <AccountActionLayout 
      title= 'Confirma tu cuenta'
      text= 'Ingresa el codigo que recibiste'
      accentText='por email'
    >
      <VerifyCode 
        mutationFn={confirmAccount}
        successRedirectTo=""
        resendCodeRedirectTo="/auth/request-code"
        lottieAnimation={null}
        successMessage="¡Bienvenido a CodeCraft!"
      />
    </AccountActionLayout>
  )
}

export default ConfirmAccount


