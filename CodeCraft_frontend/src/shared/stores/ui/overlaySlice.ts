import { type StateCreator } from 'zustand'

type Overlay= "sidebar" | "userMenu" | null 

export type OverlaySliceType = {
  overlay: Overlay
  openOverlay: (overlay: "sidebar" | "userMenu") => void,
  closeOverlay: () => void
}


export const overlaySlice : StateCreator<OverlaySliceType> = (set) => ({
  overlay: null,
  openOverlay: (overlay: Exclude<Overlay, null>) => {
    set({
      overlay
    })
  },
  closeOverlay: () => {
    set({
      overlay: null
    })
  },
  toggleOverlay: (overlay: Exclude<Overlay, null>) => {
    set(state => ({
      overlay: state.overlay === overlay ? null : overlay
    }))
  }
})
