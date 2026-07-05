import './TimeSlotPicker.css'

interface TimeSlotPickerProps {
  date: string
  time: string
  minDate: string
  maxDate: string
  onDateChange: (date: string) => void
  onTimeChange: (time: string) => void
  onSearch: () => void
  onResetToNow: () => void
}

export function TimeSlotPicker({
  date,
  time,
  minDate,
  maxDate,
  onDateChange,
  onTimeChange,
  onSearch,
  onResetToNow,
}: TimeSlotPickerProps) {
  return (
    <section className="time-picker">
      <h2 className="time-picker__title">출발 시간 선택</h2>
      <p className="time-picker__desc">
        확인하고 싶은 날짜와 시간을 선택하세요. (오늘·내일 데이터 제공)
      </p>

      <div className="time-picker__controls">
        <label className="time-picker__field">
          <span>날짜</span>
          <input
            type="date"
            value={date}
            min={minDate}
            max={maxDate}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </label>

        <label className="time-picker__field">
          <span>시간</span>
          <input
            type="time"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
          />
        </label>

        <div className="time-picker__actions">
          <button type="button" className="btn btn--primary" onClick={onSearch}>
            이 시간대 혼잡도 보기
          </button>
          <button type="button" className="btn btn--secondary" onClick={onResetToNow}>
            현재 시간으로 돌아가기
          </button>
        </div>
      </div>
    </section>
  )
}
