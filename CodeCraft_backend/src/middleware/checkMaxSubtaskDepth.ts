import { Request, Response, NextFunction } from "express"
import { TaskType } from "../types"
import Task from "../models/Task.model"


const MAX_DEPTH = 3

export const checkMaxSubtaskDepth = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const newTask : TaskType = req.body

    //Task root
    if(!newTask.parentTask) {
      return next()
    }

    let depth = 1

    let current = await Task.findById(newTask.parentTask)

    //No se encuentra el parent

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