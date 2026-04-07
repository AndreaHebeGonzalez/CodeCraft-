import { Router } from "express"
import { ProjectController } from "../controllers/project.controller"
import { validateCreateProyect, validateUpdateProject } from "../validators/project.validator"
import { validateRequest } from "../middleware/validation"
import { validateObjectIdParam } from "../validators/params"
import { TaskControllers } from "../controllers/task.controller"
import { projectExist } from "../middleware/project"
import { validateCreateTasks, validateUpdateTask } from "../validators/task.validator"
import { taskBelongsToProject, taskExist } from "../middleware/task"
import { checkMaxSubtaskDepth } from "../middleware/checkMaxSubtaskDepth"

const router = Router()

router.param('projectId', projectExist) 

/* Project */ 

router.post('/', validateCreateProyect, validateRequest, ProjectController.createProjects)

router.get('/', ProjectController.getAllProjects)

router.get('/:projectId', ProjectController.getProjectById)

router.patch('/:projectId', validateUpdateProject, validateRequest, ProjectController.updateProject)

router.delete('/:projectId', ProjectController.deleteProject)


/* Task */

router.param('taskId', taskExist) 
router.param('taskId', taskBelongsToProject)

router.post('/:projectId/tasks', validateCreateTasks, validateRequest, checkMaxSubtaskDepth, TaskControllers.createTask)

router.get('/:projectId/tasks', TaskControllers.getProjectTasks)

router.get('/:projectId/tasks/:taskId', TaskControllers.getTaskByID)

router.patch('/:projectId/tasks/:taskId', validateUpdateTask, validateRequest, TaskControllers.updateTask)

router.delete('/:projectId/tasks/:taskId', TaskControllers.deleteTask)

export default router