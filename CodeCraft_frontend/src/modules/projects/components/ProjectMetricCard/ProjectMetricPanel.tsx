import './ProjectMetricCard.scss'

type ProjectMetricPanelProps = {
  text : string
  value: number
}

export const ProjectMetricPanel = ({ text, value } : ProjectMetricPanelProps) => {
  return (
    <div className='metric-panel'>
      <span className='metric-panel__text'>{text}</span>
      <span className='metric-panel__value'>{value}</span>
    </div>
  )
}
