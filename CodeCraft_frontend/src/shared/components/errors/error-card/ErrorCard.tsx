import { AlertIcon, NetworkIcon } from "@/assets/icon"
import type { ErrorPageType } from "@/shared/error/error.types"
import './error-card.scss'
import { errorConfig } from "@/shared/error/errorConfig"

type ErrorCardProps = {
  type: ErrorPageType
}

const ErrorCard = ({ type } : ErrorCardProps) => {
  return (
    <div className="error-card">
      <div  className="error-card__container">
        <div  className="error-card__icon">
          {
            type === "network" ?
            <NetworkIcon 
              className="error-card__icon-xlg"
            /> 
            :
            <AlertIcon 
              className="error-card__icon-xlg"
            />
          }
        </div>
        <div  className="error-card__content">
          <span className="error-card__title">{errorConfig[type].alertTitle}</span>
          <p className="error-card__text">{errorConfig[type].alertMessage}</p>
        </div>
      </div>
    </div>
  )
}

export default ErrorCard