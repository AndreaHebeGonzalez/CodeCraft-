import { useMemo, useRef } from "react"
import type { Tasks, TasksByProjectResponseDomain, TaskStatusType } from "../../types"
import { buildTree } from "@/shared/utils/buildTree"
import TaskWithSubtasks from "../TaskWithSubtasks/TaskWithSubtasks"
import { PortalContext } from "@/shared/context/PortalContext"
import './TaskBoard.scss'


type TaskBoardProps = {
  projectTasks: TasksByProjectResponseDomain
}

type GroupTask = {
  [key in TaskStatusType]: Tasks
}

const statusTranslations : { [key in TaskStatusType]: string} = {
  pending: 'Pendiente',
  onHold: 'En espera',
  inProgress: 'En progeso',
  underReview: 'En revisión',
  completed: 'Completado'
} 

export const TaskBoard = ({ projectTasks } : TaskBoardProps) => {

  const boardRef = useRef<HTMLDivElement>(null) 

  const tasks = projectTasks.map(object => object.task)

  const groupedTasks = useMemo<GroupTask>(() => { 
    const acc : GroupTask =  {
      pending: [],
      onHold: [],
      inProgress: [],
      underReview: [],
      completed: []
    }

    for(const task of tasks) {
      if(task.parentTask !== null) continue
      acc[task.status].push(task)
    }

    return acc
  }, [tasks])

  const { mapTasks } = useMemo(() => 
    buildTree(tasks)
  , [tasks])

  return (
    <PortalContext.Provider value={{ boardRef }}>
      <div className="task-board" ref={boardRef}>
        {
          (Object.entries(groupedTasks) as [TaskStatusType, Tasks][]).map(([status, tasks]) => (
            <div className="task-board__column" key={status}>
              <h3 className="task-board__status">{statusTranslations[status]}</h3>
              <div className={`task-board__color task-board__color--${status}`}></div>
              <ul className="task-board__tasks-status">
                {
                  tasks.length === 0 ? (
                    <li className="task-board__no-task">Soltar tarea aquí</li>
                  ) : (
                    tasks.map(task => 
                      <TaskWithSubtasks 
                        key={task._id}
                        task={mapTasks.get(task._id.toString())}
                        subtask={false}
                        depth={0}
                      />
                    )
                  )
                }
              </ul>
            </div>
          ))
        }
      </div>
    </PortalContext.Provider>
  )
}
