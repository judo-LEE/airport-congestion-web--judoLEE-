import type { PassengerItem } from '../types/passenger'
import { PassengerChart } from './PassengerChart'
import { SlotNotFoundAlert } from './SlotNotFoundAlert'
import { TimeSlotDetail } from './TimeSlotDetail'
import { TimeSlotPicker } from './TimeSlotPicker'

interface PassengerDashboardProps {
  items: PassengerItem[]
  selectedDate: string
  selectedTime: string
  minDate: string
  maxDate: string
  viewedItem: PassengerItem | null
  slotNotFound: boolean
  showSlotDetail: boolean
  onDateChange: (date: string) => void
  onTimeChange: (time: string) => void
  onSearch: () => void
  onResetToNow: () => void
}

export function PassengerDashboard({
  items,
  selectedDate,
  selectedTime,
  minDate,
  maxDate,
  viewedItem,
  slotNotFound,
  showSlotDetail,
  onDateChange,
  onTimeChange,
  onSearch,
  onResetToNow,
}: PassengerDashboardProps) {
  return (
    <>
      <TimeSlotPicker
        date={selectedDate}
        time={selectedTime}
        minDate={minDate}
        maxDate={maxDate}
        onDateChange={onDateChange}
        onTimeChange={onTimeChange}
        onSearch={onSearch}
        onResetToNow={onResetToNow}
      />

      {showSlotDetail && slotNotFound && (
        <SlotNotFoundAlert date={selectedDate} time={selectedTime} />
      )}

      {showSlotDetail && viewedItem && <TimeSlotDetail item={viewedItem} />}

      <PassengerChart items={items} />
    </>
  )
}
