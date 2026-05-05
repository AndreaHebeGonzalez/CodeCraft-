import { useRef } from "react"
import { motion } from "framer-motion"
import { BottomArrow } from "@/assets/icon"
import useClickOutside from "@/shared/hooks/useClickOutside"
import useOpenElement from "@/shared/hooks/useOpenElement"
import './UserMenu.scss'
import { UserNav } from "./user-nav/UserNav"

const UserMenu = () => {

  
  const { 
    isOpen,
    handleOpenElement,
    closeElement
    } = useOpenElement()

    const userMenuRef = useRef<HTMLElement | null>(null)
    const iconRef = useRef<HTMLDivElement | null>(null)

    useClickOutside([userMenuRef, iconRef], closeElement, true)


  return (
    <div className='user-menu'>
      <div className='user-menu__avatar'>
        <p>AG</p>
      </div>

      <div 
        className='user-menu__icon-bg'
        ref={iconRef}
      >    
        <motion.div
          className="user-menu__icon-wrapper"
          onClick={handleOpenElement}
          animate= {{ rotate: isOpen ?  180 : 0 }}
          transition={{ ease: "linear", duration: 0.3 }}
        >
          <BottomArrow 
            className='user-menu__icon-lg'
          />
        </motion.div>
      </div>

      <UserNav 
        userMenuRef={userMenuRef}
        isOpen={isOpen}
      />
    </div>
  )
}

export default UserMenu

