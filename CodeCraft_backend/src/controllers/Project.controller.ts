import type { Request, Response } from "express"
import Project from "../models/Project.model"
import Task from "../models/Task.model"


export class ProjectController {

  static createProjects = async (req: Request, res: Response) => {
  
    const project = new Project(req.body) //Crea una instancia del Proyect
    //Se almacena esa instancia en la BD
    try { 
      await project.save()
      res.status(201).json({ message: 'Proyecto creado correctamente' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({})
      res.json({ data: projects })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static getProjectById = async (req: Request, res: Response) => {
    try {
      const project = req.project
      res.json({ data: project })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static updateProject = async (req: Request, res: Response) => {

    /* 
      Flujo actual:

      1 buscar proyecto
      2 verificar permisos
      3 modificar estado
      4 validar reglas
      5 guardar

      Ese flujo se parece a:

      cargar entidad
      mutar estado
      persistir

      que es el modelo clásico de Domain Model / Active Record.
    */
    try {
      const { startDate, dueDate, ...otherFields } = req.body

      /* 
        -El middleware project.ts busca el projecto a modificar por id, de encontrarlo lo almacena en la req con req.project = project.
        este sera un documento de Mongoose en memoria no solo datos planos.

        1. modifica el documento en memoria
        2. marca los campos como "dirty" en Mongoose
        3. luego haces project.save() y Mongoose genera el update automáticamente.

        Por qué no modificar directamente la base
        se podria hacer 

        await Project.findByIdAndUpdate(id, otherFields)

        pero se pierden cosas importantes ya que al hacer project.save() se ejecutan:

        schema validators
        pre-save middleware
        post-save middleware
        defaults
        getters/setters

      */

      Object.assign(req.project, otherFields)

      const touchStarDate = startDate !== undefined
      const touchDueDate = dueDate !== undefined

      if(touchStarDate || touchDueDate) {
        let startValue = startDate !== undefined ? startDate : req.task.startDate
        let dueValue = dueDate !== undefined ? dueDate : req.task.dueDate

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
          return res.status(400).json({ message: 'La fecha de entrega no puede ser anterior a la fecha de inicio del proyecto'})
        }

        if(startDate !== undefined) req.project.startDate = startValue
        if(dueDate !== undefined) req.project.dueDate = dueValue
      }
      
      await req.project.save()

      res.json({ message: 'Proyecto actualizado correctamente' })
      
    } catch (error) {
      console.error(error)
      res.status(500).json({message: 'Error interno del servidor'})
    }
  }

  static deleteProject = async (req: Request, res: Response) => { 

    try {
      const result = await Task.deleteMany({ project: req.project._id })
      await req.project.deleteOne()

      res.json({ message: 'Proyecto eliminado' })

    } catch (error) {
      console.error(error)
      res.status(500).json({message: 'Error interno del servidor'})
    }
  }
}



/* 

6. Lo único que falta para cerrar el círculo
Pendiente clave (arquitectura)

👉 Middleware global de errores en backend

Ahora tienes:

try/catch en cada controller

lógica repetida

riesgo de inconsistencias

El siguiente paso natural es:

app.use(errorHandler)


Y lanzar errores desde controllers:

throw new AppError(404, 'Proyecto no encontrado')


No es obligatorio ahora, pero es el cierre correcto de todo lo que ya estás haciendo.


*/