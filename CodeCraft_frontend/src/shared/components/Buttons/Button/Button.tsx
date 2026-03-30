import type React from 'react'
import './Button.scss'

type ButtonProps = {
  text: string
  type?: 'submit' | 'reset' | 'button' 
  onClick?: () => void 
  variant: 'outline' | 'add-task' | 'form'
  disabled?: boolean
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> 
}

const Button = ({ text, type, onClick, variant, disabled, Icon } : ButtonProps) => {


  return (
    <button
      className={`btn btn--${variant} ${disabled ? 'btn--disabled': ''}`}
      {...(type && { type })}
      {...(onClick && { onClick })}
      {...(disabled && {disabled})}
      
    >
      {
        Icon &&
        <Icon 
          className='btn__icon-md'
        />
      }
      {text}
    </button>
  )
}

export default Button