import { MenuNotifications } from "@/assets/icon"
import './Notification.scss'

const Notification = () => {
  return (
    <div className='notifications'>
      <div className='notifications__icon-wrapper'>
        <MenuNotifications 
          className="notifications__icon-lg"
        />
        <div className='notification--flag'></div>
      </div>
      <div className="notifications__list">

      </div>
    </div>
  )
}

export default Notification