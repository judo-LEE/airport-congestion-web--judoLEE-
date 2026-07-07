import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchPassengerAnnouncement } from './api/passenger'
import { PassengerChart } from './components/PassengerChart'
import { TimeSlotDetail } from './components/TimeSlotDetail'
import { TimeSlotPicker } from './components/TimeSlotPicker'
import type { PassengerItem } from './types/passenger'
import {
  findPassengerItem,
  formatLocalDate,
  getCurrentTimeString,
  getDateRange,
  hourFromTimeString,
} from './utils/passenger'
import { ThemeProvider } from './context/ThemeContext'
import { ThemeToggle } from './components/ThemeToggle'
import './App.css'

function App() {
  const [items, setItems] = useState<PassengerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedDate, setSelectedDate] = useState(formatLocalDate(new Date()))
  const [selectedTime, setSelectedTime] = useState(getCurrentTimeString())
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
    Promise.all([
      fetchPassengerAnnouncement({ selectdate: '0' }),
      fetchPassengerAnnouncement({ selectdate: '1' }),
    ])
      .then(([today, tomorrow]) => {
        const allItems = [...today.items, ...tomorrow.items]
        console.log('인천공항 승객예고 데이터:', allItems)
        setItems(allItems)

        const now = new Date()
        const date = formatLocalDate(now)
        const time = getCurrentTimeString(now)
        const current = findPassengerItem(allItems, date, now.getHours())
        setSelectedDate(date)
        setSelectedTime(time)
        setViewedItem(current ?? null)
        setShowSlotDetail(Boolean(current))
      })
      .catch((err) => {
        console.error('데이터 조회 실패:', err)
        setError(err instanceof Error ? err.message : '알 수 없는 오류')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleSearch = () => {
    lookupSlot(selectedDate, selectedTime)
  }

  const handleResetToNow = () => {
    const now = new Date()
    const date = formatLocalDate(now)
    const time = getCurrentTimeString(now)
    setSelectedDate(date)
    setSelectedTime(time)
    lookupSlot(date, time)
  }

  return (
    <main className="app">
      <header className="app__header">
        <div className="app__header-text">
          <h1>인천공항 혼잡도</h1>
          <p>승객예고 · 출입국장별 예상 승객 수</p>
        </div>
        <ThemeToggle />
      </header>

      {loading && <p className="status">데이터를 불러오는 중...</p>}
      {error && <p className="status error">오류: {error}</p>}

      {!loading && !error && (
        <>
          <TimeSlotPicker
            date={selectedDate}
            time={selectedTime}
            minDate={minDate}
            maxDate={maxDate}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
            onSearch={handleSearch}
            onResetToNow={handleResetToNow}
          />

          {showSlotDetail && slotNotFound && (
            <p className="slot-not-found">
              선택한 시간대({selectedDate} {selectedTime})의 데이터가 없습니다.
              <br />
              API는 오늘·내일, 1시간 단위 데이터만 제공합니다.
            </p>
          )}

          {showSlotDetail && viewedItem && (
            <TimeSlotDetail item={viewedItem} />
          )}

          <PassengerChart items={items} />
        </>
      )}
    </main>
  )
}

export default function AppRoot() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  )
}
