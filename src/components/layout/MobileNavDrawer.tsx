import { Link as RouterLink, useLocation } from 'react-router-dom'
import { Box, Drawer, List, ListItemButton, ListItemText } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Logo from '../Logo'

export interface MobileNavItem {
  label: string
  path: string
}

export interface MobileNavDrawerProps {
  open: boolean
  items: readonly MobileNavItem[]
  onClose: () => void
}

export function MobileNavDrawer({
  open,
  items,
  onClose,
}: MobileNavDrawerProps) {
  const location = useLocation()
  const theme = useTheme()

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 260,
          bgcolor: theme.palette.neutral950,
        },
      }}
    >
      <Box sx={{ p: 2, pb: 0 }}>
        <Logo />
      </Box>
      <List>
        {items.map(({ label, path }) => {
          const active = location.pathname === path
          return (
            <ListItemButton
              key={path}
              component={RouterLink}
              to={path}
              selected={active}
              onClick={onClose}
            >
              <ListItemText
                primary={label}
                slotProps={{
                  primary: {
                    fontSize: 14,
                    fontWeight: active ? 600 : 500,
                  },
                }}
              />
            </ListItemButton>
          )
        })}
      </List>
    </Drawer>
  )
}
