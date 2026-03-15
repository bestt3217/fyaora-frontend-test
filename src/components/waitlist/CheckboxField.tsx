import { FormControlLabel } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'
import Checkbox from '../Checkbox'

export type CheckboxFieldProps = {
  label: string
  checked: boolean
  onChange: (event: unknown, checked: boolean) => void
  /** Optional overrides for FormControlLabel (e.g. table row height) */
  sx?: SxProps<Theme>
}

export default function CheckboxField({
  label,
  checked,
  onChange,
  sx = {},
}: CheckboxFieldProps) {
  return (
    <FormControlLabel
      sx={
        sx
          ? ([
              {
                height: '38px',
                '& .MuiFormControlLabel-label': { fontWeight: 500 },
              },
              sx,
            ] as SxProps<Theme>)
          : {
              height: '38px',
              '& .MuiFormControlLabel-label': { fontWeight: 500 },
            }
      }
      control={<Checkbox checked={checked} onChange={onChange} />}
      label={label}
    />
  )
}
