import { Document, Types } from "mongoose";

export interface IToken extends Document {
  token: string,
  user: Types.ObjectId,
  createdAt: Date
}