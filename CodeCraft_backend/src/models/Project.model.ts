import mongoose, { Schema, Types } from "mongoose";
import { IProject, projectStatus } from '../types';


const ProjectSchema : Schema = new Schema(
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
