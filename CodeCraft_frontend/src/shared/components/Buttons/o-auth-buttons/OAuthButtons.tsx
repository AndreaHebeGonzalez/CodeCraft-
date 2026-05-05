import { GoogleIcon } from '@/assets/icon'
import './OAuthButtons.scss'

type OAuthButtonsProps = {
  mode : 'login' | 'register'
}

const OAuthButtons = () => {
  return (
    <button className='oauth-btn'>
      <div className='oauth-btn__icon-wrapper'>
        <GoogleIcon 
          className='oauth-btn__icon-lg'
        />
      </div>
      Continuar con google
    </button>
  )
}

export default OAuthButtons