import Button from '../../buttons/button/Button'
import ErrorCard from '../error-card/ErrorCard'
import network from '@/assets/illustrations/network-error.png'
import serverError from '@/assets/illustrations/server-error.png'
import notFound from '@/assets/illustrations/not-found.png'
import unknown from '@/assets/illustrations/unknown.png'
import { errorConfig } from '@/shared/error/errorConfig'
import './error-state.scss'
import type { ErrorPageType } from '@/shared/error/error.types'
import { useLocation, useNavigate } from 'react-router-dom'

type ErrorStateProps = {
  type: ErrorPageType
}


const errorIllustrations = {
  network: network,
  'server-error': serverError,
  'not-found': notFound,
  unknown: unknown
}



const ErrorState = ({ type } : ErrorStateProps) => {

  const navigate = useNavigate()
  const location = useLocation()

  const path = location.pathname

  const illustration = errorIllustrations[type]

  const handlePrimaryActions = () => {
    switch(type) {
      case 'not-found': 
        navigate('/')
        break
      case 'network': 
        window.location.reload()
        break
      case 'server-error': 
        window.location.reload()
        break
      case 'unknown': 
        window.location.reload()
        break
    }
  }

  const showPrimaryButton = errorConfig[type].showPrimaryButton?.(path)
  
  return (
    <div  className='error-state'>
      <div className='error-state__wrapper'>
        <div className='error-state__illustration'>
          <img src={illustration} alt="error de red" />
        </div>
        <h1 className='error-state__title'>
          {
            errorConfig[type].title
          }
        </h1>
        {/* <p className='error-state__description'>
          {
            errorConfig[type].description
          }
        </p> */}
        <ErrorCard 
          type={type}
        />
        {
          showPrimaryButton &&
          <Button 
            text={errorConfig[type].primaryAction}
            type='button'
            variant='form'
            onClick={handlePrimaryActions}
          />
        }
        {
          path !== '/' &&
          <Button 
            text="Volver atrás"
            type='button'
            variant='outline'
            onClick={() => navigate(-1)}
          />
        }
        <span>¿Necesitas ayuda?<span className='error-state__cta error-state__cta--accent error-state__cta--link'>{' '} Contacta con soporte</span></span>
      </div>
    </div>
  )
}

export default ErrorState