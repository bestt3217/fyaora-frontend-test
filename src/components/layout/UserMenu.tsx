import { useState } from 'react'
import {
  IconButton,
  Stack,
  Avatar,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import avatarImg from '../../assets/avatar1.webp'

export default function UserMenu() {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const handleLogout = () => {
    handleClose()
    // TODO: wire to auth / redirect
  }

  return (
    <>
      <IconButton
        disableRipple
        onClick={handleOpen}
        sx={{ p: 0 }}
        aria-controls={open ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar
            src={avatarImg}
            alt="Max Smith"
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
            }}
          />
          <Stack textAlign="left">
            <Typography
              sx={{
                color: theme.palette.primaryGray,
                fontSize: 12,
                lineHeight: '16px',
                fontWeight: 500,
              }}
            >
              Max Smith
            </Typography>
            <Typography
              sx={{
                color: theme.palette.neutral600,
                fontSize: 12,
                lineHeight: '14px',
              }}
            >
              London, UK
            </Typography>
          </Stack>
        </Stack>
      </IconButton>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 200, mt: 2 } } }}
      >
        <MenuItem
          disabled
          sx={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            opacity: 1,
            '&.Mui-disabled': { opacity: 1 },
          }}
        >
          <Typography
            sx={{
              color: theme.palette.primaryGray,
              fontSize: 12,
              lineHeight: '16px',
              fontWeight: 500,
            }}
          >
            Max Smith
          </Typography>
          <Typography
            sx={{
              color: theme.palette.neutral600,
              fontSize: 12,
              lineHeight: '14px',
            }}
          >
            London, UK
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  )
}
