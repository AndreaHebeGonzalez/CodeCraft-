import { useLayoutEffect, useRef, useState } from "react"


type Params = {
  value: string
  shouldTruncateText?: boolean
  MAX_HEIGHT?: number
}


const useEditableField = ({ value, shouldTruncateText, MAX_HEIGHT = 110 } : Params) => {
    /* Estado para almacenar valor del campo */
    const [draft, setDraft] = useState(value)
  
    /* Estado que indica si el texto es expandible o no */
    const [isTextExpandable, setIsTextExpandable] = useState(false)
  
    /* Estado que indica si el texto esta expandido o no */
    const [isExpanded, setIsExpanded] = useState(false)
  
    const parentElementRef = useRef<HTMLDivElement | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    useLayoutEffect(() => {
        if(shouldTruncateText) {
          checkIfTextIsExpandable(textareaRef.current)
        }
        autoResizeTextarea(textareaRef.current)
      }, [])
    
    function autoResizeTextarea (element : HTMLTextAreaElement | null)  {
      if(!element) return
      if (element instanceof HTMLTextAreaElement) {
        element.style.height = 'auto'
        element.style.height = `${element.scrollHeight}px`
      }
    }
  
    function checkIfTextIsExpandable (element : HTMLTextAreaElement | null) {
      if(!element) return
      if(element.scrollHeight > MAX_HEIGHT) {
        setIsTextExpandable(true)
        setIsExpanded(false)
        collapseText(parentElementRef.current)
      } else {
        setIsTextExpandable(false)
        setIsExpanded(true)
      }
    }
  
    function expandText (parentElement : HTMLDivElement | null) {
      if(!parentElement) return
      parentElement.style.maxHeight = 'none'
      parentElement.style.overflow = 'visible'
    }
  
    function collapseText (parentElement : HTMLDivElement | null) {
      if(!parentElement) return
      parentElement.style.maxHeight = `${MAX_HEIGHT}px`
      parentElement.style.overflow = 'hidden'
    }
  
    function handleExpandText () {
      if(isExpanded) {
        collapseText(parentElementRef.current)
        setIsExpanded(false)
      } else {
        expandText(parentElementRef.current)
        setIsExpanded(true)
      }
    }

    function handleClickParentElement () {
      if(!shouldTruncateText && !isTextExpandable) return
      expandText(parentElementRef.current)
      setIsExpanded(true)
    }
  
    function handleChange (e: React.ChangeEvent<HTMLTextAreaElement>) {
      const element : HTMLTextAreaElement = e.target
      setDraft(e.target.value)
      autoResizeTextarea(element)
      setIsTextExpandable(element.scrollHeight > 150) 
    }

    return ({
      draft,
      setDraft,
      isTextExpandable,
      isExpanded,
      parentElementRef,
      textareaRef,
      handleExpandText,
      handleChange,
      handleClickParentElement
    })
}

export default useEditableField