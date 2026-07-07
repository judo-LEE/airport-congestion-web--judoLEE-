import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import type { PassengerItem } from '../types/passenger'
import {
  formatDisplayDate,
  formatTimeRange,
  getCongestionLabel,
  getCongestionLevel,
  parseCount,
} from '../utils/passenger'
import './TimeSlotDetail.css'

interface TimeSlotDetailProps {
  item: PassengerItem
}

interface GateData {
  name: string
  value: number
}

function GateBarChart({
  title,
  data,
  themeKey,
}: {
  title: string
  data: GateData[]
  themeKey: string
}) {
  const { chartColors } = useTheme()
  const gateColors = chartColors.gate
  const chartHeight = Math.max(180, data.length * 36)

  return (
    <div className="slot-gate-chart">
      <h4>{title}</h4>
      <ResponsiveContainer width="100%" height={chartHeight} key={themeKey}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            type="number"
            tick={{ fill: 'var(--text)', fontSize: 11 }}
            tickFormatter={(v) => `${v}명`}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={72}
            tick={{ fill: 'var(--text)', fontSize: 11 }}
          />
          <Tooltip
            formatter={(value: unknown) =>
              `${Math.round(Number(value ?? 0)).toLocaleString()}명`
            }
            contentStyle={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry) => {
              const level = getCongestionLevel(entry.value)
              return <Cell key={entry.name} fill={gateColors[level]} />
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  sub,
}: {
  label: string
  value: number
  sub: string
}) {
  const level = getCongestionLevel(value)
  return (
    <article className={`slot-summary level-${level}`}>
      <span className="slot-summary__label">{label}</span>
      <strong className="slot-summary__value">
        {Math.round(value).toLocaleString()}명
      </strong>
      <span className="slot-summary__badge">{getCongestionLabel(level)}</span>
      <span className="slot-summary__sub">{sub}</span>
    </article>
  )
}

export function TimeSlotDetail({ item }: TimeSlotDetailProps) {
  const { theme } = useTheme()
  const t1Arrival = parseCount(item.t1egsum1)
  const t1Departure = parseCount(item.t1dgsum1)
  const t2Arrival = parseCount(item.t2egsum1)
  const t2Departure = parseCount(item.t2dgsum2)
  const total = t1Arrival + t1Departure + t2Arrival + t2Departure
  const overallLevel = getCongestionLevel(total)

  const t1ArrivalGates: GateData[] = [
    { name: '동편 A', value: parseCount(item.t1eg1) },
    { name: '동편 B', value: parseCount(item.t1eg2) },
    { name: '서편 E', value: parseCount(item.t1eg3) },
    { name: '서편 F', value: parseCount(item.t1eg4) },
  ]

  const t1DepartureGates: GateData[] = [
    { name: '출국 1', value: parseCount(item.t1dg1) },
    { name: '출국 2', value: parseCount(item.t1dg2) },
    { name: '출국 3', value: parseCount(item.t1dg3) },
    { name: '출국 4', value: parseCount(item.t1dg4) },
    { name: '출국 5', value: parseCount(item.t1dg5) },
    { name: '출국 6', value: parseCount(item.t1dg6) },
  ]

  const t2ArrivalGates: GateData[] = [
    { name: '입국 1', value: parseCount(item.t2eg1) },
    { name: '입국 2', value: parseCount(item.t2eg2) },
  ]

  const t2DepartureGates: GateData[] = [
    { name: '출국 1', value: parseCount(item.t2dg1) },
    { name: '출국 2', value: parseCount(item.t2dg2) },
  ]

  return (
    <section className="slot-detail">
      <header className="slot-detail__header">
        <div>
          <p className="slot-detail__date">{formatDisplayDate(item.adate)}</p>
          <h2 className="slot-detail__time">{formatTimeRange(item.atime)}</h2>
        </div>
        <div className={`slot-detail__overall level-${overallLevel}`}>
          <span>전체 예상</span>
          <strong>{Math.round(total).toLocaleString()}명</strong>
          <em>{getCongestionLabel(overallLevel)}</em>
        </div>
      </header>

      <div className="slot-detail__totals">
        <h3>터미널별 합계</h3>
        <div className="slot-detail__summary">
          <SummaryCard label="T1 입국장 합계" value={t1Arrival} sub="제1터미널" />
          <SummaryCard label="T1 출국장 합계" value={t1Departure} sub="제1터미널" />
          <SummaryCard label="T2 입국장 합계" value={t2Arrival} sub="제2터미널" />
          <SummaryCard label="T2 출국장 합계" value={t2Departure} sub="제2터미널" />
        </div>
      </div>

      <div className="slot-detail__details">
        <h3>출입국장별 상세</h3>
        <div className="slot-detail__gate-grid">
          <GateBarChart title="T1 입국장" data={t1ArrivalGates} themeKey={theme} />
          <GateBarChart title="T1 출국장" data={t1DepartureGates} themeKey={theme} />
          <GateBarChart title="T2 입국장" data={t2ArrivalGates} themeKey={theme} />
          <GateBarChart title="T2 출국장" data={t2DepartureGates} themeKey={theme} />
        </div>
      </div>
    </section>
  )
}
