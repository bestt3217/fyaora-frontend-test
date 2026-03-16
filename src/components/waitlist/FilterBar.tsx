import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  FormGroup,
  styled,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import logo from '../../assets/logo.svg'
import CheckboxField from './CheckboxField'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { FILTER_BAR_WIDTH, HEADER_HEIGHT_MD, MAIN_SPACING_Y } from '@/lib/const'

const REGISTRATION_STATUS = ['Onboarded', 'Rejected'] as const
const VENDOR_TYPES = ['Independent', 'Company'] as const
const SERVICE_OFFERINGS = [
  'Housekeeping',
  'Window Cleaning',
  'Car Valet',
] as const

const FilterCheckboxGroup = styled(FormGroup)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  gap: theme.spacing(0.5),
}))

const FilterLabel = styled(Box)(({ theme }) => ({
  padding: '8px 12px',
  fontFamily: 'Poppins',
  fontWeight: 700,
  fontStyle: 'normal',
  fontSize: 16,
  lineHeight: '20px',
  letterSpacing: 0,
  color: theme.palette.primaryGray,
  display: 'block',
})) as typeof Box

export type FilterValues = {
  postcode: string
  registrationStatus: string[]
  dateStart: string
  dateEnd: string
  vendorType: string[]
  serviceOffering: string[]
}

const initialFilters: FilterValues = {
  postcode: '',
  registrationStatus: [],
  dateStart: '',
  dateEnd: '',
  vendorType: [],
  serviceOffering: [],
}

type FilterBarProps = {
  /** Initial filter values (e.g. from URL query params). When changed, form resets to these. */
  initialValues?: FilterValues
  onApply?: (filters: FilterValues) => void
}

export default function FilterBar({ initialValues, onApply }: FilterBarProps) {
  const [values, setValues] = useState<FilterValues>(
    initialValues ?? initialFilters
  )

  const handleTextChange =
    (field: 'postcode' | 'dateStart' | 'dateEnd') =>
    (e: { target: { value: string } }) =>
      setValues((prev) => ({ ...prev, [field]: e.target.value }))

  const handleCheckboxChange =
    (field: 'registrationStatus' | 'vendorType' | 'serviceOffering') =>
    (value: string) =>
    (_e: unknown, checked: boolean) => {
      setValues((prev) => {
        const arr = prev[field]
        const next = checked ? [...arr, value] : arr.filter((v) => v !== value)
        return { ...prev, [field]: next }
      })
    }

  const handleApply = () => onApply?.(values)
  const handleClear = () => {
    setValues(initialFilters)
    onApply?.(initialFilters)
  }

  return (
    <Box
      sx={{
        py: { xs: 0, lg: MAIN_SPACING_Y * 1 },
        width: { xs: '100%', lg: FILTER_BAR_WIDTH },
        minWidth: { xs: '100%', lg: FILTER_BAR_WIDTH },
        overflow: 'hidden',
        height: { xs: '100%', lg: `calc(100vh - ${HEADER_HEIGHT_MD}px)` },
        position: 'sticky',
        top: HEADER_HEIGHT_MD,
      }}
    >
      <Stack
        component="aside"
        sx={{
          height: '100%',
          flexShrink: 0,
          bgcolor: 'neutral950',
          p: 2,
        }}
        gap={{xs: 2, md: 4}}
      >
        <Box component={RouterLink} to="/">
          <img src={logo} alt="Logo" style={{ height: 32, width: 'auto' }} />
        </Box>
        <Box sx={{ bgcolor: 'neutral800', px: 2, py: 1, borderRadius: 1 }}>
          <Typography fontWeight={700} fontSize={16} lineHeight="20px">
            User Management
          </Typography>
        </Box>

        <Stack
          gap={{xs: 2, md: 4}}
          sx={{
            overflowY: 'auto',
          }}
        >
          <Box>
            <FilterLabel component="label">Postcode</FilterLabel>
            <TextField
              placeholder="ZIP"
              value={values.postcode}
              onChange={handleTextChange('postcode')}
              size="small"
              fullWidth
              variant="outlined"
              sx={{ mt: 0.5, bgcolor: 'white', maxWidth: '125px' }}
            />
          </Box>

          <Box>
            <FilterLabel component="label">Registration Status</FilterLabel>
            <FilterCheckboxGroup>
              {REGISTRATION_STATUS.map((s) => (
                <CheckboxField
                  key={s}
                  label={s}
                  checked={values.registrationStatus.includes(s)}
                  onChange={handleCheckboxChange('registrationStatus')(s)}
                />
              ))}
            </FilterCheckboxGroup>
          </Box>

          <Box>
            <FilterLabel component="label">Date registered</FilterLabel>
            <Stack spacing={1} sx={{ mt: 0.5 }}>
              <DatePicker
                label="Start"
                value={values.dateStart ? dayjs(values.dateStart) : null}
                onChange={(value) =>
                  setValues((prev) => ({
                    ...prev,
                    dateStart: value ? value.format('YYYY-MM-DD') : '',
                  }))
                }
                slotProps={{
                  textField: {
                    helperText: 'MM/DD/YYYY',
                  },
                }}
              />
              <DatePicker
                label="End"
                value={values.dateEnd ? dayjs(values.dateEnd) : null}
                onChange={(value) =>
                  setValues((prev) => ({
                    ...prev,
                    dateEnd: value ? value.format('YYYY-MM-DD') : '',
                  }))
                }
                slotProps={{
                  textField: {
                    helperText: 'MM/DD/YYYY',
                  },
                }}
              />
            </Stack>
          </Box>

          <Box>
            <FilterLabel component="label">Vendor Type</FilterLabel>
            <FilterCheckboxGroup>
              {VENDOR_TYPES.map((t) => (
                <CheckboxField
                  key={t}
                  label={t}
                  checked={values.vendorType.includes(t)}
                  onChange={handleCheckboxChange('vendorType')(t)}
                />
              ))}
            </FilterCheckboxGroup>
          </Box>

          <Box>
            <FilterLabel component="label">Service Offering</FilterLabel>
            <FilterCheckboxGroup>
              {SERVICE_OFFERINGS.map((s) => (
                <CheckboxField
                  key={s}
                  label={s}
                  checked={values.serviceOffering.includes(s)}
                  onChange={handleCheckboxChange('serviceOffering')(s)}
                />
              ))}
            </FilterCheckboxGroup>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="contained"
            onClick={handleApply}
            size="medium"
            fullWidth
          >
            Apply Filters
          </Button>
          <Button
            variant="outlined"
            onClick={handleClear}
            size="medium"
            fullWidth
          >
            Clear Filters
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
