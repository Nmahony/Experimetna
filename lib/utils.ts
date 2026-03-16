import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format, isToday, isTomorrow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'd MMM yyyy')
}

export function formatRelativeDate(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatMeetupDate(date: string | Date): string {
  const d = new Date(date)
  if (isToday(d)) return 'Today'
  if (isTomorrow(d)) return 'Tomorrow'
  return format(d, 'EEE d MMM')
}

export function formatAgeRange(minMonths: number, maxYears: number): string {
  const minStr = minMonths === 0 ? 'Newborn' : minMonths < 12 ? `${minMonths}m` : `${Math.floor(minMonths / 12)}yr`
  const maxStr = `${maxYears}yr`
  return `${minStr} – ${maxStr}`
}

export function getWeatherEmoji(wmoCode: number): string {
  if (wmoCode === 0) return '☀️'
  if (wmoCode <= 3) return '⛅'
  if (wmoCode <= 48) return '🌫️'
  if (wmoCode <= 67) return '🌧️'
  if (wmoCode <= 77) return '❄️'
  if (wmoCode <= 82) return '🌦️'
  return '⛈️'
}

export function isGoodOutdoorDay(wmoCode: number, tempC: number): boolean {
  return wmoCode <= 3 && tempC >= 8
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '…'
}
