import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import './ProjectNavbar.scss'
import Button from '@/shared/components/Buttons/Button/Button'
import { Add } from '@/assets/icon'

const ProjectNavBar = () => {

  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="project-nav">
      <ul className="project-nav__wrapper">

        <li className="project-nav__item">
          <NavLink className={({ isActive }) => 
              `project-nav__link
              ${isActive ? 'active' : ''}`}
            to={"summary"}
          >
            Resumen
          </NavLink>
        </li>
        <li className="project-nav__item">
          <NavLink className="project-nav__link" to={"tasks"}>
            Tareas
          </NavLink>
        </li>
        <li className="project-nav__item">
          <NavLink className="project-nav__link" to={"calendar"}>
            Calendario
          </NavLink>
        </li>

        <li className='project-nav__add'>
          <Button
            text='Agregar tarea'
            type='button'
            onClick= {() => navigate(location.pathname + '?modalType=newTask')}
            variant= 'add-task'
            Icon={Add}
          />
        </li>
        
      </ul>

    </nav>
  )
}

export default ProjectNavBar