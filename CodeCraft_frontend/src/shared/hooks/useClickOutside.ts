import { useEffect, type RefObject } from "react"


export default function useClickOutside(
  refs: RefObject<HTMLElement | null>[], /* Toma todas las ref que no queremos que cierren */
  handler : () => void,
  enabled: boolean //Si esta desactivado --> false
) {


  useEffect(() => {
    if(!enabled) return
    
    const listener = (event : MouseEvent) => {
      const element = event.target as Node

      const isInsede = !refs.some(ref => {
        const el = ref.current
        return el && el.contains(element)
      }) 
      if(isInsede) handler()
    }

    document.addEventListener('mousedown', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
    }
  
  }, [handler])
}
