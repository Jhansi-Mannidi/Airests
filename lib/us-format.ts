export const US_LOCALE = 'en-US'

export function formatUsd(value: number, digits = 2) {
  return value.toLocaleString(US_LOCALE, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

export function formatUsNumber(value: number, digits = 0) {
  return value.toLocaleString(US_LOCALE, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

export function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

export function formatUsPhone(value: string) {
  const digits = digitsOnly(value).slice(0, 10)
  if (digits.length === 0) return ''
  if (digits.length < 4) return `(${digits}`
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

export function formatUsCardNumber(value: string) {
  const digits = digitsOnly(value).slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

export function formatUsCardExpiry(value: string) {
  const digits = digitsOnly(value).slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`
}

export function formatUsTime(date: Date) {
  return date.toLocaleTimeString(US_LOCALE, { hour: 'numeric', minute: '2-digit' })
}

export function formatUsDate(date: Date) {
  return date.toLocaleDateString(US_LOCALE, { month: 'numeric', day: 'numeric', year: 'numeric' })
}

export function formatUsLongDate(date: Date) {
  return date.toLocaleDateString(US_LOCALE, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

export function usPhoneError(value: string) {
  if (digitsOnly(value).length !== 10) return 'Enter a 10-digit U.S. phone number'
  return null
}
