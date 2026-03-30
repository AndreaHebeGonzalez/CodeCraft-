import './TruncatedTextTooltip.scss'

type TruncatedTextTooltipProps = {
  targetRef: React.RefObject<HTMLElement | null>
  children: React.ReactNode
}

export const TruncatedTextTooltip = ({ targetRef, children } : TruncatedTextTooltipProps) => {
  
  if (!targetRef.current) return null

  const rect = targetRef.current.getBoundingClientRect()

  return (
    <div 
      className="tooltip"
      style={{
        position: 'fixed',
        top: rect.bottom + 6,
        left: rect.left,
      }}
    >
      {children}
    </div>
  )
}
