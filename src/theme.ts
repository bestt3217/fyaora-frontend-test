import { createTheme } from '@mui/material/styles'
import type { ThemeOptions } from '@mui/material/styles'

// Augment MUI palette so theme.palette.neutral20, blue100, etc. are typed
declare module '@mui/material/styles' {
  interface Palette {
    neutral20: string
    neutral50: string
    neutral100: string
    neutral200: string
    neutral300: string
    neutral950: string
    blue100: string
    blue200: string
  }
  interface PaletteOptions {
    neutral20?: string
    neutral50?: string
    neutral100?: string
    neutral200?: string
    neutral300?: string
    blue100?: string
    blue200?: string
  }
}

/** Brand palette – neutral and blue scale. Use theme.palette.neutral20, theme.palette.blue100, etc. */
const palette = {
  // Neutrals
  neutral20: '#313030',
  neutral50: '#5c5b5b',
  neutral100: '#757474',
  neutral200: '#9e9d9d',
  neutral300: '#e5e5e5',
  neutral950: '#f4f7f9',
  // Blues
  blue100: '#1a78f2',
  blue200: '#145fbf',

  // MUI primary (maps to blue for buttons, etc.)
  primary: {
    main: '#1a78f2',
    light: '#4d9bf5',
    dark: '#145fbf',
    contrastText: '#fff',
  },
} as ThemeOptions['palette']

export const brandedTokens: ThemeOptions = {
  palette,
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontFamily:
      'var(--font-primary, "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
  },
}

export const brandedComponents: ThemeOptions['components'] = {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        minWidth: 'unset',
        textTransform: 'capitalize',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
    },
  },
}

const brandedTheme = createTheme({
  ...brandedTokens,
  components: brandedComponents,
})

export default brandedTheme
