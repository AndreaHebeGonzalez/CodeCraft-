import type { Location } from "react-router-dom";
import type { dueStatusLabels } from "../locales/es";


export type ModalState = {
  backgroundLocation?: Location;
}

export type DueStatus = keyof typeof dueStatusLabels


export type ApiResponse = {
  message: string
}