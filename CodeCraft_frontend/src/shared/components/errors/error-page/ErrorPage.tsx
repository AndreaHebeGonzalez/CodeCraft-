import { useEffect } from 'react'
import useAppStore from '@/shared/stores/useAppStore'
import SimpleHeader from '../../simple-header/SimpleHeader'
import type { ErrorPageType } from '@/shared/error/error.types'

import './ErrorPage.scss'
import ErrorState from '../error-state/ErrorState'

type ErrorPageProps = {
  type: ErrorPageType
}

const ErrorPage = ({ type } : ErrorPageProps) => {

  const { isOpenModal, closeModal } = useAppStore() 


  useEffect(() => {
    if(isOpenModal) closeModal()
  }, [])
  
  return (
    <div className='error-page'>
      <SimpleHeader />
      <main  className='error-page__content'>
        <ErrorState  type={type} />
      </main>
    </div>
  )
}

export default ErrorPage