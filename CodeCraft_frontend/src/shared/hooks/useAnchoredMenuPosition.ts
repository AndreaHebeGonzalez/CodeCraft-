import { useRef, useState } from "react"


export type SelectorPosition = {
  px: number,
  translateY: number
}

const useAnchoredMenuPosition = (openMenu?: () => void) => {

  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null)


  const anchorRef = useRef<HTMLDivElement | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  
  function handleOpenSelector() {
    setAnchorRect(anchorRef.current!.getBoundingClientRect())
    openMenu && openMenu()
  }

  function updateAnchorsRect () {
    if(!anchorRef.current) return

    setAnchorRect(anchorRef.current!.getBoundingClientRect())
  }

  function getSelectorPosition() : SelectorPosition | null{
    const halfViewportHeight  = window.innerHeight / 2
    
    if(!anchorRect) return null

    if(anchorRect?.top < halfViewportHeight) {
      
      return({
        px: 17,
        translateY: 0
      })
    } else {
      return({
        px: 0,
        translateY: 100
      })
    }
  }

  const selectorPosition : SelectorPosition | null = getSelectorPosition()

  return ({
    anchorRef,
    menuRef, 
    anchorRect,
    handleOpenSelector,
    getSelectorPosition,
    updateAnchorsRect,
    selectorPosition
  })
}

export default useAnchoredMenuPosition