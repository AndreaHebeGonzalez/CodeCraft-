import Avatar from '@/shared/components/avatar/Avatar'
import ProjectName from '@/shared/components/tags/project-name/ProjectName'
import TaskPriority from '@/shared/components/tags/task-priority/TaskPriority'
import TaskStatus from '@/shared/components/tags/task-status/TaskStatus'
import './UpcomingTasks.scss'


const UpcomingTasks = () => {
  return (
    <ul className='upcoming-tasks'>
      <div className='upcoming-tasks__task'>
        <div className='upcoming-tasks__left'>
          <span className='upcoming-tasks__name'>Configurar Google OAuth</span>
          <div className='upcoming-tasks__date-coll'>
            <span className='upcoming-tasks__end-date'>20 de agosto</span>
            <span>-</span>
            <div className='upcoming-tasks__collaborators'>
              <Avatar 
                text='AG'
                variant='#0000ff'
              />
              <Avatar 
                text='BV'
                variant='#04BC41'
              />
              <Avatar 
                text='RM'
                variant='#85bc04ff'
              />
            </div>
          </div>
        </div>
        <div className='upcoming-tasks__right'>
          <div className='upcoming-tasks__status'>
            <TaskStatus 
              onlyIcon={false}
              variant='onHold'
            />
          </div>
          <ProjectName
            text= 'NutriPlan'
            variant= '#00ffff'
          />
          <div className='upcoming-tasks__priority'>
            <span>Prioridad: </span>
            <TaskPriority 
              onlyIcon={false}
              variant= 'low'
            />
          </div>
        </div>
      </div>
      
      <div className='upcoming-tasks__task'>
        <div className='upcoming-tasks__left'>
          <span className='upcoming-tasks__name'>Configurar Google OAuth</span>
          <div className='upcoming-tasks__date-coll'>
            <span className='upcoming-tasks__end-date'>20 de agosto</span>
            <span>-</span>
            <div className='upcoming-tasks__collaborators'>
              <Avatar 
                text='AG'
                variant='#0000ff'
              />
              <Avatar 
                text='BV'
                variant='#04BC41'
              />
              <Avatar 
                text='RM'
                variant='#85bc04ff'
              />
            </div>
          </div>
        </div>
        <div className='upcoming-tasks__right'>
          <div className='upcoming-tasks__status'>
            <TaskStatus
              onlyIcon={false} 
              variant='onHold'
            />
          </div>
          <ProjectName
            text= 'NutriPlan'
            variant= '#00ffff'
          />
          <div className='upcoming-tasks__priority'>
            <span>Prioridad: </span>
            <TaskPriority 
              onlyIcon={false}
              variant= 'low'
            />
          </div>
        </div>
      </div>
    </ul>
  )
}

export default UpcomingTasks