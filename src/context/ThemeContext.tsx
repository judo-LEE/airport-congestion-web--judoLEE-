import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  applyTheme,
  getInitialTheme,
  getChartColors,
  THEME_STORAGE_KEY,
  type Theme,
} from '../utils/theme'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  chartColors: ReturnType<typeof getChartColors>
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme())

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      chartColors: getChartColors(theme),
    }),
    [theme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
