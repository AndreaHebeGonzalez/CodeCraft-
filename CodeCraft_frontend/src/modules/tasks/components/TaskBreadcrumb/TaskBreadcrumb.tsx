import { Link } from "react-router-dom"
import type { GetTaskByIdResponse } from "../../types"
import { RightArrow } from "@/assets/icon"
import './TaskBreadcrumb.scss'



export type TaskBreadcrumbProps = {
  breadcrumbs: GetTaskByIdResponse['breadcrumbs']
}

const TaskBreadcrumb = ({ breadcrumbs } : TaskBreadcrumbProps) => {

  return (
    <ul className="breadcrumb">
        {
          breadcrumbs.map(i=>
          (<li className="breadcrumb__item">
            <Link to={location.pathname + `?modalType=task&taskId=${i._id}`}>
              {i.taskName}
            </Link>
            {
              breadcrumbs.length >= 1 &&
              <RightArrow
                className="breadcrumb__arrow"
                width={15}
                height={15}
              />
            }
            
          </li>))
        }
      </ul>
  )
}

export default TaskBreadcrumb