import type { PassengerItem } from '../types/passenger'

export function formatLocalDate(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getCurrentTimeString(date = new Date()) {
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

export function toAdate(isoDate: string) {
  return isoDate.replace(/-/g, '')
}

export function hourFromTimeString(time: string) {
  return Number.parseInt(time.split(':')[0] ?? '0', 10)
}

export function toAtime(hour: number) {
  const start = String(hour).padStart(2, '0')
  const end = String(hour + 1).padStart(2, '0')
  return `${start}_${end}`
}

export function findPassengerItem(
  items: PassengerItem[],
  isoDate: string,
  hour: number,
) {
  const adate = toAdate(isoDate)
  const atime = toAtime(hour)
  return items.find((item) => item.adate === adate && item.atime === atime)
}

export function formatDisplayDate(adate: string) {
  if (adate.length !== 8) return adate
  return `${adate.slice(0, 4)}-${adate.slice(4, 6)}-${adate.slice(6, 8)}`
}

export function formatTime(value: string) {
  const [start, end] = value.split('_')
  if (!start || !end) return value
  return `${start}:00`
}

export function formatTimeRange(value: string) {
  const [start, end] = value.split('_')
  if (!start || !end) return value
  return `${start}:00 ~ ${end}:00`
}

export function parseCount(value: string) {
  const count = Number.parseFloat(value)
  return Number.isNaN(count) ? 0 : count
}

export function getCongestionLevel(count: number) {
  if (count >= 800) return 'high'
  if (count >= 400) return 'medium'
  if (count > 0) return 'low'
  return 'none'
}

export function getCongestionLabel(level: ReturnType<typeof getCongestionLevel>) {
  switch (level) {
    case 'high':
      return '혼잡'
    case 'medium':
      return '보통'
    case 'low':
      return '여유'
    default:
      return '없음'
  }
}

export function getDateRange(days = 2) {
  const today = new Date()
  const dates: string[] = []

  for (let i = 0; i < days; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push(formatLocalDate(date))
  }

  return { min: dates[0], max: dates[dates.length - 1] }
}

export function buildTotalChartData(items: PassengerItem[]) {
  return items.map((item) => ({
    time: formatTime(item.atime),
    'T1 입국장 합계': parseCount(item.t1egsum1),
    'T1 출국장 합계': parseCount(item.t1dgsum1),
    'T2 입국장 합계': parseCount(item.t2egsum1),
    'T2 출국장 합계': parseCount(item.t2dgsum2),
  }))
}

export function buildT1ArrivalChartData(items: PassengerItem[]) {
  return items.map((item) => ({
    time: formatTime(item.atime),
    '동편 A': parseCount(item.t1eg1),
    '동편 B': parseCount(item.t1eg2),
    '서편 E': parseCount(item.t1eg3),
    '서편 F': parseCount(item.t1eg4),
  }))
}

export function buildT1DepartureChartData(items: PassengerItem[]) {
  return items.map((item) => ({
    time: formatTime(item.atime),
    '출국 1': parseCount(item.t1dg1),
    '출국 2': parseCount(item.t1dg2),
    '출국 3': parseCount(item.t1dg3),
    '출국 4': parseCount(item.t1dg4),
    '출국 5': parseCount(item.t1dg5),
    '출국 6': parseCount(item.t1dg6),
  }))
}

export function buildT2ArrivalChartData(items: PassengerItem[]) {
  return items.map((item) => ({
    time: formatTime(item.atime),
    '입국 1': parseCount(item.t2eg1),
    '입국 2': parseCount(item.t2eg2),
  }))
}

export function buildT2DepartureChartData(items: PassengerItem[]) {
  return items.map((item) => ({
    time: formatTime(item.atime),
    '출국 1': parseCount(item.t2dg1),
    '출국 2': parseCount(item.t2dg2),
  }))
}

export function buildSummaryStats(items: PassengerItem[]) {
  if (items.length === 0) {
    return {
      peakTime: '-',
      peakCount: 0,
      t1Peak: 0,
      t2Peak: 0,
      timeSlots: 0,
    }
  }

  let peakTime = '-'
  let peakCount = 0
  let t1Peak = 0
  let t2Peak = 0

  for (const item of items) {
    const total =
      parseCount(item.t1egsum1) +
      parseCount(item.t1dgsum1) +
      parseCount(item.t2egsum1) +
      parseCount(item.t2dgsum2)

    if (total > peakCount) {
      peakCount = total
      peakTime = formatTime(item.atime)
    }

    t1Peak = Math.max(t1Peak, parseCount(item.t1egsum1) + parseCount(item.t1dgsum1))
    t2Peak = Math.max(t2Peak, parseCount(item.t2egsum1) + parseCount(item.t2dgsum2))
  }

  return {
    peakTime,
    peakCount,
    t1Peak,
    t2Peak,
    timeSlots: items.length,
  }
}
