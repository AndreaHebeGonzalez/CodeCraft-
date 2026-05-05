import type { AppErrorKind } from "./error.types"



type AppErrorParams = {
  kind: AppErrorKind
  userMessage?: string
  technicalMessage?: string
  status?: number
  details?: unknown
}

export class AppError extends Error {
  kind: AppErrorKind
  status?: number
  details?: unknown
  userMessage?: string

  constructor(params: AppErrorParams) {
    super(params.technicalMessage || params.userMessage || "AppError")

    this.kind = params.kind
    this.status = params.status
    this.details = params.details
    this.userMessage = params.userMessage
  }
}