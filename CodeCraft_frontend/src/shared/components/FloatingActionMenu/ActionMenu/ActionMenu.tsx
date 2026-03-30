import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './ActionMenu.scss'

/* import type { RefObject } from 'react'
 */
type ActionMenuProps = {
  isOpen: boolean,
  /* ref: RefObject<HTMLUListElement | null> */
  items: {
    name: string,
    url: string
  }[]
}

const openVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit:{ opacity: 0 }
}

export const ActionMenu = ({ isOpen, items } : ActionMenuProps) => {

  return (
    
    <AnimatePresence>
      {
        isOpen &&
        <motion.ul 
          className='action-menu'
          variants={openVariant}
          initial= 'hidden'
          animate='visible'
          exit='exit'
        >
          {
            items.map(item=>(
              <li className='action-menu__item'>
                <Link className='action-menu__link' to={item.url}>
                  {
                    item.name
                  }
                </Link>
              </li>
            ))
          }
        </motion.ul>
      }
    </AnimatePresence>
  )
}
