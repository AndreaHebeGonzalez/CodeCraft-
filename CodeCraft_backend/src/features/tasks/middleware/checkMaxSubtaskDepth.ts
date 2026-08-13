import { Request, Response, NextFunction } from "express"
import Task from "../Task.model"
import { TaskInput } from "../tasks.types"

// Esta funcion verifica el nivel maximo de subtareas alcanzado 

const MAX_DEPTH = 3

export const checkMaxSubtaskDepth = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const newTask : TaskInput = req.body

    //Task root
    if(!newTask.parentTask) {
      return next()
    }

    let depth = 1

    let current = await Task.findById(newTask.parentTask)

    //No se encuentra el parent, mejorar respuesta y que hacer en este caso donde estando vinculada a una task padre la task padre no se encuentra en la BD

    if(!current) {
      return res.status(404).json({message: 'parent no encontrada'})
    }
  
    while(current.parentTask) {
      current = await Task.findById(current.parentTask)
      if(!current) break
      depth++
    }

    if (!current) {
      return res.status(400).json({
      message: "Jerarquía de tareas inválida (parent inexistente)"
      })
    }
    
    if(depth>MAX_DEPTH) { 
      const error = new Error(`Máximo nivel de subtareas alcanzado (${MAX_DEPTH})`)     
      return res.status(400).json({message: error.message})
    }
    
    next()

  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Hubo un error'})
  }
}