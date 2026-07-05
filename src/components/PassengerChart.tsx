import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { PassengerItem } from '../types/passenger'
import {
  buildSummaryChartData,
  buildSummaryStats,
  buildT1ChartData,
  buildT2ChartData,
} from '../utils/passenger'
import './PassengerChart.css'

interface PassengerChartProps {
  items: PassengerItem[]
}

const SUMMARY_LINES = [
  { key: 'T1 입국장', color: '#6366f1' },
  { key: 'T1 출국장', color: '#8b5cf6' },
  { key: 'T2 입국장', color: '#06b6d4' },
  { key: 'T2 출국장', color: '#10b981' },
] as const

const T1_BARS = [
  { key: '동편 A', color: '#6366f1' },
  { key: '동편 B', color: '#818cf8' },
  { key: '서편 E', color: '#a5b4fc' },
  { key: '서편 F', color: '#c7d2fe' },
  { key: '출국 1', color: '#8b5cf6' },
  { key: '출국 2', color: '#a78bfa' },
  { key: '출국 3', color: '#c4b5fd' },
] as const

const T2_BARS = [
  { key: '입국 1', color: '#06b6d4' },
  { key: '입국 2', color: '#22d3ee' },
  { key: '출국 1', color: '#10b981' },
  { key: '출국 2', color: '#34d399' },
] as const

const TOOLTIP_STYLE = {
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  color: 'var(--text-h)',
}

function formatTooltipValue(value: unknown) {
  return `${Math.round(Number(value ?? 0)).toLocaleString()}명`
}

function ChartTooltip() {
  return <Tooltip formatter={formatTooltipValue} contentStyle={TOOLTIP_STYLE} />
}

export function PassengerChart({ items }: PassengerChartProps) {
  const summaryData = buildSummaryChartData(items)
  const t1Data = buildT1ChartData(items)
  const t2Data = buildT2ChartData(items)
  const stats = buildSummaryStats(items)

  return (
    <div className="dashboard">
      <div className="dashboard__stats">
        <article className="stat-card">
          <span className="stat-card__label">최대 혼잡 시간대</span>
          <strong className="stat-card__value">{stats.peakTime}</strong>
          <span className="stat-card__sub">
            {Math.round(stats.peakCount).toLocaleString()}명
          </span>
        </article>
        <article className="stat-card">
          <span className="stat-card__label">T1 최대 승객</span>
          <strong className="stat-card__value">
            {Math.round(stats.t1Peak).toLocaleString()}명
          </strong>
          <span className="stat-card__sub">제1터미널 합계 기준</span>
        </article>
        <article className="stat-card">
          <span className="stat-card__label">T2 최대 승객</span>
          <strong className="stat-card__value">
            {Math.round(stats.t2Peak).toLocaleString()}명
          </strong>
          <span className="stat-card__sub">제2터미널 합계 기준</span>
        </article>
        <article className="stat-card">
          <span className="stat-card__label">조회 시간대</span>
          <strong className="stat-card__value">{stats.timeSlots}개</strong>
          <span className="stat-card__sub">시간대별 데이터</span>
        </article>
      </div>

      <div className="dashboard__charts">
        <section className="chart-panel chart-panel--summary">
          <div className="chart-panel__header">
            <h2 className="chart-panel__title">출입국장 혼잡 추이</h2>
            <p className="chart-panel__desc">터미널별 입국·출국장 예상 승객 수</p>
          </div>
          <div className="chart-panel__canvas">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={summaryData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: 'var(--text)', fontSize: 11 }}
                  axisLine={{ stroke: 'var(--border)' }}
                  tickLine={{ stroke: 'var(--border)' }}
                />
                <YAxis
                  tick={{ fill: 'var(--text)', fontSize: 11 }}
                  axisLine={{ stroke: 'var(--border)' }}
                  tickLine={{ stroke: 'var(--border)' }}
                  tickFormatter={(value) => `${value}`}
                  width={48}
                />
                <ChartTooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {SUMMARY_LINES.map((line) => (
                  <Line
                    key={line.key}
                    type="monotone"
                    dataKey={line.key}
                    stroke={line.color}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="chart-panel">
          <div className="chart-panel__header">
            <h2 className="chart-panel__title">제1터미널 상세</h2>
            <p className="chart-panel__desc">입국·출국장별 승객 수</p>
          </div>
          <div className="chart-panel__canvas">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={t1Data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: 'var(--text)', fontSize: 10 }}
                  axisLine={{ stroke: 'var(--border)' }}
                  tickLine={{ stroke: 'var(--border)' }}
                />
                <YAxis
                  tick={{ fill: 'var(--text)', fontSize: 10 }}
                  axisLine={{ stroke: 'var(--border)' }}
                  tickLine={{ stroke: 'var(--border)' }}
                  width={40}
                />
                <ChartTooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {T1_BARS.map((bar) => (
                  <Bar
                    key={bar.key}
                    dataKey={bar.key}
                    fill={bar.color}
                    radius={[3, 3, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="chart-panel">
          <div className="chart-panel__header">
            <h2 className="chart-panel__title">제2터미널 상세</h2>
            <p className="chart-panel__desc">입국·출국장별 승객 수</p>
          </div>
          <div className="chart-panel__canvas">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={t2Data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: 'var(--text)', fontSize: 10 }}
                  axisLine={{ stroke: 'var(--border)' }}
                  tickLine={{ stroke: 'var(--border)' }}
                />
                <YAxis
                  tick={{ fill: 'var(--text)', fontSize: 10 }}
                  axisLine={{ stroke: 'var(--border)' }}
                  tickLine={{ stroke: 'var(--border)' }}
                  width={40}
                />
                <ChartTooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {T2_BARS.map((bar) => (
                  <Bar
                    key={bar.key}
                    dataKey={bar.key}
                    fill={bar.color}
                    radius={[3, 3, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  )
}
