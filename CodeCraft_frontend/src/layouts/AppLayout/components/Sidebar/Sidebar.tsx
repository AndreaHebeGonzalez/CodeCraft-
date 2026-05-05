import { Link } from 'react-router-dom'
import { AnimatePresence, motion, easeInOut } from 'framer-motion'
import { Home, Task, Messages, Teams, MyProjects, Close } from '@/assets/icon' 
import Logo from '@/assets/logo/CodeCraft.png'
import ProjectName from '@/shared/components/tags/project-name/ProjectName'
import { ProjectRole } from '@/shared/components/tags/project-rol/ProjectRole'
import { useQuery } from '@tanstack/react-query'
import { getProjects } from '@/modules/projects/services'
import { useEffect, useRef, useState } from 'react'
import useAppStore from '@/shared/stores/useAppStore'
import useClickOutside from '@/shared/hooks/useClickOutside'
import { createPortal } from 'react-dom'
import OverflowTooltip from '@/shared/components/tooltips/overflow-tooltip/OverflowTooltip'
import './Sidebar.scss'

const SIDEBAR_COLLAPSED_MOBILE_WIDTH = '0'
const SIDEBAR_COLLAPSED_WIDTH = '50px'
const SIDEBAR_EXPANDED_WIDTH = '180px'

const sidebarItems = {
  home: 'Inicio',
  myTasks: 'Mis Tareas',
  messages: 'Mensajes',
  myTeams: 'Equipos',
  myProjects: 'Mis proyectos'
}

type SidebarItemKey = keyof typeof sidebarItems


type SidebarProps = {
  isOpen: boolean,
  closeMenu: () => void
}

type TooltipType = {
  rect: DOMRect | null,
  text: string
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { type: "tween" as const, duration: 0.3, ease: easeInOut },
  },
  exit: { opacity: 0 },
}

const animateTextVariants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: -10 }
}



const Sidebar = ({ isOpen, closeMenu } : SidebarProps) => {

  const { isTablet } = useAppStore()

  const [tooltip, setTooltip] = useState<TooltipType>({
    rect: null,
    text: ''
  })
  const [showTooltip, setShowTooltip] = useState(false)

  const sidebarRef = useRef<HTMLDivElement | null>(null)

  useClickOutside([sidebarRef], closeMenu, !isTablet)

  const { data } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  })

  useEffect

  function handleMouseEnter (e : React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const element = e.currentTarget
    const id = e.currentTarget.id as SidebarItemKey
    setTooltip({
      rect: element.getBoundingClientRect(),
      text: sidebarItems[id]
    })
    setShowTooltip(true)
  } 

  function handleMouseLeave () {
    setShowTooltip(false)
    setTooltip({
      rect: null,
      text: ''
    })
  }

  return (
    <>
      <AnimatePresence>
        {
          !isTablet && isOpen &&
          <motion.div 
            className= 'sidebar-overlay'
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
          </motion.div>
        }
      </AnimatePresence>

      <aside className='sidebar'>
        <motion.div 
          ref={sidebarRef}
          className= 'sidebar__wrapper'
          animate={isTablet ? { width: isOpen ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH }:{ width: isOpen ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_MOBILE_WIDTH }}
          transition={{ ease: "linear", duration: 0.3 }}
        >
          {
            !isTablet &&
            <div className='sidebar__header'>
              <div className='sidebar__logo'>
                <Link to='/'>
                  <img src={Logo} alt="Logo" />
                  <h1 className='sidebar__logo-text'>CodeCraft</h1>
                </Link>
              </div>
            </div>
          }
          <nav className="sidebar__content">
            <div className="sidebar__main">
              <ul className='sidebar__list'>
                <Link to={'/'} className='sidebar__link'>
                  <li className='sidebar__item'>
                    <div 
                      id='home' 
                      className='sidebar__icon-wrapper' 
                      {...(!isOpen && { onMouseEnter: (e) => handleMouseEnter (e), onMouseLeave: () => handleMouseLeave() })}>
                      <Home 
                        className='sidebar__icon-lg'  
                      />
                    </div>
                    <motion.p 
                    className='sidebar__item-text'
                    initial={false}
                    animate={isOpen ? 'open':'closed'}
                    variants={animateTextVariants}
                    transition={{ 
                      duration: 0.2,
                      delay: isOpen ? 0.15: 0.3
                    }}
                    >Inicio</motion.p>
                    
                  </li>
                </Link>
                
                <Link to={'/'} className='sidebar__link'>
                  <li className='sidebar__item'>
                    <div 
                      id='myTasks' 
                      className='sidebar__icon-wrapper' 
                      {...(!isOpen && { onMouseEnter: (e) => handleMouseEnter (e), onMouseLeave: () => handleMouseLeave() })}>
                        <Task
                          className='sidebar__icon-lg'        
                        />
                    </div>
              
                    <motion.p 
                      className='sidebar__item-text'
                      initial={false}
                      animate={isOpen ? 'open':'closed'}
                      variants={animateTextVariants}
                      transition={{
                        duration : 0.2,
                        delay: isOpen ? 0.15:0.3
                      }}
                    >Mis tareas</motion.p>
                  </li>
                </Link>
                
                <Link to={'/'} className='sidebar__link'>
                  <li className='sidebar__item'>
                    <div 
                      id='messages' 
                      className='sidebar__icon-wrapper' 
                      {...(!isOpen && { onMouseEnter: (e) => handleMouseEnter (e), onMouseLeave: () => handleMouseLeave() })}>
                        <Messages 
                          className='sidebar__icon-lg' 
                        />
                    </div>
                      <motion.p 
                        className='sidebar__item-text'
                        initial={false}
                        animate= {isOpen ? 'open':'closed'}
                        variants={animateTextVariants}
                        transition={{
                          duration: 0.2,
                          delay: isOpen ? 0.15:0.3
                        }}
                      >Mensajes</motion.p>
                    
                    
                  </li>
                </Link>

                <Link to={'/'} className='sidebar__link'>
                  <li className='sidebar__item'>
                    <div 
                      id='myTeams' 
                      className='sidebar__icon-wrapper' 
                      {...(!isOpen && { onMouseEnter: (e) => handleMouseEnter (e), onMouseLeave: () => handleMouseLeave() })}>
                      <Teams
                        className='sidebar__icon-lg'
                      />
                    </div>
                      <motion.p 
                        className='sidebar__item-text'
                        initial={false}
                        animate={isOpen ? 'open':'closed'}
                        variants={animateTextVariants}
                        transition={{
                          duration: 0.2,
                          delay: isOpen ? 0.15: 0.3
                        }}
                      >Equipos
                      </motion.p> 
                  </li>
                </Link>
              </ul>
            </div>
            <div className='sidebar__projects'>
              <Link to={'/projects'}>
                <div className='sidebar__item'>
                  <div 
                    id='myProjects' 
                    className='sidebar__icon-wrapper' 
                    {...(!isOpen && { onMouseEnter: (e) => handleMouseEnter (e), onMouseLeave: () => handleMouseLeave() })}>
                    <MyProjects 
                      className='sidebar__icon-lg'
                    />  
                  </div>

                    <motion.p
                      className='sidebar__item-text' 
                      initial={false}
                      animate= {isOpen ? 'open':'closed'}
                      variants={animateTextVariants}
                      transition={{
                        duration: 0.2,
                        delay: isOpen ? 0.15:0.3
                      }}
                    >Mis proyectos</motion.p>
                  
                </div>
              </Link>
              
              <div className='sidebar__projects-list-wrapper'>
                <ul className='sidebar__projects-list'>
                {
                  data &&
                  data.map(project => (
                    <li className='sidebar__item' key={project._id}>
                      <Link to={`/projects/${project._id}/summary`} className='sidebar__link-project'>
                        <ProjectName 
                          text={project.projectName}
                          variant='#0000ff'
                        />
                        <ProjectRole
                          role= 'dev'
                        />
                      </Link>
                    </li>
                  ))
                }
                </ul>
              </div>
            </div>
          </nav>
          
        </motion.div>
        {
          !isTablet && isOpen &&
          <Close 
            className='sidebar__close-icon'
            onClick={closeMenu}
          />
        }
        {
        !isOpen && tooltip.rect &&
        createPortal(
          <div 
            className='sidebar__tooltip'
            style={{
              position: 'fixed',
              top:`${tooltip.rect.top}px`,
              left: `${tooltip.rect.right}px`,
            }}
          >
            <OverflowTooltip
              text={tooltip.text}
              arrowPosition='left'
              position='static'
              contentLayout='compact'
              isHover={showTooltip}
            />
          </div>, document.body)
        }
        
      </aside>
    </>
  )
}

export default Sidebar