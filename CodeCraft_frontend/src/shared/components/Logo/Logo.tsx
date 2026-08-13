import { Link, useMatches } from 'react-router-dom'
import logo from '@/assets/logo/CodeCraft.png'
import './Logo.scss'
import useAppStore from '@/shared/stores/useAppStore'

const Logo = () => {

  const { isTablet } = useAppStore()

  const matches = useMatches()

  const isAuthRoute = matches.some(m => m.id === 'auth')

  return (
    <div className='logo'>
      <Link to={isAuthRoute ? '/auth/login':'/'} className={`logo__link ${isAuthRoute  ? 'logo__link--column':''}`}>
        <img src={logo} alt="CodeCraft logo"  className={`logo__img ${isAuthRoute ? 'logo__img--auth':''}`} />
        {
          isAuthRoute && isTablet &&
          <h1 className='logo__name'>CodeCraft</h1>
        }

        {
          !isAuthRoute &&
          <h1 className='logo__name'>CodeCraft</h1>
        }
      </Link>
    </div>
  )
}

export default Logo