import { type StateCreator } from "zustand";


export type ErrorBanner = {
  showErrorBanner: boolean,
  textErrorBanner: string,
  openErrorBanner: (text: string) => void
  closeErrorBanner: () => void
}

export const errorBanner : StateCreator<ErrorBanner> = (set) => ({
  showErrorBanner: false,
  textErrorBanner: '',
  openErrorBanner: (text) => {
    set({
      textErrorBanner: text,
      showErrorBanner: true
    })
  },
  closeErrorBanner: () => {
    set({
      showErrorBanner: false,
    }),
    setTimeout(() => {
      set({
        textErrorBanner: '',
      })
    }, 300)
  }
})