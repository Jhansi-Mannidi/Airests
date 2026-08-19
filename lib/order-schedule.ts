const STORE_OPEN_HOUR = 11
const STORE_CLOSE_HOUR = 22
const SLOT_MINUTES = 15
const LEAD_MINUTES = 45

export type ScheduleDay = {
  id: 'today' | 'tomorrow'
  label: string
  date: Date
}

function startOfDay(date: Date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export function formatScheduleLabel(date: Date, now = new Date()) {
  const day = isSameDay(date, now) ? 'Today' : isSameDay(date, addDays(now, 1)) ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  return `${day}, ${formatTime(date)}`
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function nextSlotStart(from: Date) {
  const next = new Date(from.getTime() + LEAD_MINUTES * 60_000)
  const remainder = next.getMinutes() % SLOT_MINUTES
  if (remainder !== 0) next.setMinutes(next.getMinutes() + (SLOT_MINUTES - remainder), 0, 0)
  else next.setSeconds(0, 0)
  return next
}

export function getScheduleDays(now = new Date()): ScheduleDay[] {
  const today = startOfDay(now)
  return [
    { id: 'today', label: 'Today', date: today },
    { id: 'tomorrow', label: 'Tomorrow', date: addDays(today, 1) },
  ]
}

export function getSlotsForDay(day: Date, now = new Date()) {
  const open = new Date(day)
  open.setHours(STORE_OPEN_HOUR, 0, 0, 0)
  const close = new Date(day)
  close.setHours(STORE_CLOSE_HOUR, 0, 0, 0)

  let cursor = open
  if (isSameDay(day, now)) {
    const earliest = nextSlotStart(now)
    if (earliest > cursor) cursor = earliest
  }

  const slots: Date[] = []
  while (cursor < close) {
    slots.push(new Date(cursor))
    cursor = new Date(cursor.getTime() + SLOT_MINUTES * 60_000)
  }
  return slots
}

export function firstAvailableSlot(now = new Date()) {
  for (const day of getScheduleDays(now)) {
    const slots = getSlotsForDay(day.date, now)
    if (slots[0]) return slots[0]
  }
  return null
}
