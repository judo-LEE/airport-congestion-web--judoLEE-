import { useCallback, useEffect, useMemo, useState } from 'react'
import type { PassengerItem } from '../types/passenger'
import {
  findPassengerItem,
  formatLocalDate,
  getCurrentTimeString,
  getDateRange,
  hourFromTimeString,
} from '../utils/passenger'

export function useTimeSlotSelection(items: PassengerItem[]) {
  const [selectedDate, setSelectedDate] = useState(() => formatLocalDate(new Date()))
  const [selectedTime, setSelectedTime] = useState(() => getCurrentTimeString())
  const [viewedItem, setViewedItem] = useState<PassengerItem | null>(null)
  const [slotNotFound, setSlotNotFound] = useState(false)
  const [showSlotDetail, setShowSlotDetail] = useState(false)

  const { min: minDate, max: maxDate } = useMemo(() => getDateRange(2), [])

  const lookupSlot = useCallback(
    (date: string, time: string) => {
      const hour = hourFromTimeString(time)
      const item = findPassengerItem(items, date, hour)
      setViewedItem(item ?? null)
      setSlotNotFound(!item)
      setShowSlotDetail(true)
    },
    [items],
  )

  useEffect(() => {
    if (items.length === 0) return

    const now = new Date()
    const date = formatLocalDate(now)
    const time = getCurrentTimeString(now)
    const current = findPassengerItem(items, date, now.getHours())

    setSelectedDate(date)
    setSelectedTime(time)
    setViewedItem(current ?? null)
    setShowSlotDetail(Boolean(current))
  }, [items])

  const handleSearch = useCallback(() => {
    lookupSlot(selectedDate, selectedTime)
  }, [lookupSlot, selectedDate, selectedTime])

  const handleResetToNow = useCallback(() => {
    const now = new Date()
    const date = formatLocalDate(now)
    const time = getCurrentTimeString(now)
    setSelectedDate(date)
    setSelectedTime(time)
    lookupSlot(date, time)
  }, [lookupSlot])

  return {
    selectedDate,
    selectedTime,
    minDate,
    maxDate,
    viewedItem,
    slotNotFound,
    showSlotDetail,
    onDateChange: setSelectedDate,
    onTimeChange: setSelectedTime,
    onSearch: handleSearch,
    onResetToNow: handleResetToNow,
  }
}
