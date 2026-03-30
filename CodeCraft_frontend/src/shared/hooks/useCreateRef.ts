import { useRef } from "react";



export default function useCreateRef() {

  const calendarRef = useRef<HTMLDivElement | null>(null)
  const iconRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const startButtonRef = useRef<HTMLButtonElement | null>(null)
  const buttonRef = useRef<HTMLDivElement | null>(null)

  return {

    calendarRef,
    iconRef,
    inputRef,


    startButtonRef,
    buttonRef
  }
}