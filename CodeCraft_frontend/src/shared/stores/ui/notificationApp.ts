import type { StateCreator } from "zustand";

export type NotificationApp = {
  showNotification: boolean
  text: string
  isError: boolean
  openNotification: (text: string, isError?: boolean) => void
  closeNotification: () => void
  setIsError: (value: boolean) => void
}

export const notificationApp : StateCreator<NotificationApp>= (set) => ({
  showNotification: false,
  text: '',
  isError: false,
  openNotification: (text, isError = false) => {
    set({
      showNotification: true,
      text,
      isError
    })
  },
  closeNotification: () => {
    set({
      showNotification: false,
      text: ''
    })
  },
  setIsError: (value) => {
    set({
      isError: value
    })
  }
})