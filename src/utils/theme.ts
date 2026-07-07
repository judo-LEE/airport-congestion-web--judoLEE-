export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'theme'

export function getStoredTheme(): Theme | null {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return null
}

export function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function getInitialTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme()
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  document.documentElement.style.colorScheme = theme
}

const LIGHT_CHART = {
  totalLines: ['#171717', '#404040', '#737373', '#a3a3a3'],
  t1Arrival: ['#171717', '#404040', '#737373', '#a3a3a3'],
  t1Departure: ['#171717', '#404040', '#525252', '#737373', '#a3a3a3', '#d4d4d4'],
  t2Arrival: ['#404040', '#737373'],
  t2Departure: ['#525252', '#a3a3a3'],
  gate: { none: '#e5e5e5', low: '#d4d4d4', medium: '#737373', high: '#171717' },
  grid: 'var(--border)',
  tick: 'var(--text)',
} as const

const DARK_CHART = {
  totalLines: ['#f5f5f5', '#d4d4d4', '#a3a3a3', '#737373'],
  t1Arrival: ['#f5f5f5', '#d4d4d4', '#a3a3a3', '#737373'],
  t1Departure: ['#f5f5f5', '#e5e5e5', '#d4d4d4', '#a3a3a3', '#737373', '#525252'],
  t2Arrival: ['#d4d4d4', '#a3a3a3'],
  t2Departure: ['#a3a3a3', '#737373'],
  gate: { none: '#404040', low: '#525252', medium: '#a3a3a3', high: '#f5f5f5' },
  grid: 'var(--border)',
  tick: 'var(--text)',
} as const

export function getChartColors(theme: Theme) {
  return theme === 'dark' ? DARK_CHART : LIGHT_CHART
}
