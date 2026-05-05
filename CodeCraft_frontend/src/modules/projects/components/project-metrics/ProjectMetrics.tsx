import { MetricPanel } from '@/shared/components/metric-panel/MetricPanel'
import './ProjectMetrics.scss'

export const ProjectMetrics = () => {

  
  return (
    <div className='project-metrics'>
      <div className='project-metrics__task-summary-panels'>
        <MetricPanel
          text='Total de tareas creadas'
          value= {30}
        />
        <MetricPanel
          text='Total de tareas sin finalizar'
          value= {25}
        />
        <MetricPanel
          text='Total de tareas con retraso'
          value= {0}
        />
      </div>
      <div className='project-metrics__graphic'>

      </div>
    </div> 
  )
}
