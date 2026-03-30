import { useEffect, useRef, type PropsWithChildren, type ReactNode } from "react"
import { motion, AnimatePresence, easeInOut } from "framer-motion"
import './Modal.scss'



type ModalProps = PropsWithChildren<{
  content?: ReactNode
  isOpen: boolean
  onClose: () => void
  scrollKey: string | undefined
}>

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const wrapperVariants = {
  hidden: { y: -30, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "tween" as const, duration: 0.5, ease: easeInOut },
  },
  exit: { y: 20, opacity: 0, scale: 0.95 },
}


const Modal = ({ children, content, isOpen, onClose, scrollKey } : ModalProps) => {

  
  const overlayRef= useRef<HTMLDivElement>(null)
  const mouseDownTarget = useRef<EventTarget>(null)

  useEffect(() => {
    if(!scrollKey) return
    overlayRef.current?.scrollTo({
      top: 0,
      behavior: 'auto'
    })
  }, [scrollKey])
  

  const handleMouseDown = (e : React.MouseEvent) => {
    mouseDownTarget.current = e.target
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if(mouseDownTarget.current === overlayRef.current && e.target === overlayRef.current){
      onClose()
    }
  }

  

  return (
    <AnimatePresence>
      {
        isOpen && (
      <motion.div 
        className='modal'
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        ref={overlayRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <motion.div 
          className='modal__wrapper'
          variants={wrapperVariants}
          initial= "hidden"
          animate= "visible"
          exit="exit"
        > 
          {content || children}
        </motion.div>
      </motion.div>)
    } 
    </AnimatePresence>
    
  )
}

export default Modal