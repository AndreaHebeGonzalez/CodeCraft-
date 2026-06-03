import type { Location } from "react-router-dom";
import type { dueStatusLabels } from "../locales/es";
import type { Dispatch } from "react";


export type ModalState = {
  backgroundLocation?: Location
}

export type DueStatus = keyof typeof dueStatusLabels


export type ApiResponse<T> = { 
  message: string
  data?: T 
}

export type ApiErrorResponse<T> = {
  message: string
  error?: T
}

export type LoginDataResponse  = { token : string}

/* Async Feedback */

export type AsyncFeedbackState = {
  lottieAnimation: object | null
  animationVariantStyles: "fixed" | "static"
  showRedirectCountdown: boolean
  activeOverlay: boolean
  isLoading: boolean
  isSuccess: boolean
  redirectTo: string
  message?: string
}

export type AsyncFeedbackContextType = {
  feedback: AsyncFeedbackState
  setFeedback: Dispatch<React.SetStateAction<AsyncFeedbackState>>
}