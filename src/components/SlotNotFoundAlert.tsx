import './SlotNotFoundAlert.css'

interface SlotNotFoundAlertProps {
  date: string
  time: string
}

export function SlotNotFoundAlert({ date, time }: SlotNotFoundAlertProps) {
  return (
    <p className="slot-not-found">
      선택한 시간대({date} {time})의 데이터가 없습니다.
      <br />
      API는 오늘·내일, 1시간 단위 데이터만 제공합니다.
    </p>
  )
}
