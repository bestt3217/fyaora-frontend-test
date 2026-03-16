import { createTheme } from '@mui/material/styles'
import type { ThemeOptions } from '@mui/material/styles'

// Augment MUI palette and typography
declare module '@mui/material/styles' {
  interface TypographyVariants {
    'm3-display-small': React.CSSProperties
  }
  interface TypographyVariantsOptions {
    'm3-display-small'?: React.CSSProperties
  }

  interface Palette {
    light40: string
    dark20: string
    dark100: string
    neutral20: string
    neutral200: string
    neutral400: string
    neutral500: string
    neutral600: string
    neutral700: string
    neutral800: string
    neutral900: string
    neutral950: string
    primaryGray: string
    blue100: string
    blue200: string
    dark10: string
    m3SysLightOutline: string
    m3SysLightOnSurface: string
    gumbo200: string
  }
  interface PaletteOptions {
    light40?: string
    dark20?: string
    dark100?: string
    neutral20?: string
    neutral200?: string
    neutral400?: string
    neutral500?: string
    neutral600?: string
    neutral700?: string
    neutral800?: string
    neutral900?: string
    blue100?: string
    blue200?: string
    primaryGray?: string
    dark10?: string
    m3SysLightOutline?: string
    m3SysLightOnSurface?: string
    gumbo200?: string
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    'm3-display-small': true
  }
}

/** Brand palette – neutral and blue scale. Use theme.palette.neutral20, theme.palette.blue100, etc. */
const palette = {
  // Light / dark
  light40: '#EFEFEF',
  dark20: '#CFD1D4',
  dark100: '#1E1E1E',
  // Neutrals
  neutral20: '#313030',
  neutral200: '#2B3641',
  neutral400: '#677582',
  neutral500: '#88939D',
  neutral600: '#4F6071',
  neutral700: '#BCC2C8',
  neutral800: '#D3D8DD',
  neutral900: '#EAEEF3',
  neutral950: '#f4f7f9',
  dark10: '#E7E8EA',

  // M3 / Gumbo
  m3SysLightOutline: '#807664',
  m3SysLightOnSurface: '#4E4636',
  gumbo200: '#C8D5D9',

  // Blues
  blue100: '#1a78f2',
  blue200: '#145fbf',

  // Primary Gray
  primaryGray: '#324054',

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
    'm3-display-small': {
      fontFamily: 'Poppins',
      fontWeight: 400,
      fontStyle: 'normal',
      fontSize: '36px',
      lineHeight: '44px',
      letterSpacing: 0,
      textAlign: 'center',
      verticalAlign: 'middle',
    },
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
