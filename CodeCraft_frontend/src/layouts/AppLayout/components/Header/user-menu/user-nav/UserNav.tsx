import { LogOut, User, MyProjectsOutline } from "@/assets/icon"
import { AnimatePresence, motion } from "framer-motion"


type UserNavProps = {
  userMenuRef: React.RefObject<HTMLElement | null>
  isOpen: boolean
}

const openVariant = {
  hidden: { height: 0 },
  visible: { 
    height: 'max-content',
  },
  exit: { height: 0 },
}

export const UserNav = ({ userMenuRef, isOpen } : UserNavProps) => {

  return (
    <AnimatePresence>
      {
        isOpen && 
        <motion.nav 
          ref={userMenuRef}
          className="user-menu__nav"
          variants={openVariant}
          initial= "hidden"
          animate="visible"
          exit="exit"
          transition={{ ease: "linear", duration: 0.2}}
        >
          <ul 
            className="user-menu__list"
          >
            <li className="user-menu__item">
              <User 
                className="user-menu__icon-lg"
              />
              <p>Perfil</p>
            </li>
            <li className="user-menu__item">
              <MyProjectsOutline
                className='user-menu__icon-lg'
              />
              <p>Mis proyectos</p>
            </li>
            <li className="user-menu__item">
              <LogOut 
                className="user-menu__icon-lg"
              />
              <p>Cerrar sesión</p>
            </li>
          </ul>
        </motion.nav>
      }
    </AnimatePresence>
  )
}
