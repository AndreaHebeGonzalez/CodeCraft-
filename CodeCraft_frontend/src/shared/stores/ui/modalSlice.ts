
import type { StateCreator } from "zustand"

export type ModalSlice = {
  isOpenModal: boolean,
  title: string,
  openModal: () => void
  closeModal: () => void
}


export const modalSlice : StateCreator<ModalSlice> = (set) => ({
  isOpenModal: false,
  title: '',
  content: null,
  openModal: () => {
    set({
      isOpenModal: true
    })
  },
  closeModal: () => {
    set({
      title: '',
      isOpenModal: false,
    })
  }
})