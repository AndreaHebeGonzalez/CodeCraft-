import { useRef } from 'react'
import { CheckCheck, CircleAlert } from '@/assets/icon'
import { AnimatePresence, easeIn, motion } from 'framer-motion'
import useAppStore from '@/shared/stores/useAppStore'
import './AppNotification.scss'


const notificationVariants = {
  hidden: {x: '120%'},
  visible: {x: 0},
  exit:{x:'120%', transition: { type: "tween" as const, duration: 0.8, ease: easeIn }}
}

const AppNotification = () => {
  const progressBarRef = useRef<HTMLDivElement | null>(null)
  const notificationBoxRef = useRef<HTMLDivElement | null>(null)

  const { showNotification, isError, textNotification, closeNotification } = useAppStore()


  return (
    <AnimatePresence>
    {
      showNotification &&
      (<motion.div className='notification'
        variants={notificationVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{
          duration: 0.8,
          ease: "backInOut"
        }}
      >
        <div ref={notificationBoxRef} className='notification__wrapper'>
          <div className='notification__content'>
            {
              isError ? (
                <CircleAlert 
                  className={'notification__icon-error'}
                  width={20}
                  height={20}
                />
              ) 
              : 
              (
                <CheckCheck 
                  className={'notification__icon'}
                  width={20}
                  height={20}
                />
              )
            }
            <p>
              {textNotification}
            </p>
          </div>
          <motion.div 
            ref={progressBarRef} 
            className={`notification__progressBar ${isError ? 'notification__progressBar--error' : 'notification__progressBar--check'}`}
            initial={{ width: '100%' }}
            animate={{width: 0}}
            exit={{opacity: 0}}
            transition={{ ease: "linear", duration: 4 }}
            onAnimationComplete={() => {
              closeNotification()
            }}
          >
          </motion.div>
        </div>
      </motion.div>)
    }
    </AnimatePresence>
    
  )
}

export default AppNotification