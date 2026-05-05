import type { RefObject } from 'react'
import { Add } from '@/assets/icon'
import './AddButton.scss'

type AddButtonType = {
  ref?: RefObject<HTMLButtonElement | null>
  text?: string
  onClick?: () => void 
}

export const AddButton = ({ text, onClick, ref } : AddButtonType) => {
  return (
    <button className='add-button' {...(onClick && { onClick })} ref={ref}>
      <div className='add-button__icon-wrapper'>
        <Add 
          className='add-button__icon-sm add-button__icon-sm--color-muted'
        />
      </div>
      {text && <span className='add-button__text'>{text}</span>}
      
    </button>
  )
}
