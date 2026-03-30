import { type StateCreator } from "zustand";

export type BreakpointSlice = {
  isMobile: boolean,
  isTablet: boolean,
  isTabletTwo: boolean
}

export const breakpointSlice : StateCreator<BreakpointSlice> = () => ({
  /* >= 480 */
  isMobile: false,
  /* >= 768 */
  isTablet: false,
  /* >= 992 */
  isTabletTwo: false,
})