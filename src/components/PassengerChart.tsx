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
import { useTheme } from '../context/ThemeContext'
import type { PassengerItem } from '../types/passenger'
import {
  buildSummaryStats,
  buildT1ArrivalChartData,
  buildT1DepartureChartData,
  buildT2ArrivalChartData,
  buildT2DepartureChartData,
  buildTotalChartData,
} from '../utils/passenger'
import './PassengerChart.css'

interface PassengerChartProps {
  items: PassengerItem[]
}

const TOTAL_KEYS = [
  'T1 입국장 합계',
  'T1 출국장 합계',
  'T2 입국장 합계',
  'T2 출국장 합계',
] as const

const T1_ARRIVAL_KEYS = ['동편 A', '동편 B', '서편 E', '서편 F'] as const
const T1_DEPARTURE_KEYS = ['출국 1', '출국 2', '출국 3', '출국 4', '출국 5', '출국 6'] as const
const T2_ARRIVAL_KEYS = ['입국 1', '입국 2'] as const
const T2_DEPARTURE_KEYS = ['출국 1', '출국 2'] as const

function zipColors(keys: readonly string[], colors: readonly string[]) {
  return keys.map((key, index) => ({ key, color: colors[index] ?? colors.at(-1)! }))
}

function formatTooltipValue(value: unknown) {
  return `${Math.round(Number(value ?? 0)).toLocaleString()}명`
}

interface DetailBarChartProps {
  data: Record<string, string | number>[]
  bars: { key: string; color: string }[]
  themeKey: string
}

function ChartTooltip() {
  return (
    <Tooltip
      formatter={formatTooltipValue}
      contentStyle={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        color: 'var(--text-h)',
      }}
    />
  )
}

function DetailBarChart({ data, bars, themeKey }: DetailBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" key={themeKey}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
        <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text)' }} />
        {bars.map((bar) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            fill={bar.color}
            radius={[3, 3, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

export function PassengerChart({ items }: PassengerChartProps) {
  const { theme, chartColors } = useTheme()

  const totalData = buildTotalChartData(items)
  const t1ArrivalData = buildT1ArrivalChartData(items)
  const t1DepartureData = buildT1DepartureChartData(items)
  const t2ArrivalData = buildT2ArrivalChartData(items)
  const t2DepartureData = buildT2DepartureChartData(items)
  const stats = buildSummaryStats(items)

  const totalLines = zipColors(TOTAL_KEYS, chartColors.totalLines)
  const t1ArrivalBars = zipColors(T1_ARRIVAL_KEYS, chartColors.t1Arrival)
  const t1DepartureBars = zipColors(T1_DEPARTURE_KEYS, chartColors.t1Departure)
  const t2ArrivalBars = zipColors(T2_ARRIVAL_KEYS, chartColors.t2Arrival)
  const t2DepartureBars = zipColors(T2_DEPARTURE_KEYS, chartColors.t2Departure)

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
        <section className="chart-panel chart-panel--totals">
          <div className="chart-panel__header">
            <h2 className="chart-panel__title">터미널별 합계 추이</h2>
            <p className="chart-panel__desc">
              입국·출국장 합계만 표시 (개별 출입국장과 분리)
            </p>
          </div>
          <div className="chart-panel__canvas">
            <ResponsiveContainer width="100%" height="100%" key={theme}>
              <LineChart data={totalData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
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
                <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text)' }} />
                {totalLines.map((line) => (
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

        <section className="chart-panel chart-panel--detail">
          <div className="chart-panel__header">
            <h2 className="chart-panel__title">T1 입국장 상세</h2>
            <p className="chart-panel__desc">개별 입국장만 표시</p>
          </div>
          <div className="chart-panel__canvas">
            <DetailBarChart
              data={t1ArrivalData}
              bars={t1ArrivalBars}
              themeKey={theme}
            />
          </div>
        </section>

        <section className="chart-panel chart-panel--detail">
          <div className="chart-panel__header">
            <h2 className="chart-panel__title">T1 출국장 상세</h2>
            <p className="chart-panel__desc">개별 출국장만 표시</p>
          </div>
          <div className="chart-panel__canvas">
            <DetailBarChart
              data={t1DepartureData}
              bars={t1DepartureBars}
              themeKey={theme}
            />
          </div>
        </section>

        <section className="chart-panel chart-panel--detail">
          <div className="chart-panel__header">
            <h2 className="chart-panel__title">T2 입국장 상세</h2>
            <p className="chart-panel__desc">개별 입국장만 표시</p>
          </div>
          <div className="chart-panel__canvas">
            <DetailBarChart
              data={t2ArrivalData}
              bars={t2ArrivalBars}
              themeKey={theme}
            />
          </div>
        </section>

        <section className="chart-panel chart-panel--detail">
          <div className="chart-panel__header">
            <h2 className="chart-panel__title">T2 출국장 상세</h2>
            <p className="chart-panel__desc">개별 출국장만 표시</p>
          </div>
          <div className="chart-panel__canvas">
            <DetailBarChart
              data={t2DepartureData}
              bars={t2DepartureBars}
              themeKey={theme}
            />
          </div>
        </section>
      </div>
    </div>
  )
}
