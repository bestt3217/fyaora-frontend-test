import { useRef, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import CloseIcon from '@mui/icons-material/Close'
import type { WaitlistRow } from '@/types/waitlist'
import { useToast } from '@/hooks/use-toast'
import IconUserOutline from '../icons/IconUserOutline'
import IconMail from '../icons/IconMail'
import IconPhone from '../icons/IconPhone'
import IconLocation from '../icons/IconLocation'
import dayjs from 'dayjs'
import IconCalendarOutline from '../icons/IconCalendarOutline'
import IconMessage from '../icons/IconMessage'
import IconPencil from '../icons/IconPencil'
import {
  EditCtaButton,
  IconLabel,
  InfoRow,
  SectionTitle,
} from './UserDetailDialogParts'

const PLACEHOLDER_NOTES = 'No Note Added yet'

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
  const theme = useTheme()
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'))
  const { showToast } = useToast()
  const [notesEditing, setNotesEditing] = useState(false)
  const [internalNotes, setInternalNotes] = useState(PLACEHOLDER_NOTES)
  const [draftNotes, setDraftNotes] = useState(PLACEHOLDER_NOTES)
  const notesInputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  if (!row) return null

  const isServiceProvider = row.type === 'service-providers'

  const startEditingNotes = () => {
    setDraftNotes(internalNotes === PLACEHOLDER_NOTES ? '' : internalNotes)
    setNotesEditing(true)
    setTimeout(() => notesInputRef.current?.focus(), 0)
  }

  const saveNotes = () => {
    setInternalNotes(draftNotes.trim() || PLACEHOLDER_NOTES)
    setNotesEditing(false)
  }

  const cancelEditingNotes = () => {
    setNotesEditing(false)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isSmDown}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
          },
        },
      }}
    >
      <DialogContent
        sx={{
          p: 3,
        }}
      >
        <Stack gap={2.5}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <IconLabel icon={<IconUserOutline width={20} height={20} />}>
              User Details
            </IconLabel>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Stack
            direction={isSmDown ? 'column' : 'row'}
            justifyContent="space-between"
            alignItems={isSmDown ? 'flex-start' : 'center'}
            gap={isSmDown ? 1.5 : 0.5}
          >
            <Stack spacing={1}>
              <Typography
                component="p"
                color="black"
                fontSize={19.85}
                lineHeight={1}
                fontWeight={600}
              >
                {row.name}
              </Typography>
              <InfoRow
                icon={<IconMail width={16} height={16} color="#AEAEAE" />}
                color="#AEAEAE"
              >
                {row.email}
              </InfoRow>
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
            </Stack>
          </Stack>

          <Divider />

          <Stack gap={2.5}>
            <SectionTitle>Contact Information</SectionTitle>
            <Grid container rowSpacing={3} columnSpacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoRow
                  icon={<IconMail width={16} height={16} color="#000000" />}
                >
                  Contact Information
                </InfoRow>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoRow
                  icon={<IconPhone width={16} height={16} color="#000000" />}
                >
                  {row.phoneNumber || '—'}
                </InfoRow>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoRow
                  icon={<IconLocation width={16} height={16} color="#000000" />}
                >
                  United Kingdom
                </InfoRow>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoRow
                  icon={
                    <IconCalendarOutline
                      width={16}
                      height={16}
                      color="#000000"
                    />
                  }
                >
                  Signed up {dayjs(row.dateRegistered).format('MM/DD/YYYY')}
                </InfoRow>
              </Grid>
            </Grid>
          </Stack>

          <Divider />

          <Stack spacing={2}>
            <SectionTitle>Customer Details</SectionTitle>

            <IconLabel
              icon={<IconUserOutline width={20} height={20} />}
              fontWeight={400}
            >
              {row.vendorType || '—'}
            </IconLabel>

            <Typography sx={{ fontSize: 17.18 }} fontWeight={500} color="black">
              User Details
            </Typography>
            <InfoRow>{row.serviceOffering || '—'}</InfoRow>
          </Stack>

          {/* Internal notes */}
          <Box sx={{ mt: 3 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <IconLabel
                icon={<IconMessage width={20} height={20} color="#000000" />}
              >
                Internal Notes
              </IconLabel>

              {notesEditing ? (
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="text"
                    onClick={cancelEditingNotes}
                  >
                    Cancel
                  </Button>
                  <Button size="small" variant="contained" onClick={saveNotes}>
                    Save
                  </Button>
                </Stack>
              ) : (
                <EditCtaButton
                  onClick={startEditingNotes}
                  icon={<IconPencil width={16} height={16} color="#000000" />}
                  label="Edit"
                />
              )}
            </Stack>

            <TextField
              inputRef={notesInputRef}
              multiline
              minRows={3}
              fullWidth
              disabled={!notesEditing}
              value={notesEditing ? draftNotes : internalNotes}
              onChange={(e) => notesEditing && setDraftNotes(e.target.value)}
              placeholder={PLACEHOLDER_NOTES}
              slotProps={{
                input: { 'aria-label': 'Internal notes' },
              }}
              sx={{
                '& .MuiInputBase-root.Mui-disabled': {
                  backgroundColor: '#E9E9E9',
                  color: '#7F7F7F',
                },
              }}
            />
          </Box>

          {/* Actions */}
          <Stack
            direction="row"
            justifyContent={isSmDown ? 'space-between' : 'center'}
            spacing={isSmDown ? 1.5 : 2}
            sx={{ width: '100%' }}
          >
            <Button
              sx={{
                borderRadius: 100,
                height: isSmDown ? 44 : 56,
                minWidth: isSmDown ? 'auto' : 150,
                px: isSmDown ? 2 : 3,
                fontSize: isSmDown ? 16 : 20,
                flex: isSmDown ? 1 : 'unset',
              }}
              variant="contained"
              color="primary"
              onClick={() => {
                showToast('User onboarded successfully.')
                onClose()
              }}
            >
              Onboard
            </Button>
            <Button
              sx={{
                borderRadius: 100,
                height: isSmDown ? 44 : 56,
                minWidth: isSmDown ? 'auto' : 150,
                px: isSmDown ? 2 : 3,
                fontSize: isSmDown ? 16 : 20,
                flex: isSmDown ? 1 : 'unset',
              }}
              variant="contained"
              color="error"
              onClick={() => {
                showToast('User rejected.')
                onClose()
              }}
            >
              Reject
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
