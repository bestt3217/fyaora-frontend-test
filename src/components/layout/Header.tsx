import { Link as RouterLink, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Container,
  Button,
  IconButton,
  Stack,
} from '@mui/material'
import type { ButtonProps } from '@mui/material/Button'
import { styled, useTheme } from '@mui/material/styles'
import IconNotification from '../icons/IconNotification'
import IconChat from '../icons/IconChat'
import UserMenu from './UserMenu'
import { HEADER_HEIGHT_MD, HEADER_HEIGHT_XS } from '@/lib/const'

const navItems = [
  { label: 'Service Dashboard', path: '/service-dashboard' },
  { label: 'Finance Forecast', path: '/finance-forecast' },
  { label: 'Human Resources', path: '/waitlist' },
  { label: 'Users', path: '/users' },
  { label: 'Compliances & Verifications', path: '/compliances' },
] as const

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<ButtonProps & { active?: boolean; to?: string }>(({ theme, active }) => ({
  padding: '10px 12px',
  fontWeight: 500,
  fontSize: 14,
  lineHeight: '20px',
  letterSpacing: '0.1px',
  textAlign: 'center',
  verticalAlign: 'middle',
  color: active ? theme.palette.blue100 : theme.palette.neutral20,
  textTransform: 'none',
  '&:hover': {
    color: theme.palette.blue100,
    backgroundColor: 'transparent',
    textDecoration: 'inherit',
  },
}))

const HeaderIconButton = styled(IconButton)(({ theme }) => ({
  padding: 0,
  color: theme.palette.neutral400,
  '&:hover': {
    color: theme.palette.blue100,
    backgroundColor: 'transparent',
  },
}))

export default function Header() {
  const location = useLocation()
  const theme = useTheme()

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{ bgcolor: theme.palette.neutral950 }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: HEADER_HEIGHT_XS, md: HEADER_HEIGHT_MD },
          }}
        >
          <Stack direction="row" spacing={1} flex={1} flexWrap="wrap">
            {navItems.map(({ label, path }) => (
              <NavButton
                key={path}
                component={RouterLink}
                to={path}
                size="small"
                active={location.pathname === path}
              >
                {label}
              </NavButton>
            ))}
          </Stack>

          <Stack direction="row" spacing={5}>
            <HeaderIconButton disableRipple>
              <IconNotification width={24} height={24} />
            </HeaderIconButton>
            <HeaderIconButton disableRipple>
              <IconChat width={24} height={24} />
            </HeaderIconButton>
            <UserMenu />
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
