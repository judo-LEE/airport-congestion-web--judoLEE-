import type {
  FetchPassengerParams,
  PassengerApiResponse,
} from '../types/api'
import type { PassengerItem } from '../types/passenger'

export async function fetchPassengerAnnouncement({
  selectdate = '0',
  numOfRows = '100',
  pageNo = '1',
}: FetchPassengerParams = {}) {
  const apiKey = import.meta.env.VITE_API_KEY

  if (!apiKey) {
    throw new Error(
      'API 키가 설정되지 않았습니다. Netlify 환경 변수에 VITE_API_KEY를 추가해 주세요.',
    )
  }

  const url = new URL('/api/getPassgrAnncmt', window.location.origin)
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

export async function fetchAllPassengerItems(): Promise<PassengerItem[]> {
  const [today, tomorrow] = await Promise.all([
    fetchPassengerAnnouncement({ selectdate: '0' }),
    fetchPassengerAnnouncement({ selectdate: '1' }),
  ])

  return [...today.items, ...tomorrow.items]
}
