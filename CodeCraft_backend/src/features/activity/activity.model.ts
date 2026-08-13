import mongoose, { Schema, Types } from "mongoose";
import { activityEntityType, activityType } from "./activity.constants";
import { IActivity } from "./types/activity.types";

const ActivitySchema = new Schema({
  projectId: {
    type: Types.ObjectId,
    ref: "Project",
    required: true
  },
  projectTeamId: {
    type: Types.ObjectId,
    ref: "ProjectTeam"
  },
  actorId: { //User que creo la acción
    type: Types.ObjectId,
    ref: "User",
    required: true
  }, 
  targetUser: { //usuario afectado por la accion, si es necesario.
    type: Types.ObjectId,
    ref: "User"
  },
  entityType: {
    type: String,
    enum: Object.values(activityEntityType),
    required: true
  },
  entityId: { 
    type: Types.ObjectId,
    required: true
  },
  type: {
    type: String,
    enum: Object.values(activityType),
    required: true
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
},
{
  timestamps: true
})

// Historial del proyecto

ActivitySchema.index({ // ! 1
    projectId: 1,
    createdAt: -1
})

//Historial del equipo

ActivitySchema.index({
  projectTeamId: 1,
  createdAt: -1
})

// Historial de una entidad

ActivitySchema.index({
  entityType: 1,
  entityId: 1,
  createdAt: -1
})


// Actividades realizadas por un usuario
ActivitySchema.index({
  actorId: 1,
  createdAt: -1
})

//Historial por tipo de evento
ActivitySchema.index({
  projectId: 1,
  type: 1,
  createdAt: -1
})


export const Activity = mongoose.model<IActivity>('Activity', ActivitySchema)
/* 

! 1 Guardá internamente este índice ordenado primero por projectId y luego por createdAt descendente

Ej:
Proyecto A

10/07

09/07

05/07

02/07


Proyecto B

12/07

08/07

03/07
*/