import { useEffect, useRef, useState } from "react"
import type { TokenFormData } from "../../types"
import { useMutation } from "@tanstack/react-query"
import useAppStore from "@/shared/stores/useAppStore"
import type { AppError } from "@/shared/error/AppError"
import { Link, useOutletContext } from "react-router-dom"
import type { AsyncFeedbackContextType, AsyncFeedbackState } from "@/shared/types"
import './verify-code.scss'

const CODE_LENGTH = 6

type VeryfyCodeProp = {
  mutationFn: (data: TokenFormData) => Promise<string>
  successRedirectTo?: string,
  resendCodeRedirectTo: string
  saveToken?: React.Dispatch<React.SetStateAction<string>>
  setIsValidToken?: React.Dispatch<React.SetStateAction<boolean>>
  lottieAnimation: AsyncFeedbackState['lottieAnimation']
  successMessage?: string
} 

const VerifyCode = ( { mutationFn, successRedirectTo, resendCodeRedirectTo, saveToken, setIsValidToken, lottieAnimation, successMessage } : VeryfyCodeProp  ) => {

  const { openErrorBanner, showErrorBanner, closeErrorBanner } = useAppStore()
  const { setFeedback } = useOutletContext<AsyncFeedbackContextType>()

  /* Se usan referencias porque se accede a cada input a través de estas */
  const [token, setToken] = useState<TokenFormData['token']>('')

  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const { mutate, isPending } = useMutation({
    mutationFn: mutationFn,
    onMutate: () => {
      setFeedback(prev => ({
        ...prev,
        activeOverlay: true, 
        isLoading: isPending,
        lottieAnimation,
        showRedirectCountdown: false,
        animationVariantStyles: "fixed"
      }))
    },
    onError: (error : AppError) => {
      openErrorBanner(error.userMessage || 'Ocurrio un error inesperado')
      setFeedback(prev=>({
        ...prev,
        activeOverlay: false, 
        isLoading: false
      }))
    },

    onSuccess: (message) => {
      setFeedback(prev => ({
        ...prev,
        lottieAnimation: lottieAnimation || null,
        isLoading: false,
        isSuccess: true,
        redirectTo: successRedirectTo || '',
        message: successMessage ?`${successMessage}. ${message}` : message
      }))

      setTimeout(() => {
        if(saveToken) saveToken(token)
        if(setIsValidToken) setIsValidToken(true)
      }, 1500);
    }
  })

  useEffect(() => {
    if(token.length === CODE_LENGTH) {
      handleComplete()
    }
    if(token.length < CODE_LENGTH && showErrorBanner) {
      closeErrorBanner()
    }
  }, [token])

  function getDigit (index: number) {
    return token[index] || ''
  }

  /* Se carga el nuevo digito ingresado en el input con onChange en code y se hace focus en el siguiente input  */
  function updateDigit (value: string, index: number) {
    const sanitizen = value.replace(/\D/g, "")

    if(!sanitizen) return
    
    const newCode = token.split("")

    newCode[index] = sanitizen[0]

    const finalCode = newCode.join("").slice(0, CODE_LENGTH)
    

    setToken(finalCode)

    if(index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown (e : React.KeyboardEvent<HTMLInputElement>, index: number) {
    if(e.key === "Backspace") {
      e.preventDefault()

      const newCode = token.split('')

      if(newCode[index]) {
        newCode[index] = ''
        const finalCode = newCode.join('')
        setToken(finalCode)
        return
      }

      if(index > 0) {
        inputRefs.current[index - 1]?.focus()
        newCode[index - 1] = ""
        setToken(newCode.join(""))
      }
    } 

    if(e.key === 'ArrowLeft') {
      inputRefs.current[index - 1]?.focus()
    }

    if(e.key === 'ArrowRight') {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handlePaste (e : React.ClipboardEvent<HTMLInputElement>)  {
    console.log('se intento pegar')
    e.preventDefault

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH)

    console.log(pasted)
    
    if(!pasted) return

    setToken(pasted)

    const focusIndex = Math.min(pasted.length - 1, CODE_LENGTH - 1)

    inputRefs.current[focusIndex]?.focus()
  }

  function handleComplete ()  {
    const formData : TokenFormData = {
      token
    }
    mutate(formData)
  }

  return (
    <div className="verify-code">
      <p className="account-action-layout__text">
        Código de 6 dígitos
      </p>

      <div className="verify-code__content">
        { 
          Array.from({ length: CODE_LENGTH }).map((_, index)=>(
            <input 
              className="verify-code__input"
              key={index}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              ref={(ele)=>{
                inputRefs.current[index] = ele
              }}
              value={getDigit(index)}
              onChange={(e) => {
                updateDigit(e.target.value, index)
              }}
              onKeyDown={(e)=>{
                handleKeyDown(e, index)
              }}
              onPaste={handlePaste}
            />
          ))
        }
      </div>

      <Link to={resendCodeRedirectTo} className="auth-view__text">Solicitar un nuevo código</Link>
    </div>
  )
}

export default VerifyCode