import Logo from '@/assets/logo/CodeCraft.png'
import { MenuClose, MenuOpen } from '@/assets/icon'
import Button from '@/shared/components/Buttons/Button/Button'
import Notification from './Notifications/Notification'
import UserMenu from './UserMenu/UserMenu'
import useAppStore from '@/shared/stores/useAppStore'
import { Link } from 'react-router-dom'
import './Header.scss'
import { DateGenerate } from '@/shared/utils/dateUtils'

type HeaderProps = {
  openMenu: boolean
  handleOpenMenu: () => void
}

const Header = ({ openMenu, handleOpenMenu } : HeaderProps) => {

  const { isTabletTwo } = useAppStore()
  console.log(openMenu)

  const { showNotification } = useAppStore()
  
  return (
    <header className='header'>
      <div className='header__container'>
        <div className='header__content'>
          <div className='header__left'>
            {
              openMenu ? 
              <MenuOpen
                className='header__icon-xlg'
                onClick={handleOpenMenu}
              /> 
              : 
              <MenuClose
                className='header__icon-xlg'
                onClick={handleOpenMenu}
              />
            }

            {
              isTabletTwo &&
              <Link 
              to={showNotification ? '#' : location.pathname + '?modalType=newProyect'} 
              className='project-card__end-date'
              >
                <Button 
                  text='Crear Proyecto'
                  type='button'
                  variant = 'outline'
                />
              </Link>
            }
          </div>
          <div className='header__logo'>
            <Link to='/'>
              <img src={Logo} alt="Logo" />
              <h1 className='header__logo-text'>CodeCraft</h1>
            </Link>
          </div>
          <div className='header__right'>
              {
                isTabletTwo &&
                <div className='header__current-date'><p>{DateGenerate()}</p></div>
              }
            <Notification />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header