import type { SelectorPosition } from "@/shared/hooks/useAnchoredMenuPosition"
import type { ReactNode, RefObject } from "react"
import { createPortal } from "react-dom"

type AnchoredSelectorProps = {
  children: ReactNode
  isOpen: boolean,
  anchorRect: DOMRect | null
  position: SelectorPosition | null
  selectorRef: RefObject<HTMLDivElement | null>
}

const AnchoredSelector = ({children, isOpen, anchorRect, position, selectorRef } : AnchoredSelectorProps) => {


  if(!isOpen ||  !anchorRect || !position)  return null

  const top = anchorRect.top + position.px
  const left = anchorRect.left

  return (
    createPortal(
      <div 
        ref={selectorRef}
        style={{
          position: 'fixed',
          top: `${top}px`,
          left: `${left}px`, 
          transform: `translateY(-${position.translateY}%)`,
          zIndex:'1000'
        }}
      > 
        {children}
      </div>, document.body
    )
  )
}

export default AnchoredSelector