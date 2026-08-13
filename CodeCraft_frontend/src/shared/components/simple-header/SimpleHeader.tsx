import { HomeOutline } from "@/assets/icon"
import Logo from "../logo/Logo"
import './simple-header.scss'

const SimpleHeader = () => {
  return (
    <header className='simple-header'>
      <div className='simple-header__container'>
        <div className='simple-header__content'>
          <Logo />
          <div className='simple-header__home'>
            <HomeOutline 
              className="simple-header__icon-xlg"
            />
            <span className="simple-header__home-text">Volver al inicio</span>
          </div>
        </div>
      </div>
    </header> 
  )
}

export default SimpleHeader