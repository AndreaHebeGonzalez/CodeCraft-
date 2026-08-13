import mongoose, { Schema, Types } from "mongoose";
import { IToken } from "./token.types";


const tokenSchema : Schema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now, //genera la fecha al momento de la creacion,
      expires: "10m"  //“Elimina automáticamente este documento 1 día después del valor de createdAt”.
    }
  },
)

  const Token = mongoose.model<IToken>('Token', tokenSchema)

  export default Token