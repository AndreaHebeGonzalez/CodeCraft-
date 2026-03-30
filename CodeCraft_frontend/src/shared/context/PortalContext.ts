import { createContext, type RefObject } from "react";

type PortalContextValue = {
  boardRef: RefObject<HTMLDivElement | null> | null
}

export const PortalContext = createContext<
  PortalContextValue
>({
  boardRef: null
});
