import { create } from "zustand"
import { modalSlice, type ModalSlice } from './ui/modalSlice'
import { errorBanner, type ErrorBanner } from "./ui/errorBannerSlice"
import { notificationApp, type NotificationApp } from "./ui/notificationApp"
import { breakpointSlice, type BreakpointSlice } from "./ui/breakpointSlice"
import { taskTreeSlice, type TaskTreeSlice } from "./ui/taskTreeSlice"


const useAppStore = create<ModalSlice & ErrorBanner & NotificationApp & BreakpointSlice & TaskTreeSlice>((...a) => ({
  ...modalSlice(...a),
  ...errorBanner(...a),
  ...notificationApp(...a),
  ...breakpointSlice(...a),
  ...taskTreeSlice(...a)

}))

export default useAppStore