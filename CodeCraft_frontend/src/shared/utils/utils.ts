import type { TaskFormData, TaskFormDataNormalized } from "@/modules/tasks/types"




/* Viene en string necesito Date */

export function mapDTOToDomain<T extends Record<string, any>, K extends keyof T> (data: T, dateKeys: K[]) : Omit<T, K> & { [P in K] : Date | null } {
  const result = { ...data } as any

  for (const key of dateKeys) {
    const value = data[key]

    result[key] = value ? new Date(value as string) : null
  }

  return result as Omit<T, K> & {[P in K] : Date | null}
}


type MapTaskDates<T extends { task : {
    startDate: string | null
    dueDate: string | null
  }}> = Omit<T, 'task'> & {
  task: Omit<T['task'], 'startDate' | 'dueDate'> & {
    startDate: Date | null
    dueDate: Date | null
  }
}

export function mapTaskPropertyToDomain<
  T extends { task : {
    startDate: string | null
    dueDate: string | null
  }}
  > (data: T) : 

  MapTaskDates<T>
  
{
  return {
    ...data,
      task: mapDTOToDomain(data.task, ['startDate', 'dueDate'])
  }
}


/* export function mapTaskPropertyToDomain<T extends Record<string, any>, K extends keyof T, D extends T[K]> (data: T, key: K, dateKeys: D) : 
  Omit<T, K> & { [P in K] : Omit<T[K], D> & {[Q in D] : Date | null}}
{
  return {
    ...data,
      [key]: mapDTOToDomain(data[key], dateKeys)
  }
} */


//Elimina propiedades con valor falsy
export const cleanFormData = <T extends object>(data: T): T => {
  
  const newValue =  Object.keys(data).reduce((acc, key) => {

    const value = data[key as keyof T]

    if(data[key as keyof T]) acc[key as keyof T] = value
    
    return acc

  }, {} as T)
  
  return newValue
}

export const capitalizeFirstLetter = (word: string) => {
  const firsLetter = word.slice(0, 1)
  const formatted = firsLetter.toUpperCase() + word.slice(1)
  return formatted
}

export const normalizeTaskFormData = (formData: TaskFormData, taskId: string) : TaskFormDataNormalized => {
  const { rangeDates, ...data } = formData
  return ({
    ...data,
    parentTask: taskId,
    startDate: formData.rangeDates?.from === undefined ? null : formData.rangeDates?.from,
    dueDate: formData.rangeDates?.to === undefined ? null : formData.rangeDates?.to
  })
}


/* SCROLL */

export const getScrollParent = (node: HTMLElement | null): HTMLElement | null => {
  if (!node) return null

  let parent = node.parentElement

  while (parent) {
    const { overflowY } = getComputedStyle(parent)

    if (overflowY === 'auto' || overflowY === 'scroll') {
      return parent
    }

    parent = parent.parentElement
  }

  return document.scrollingElement as HTMLElement
}

export type ScrollLock = {
  lock: () => void
  unlock: () => void
}

export const blockScroll = (element: HTMLElement) => {

  const prevent = (e: Event) => {
    e.preventDefault()
  }

  element.addEventListener('wheel', prevent, { passive: false })
  element.addEventListener('touchmove', prevent, { passive: false })

  return () => {
    element.removeEventListener('wheel', prevent)
    element.removeEventListener('touchmove', prevent)
  }
}