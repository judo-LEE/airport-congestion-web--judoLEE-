import type { PassengerItem } from '../types/passenger'

export function formatTime(value: string) {
  const [start, end] = value.split('_')
  if (!start || !end) return value
  return `${start}:00`
}

export function parseCount(value: string) {
  const count = Number.parseFloat(value)
  return Number.isNaN(count) ? 0 : count
}

export function buildSummaryChartData(items: PassengerItem[]) {
  return items.map((item) => ({
    time: formatTime(item.atime),
    'T1 입국장': parseCount(item.t1egsum1),
    'T1 출국장': parseCount(item.t1dgsum1),
    'T2 입국장': parseCount(item.t2egsum1),
    'T2 출국장': parseCount(item.t2dgsum2),
  }))
}

export function buildT1ChartData(items: PassengerItem[]) {
  return items.map((item) => ({
    time: formatTime(item.atime),
    '동편 A': parseCount(item.t1eg1),
    '동편 B': parseCount(item.t1eg2),
    '서편 E': parseCount(item.t1eg3),
    '서편 F': parseCount(item.t1eg4),
    '출국 1': parseCount(item.t1dg1),
    '출국 2': parseCount(item.t1dg2),
    '출국 3': parseCount(item.t1dg3),
  }))
}

export function buildT2ChartData(items: PassengerItem[]) {
  return items.map((item) => ({
    time: formatTime(item.atime),
    '입국 1': parseCount(item.t2eg1),
    '입국 2': parseCount(item.t2eg2),
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
