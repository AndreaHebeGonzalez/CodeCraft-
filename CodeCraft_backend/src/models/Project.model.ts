import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { ITask } from '../types';


export const projectStatus = {
  NOT_STARTED: 'notStarted',
  IN_PROGRESS: 'inProgress',
  AT_RISK: 'atRisk',
  COMPLETED: 'completed'
} as const 

export type ProjectStatus = typeof projectStatus[keyof typeof projectStatus]

export interface IProject extends Document  {
  projectName: string
  clientName: string
  description: string
  startDate: Date | null
  dueDate: Date | null
  isOverdue: boolean
  /* owner: mongoose.Types.ObjectId
  collaborators: mongoose.Types.ObjectId[] */
  tasks: PopulatedDoc<ITask & Document>[]
  status: ProjectStatus,
  
}

const ProjectSchema = new Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true
    },
    clientName: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    startDate: {
      type: Date,
      default: null
    },
    dueDate: {
      type: Date,
      default: null
    },
    isOverdue: {
      type: Boolean,
      default: false
    },
    tasks: [
      {
        type: Types.ObjectId,
        ref: 'Task'
      }
    ], 
    status: {
      type: String,
      enum: Object.values(projectStatus), 
      default: "notStarted",
    },
  },
  {
    timestamps: true
  }
)

const Project = mongoose.model<IProject>('Project', ProjectSchema) 

export default Project
