import { format, parseISO, differenceInHours } from 'date-fns' 
import { es } from 'date-fns/locale'
import type { DueStatus } from '../types'
import { capitalizeFirstLetter } from './utils'



export const formatDate = (date? : Date | null) => {
  if(!date) return undefined
  return date
}

export const dateAtEndOfDay = (date : Date) => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23, 59, 59, 999
  )
}

export const dateAtStartOfDay = (date: Date) => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0, 0, 0, 0
  )
}

export const formatDateToWords =  (isoString: string) => {
  const date = parseISO(isoString)
  return format(date, "d 'de' MMMM", { locale: es })
}

export const formatDateShortMonth =  (isoString: string) => {
  const date = parseISO(isoString)
  return format(date, "d '-' MMM", { locale: es })

}

export const isBeforeToday = (isoString: string) => {
  const date = parseISO(isoString)
  const currentDate = dateAtEndOfDay(new Date())
  return date <= currentDate //ya comenzó antes de hoy
}

export const isToday = (isoString: string) => {
  const date = parseISO(isoString)
  const currentDate = dateAtEndOfDay(new Date())
  return date === currentDate //comienza hoy
}

export const syncDatesLogic = (prevDate: Date, newSelectedDate: Date, newSelectedDateName: 'startDate' | 'dueDate') => {
  if(newSelectedDateName === 'dueDate') { //prev: startDate
    if(prevDate && prevDate > newSelectedDate) {
      return dateAtEndOfDay(prevDate)
    } else {
      return newSelectedDate
    }
  } else { //prev: dueDate
    if(prevDate &&  prevDate < newSelectedDate) {
      return dateAtStartOfDay(prevDate)
    } else {
      return newSelectedDate
    }
  }
}

export const getDueStatus = (dueDate: Date | undefined | null) : DueStatus | '' => {
  if(!dueDate) return ''
  const now = new Date()
  if(dueDate.getTime() < now.getTime()) return 'overdue'
  const diffHours = differenceInHours(dueDate, now)
  if(diffHours < 24) return 'dueSoon'
  return ''
}


export const getDueStatusExtend = (dueDate: Date | undefined | null) => {
  if(!dueDate) return ''
  const now = new Date()
  if(dueDate.getTime() < now.getTime()) return 'Plazo vencido'
  const diffHours = differenceInHours(dueDate, now)
  if(diffHours < 24) return 'Vence hoy'
  if(diffHours < 48) return 'Vence mañana'
  if(diffHours < 24 * 7) return 'Vence en una semana'
  return ''
}

export function DateGenerate() {
  const date = new Date()

  const formatter = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month:'long'
  })
  const day = capitalizeFirstLetter(formatter.format(date))
  return day
}