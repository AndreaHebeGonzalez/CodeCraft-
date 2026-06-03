import { AnimatePresence, easeInOut, motion } from "framer-motion"
import { Loading } from "../../loading/Loading"
import SuccessCheck from "../success-check/SuccessCheck"
import type { AsyncFeedbackState } from "@/shared/types"
import './async-feedback.scss'

type AsyncFeedbackProps = {
  lottieAnimation: AsyncFeedbackState['lottieAnimation']
  animationVariantStyles: AsyncFeedbackState['animationVariantStyles']
  showRedirectCountdown: boolean
  activeOverlay: AsyncFeedbackState['activeOverlay']
  isSuccess: AsyncFeedbackState['isSuccess']
  isLoading: AsyncFeedbackState['isLoading']
  redirecTo: AsyncFeedbackState['redirectTo']
  resetFeedback: ()=>void
  closeOverlay:()=>void
  message?: AsyncFeedbackState['message']
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { type: "tween" as const, duration: 0.3, ease: easeInOut },
  },
  exit: { 
    opacity: 0, 
    transition: { type: "tween" as const, duration: 0.5, ease: easeInOut }
  },
}

export const AsyncFeedback = ({ lottieAnimation, animationVariantStyles, showRedirectCountdown, activeOverlay, isSuccess, isLoading, redirecTo, resetFeedback,  closeOverlay, message } : AsyncFeedbackProps) => {

  if (!isSuccess && !isLoading) return null

  return (
    <div className="async-feedback">
      <AnimatePresence>
        {
          activeOverlay && 
          <motion.div 
            className="async-feedback__overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {
              isLoading &&
              <div className="async-feedback__loading">
                <Loading />
              </div>
            }

            {
              isSuccess && 
              <SuccessCheck
                animationVariantStyles={animationVariantStyles} 
                showRedirectCountdown={showRedirectCountdown}
                lottieAnimation={lottieAnimation}
                resetFeedback={resetFeedback}
                closeOverlay={closeOverlay}
                redirecTo={redirecTo}
                message={message}
              />
            }
          </motion.div>
        }
      </AnimatePresence>
    </div>
  )
}
