import mongoose, { Schema } from "mongoose";
import { IUser } from "../types";


const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
    },
    email:{
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      selected: false
    },
    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local'
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },  
    confirmed: {
      type: Boolean,
      deafult: false
    },

    /* confirmationToken: {
      type: String,
      default: null
    },
    resetPasswordToken: {
      type: String,
      default: null
    },
    resetPasswordExpires: {
      type: Date,
      default: null
    },
    lastLogin: {
      type: Date
    },
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: {
      type: Date
    } */
  }, 
  {
    timestamps: true
  }
)

const User = mongoose.model<IUser>('User', userSchema) 

export default User