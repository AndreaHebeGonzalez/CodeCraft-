import { Request, Response } from "express"
import Task from "./Task.model"
import { getAllSubtaskByTaskId } from "./task.utils"
import { startSession, Types } from "mongoose"
import Project from "../projects/Project.model"
import { errorTypes } from "../../errors/errorTypes.constants"
import { createActivity } from "../activity/activity.service"
import { getActivityData } from "../activity/activity.utils"
import { TaskEditableFields } from "./tasks.types"
import { isTaskUpdatedField } from "./task.typeGuard"




export class TaskControllers {

  static createTask = async (req: Request, res: Response) => {

    const session = await startSession()
    try {
      let attempts  = 0
      while(attempts < 3) {

        try {
          session.startTransaction()

          //Obtengo el proyecto nuevamente

          const project = await Project.findById(req.project._id).session(session)

          if(!project) {
            await session.abortTransaction()
            return res.status(404).json({
              message: "El proyecto no existe"
            })
          }

          //Verifico la version del array de tasks

          const currentVersion = project.structureVersion

          //Creo task
          const task = new Task(req.body)

          if(task.parentTask) {
            //Si tiene parenTask verifico que esta exista en la BD
            const parentTask = await Task.findById(task.parentTask).session(session)

            //Si no existe devuelvo error
            if(!parentTask) {
              await session.abortTransaction()
              return res.status(404).json({ message: "La tarea asociada no existe" })
            }
          }

          //Si existe guardo la ref del proyecto en la nueva task dentro dela transaccion

          task.projectId = req.project.id
          await task.save({ session })

          /*Intento actualizar el proyecto en el array de task y en el registro de structureVersion, si la version no coincide con la guardada la operacion devuelve:
          {
            matchedCount:0,
            modifiedCount:0
          }
          */

          const result = await Project.updateOne(
            {
                _id: project._id,
                structureVersion: currentVersion
            },
            {
                $push:{
                    tasks: task._id
                },

                $inc:{
                    structureVersion:1
                }
            },
            {
              session
            }
          )

          if(result.matchedCount === 0) {
            throw new Error(
              errorTypes.PROJECT_TASK_TREE_VERSION_CONFLICT
            )
          }
          
          await session.commitTransaction()

          const activityData = getActivityData(req.project._id, req.user._id, "TASK", task._id)


          await createActivity("TASK_CREATED", activityData, { taskName: task.taskName })

          return res.status(201).json({ message: 'Tarea creada correctamente', data: task })

        } catch (error) {
          if (session.inTransaction()) {
            await session.abortTransaction()
          }

          if(error instanceof Error && error.message === errorTypes.PROJECT_TASK_TREE_VERSION_CONFLICT) {
            attempts++
            continue
          }
          throw error
        } 
      }

      res.status(409).json({
        message: "No se pudo crear la tarea por conflictos de concurrencia"
      })

    } catch (error) {
      res.status(500).json({message: 'Hubo un error'})
    } finally {
      await session.endSession()
    }
  }

  static getProjectTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({ projectId: req.project._id })
      .select('_id projectId taskName status priority parentTask startDate dueDate completedAt createdAt updatedAt')
      .lean()

      const tasksWithBreadcrumbs = await Promise.all(tasks.map(async (task) => {
        const breadcrumbs = []
        let current = task

        while(current.parentTask) {
          const parent = await Task.findById(current.parentTask)
          .select("_id taskName parentTask")
          .lean()

          if(!parent) break

          breadcrumbs.unshift(parent.taskName)
          current = parent
        }


        /* 
        En getTaskById devuelvo breadcrumbs como propiedad aparte en el objeto de respuesta, en este caso lo envio dentro de la task como propiedad interna, puedo tratar a ambos casos de la misma manera
        */
      
        return {
          task,
          breadcrumbs
        }

      }))
      
      res.json({ data: tasksWithBreadcrumbs })
    } catch (error) {
      res.status(500).json({ message: 'Hubo un error' })
    }
  }

  /* Dado el id del proyecto, traer informacion del proyecto */

  static getTaskByID = async (req: Request, res: Response) => {
    try {
      const task = req.task.toObject()
      
      const breadcrumbs = []
      let depth = 0
      let current = task


      while(current.parentTask) {
        
        const parent = await Task.findById(current.parentTask)
        .select("_id taskName parentTask")
        .lean()

        if(!parent) break

        depth++
        breadcrumbs.unshift(parent)
        current = parent
      }

      const subtasks = await Task.find({parentTask: task._id})
      .select("_id taskName status")
      .lean()

      res.json({ data: {
        task,
        breadcrumbs,
        subtasks,
        depth
      }})
    } catch (error) {
      res.status(500).json({ message: 'Hubo un error' })
    }
  }

  static updateTask = async (req: Request, res: Response) => {

    try {
      const { startDate, dueDate, taskName, description, status, priority } = req.body

      const changedFields = Object.keys(req.body.toObject()) as Array<keyof TaskEditableFields>
      
      const previousTask = req.task.toObject()

      Object.assign(req.task, {
        ...(taskName !== undefined && taskName !== null && { taskName }),
        ...(description in req.body && description !== null && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority } )
      })
      
      //Guardo fechas de inicio y finalizacion de la tarea

      if(req.body.hasOwnProperty("status")) {
        if(status === "inProgress") {
          req.task.startedAt = new Date()
        } else if(status === "completed") {
          req.task.completedAt = new Date()
        }
      }

      //Validacion de dueDate con respecto a la fecha almacenada en la base de datos, las modificaciones de las fechas son aisladas, no se modifican en la misma solicitud
      const touhStartDate = startDate !== undefined
      const touhDueDate = dueDate !== undefined

      if(touhStartDate || touhDueDate) {
        let startValue = startDate !== undefined ? startDate : req.task.startDate
        let dueValue = dueDate !== undefined ? dueDate : req.task.startDate

        if(startValue) {
          const start = new Date(startValue)
          start.setHours(0, 0, 0, 0)
          startValue = start
        }

        if(dueValue) {
          const due = new Date(dueValue)
          due.setHours(23, 59, 59, 999)
          dueValue = due
        }

        if(startValue && dueValue && dueValue < startValue) {
          const error = new Error('La fecha de entrega no puede ser anterior a la fecha de inicio de la tarea')
          return res.status(400).json({ message: error.message })
        }
      
        if(startDate !== undefined) req.task.startDate = startValue
        if(dueDate !== undefined) req.task.dueDate = dueValue
        
      }

      const task = (await req.task.save()).toObject() 

      const activityData  = getActivityData(req.project._id, req.user._id, "TASK", task._id)

      for(const field of changedFields) {
        if(field === "startDate" ||  field === "dueDate") {
          if(field === "startDate" && task.startDate?.getTime() !== previousTask.startDate?.getTime()) {
            await createActivity("TASK_START_DATE_CHANGED", activityData, {
              previousDate: previousTask.startDate,
              currentDate: task.startDate
            })
          }
          if(field === "dueDate" && task.dueDate?.getTime() !== previousTask.dueDate?.getTime()) {
            await createActivity("TASK_DUE_DATE_CHANGED", activityData, {
              previousDate: previousTask.dueDate,
              currentDate: task.dueDate
            })  
          }
        } else if(field === "status") {
          if(previousTask.status === "completed" && task.status !== "completed") {
            await createActivity("TASK_REOPENED", activityData, {
              previousStatus: previousTask.status,
              newStatus: task.status
            })
          } else if(previousTask.status !== "completed" && task.status === "completed") {
            await createActivity("TASK_COMPLETED", activityData, {
              previousStatus: previousTask.status,
              newStatus: task.status
            })
          } else if(previousTask.status !== task.status) {
            await createActivity("TASK_STATUS_CHANGED", activityData, {
              previousStatus: previousTask.status,
              newStatus: task.status
            })
          }
        } else if(field === "priority" && previousTask.priority !== task.priority) {
          await createActivity("TASK_PRIORITY_CHANGED", activityData, {
            previousPriority: previousTask.priority,
            newPriority: task.priority
          })
        } else if(isTaskUpdatedField(field)) {
          await createActivity("TASK_UPDATED", activityData, {
            field: field,
            previousValue: previousTask[field],
            currentValue: task[field]
          })
        }
      }

      res.json({ message: 'Tarea actualizada correctamente' })

    } catch (error) {
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static deleteTask = async(req: Request, res: Response) => {

    const session = await startSession()
    let attempts = 0

    try {
      while (attempts < 3) {
        try {
          session.startTransaction()

          const project = await Project.findById(req.project._id).session(session)

          if(!project) {
            await session.abortTransaction()
            return res.status(404).json({ message: "Proyecto no encontrado" })
          }

          const currentVersion = project.structureVersion
        
          const projectTasks = await Task.find({
            projectId: req.project._id
          })
          .session(session)
          .select('_id parentTask')

          const descendantTaskIds : Types.ObjectId[] = getAllSubtaskByTaskId(projectTasks, req.task._id)

          await Task.deleteMany({
            _id: { $in: descendantTaskIds}
          }, { session })

          const result = await Project.updateOne(
            {
              _id: project._id,
              structureVersion: currentVersion
            },
            {
              $pull: {
                tasks: {
                  $in: descendantTaskIds
                }
              },
              $inc: {
                structureVersion: 1
              }
            },
            {
              session
            }
          )

          if(result.matchedCount === 0) {
            throw new Error(errorTypes.PROJECT_TASK_TREE_VERSION_CONFLICT)
          }

          await session.commitTransaction()

          const activityData  = getActivityData(req.project._id, req.user._id, "TASK", req.task._id)

          await createActivity("TASK_DELETED", activityData, {
            taskName: req.task.taskName
          })

          return res.json({ message: 'Tarea eliminada correctamente' }) 

        } catch (error) {
          if(session.inTransaction()) {
            await session.abortTransaction()
          }

          if(error instanceof Error && error.message === errorTypes.PROJECT_TASK_TREE_VERSION_CONFLICT) {
            attempts++
            continue
          }

          throw error
        }
      }

      res.status(409).json({ 
        message: "No se pudo eliminar la tarea por conflictos de concurrencia"
      })

    } catch (error) {
      res.status(500).json({ message: 'Hubo un error' })

    } finally {
      await session.endSession()
    }
  }
}
