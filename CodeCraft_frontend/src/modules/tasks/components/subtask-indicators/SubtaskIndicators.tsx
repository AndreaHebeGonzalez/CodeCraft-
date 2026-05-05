import { useContext, useEffect } from "react"
import type { TaskNode } from "../../types"
import useOpenElement from "@/shared/hooks/useOpenElement"
import useAppStore from "@/shared/stores/useAppStore"
import useClickOutside from "@/shared/hooks/useClickOutside"
import useAnchoredMenuPosition from "@/shared/hooks/useAnchoredMenuPosition"
import useBlockScroll from "@/shared/hooks/useBlockScroll"
import TaskPriority from "@/shared/components/tags/task-priority/TaskPriority"
import TaskStatus from "@/shared/components/tags/task-status/TaskStatus"
import { getScrollParent } from "@/shared/utils/utils"
import { PortalContext } from "@/shared/context/PortalContext"
import { StatusSelector } from "../task-selectors/StatusSelector"
import { PrioritySelector } from "../task-selectors/PrioritySelector"
import AnchoredSelector from "../anchored-selector/AnchoredSelector"
import './SubtaskIndicators.scss'


type SubtaskIndicatorsProps = {
  task: TaskNode,
  onSave: (field: string, value: string) => void
  isSubtask?: boolean 
}

const SubtaskIndicators = ({ task, onSave, isSubtask } : SubtaskIndicatorsProps) => {

  const { openByDepth } = useAppStore()

  const { boardRef } = useContext(PortalContext)

  const { isOpen: isOpenSelectorPriority, handleOpenElement : openSelectorPriority, closeElement: closeSelectorPriority } = useOpenElement()

  const { isOpen: isOpenSelectorStatus, handleOpenElement : openSelectorStatus, closeElement: closeSelectorStatus  } = useOpenElement()

  const { anchorRef: iconPriorityRef , menuRef: selectorPriorityRef, anchorRect: priorityAnchorRect, handleOpenSelector: handleOpenSelectorPriority, updateAnchorsRect: updatePiorityAnchorRect, selectorPosition: prioritySelectorPosition } = useAnchoredMenuPosition(openSelectorPriority) 

  const { anchorRef: iconStatusRef, menuRef: selectorStatusRef, anchorRect: statusAnchorRect, handleOpenSelector: handleOpenSelectorStatus, updateAnchorsRect: updateStatusAnchorRect, selectorPosition: statusSelectorPosition} = useAnchoredMenuPosition(openSelectorStatus) 
  
  const { containerRef: mainScrollRef } = useBlockScroll([isOpenSelectorStatus, isOpenSelectorPriority])
  const { containerRef: columnStateScrollRef } = useBlockScroll([isOpenSelectorStatus, isOpenSelectorPriority])

  useClickOutside([iconStatusRef, selectorStatusRef], closeSelectorStatus, true)
  useClickOutside([iconPriorityRef, selectorPriorityRef], closeSelectorPriority, true) 


  useEffect(() => {
    if(!boardRef?.current) return
      mainScrollRef.current = getScrollParent(boardRef.current)
      columnStateScrollRef.current = getScrollParent(iconStatusRef.current)
  }, [])

  useEffect(() => {
    updatePiorityAnchorRect()
    updateStatusAnchorRect()
  }, [openByDepth])

  return (
    <div
      className="subtask-indicators"
    >
      <div onClick={handleOpenSelectorPriority} ref={iconPriorityRef}>
        <TaskPriority 
          onlyIcon={true}
          variant={task.priority}
        />
        <AnchoredSelector
          isOpen={isOpenSelectorPriority}
          anchorRect={priorityAnchorRect}
          position={prioritySelectorPosition}
          selectorRef={selectorPriorityRef}
        >
          <PrioritySelector 
            value={task.priority}
            onSave={onSave}
            handleOpenSelectorPriority={openSelectorPriority}
          />
        </AnchoredSelector>
      </div>

      {
        isSubtask &&
        <div onClick={handleOpenSelectorStatus} className="subtask-indicators__selector" ref={iconStatusRef}>
          <TaskStatus
            onlyIcon={true} 
            variant={task.status}
          />

          <AnchoredSelector
            isOpen={isOpenSelectorStatus}
            anchorRect={statusAnchorRect}
            position={statusSelectorPosition}
            selectorRef={selectorStatusRef}
          >
            <StatusSelector 
              value={task.status}
              handleOpenSelectorStatus={openSelectorStatus}
              onSave={onSave}
            />
          </AnchoredSelector>
        </div>
      }
    </div>
  )
}

export default SubtaskIndicators
