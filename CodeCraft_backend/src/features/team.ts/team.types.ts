import { Document, Types } from "mongoose";

export interface ITeam extends Document {
  name: string,
  description?: string,
  createdBy: Types.ObjectId
}

