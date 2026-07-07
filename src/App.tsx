import { AppHeader } from './components/AppHeader'
import { PassengerDashboard } from './components/PassengerDashboard'
import { StatusMessage } from './components/StatusMessage'
import { usePassengerData } from './hooks/usePassengerData'
import { useTimeSlotSelection } from './hooks/useTimeSlotSelection'
import './App.css'

function App() {
  const { items, loading, error } = usePassengerData()
  const timeSlot = useTimeSlotSelection(items)

  const showDashboard = !loading && !error

  return (
    <main className="app">
      <AppHeader />
      <StatusMessage loading={loading} error={error} />
      {showDashboard && (
        <PassengerDashboard items={items} {...timeSlot} />
      )}
    </main>
  )
}

export default App
