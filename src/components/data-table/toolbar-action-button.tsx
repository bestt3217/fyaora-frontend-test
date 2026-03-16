import { Button, styled } from '@mui/material'

/**
 * Button style matching the toolbar filter toggle (inactive state).
 * Use for Sort and View buttons so they align with the toggle group.
 */
export const ToolbarActionButton = styled(Button)(({ theme }) => ({
  padding: '6px 8px',
  height: 32,
  minHeight: 32,
  border: '1px solid',
  borderColor: theme.palette.m3SysLightOutline,
  borderRadius: 8,
  color: theme.palette.m3SysLightOnSurface,
  fontSize: 14,
  lineHeight: '20px',
  letterSpacing: '0.1px',
  fontWeight: 500,
  textTransform: 'none',
  '&:hover': {
    borderColor: theme.palette.m3SysLightOutline,
    backgroundColor: theme.palette.action.hover,
    textDecoration: 'none',
  },
}))
