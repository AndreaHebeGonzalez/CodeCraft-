import { useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, easeOut, motion } from 'framer-motion'
import type { TaskNode } from '../../types'
import TaskCard from '../TaskCard/TaskCard'
import useAppStore from '@/shared/stores/useAppStore'
import './TaskWithSubtasks.scss'


const branchLineVariant = {
  idle: { 
    boxShadow: '0px 0px 0px 0px rgba(53, 39, 80, 0)'
    
  },
  glow: {
    boxShadow: "0px 0px 12px 2px rgba(53, 39, 80, 0.8)",
    backgroundColor: '#fff',
    transition: {
      duration: 0.3,
      ease: easeOut
    },
  }
}

type TaskWithSubtasks = {
  task: TaskNode | undefined,
  depth: number,
  subtask: boolean
  registerLastCardRef?: (el: HTMLDivElement | null) => void
  parentHovered?: boolean
}

const TaskWithSubtasks = ({ task, subtask, depth, registerLastCardRef, parentHovered } : TaskWithSubtasks) => {

  if(!task) return null

  const { openByDepth, openNode  } = useAppStore()
  
  const [isHovered, setIsHovered] = useState(false)

  const childrenContainerRef = useRef<HTMLUListElement>(null)
  
  const branchRef = useRef<HTMLDivElement>(null)

  const lastChildCardRefs = useRef<HTMLDivElement>(null)

  const isOpen = openByDepth[depth] === task._id

  useLayoutEffect(() => {
    if(!isOpen) return
    if(!childrenContainerRef.current) return
    if(!branchRef.current) return
  
    const lastCard =
    lastChildCardRefs.current

    if (!lastCard) return

    const containerTop =
      childrenContainerRef.current.getBoundingClientRect().top

    const lastBottom =
      lastCard.getBoundingClientRect().bottom

    branchRef.current.style.height = `${lastBottom - containerTop}px`
  
  }, [isOpen, task.children.length, openByDepth])


  return (
    <li className='parent-task'>
      {
        subtask ? 
        <motion.div 
          className='parent-task__wrapper'
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <div ref={registerLastCardRef}> 

            <motion.div 
              className="parent-task__line-to-branch" 
              variants={branchLineVariant}
              animate={parentHovered ? "glow" : "idle"}
            />

            <TaskCard 
              isSubtask={true}
              key={task._id} 
              task={task}  
              onOpenSubtasks={() => openNode(depth, task._id)}
            />

          </div>
        </motion.div>
        :
        <motion.div 
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <TaskCard 
            isSubtask={false}
            key={task._id} 
            task={task} 
            onOpenSubtasks={() => openNode(depth, task._id)}
          />
        </motion.div> 
      }
      
      <AnimatePresence>
      {
        task.children.length > 0 &&
          <motion.ul 
            ref={childrenContainerRef}
            className='parent-task__child-task'
          >
            { isOpen &&

              <motion.div 
                className='parent-task__branch-line'
                variants={branchLineVariant}
                animate={isHovered ? "glow" : "idle"}
                ref={branchRef}
              />

            }
            
            {
              isOpen &&
              task.children.map((s, index) => {
                const isLast = index === task.children.length - 1

                return (
                  <TaskWithSubtasks 
                    key={s._id}
                    task={s}
                    subtask={true}
                    depth={depth + 1}
                    registerLastCardRef={(el) => {
                      if (el && isLast ) lastChildCardRefs.current = el
                    }}
                    parentHovered={isHovered}
                  />
                )}
              )
            }          
          </motion.ul>
      }
      </AnimatePresence>  
    </li>
  )
}

export default TaskWithSubtasks