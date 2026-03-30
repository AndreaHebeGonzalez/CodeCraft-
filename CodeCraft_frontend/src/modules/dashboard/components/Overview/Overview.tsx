import './Overview.scss'

const Overview = () => {
  return (
    <div className='overview'>
      <div className='overview__panel'>
        <span className='overview__name'>Total de tareas</span>
        <span className='overview__number'>50</span>
      </div>
      <div className='overview__panel'>
        <span className='overview__name'>Finalizadas vs. Pendientes</span>
        <span className='overview__number'>30 / 50</span>
      </div>
      <div className='overview__panel'>
        <span className='overview__name'>Proyectos activos</span>
        <span className='overview__number'>4</span>
      </div>
    </div>
  )
}

export default Overview