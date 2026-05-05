import type { StateCreator } from "zustand";

export type NotificationApp = {
  showNotification: boolean
  textNotification: string
  isError: boolean
  openNotification: (text: string, isError?: boolean) => void
  closeNotification: () => void
  setIsError: (value: boolean) => void
}

export const notificationApp : StateCreator<NotificationApp>= (set) => ({
  showNotification: false,
  textNotification: '',
  isError: false,
  openNotification: (text, isError = false) => {
    set({
      showNotification: true,
      textNotification: text,
      isError
    })
  },
  closeNotification: () => {
    set({
      showNotification: false,
      textNotification: ''
    })
  },
  setIsError: (value) => {
    set({
      isError: value
    })
  }
})