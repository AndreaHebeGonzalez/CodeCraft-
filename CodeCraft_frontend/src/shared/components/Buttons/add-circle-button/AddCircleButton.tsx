import { Add } from '@/assets/icon'
import './AddCircleButton.scss'
import { Link, useLocation } from 'react-router-dom'
import useAppStore from '@/shared/stores/useAppStore'


export const AddCircleButton = () => {
  const location = useLocation()
  const { showNotification } = useAppStore()
  
  return (
    <Link 
      to={showNotification ? '#' : location.pathname + '?modalType=newProyect'} 
      className="add-circle-button">
      <Add />
    </Link>
  )
}
