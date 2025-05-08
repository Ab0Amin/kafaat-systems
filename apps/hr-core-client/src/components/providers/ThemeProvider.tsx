'use client';

import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
  Theme,
  PaletteColor,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useLocales } from '../../i18n/use-locales';

type ThemeMode = 'light' | 'dark' | 'system';

// ===== Theme Context =====
interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'system',
  setMode: () => {
    console.warn('ThemeContext is not initialized');
  },
});

export const useTheme = () => useContext(ThemeContext);

// ===== Color Constants =====
const colors = {
  light: {
    primary: '#20B2AA',
    secondary: '#F9F9F9',
    accent: '#FFB347',
    textPrimary: 'rgba(0, 0, 0, 0.87)',
    textSecondary: 'rgba(0, 0, 0, 0.6)',
    backgroundDefault: '#F9F9F9',
    backgroundPaper: '#FFFFFF',
    accentHover: '#E6A200',
    primaryHover: '#1A9389',
  },
  dark: {
    primary: '#4DB6AC',
    secondary: '#303030',
    accent: '#FFCA28',
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    backgroundDefault: '#303030',
    backgroundPaper: '#424242',
    accentHover: '#E6B324',
    primaryHover: '#45A6A0',
  },
};

// ===== MUI Palette Extension =====
declare module '@mui/material/styles' {
  interface Palette {
    accent: PaletteColor;
  }

  interface PaletteOptions {
    accent?: Partial<PaletteColor>;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    accent: true;
  }
}

// ===== Theme Provider Component =====
export function ThemeProvider({ children }: { children: ReactNode }) {
  const { currentLang, currentDirection } = useLocales();
  const [mode, setMode] = useState<ThemeMode>('system');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    if (savedMode) setMode(savedMode);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const currentTheme = mode === 'system' ? systemTheme : mode;
  const paletteColors = currentTheme === 'dark' ? colors.dark : colors.light;

  const getBackgroundColor = (color: 'primary' | 'secondary' | 'accent', theme: Theme) => {
    if (color === 'accent') return theme.palette.accent.main;
    if (color === 'primary') return theme.palette.primary.main;
    if (color === 'secondary') return theme.palette.secondary.main;
    return '';
  };

  const theme = createTheme({
    direction: currentDirection,
    palette: {
      mode: currentTheme,
      primary: { main: paletteColors.primary },
      secondary: { main: paletteColors.secondary },
      accent: { main: paletteColors.accent },
      text: {
        primary: paletteColors.textPrimary,
        secondary: paletteColors.textSecondary,
      },
      background: {
        default: paletteColors.backgroundDefault,
        paper: paletteColors.backgroundPaper,
      },
    },
    typography: {
      fontFamily:
        currentLang === 'ar' ? 'Tajawal, Roboto, Arial, sans-serif' : 'Roboto, Arial, sans-serif',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            direction: currentDirection,
            backgroundColor: paletteColors.backgroundDefault,
            color: paletteColors.textPrimary,
          },
        },
      },
      MuiButton: {
        defaultProps: {
          color: 'primary',
        },
        styleOverrides: {
          root: ({ ownerState, theme }) => {
            const color = (ownerState.color || 'primary') as 'primary' | 'secondary' | 'accent';
            const variant = ownerState.variant || 'contained';

            const bgColor =
              variant === 'contained' ? getBackgroundColor(color, theme) : 'transparent';

            const hoverColor =
              color === 'accent'
                ? colors[currentTheme].accentHover
                : colors[currentTheme].primaryHover;

            return {
              backgroundColor: bgColor,
              color:
                variant === 'contained'
                  ? color === 'accent'
                    ? 'rgba(0, 0, 0, 0.87)'
                    : '#fff'
                  : getBackgroundColor(color, theme),
              border:
                variant === 'outlined'
                  ? `1px solid ${getBackgroundColor(color, theme)}`
                  : undefined,
              '&:hover': {
                backgroundColor: hoverColor,
              },
            };
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: paletteColors.primary,
            color: '#fff',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: paletteColors.accent,
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