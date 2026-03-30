import { Request, Response } from "express"
import Task from "../models/Task.model"
import { ITask } from "../types"



export class TaskControllers {

  static createTask = async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body)

      task.project = req.project.id
      req.project.tasks.push(task.id)
      await Promise.all([task.save(), req.project.save()])
      res.status(201).json({ message: 'Tarea creada correctamente', data: task })

    } catch (error) {
      res.status(500).json({message: 'Hubo un error'})
    }
  }

  static getProjectTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({project: req.project.id})
      .select('_id project taskName status priority parentTask startDate dueDate createdAt updatedAt')
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
      const task : ITask = req.task
      
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
      const { startDate, dueDate, ...otherFields } = req.body
      
      
      //Validacion de dueDate con respecto a la fecha almacenada en la base de datos, las modificaciones de las fechas son aisladas, no se modifican en la misma solicitud

      Object.assign(req.task, otherFields)

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

      await req.task.save()

      res.json({ message: 'Tarea actualizada correctamente' })
    } catch (error) {
      res.status(500).json({ message: 'No se pudo conectar con la BD' })
    }
  }

  static deleteTask = async(req: Request, res: Response) => {

    try {
      
      const subtasks = await Task.find({parentTask: req.task.id})
      const allIdsToRemove = [req.task._id, ...subtasks.map(s => s._id)]

      //se debe eliminar la referencia a esta tarea dentro del documento del proyecto
      req.project.tasks = req.project.tasks.filter(id => !allIdsToRemove.includes(id))

      //Pensar en transacciones de MongoDB para este controlador

      await Promise.all(subtasks.map(s => s.deleteOne())) 
      await Promise.all([req.task.deleteOne(), req.project.save()])

      res.json({ message: 'Tarea eliminada correctamente' })
    } catch (error) {
      res.status(500).json({ message: 'Hubo un error' })
    }
  }

  
}
