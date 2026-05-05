import useAppStore from '@/shared/stores/useAppStore'
import './ErrorPage.scss'
import { useEffect } from 'react'

const ErrorPage = () => {

  const { isOpenModal, closeModal } = useAppStore() 


  useEffect(() => {
    if(isOpenModal) closeModal()
  }, [])
  
  return (
    <div>ErrorPage</div>
  )
}

export default ErrorPage