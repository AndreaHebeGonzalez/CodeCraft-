import { JwtPayload } from "jsonwebtoken"

export type ResisterDTO = {
  name: string,
  email: string,
  password: string
}

export type LoginDTO = {
  email: string,
  password: string
}


export interface TokenPayload extends JwtPayload {
  email: string
}
