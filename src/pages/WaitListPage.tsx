import { Box, Stack, Typography } from '@mui/material'
import FilterBar from '../components/waitlist/FilterBar'

export default function WaitListPage() {
  return (
    <Stack direction="row" spacing={3} flex={1}>
      <FilterBar onApply={(filters) => console.log('Apply filters', filters)} />
      <Box width="100%">
        <Typography variant="h4">Waitlist</Typography>
      </Box>
    </Stack>
  )
}
