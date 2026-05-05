import { dueStatusLabels } from '@/shared/locales/es'
import './DueStatusTag.scss'
import type { DueStatus } from '@/shared/types'

type DueStatusTagProps = {
  variant: DueStatus
}

const DueStatusTag = ({ variant } : DueStatusTagProps) => {


  return (

    <div className='due-status'>
      <div className={`due-status__wrapper due-status__wrapper--${variant}`}>
        <span className='due-status__text'>
          {dueStatusLabels[variant]}
        </span>
      </div>
      
    </div>
  )
}

export default DueStatusTag