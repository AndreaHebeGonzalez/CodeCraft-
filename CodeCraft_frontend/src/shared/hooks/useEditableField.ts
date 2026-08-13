import { useLayoutEffect, useRef, useState } from "react"


type Params = {
  value: string
  shouldTruncateText?: boolean //Habilita el truncamiento del texto
  MAX_HEIGHT?: number //Altura maxima con texto colapsado 
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
        element.style.height = 'auto' // establece que la altura del contenedor debe ser la establecida como propiedad en el elemento eje: row=2. El navegador vuelve al tamaño "normal". Si hay una altura fijada previamente recalcula la altura normal segun la regla css.
        element.style.height = `${element.scrollHeight}px`  // scrollHeight mide cuánto espacio necesita realmente el contenido. En esta linea le doy a la altura visible el alto del scroll, cuando borro texto la altura visible sigue siendo la misma porque element.scrollHeight no se modifica, solo se modifica cuando el texto crece, pero como el area visible ya es suficiente como para que el texto completo se vea al borrar lineas, element.scrollHeigh no es recalculada, sigue siendo la misma. En cambio si agrego mas texto, y ese texto deja de entrar en el area visible element.scrollHeight se agranda y se asigna al area visible. 

        // Ambas lineas funcionan, receteando la altura asiganada con element.style.height = `${element.scrollHeight}px` en primera instancia luego el navegador recalcula element.scrollHeight y lo asigna al area visible.
      }
    }
  
    /* Esta funcion chequea si el texto es exandible o no si el alto del contenido scrolleable supera a MAX_HEIGHT es expandible, se ejecuta al cargar inicialmente el componente, si el texto es expandible o colapsa */
    
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
      if(!shouldTruncateText) return
      if(!isTextExpandable) return 
      if(isExpanded) return
      expandText(parentElementRef.current)
      setIsExpanded(true)
    }
  
    function handleChange (e: React.ChangeEvent<HTMLTextAreaElement>) {
      const element : HTMLTextAreaElement = e.target
      setDraft(e.target.value)
      autoResizeTextarea(element)
      setIsTextExpandable(element.scrollHeight > MAX_HEIGHT) 
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