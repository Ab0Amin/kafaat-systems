'use client';

import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useLocales } from '../../i18n/use-locales';


type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'system',
  setMode: (_: ThemeMode) => {
    console.warn('ThemeContext: setMode was called before ThemeProvider was initialized');
  },
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { currentLang, currentDirection } = useLocales();
  const [mode, setMode] = useState<ThemeMode>('system');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Get saved theme preference from localStorage
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    if (savedMode) {
      setMode(savedMode);
    }

    // Set up system theme detection
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const currentTheme = mode === 'system' ? systemTheme : mode;

  // Create theme with current language direction
  const theme = createTheme({
    direction: currentDirection,
    palette: {
      mode: currentTheme,
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
    typography: {
      fontFamily: currentLang === 'ar' ? 'Tajawal, Roboto, Arial, sans-serif' : 'Roboto, Arial, sans-serif',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            direction: currentDirection,
          },
        },
      },
    },
  });

  const handleSetMode = (newMode: ThemeMode) => {
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  return (
    <ThemeContext.Provider value={{ mode, setMode: handleSetMode }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
}