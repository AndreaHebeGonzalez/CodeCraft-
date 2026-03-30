import { AnimatePresence, motion } from "framer-motion"
import { useLayoutEffect, useState, type ReactNode, type RefObject } from "react"
import './StatusBanner.scss'

type StatusBannerProps = {
  targetRef: RefObject<HTMLElement | null>
  children: ReactNode
  showStatusBanner: boolean
  variant?: 'success' | 'info' | 'warning' | 'error'
  onClose: () => void
  /* duration: 2000 */
}

const animationVariant = {
    hidden: {  opacity: 0, y: -10 },
    visible: { 
      y: 0,
      opacity: 1 
    },
    exit: { opacity: 0, y: -10 },
}

const StatusBanner = ({ children, showStatusBanner, onClose, targetRef } : StatusBannerProps) => {

  const [rect, setRect] = useState<DOMRect | null>(null)

  useLayoutEffect(() => {
    if(!targetRef.current) return 

    setRect(targetRef.current.getBoundingClientRect())

    const timeout = setTimeout(() => {
      onClose()
    }, 1000)

    return () => clearTimeout(timeout)

  }, [targetRef])

  if (!rect) return null

  return (
    <AnimatePresence>
    {
      showStatusBanner &&
      <motion.div 
        className="status-banner"
        variants={animationVariant}
        initial= "hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.1, ease: "easeOut" }}
        style={{
          position: 'fixed',
          top: rect?.top,
          left: rect.width < 90 ?  rect.left + rect.width + 10 : rect.left + rect.width  - 50,
          zIndex: 500
        }}
      >
        <div className="status-banner__box">
          {children}
        </div>
      </motion.div>
    }
    </AnimatePresence>
  )
}

export default StatusBanner

/* 

import { useEffect } from 'react'
import './StatusBanner.scss'

type StatusBannerProps = {
  message: string
  variant?: 'success' | 'info' | 'warning' | 'error'
  duration?: number
  onClose: () => void
}

export function StatusBanner({
  message,
  variant = 'info',
  duration = 2000,
  onClose
}: StatusBannerProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className={`status-banner status-banner--${variant}`}>
      {message}
    </div>
  )
}

*/