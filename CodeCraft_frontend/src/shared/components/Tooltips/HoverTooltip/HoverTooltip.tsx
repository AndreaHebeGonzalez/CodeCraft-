import { useRef, useState, type PropsWithChildren } from "react"
import OverflowTooltip from "../OverflowTooltip/OverflowTooltip"
import './HoverTooltip.scss'

type HoverTooltipProps = {
  text: string
  showTooltip: boolean
}

const HoverTooltip = ({ children, text, showTooltip } :  PropsWithChildren<HoverTooltipProps>) => {

  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [isHover, setIsHover] = useState(false)

  const handleEnter = () => {
    setIsHover(true)
  }

  const handleLeave = () => {
    setIsHover(false) 
  }

  return (
    <div 
      className="hover-tooltip" 
      ref={wrapperRef}
      onMouseEnter={showTooltip ? handleEnter:undefined}
      onMouseLeave={showTooltip ? handleLeave:undefined}
    >
      {children}
      <OverflowTooltip
        text = {text}
        arrowPosition="bottom"
        showTooltip = {showTooltip}
        contentLayout="multiline"
        isHover={isHover}
      />
    </div>
  )
}

export default HoverTooltip