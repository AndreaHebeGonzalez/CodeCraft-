import mongoose, { Schema, Types } from "mongoose";
import { ITask } from "./tasks.types";
import { taskPriority, taskStatus } from "./task.constants";


export const TaskSchema = new Schema(
  {
    taskName: {
      type: String, 
      required: true,
      trim: true
    },
    description: {
      type: String, 
      trim: true
    },
    projectId: {
      type: Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true
    },
    parentTask: { 
      type: Types.ObjectId, 
      ref: "Task",
      default: null,
      index: true
    }, 
    assignedProjectTeams: {
      type: [
        {
          type: Types.ObjectId, 
          ref: "ProjectTeam"
        }
      ],
      default: []
    },
    assignedProjectCollaborator: {
      type: [
        {
          type: Types.ObjectId, 
          ref: "ProjectCollaborator"
        }
      ],
      default: []
    },
    status: {
      type: String,
      enum: Object.values(taskStatus),
      default: taskStatus.PENDING
    },
    priority: {
      type: String,
      enum: Object.values(taskPriority),
      default: taskPriority.MEDIUM
    },
    startDate: {
      type: Date,
      default: null
    },
    dueDate: {
      type: Date,
      default: null
    },
    completedAt: {
      type: Date,
      default: null
    },
    startedAt: { //representa la fecha en que la tasj cambio a inProgress
      type: Date,
      default: null
    },
    isOverdue: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

TaskSchema.index({
  assignedProjectTeams: 1
})

TaskSchema.index({
  assignedProjectCollaborator: 1
})


const Task = mongoose.model<ITask>('Task', TaskSchema)



export default Task

/* 
1. Nombre
2. Descripción 

3. Estado -valor por defecto-
4. Prioridad
5. Creador de la tarea
6. Responsables
7. Fecha de creación
8. Fecha de entrega
9. Fecha de Actualización
10. Subtareas vinculadas --> Son nuevas tareas pero vinculadas a esta tarea en jerarquía
11. Notas o comentarios dentro de la tarea.
12. Historial de cambios
13. PROYECTO AL CUAL PERTENECE
*/

/* 
Relaciones

Cada tarea tiene un proyecto, un proyecto puede tener muchas tareas

*/