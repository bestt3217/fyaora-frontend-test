import { MAIN_SPACING_Y } from '@/lib/const'
import { Stack } from '@mui/material'
import React from 'react'

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Stack
      sx={{ py: MAIN_SPACING_Y }}
      spacing={3}
      width="100%"
      alignItems="start"
    >
      {children}
    </Stack>
  )
}

export default PageLayout
