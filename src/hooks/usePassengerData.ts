import { useEffect, useState } from 'react'
import { fetchAllPassengerItems } from '../api/passenger'
import type { PassengerItem } from '../types/passenger'

export function usePassengerData() {
  const [items, setItems] = useState<PassengerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAllPassengerItems()
      .then((data) => {
        console.log('인천공항 승객예고 데이터:', data)
        setItems(data)
      })
      .catch((err) => {
        console.error('데이터 조회 실패:', err)
        setError(err instanceof Error ? err.message : '알 수 없는 오류')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { items, loading, error }
}
