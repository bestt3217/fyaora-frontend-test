import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import type { WaitlistRow } from '@/types/waitlist'

export interface UserDetailDialogProps {
  open: boolean
  row: WaitlistRow | null
  onClose: () => void
}

export function UserDetailDialog({
  open,
  row,
  onClose,
}: UserDetailDialogProps) {
  if (!row) return null

  const isServiceProvider = row.type === 'service-providers'

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent
        sx={(theme) => ({
          p: 3,
          bgcolor: theme.palette.neutral950,
        })}
      >
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="start">
          <Stack spacing={0.5}>
            <Typography variant="subtitle2" color="neutral500">
              User Details
            </Typography>
            <Typography variant="h6" color="dark100">
              {row.name}
            </Typography>
            <Typography
              variant="body2"
              color="neutral500"
              sx={{ wordBreak: 'break-all' }}
            >
              {row.email}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              size="small"
              label={isServiceProvider ? 'Service provider' : 'Customer'}
              sx={(theme) => ({
                bgcolor: theme.palette.neutral900,
                color: theme.palette.dark100,
                fontWeight: 500,
              })}
            />
            <Chip
              size="small"
              label={row.registrationStatus}
              sx={(theme) => ({
                bgcolor:
                  row.registrationStatus === 'Onboarded'
                    ? theme.palette.blue100
                    : theme.palette.neutral900,
                color: '#fff',
                fontWeight: 500,
              })}
            />
            <IconButton size="small" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>

        {/* Contact information */}
        <Box sx={{ mt: 3 }}>
          <Typography
            variant="subtitle2"
            color="neutral500"
            sx={{ mb: 1 }}
          >
            Contact Information
          </Typography>
          <Stack spacing={0.5}>
            <Typography variant="body2" color="dark100">
              {row.phoneNumber || '—'}
            </Typography>
            <Typography variant="body2" color="neutral500">
              United Kingdom
            </Typography>
            <Typography variant="body2" color="neutral500">
              Signed up {row.dateRegistered}
            </Typography>
          </Stack>
        </Box>

        {/* Customer / User details */}
        <Box sx={{ mt: 3 }}>
          <Typography
            variant="subtitle2"
            color="neutral500"
            sx={{ mb: 1 }}
          >
            {isServiceProvider ? 'Provider Details' : 'Customer Details'}
          </Typography>
          <Stack spacing={0.5}>
            <Typography variant="body2" color="dark100">
              Postcode: {row.postcode || '—'}
            </Typography>
            {isServiceProvider && (
              <Typography variant="body2" color="dark100">
                Vendor type: {row.vendorType || '—'}
              </Typography>
            )}
          </Stack>
        </Box>

        {isServiceProvider && (
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="subtitle2"
              color="neutral500"
              sx={{ mb: 1 }}
            >
              Service Offering
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {row.serviceOffering ? (
                <Chip
                  size="small"
                  label={row.serviceOffering}
                  sx={(theme) => ({
                    bgcolor: theme.palette.neutral900,
                    color: theme.palette.dark100,
                  })}
                />
              ) : (
                <Typography variant="body2" color="neutral500">
                  —
                </Typography>
              )}
            </Stack>
          </Box>
        )}

        {/* Internal notes */}
        <Box sx={{ mt: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Typography variant="subtitle2" color="neutral500">
              Internal Notes
            </Typography>
            <Typography variant="body2" color="blue100">
              Edit
            </Typography>
          </Stack>
          <TextField
            multiline
            minRows={3}
            fullWidth
            disabled
            value="No Note Added yet"
          />
        </Box>

        {/* Actions */}
        <Stack
          direction="row"
          justifyContent="center"
          spacing={2}
          sx={{ mt: 4 }}
        >
          <Button variant="contained" color="primary">
            Onboard
          </Button>
          <Button variant="contained" color="error">
            Reject
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

