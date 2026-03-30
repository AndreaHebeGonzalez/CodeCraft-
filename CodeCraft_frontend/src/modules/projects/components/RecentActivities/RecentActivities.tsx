import './RecentActivities.scss'

export const RecentActivities = () => {
  return (
    <div className="recent-activities">
      <div className='recent-activities__wrapper'>
        <div className="recent-activities__text">
          <span className="recent-activities__author">
            Andrea Gonzalez
          </span>
          <span className="recent-activities__action">
            completó la tarea
          </span>
          <span className="recent-activities__name">
            “Configurar Google OAuth”
          </span>
        </div>
        <span className='recent-activities__time'>Hace 1 hora</span>
      </div>
    </div>
  )
}
