import { Box } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import logo from '@/assets/logo.svg'

export default function Logo() {
  return (
    <Box component={RouterLink} to="/">
      <img src={logo} alt="Logo" style={{ height: 32, width: 'auto' }} />
    </Box>
  )
}
