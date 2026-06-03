import { useEffect, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import useAppStore from "@/shared/stores/useAppStore"
import { initBreakpoints } from "@/shared/utils/breakpoint"
import ErrorBanner from "@/shared/components/feedback/error-banner/ErrorBanner"
import { AsyncFeedback } from "@/shared/components/feedback/AsyncFeedback/AsyncFeedback"
import type { AsyncFeedbackState } from "@/shared/types"
import './AuthLayout.scss'
import "./AuthStyles.scss"
import './FormStyles.scss'



const initialValues : AsyncFeedbackState = {
  lottieAnimation: null,
  animationVariantStyles: 'static',
  showRedirectCountdown: true, //true por defecto mostrará el contador para redireccion
  activeOverlay: false,
  isLoading: false,
  isSuccess: false,
  redirectTo: '',
  message:''
}

const AuthLayout = () => {
  const location = useLocation()

  const { showErrorBanner, closeErrorBanner } = useAppStore()

  const [feedback, setFeedback] = useState<AsyncFeedbackState>(initialValues)

  useEffect(() => {
    const cleanup = initBreakpoints()
    return cleanup
  }, [])

  useEffect(() => {
    if(!showErrorBanner) return
    closeErrorBanner()
  }, [location])
  

  const resetFeedback = () => {
    setFeedback(prev => ({
      ...prev,
      lottieAnimation: null,
      animationVariantStyles: 'static',
      showRedirectCountdown: true,
      isLoading: false,
      isSuccess: false,
      redirectTo: '',
      message:''
    }))
  }

  const closeOverlay = () => {
    setFeedback(prev => ({
      ...prev,
      activeOverlay: false,
    }))
  }

  return (
    <div className="auth-layout">
      <AsyncFeedback
        animationVariantStyles={feedback.animationVariantStyles}
        lottieAnimation={feedback.lottieAnimation}
        showRedirectCountdown={feedback.showRedirectCountdown}
        activeOverlay={feedback.activeOverlay}
        isSuccess={feedback.isSuccess}
        isLoading={feedback.isLoading}
        redirecTo={feedback.redirectTo}
        resetFeedback={resetFeedback}
        closeOverlay={closeOverlay}
        message={feedback.message}
      />
      <Outlet 
        context={{
          feedback,
          setFeedback
        }}
      />
      <ErrorBanner />
    </div>
  )
}

export default AuthLayout