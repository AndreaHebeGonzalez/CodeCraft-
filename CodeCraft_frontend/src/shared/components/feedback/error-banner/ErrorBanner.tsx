import useAppStore from '@/shared/stores/useAppStore'
import { AnimatePresence, easeIn, motion } from 'framer-motion'
import { ErrorX } from '@/assets/icon'
import './error-banner.scss'

const animationVariants = {
  hidden: { y: '-160%'}, 
  animate: { y: 0, transition: 
    { 
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
      mass: 2
    } 
  },
  exit: { y: '-160%', transition: { type: "tween" as const, duration: 0.4, ease: easeIn } }
}

const ErrorBanner = () => {

  const { showErrorBanner, textErrorBanner } = useAppStore()

  return (
    <AnimatePresence>
      {
        showErrorBanner &&
        <motion.div 
          variants={animationVariants}
          initial= 'hidden'
          animate="animate"
          exit="exit"
          className='error-alert'
        >
          <ErrorX
            className='error-alert__icon-lg'
          />
          <p className='error-alert__text'>{textErrorBanner}</p>
        </motion.div>
      }
    </AnimatePresence>
  )
}


export default ErrorBanner