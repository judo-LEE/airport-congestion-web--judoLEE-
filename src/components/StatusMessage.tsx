import './StatusMessage.css'

interface StatusMessageProps {
  loading: boolean
  error: string | null
}

export function StatusMessage({ loading, error }: StatusMessageProps) {
  if (loading) {
    return <p className="status-message">데이터를 불러오는 중...</p>
  }

  if (error) {
    return <p className="status-message status-message--error">오류: {error}</p>
  }

  return null
}
