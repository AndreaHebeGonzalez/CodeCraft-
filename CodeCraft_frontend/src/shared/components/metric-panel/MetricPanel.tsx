import './MetricPanel.scss'

type MetricPanelProps = {
  text: string
  value: number
}

export const MetricPanel = ({ text, value } : MetricPanelProps) => {

  return (
    <div className= 'metric-panel'>
      <span className='metric-panel__text'>
        {text}
      </span>
      <span className='metric-panel__value'>
        {value}
      </span>
    </div>
  )
}
