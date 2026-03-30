import { AnimatePresence, motion } from 'framer-motion'
import './OverflowTooltip.scss'
import { TooltipArrow } from '@/assets/icon'

type OverflowTooltipProps = {
  text: string
  position?: 'absolute' | 'static' //Cuando se usa con children necesita position absolute para ubicarse respecto del contenedor sobre el que se hace hover
  arrowPosition: 'bottom' | 'left'
  contentLayout: 'compact' | 'multiline'
  showTooltip?: boolean //Habilita el uso del tooltip como condicion inicial
  isHover?: boolean // True cuando se hace hover sobre el elemento disparador
}

const OverflowTooltip = ({ text, showTooltip = true, isHover = true, position = 'absolute', arrowPosition = 'bottom', contentLayout= 'multiline' } : OverflowTooltipProps) => {

  return (
    <AnimatePresence>
        {
          showTooltip && isHover && (
          <motion.div 
            className={`overflow-tooltip overflow-tooltip--${position}`}
            initial={{ opacity: 0, y: -5}}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.2 } }}
            exit={{ opacity: 0, y: -5 }}
          >
            <div className={`overflow-tooltip__arrow-icon-wrapper overflow-tooltip__arrow-icon-wrapper--${arrowPosition}`}>
              <TooltipArrow 
                className='overflow-tooltip__icon-md'
              />
            </div>
            <p
              className={`overflow-tooltip__text overflow-tooltip__text--${contentLayout} `}
            >{text}</p>
            
          </motion.div>)
        }
      </AnimatePresence>
  )
}

export default OverflowTooltip