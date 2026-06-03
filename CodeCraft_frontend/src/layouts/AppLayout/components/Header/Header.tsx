import { MenuClose, MenuOpen } from '@/assets/icon'
import Button from '@/shared/components/buttons/button/Button'
import Notification from './notifications/Notification'
import UserMenu from './user-menu/UserMenu'
import useAppStore from '@/shared/stores/useAppStore'
import { Link } from 'react-router-dom'
import './Header.scss'
import { DateGenerate } from '@/shared/utils/dateUtils'
import Logo from '@/shared/components/logo/Logo'

type HeaderProps = {
  openMenu: boolean
  handleOpenMenu: () => void
}

const Header = ({ openMenu, handleOpenMenu } : HeaderProps) => {

  const { isTabletTwo } = useAppStore()

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
          <Logo />
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