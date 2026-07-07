import { ThemeToggle } from './ThemeToggle'
import './AppHeader.css'

export function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header__text">
        <h1>인천공항 혼잡도</h1>
        <p>승객예고 · 출입국장별 예상 승객 수</p>
      </div>
      <ThemeToggle />
    </header>
  )
}
