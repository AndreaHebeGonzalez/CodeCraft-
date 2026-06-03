import Lottie from "lottie-react"
import { useNavigate } from "react-router-dom"
import './success-check.scss'
import type { AsyncFeedbackState } from "@/shared/types"
import { useEffect } from "react"
import { splitTextByPeriod } from "@/shared/utils/utils"
import RedirectCountdown from "../../redirect-countdown/RedirectCountdown"

type SuccessCheckProps = {
  lottieAnimation: AsyncFeedbackState['lottieAnimation']
  animationVariantStyles: AsyncFeedbackState['animationVariantStyles']
  showRedirectCountdown: boolean
  resetFeedback: ()=>void
  closeOverlay:()=>void
  redirecTo?: string
  message?: string
}

const SuccessCheck = ({ lottieAnimation, animationVariantStyles, showRedirectCountdown, resetFeedback, closeOverlay, redirecTo, message } : SuccessCheckProps) => {

  const navigate = useNavigate()

  const splitText = splitTextByPeriod(message || 'Aguarde unos momentos y será redirigido')

  useEffect(() => {
    if(lottieAnimation) return
    
    setTimeout(() => {
      onComplete()
    }, 1000)
  }, [])

  const onComplete = () => {
    setTimeout(() => {
      closeOverlay()
      if(redirecTo) {
        navigate(redirecTo)
      }
      setTimeout(() => {
        resetFeedback()
      }, 500)  
    }, 1000)
  }
  
  return (
    <div className="success-check">
      <div className="success-check__content">
        <div className={`success-check__animation success-check__animation--${animationVariantStyles}`}>
          {
            lottieAnimation &&
            <Lottie
              animationData={lottieAnimation}
              loop={false}
              onComplete={onComplete}
            />
          }
        </div>
        {
          splitText.length > 1 ? 
          (
            <div className="success-check__messages">
              <span className="success-check__message">{splitText[0]}</span>
              <span className="success-check__message success-check__message--text-light">{splitText[1]}</span>
            </div>
          ) : 
          (
            <>
              <span className="success-check__message">{splitText[0]}</span>
            </>
          )
        }
        {
          showRedirectCountdown && 
          <>
            <div className="success-check__line" /> 
            <RedirectCountdown 
              onComplete={onComplete}
            />
          </>
        }
      </div>
    </div>
  )
}

export default SuccessCheck