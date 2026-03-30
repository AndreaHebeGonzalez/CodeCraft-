import { useRef, useEffect } from "react"
import { blockScroll } from "../utils/utils"


const useBlockScroll = (conditions : boolean[]) => {

  const containerRef = useRef<HTMLElement>(null)
  const shouldLocksScroll = conditions.some(v => v)
  
  useEffect(() => {
      if (!containerRef.current) return
  
      let cleanupContainer: (() => void) | undefined
  
      if (shouldLocksScroll) {
        cleanupContainer = blockScroll(containerRef.current)
      }
  
      return () => {
        cleanupContainer?.()
      }
    }, [shouldLocksScroll])
  
  return ({
    containerRef
  })
}

export default useBlockScroll