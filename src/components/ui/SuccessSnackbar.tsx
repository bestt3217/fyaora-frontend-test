import { Alert, Snackbar } from '@mui/material'

export interface SuccessSnackbarProps {
  open: boolean
  message: string
  onClose: () => void
  /** Milliseconds before auto-hide. Default 4000. */
  autoHideDuration?: number
}

export function SuccessSnackbar({
  open,
  message,
  onClose,
  autoHideDuration = 4000,
}: SuccessSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      slotProps={{
        root: {
          sx: {
            '&.MuiSnackbar-root': {
              bottom: { xs: 16, sm: 24 },
            },
          },
        },
      }}
    >
      <Alert
        onClose={onClose}
        severity="success"
        variant="filled"
        sx={{
          width: '100%',
          boxShadow: (theme) => theme.shadows[4],
          '& .MuiAlert-icon': {
            fontSize: 22,
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}
