import { useEffect, useState } from 'react'
import { PassengerChart } from './components/PassengerChart'
import type { PassengerApiResponse, PassengerItem } from './types/passenger'
import './App.css'

interface FetchPassengerParams {
  selectdate?: '0' | '1'
  numOfRows?: string
  pageNo?: string
}

async function fetchPassengerAnnouncement({
  selectdate = '0',
  numOfRows = '100',
  pageNo = '1',
}: FetchPassengerParams = {}) {
  const baseUrl = import.meta.env.VITE_BASE_URL
  const apiKey = import.meta.env.VITE_API_KEY

  const url = new URL(`${baseUrl}/getPassgrAnncmt`, window.location.origin)
  url.searchParams.set('serviceKey', apiKey)
  url.searchParams.set('selectdate', selectdate)
  url.searchParams.set('type', 'json')
  url.searchParams.set('numOfRows', numOfRows)
  url.searchParams.set('pageNo', pageNo)

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`)
  }

  const data: PassengerApiResponse = await response.json()
  const { header, body } = data.response

  if (header.resultCode !== '00') {
    throw new Error(`API 오류: ${header.resultMsg}`)
  }

  return body
}

function App() {
  const [items, setItems] = useState<PassengerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPassengerAnnouncement()
      .then((data) => {
        console.log('인천공항 승객예고 데이터:', data)
        setItems(data.items)
      })
      .catch((err) => {
        console.error('데이터 조회 실패:', err)
        setError(err instanceof Error ? err.message : '알 수 없는 오류')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <main className="app">
      <header className="app__header">
        <h1>인천공항 혼잡도</h1>
        <p>승객예고 · 출입국장별 예상 승객 수</p>
      </header>

      {loading && <p className="status">데이터를 불러오는 중...</p>}
      {error && <p className="status error">오류: {error}</p>}

      {!loading && !error && <PassengerChart items={items} />}
    </main>
  )
}

export default App
