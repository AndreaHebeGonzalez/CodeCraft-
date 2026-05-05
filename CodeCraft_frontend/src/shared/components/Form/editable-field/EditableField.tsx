import { type InputHTMLAttributes } from "react"
import { motion } from "framer-motion"
import useEditableField from "@/shared/hooks/useEditableField"
import { TopArrow } from "@/assets/icon"
import './EditableField.scss'

type EditableFieldProps = {
  className?: string
  value: string
  field: string
  placeholder?: string
  onSave: (field: string, value: string) => void
  setEditing? : (value: boolean) => void
  setNewValue?: (value: string) => void
  shouldTruncateText?: boolean
  MAX_HEIGHT?: number
} & InputHTMLAttributes<HTMLInputElement>


const EditableField = ({ className, value, field, placeholder, onSave, setEditing, setNewValue, shouldTruncateText = false, MAX_HEIGHT } : EditableFieldProps) => {

  const {
      draft,
      setDraft,
      isTextExpandable,
      isExpanded,
      parentElementRef,
      textareaRef,
      handleExpandText,
      handleChange,
      handleClickParentElement
    } = useEditableField({ value, shouldTruncateText, MAX_HEIGHT })

  function handleBlur() {
    if(setNewValue) setNewValue(draft)
    onSave(field, draft)

    if(setEditing) {
      setEditing(false)
    }
  }


  return  ( 
    <motion.div 
      className={`editable-field ${shouldTruncateText ? 'margin-bottom' : ''}`} 
      ref={parentElementRef}
      initial="rest"
      animate={isExpanded ? "rest" : "visible"}
      whileHover="visible"
    >
      {
        shouldTruncateText && isTextExpandable && !isExpanded &&
        <div className="editable-field__overlay" />
      }
      
      <textarea 
        ref={textareaRef}
        className={className}
        name={field}
        value={draft}
        onClick={handleClickParentElement}
        onChange={(e) => handleChange(e)}
        onBlur={() => {
          handleBlur()
          if(field === 'taskName' || field === 'projectName' && draft === '') {
            setDraft(value)
          }
        }}
        onFocus={(e) => e.target.select()}
        placeholder={placeholder}
        rows={1}
      /> 
      {
        /* Si la intancia de este componente admite truncamiento de texto y si el alto del textarea supera los 150px */
        shouldTruncateText && isTextExpandable &&
        <motion.div 
          className="editable-field__btn-wrapper" 
          onClick={(e) => e.stopPropagation()}
          variants={{
            rest: { opacity: 0 },
            visible: { opacity: 1 }
          }}
        >
          <button 
            className="editable-field__expand-text-btn"
            onClick={handleExpandText}
          >
            <motion.div 
              className="editable-field__expand-text-icon"
              animate= {{ rotate: isExpanded ?  0 : 180 }}
              transition={{ ease: "linear", duration: 0.3 }}
            >
              <TopArrow 
                width={15}
                height={15}
                style={{ transform: "translateX(1.5px)" }}
              />
            </motion.div>
            {isExpanded ? 'Contraer' : 'Ampliar'}
          </button>
        </motion.div>
      }
    </motion.div>
  )
}

export default EditableField


