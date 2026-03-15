import { Checkbox as MuiCheckbox } from '@mui/material'
import type { CheckboxProps } from '@mui/material'
import IconCheckbox from './icons/IconCheckbox'

const ICON_SIZE = 24

export default function Checkbox(props: CheckboxProps) {
  return (
    <MuiCheckbox
      icon={<IconCheckbox width={ICON_SIZE} height={ICON_SIZE} />}
      checkedIcon={<IconCheckbox checked width={ICON_SIZE} height={ICON_SIZE} />}
      {...props}
    />
  )
}
