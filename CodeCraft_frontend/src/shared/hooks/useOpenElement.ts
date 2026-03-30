import { useState } from "react"


function useOpenElement() {

  const [isOpen, setIsOpen] = useState(false)

  const handleOpenElement = () => {
    setIsOpen(value=>!value)
  }

  const closeElement = () => {
    setIsOpen(false)
  }

  return {
    isOpen,
    handleOpenElement,
    closeElement
  }
}

export default useOpenElement