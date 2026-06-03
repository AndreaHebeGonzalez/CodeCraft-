import { useState } from "react"
import VerifyCode from "../components/verify-code/VerifyCode"
import AccountActionLayout from "../layout/account-action-layout/AccountActionLayout"
import NewPasswordForm from "../components/NewPasswordForm"
import { validateCode } from "../services"



const NewPassword = () => {
  
  const [token, setToken] = useState('')
  const [isValidToken, setIsValidToken] = useState(false)

  console.log(isValidToken)
  return (
    
    <AccountActionLayout
      title= 'Reestablecer contraseña'
      text= {isValidToken ? 'Ingrese su nueva ' : 'Ingresa el código que recibiste '}
      accentText={isValidToken ? 'contraseña': 'por email'}
    >
      {
        isValidToken ?
        <NewPasswordForm 
          token={token}
        /> : 
        <VerifyCode 
          mutationFn={validateCode}
          successRedirectTo="/auth/new-password"
          resendCodeRedirectTo="/auth/forgot-password"
          saveToken={setToken}
          setIsValidToken={setIsValidToken}
          lottieAnimation = {null}
        /> 
      }
    </AccountActionLayout>
  )
}

export default NewPassword