import { format, isToday, startOfDay } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

const TIMEZONE = 'America/Sao_Paulo'

export const getGreeting = (): string => {
  const hour = new Date().getHours()
  
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

export const formatDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy')
}

export const canMarkHabit = (date: Date): boolean => {
  const targetDate = startOfDay(date)
  return isToday(targetDate)
}

export const getBrasiliaDate = (date: Date): Date => {
  return toZonedTime(date, TIMEZONE)
} 