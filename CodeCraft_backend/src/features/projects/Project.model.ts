import mongoose, { Schema, Types } from "mongoose";
import { IProject } from "./project.types"; 
import { projectStatus } from "./project.constants";


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
    projectTeams: [
      {
        type: Types.ObjectId,
        ref: 'ProjectTeam'
      }
    ],
    collaborators: [
      {
        type: Types.ObjectId,
        ref: 'ProjectCollaborator'
      }
    ],
    owner: {
      type: Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: Object.values(projectStatus), 
      default: "notStarted",
    },
    structureVersion: { //incrementa por: 1. creacion de task, eliminacion de task
      type:Number,
      default:0
    }
  },
  {
    timestamps: true
  }
)

const Project = mongoose.model<IProject>('Project', ProjectSchema) 

export default Project
