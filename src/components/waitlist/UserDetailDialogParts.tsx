import { IconButton, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

const TITLE_FONT_SIZE = 17.18
const BODY_FONT_SIZE = 15.93

export interface IconLabelProps {
  icon: ReactNode
  children: ReactNode
  /** Default black */
  color?: string
  /** Default 500 */
  fontWeight?: number
}

export function IconLabel({
  icon,
  children,
  color = 'black',
  fontWeight = 500,
}: IconLabelProps) {
  return (
    <Stack direction="row" alignItems="center" gap={0.5}>
      {icon}
      <Typography
        sx={{ fontSize: TITLE_FONT_SIZE }}
        color={color}
        fontWeight={fontWeight}
      >
        {children}
      </Typography>
    </Stack>
  )
}

export interface InfoRowProps {
  icon?: ReactNode
  children: ReactNode
  /** Default #7F7F7F */
  color?: string
}

export function InfoRow({ icon, children, color = '#7F7F7F' }: InfoRowProps) {
  return (
    <Stack direction="row" alignItems="center" gap={0.5}>
      {icon}
      <Typography
        component="p"
        color={color}
        sx={{ fontSize: BODY_FONT_SIZE }}
        lineHeight={1}
      >
        {children}
      </Typography>
    </Stack>
  )
}

export interface SectionTitleProps {
  children: ReactNode
}

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <Typography color="black" fontSize={TITLE_FONT_SIZE} fontWeight={600}>
      {children}
    </Typography>
  )
}

export interface EditCtaButtonProps {
  onClick: () => void
  icon: ReactNode
  label?: string
}

export function EditCtaButton({
  onClick,
  icon,
  label = 'Edit',
}: EditCtaButtonProps) {
  return (
    <IconButton
      disableRipple
      onClick={onClick}
      sx={{ p: 0, gap: 0.5 }}
      aria-label={label}
    >
      {icon}
      <Typography
        sx={{ fontSize: TITLE_FONT_SIZE }}
        color="black"
        fontWeight={500}
      >
        {label}
      </Typography>
    </IconButton>
  )
}
