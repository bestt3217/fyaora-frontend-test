import type { Column } from '@tanstack/react-table'
import {
  Button,
  ListItemIcon,
  Menu,
  MenuItem,
  MenuList,
  Typography,
  styled,
} from '@mui/material'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'

const ColumnHeaderButton = styled(Button)(({ theme }) => ({
  minWidth: 0,
  padding: 0,
  justifyContent: 'flex-start',
  textTransform: 'none',
  color: theme.palette.neutral200,
  fontSize: 17,
  lineHeight: '24px',
  fontWeight: 700,
  '& .MuiButton-endIcon': {
    opacity: 0,
  },
  '&:hover .MuiButton-endIcon': {
    opacity: 1,
  },
  '&:hover': {
    backgroundColor: 'transparent',
    textDecoration: 'inherit',
  },
}))

export interface DataTableColumnHeaderProps<
  TData,
  TValue,
> extends React.ComponentProps<typeof Button> {
  column: Column<TData, TValue>
  label: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  label,
  className,
  sx,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const canSort = column.getCanSort()
  const canHide = column.getCanHide()

  if (!canSort && !canHide) {
    return (
      <Typography
        component="span"
        sx={(theme) => ({
          color: theme.palette.neutral200,
          fontSize: 17,
          lineHeight: '24px',
          fontWeight: 700,
        })}
      >
        {label}
      </Typography>
    )
  }

  const handleClose = () => setAnchorEl(null)

  return (
    <>
      <ColumnHeaderButton
        size="small"
        variant="text"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        disableRipple
        endIcon={
          canSort &&
          (column.getIsSorted() === 'desc' ? (
            <ArrowDownwardIcon fontSize="small" />
          ) : column.getIsSorted() === 'asc' ? (
            <ArrowUpwardIcon fontSize="small" />
          ) : (
            <UnfoldMoreIcon fontSize="small" />
          ))
        }
        className={className}
        sx={{
          ...(column.getIsSorted() && {
            '& .MuiButton-endIcon': { opacity: 1 },
          }),
          ...sx,
        }}
        {...props}
      >
        {label}
      </ColumnHeaderButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { minWidth: 112 } } }}
      >
        <MenuList dense disablePadding>
          {[
            ...(canSort
              ? [
                  <MenuItem
                    key="asc"
                    onClick={() => {
                      column.toggleSorting(false)
                      handleClose()
                    }}
                    selected={column.getIsSorted() === 'asc'}
                  >
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <ArrowUpwardIcon fontSize="small" />
                    </ListItemIcon>
                    Asc
                  </MenuItem>,
                  <MenuItem
                    key="desc"
                    onClick={() => {
                      column.toggleSorting(true)
                      handleClose()
                    }}
                    selected={column.getIsSorted() === 'desc'}
                  >
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <ArrowDownwardIcon fontSize="small" />
                    </ListItemIcon>
                    Desc
                  </MenuItem>,
                  ...(column.getIsSorted()
                    ? [
                        <MenuItem
                          key="reset"
                          onClick={() => {
                            column.clearSorting()
                            handleClose()
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <CloseIcon fontSize="small" />
                          </ListItemIcon>
                          Reset
                        </MenuItem>,
                      ]
                    : []),
                ]
              : []),
            ...(canHide
              ? [
                  <MenuItem
                    key="hide"
                    onClick={() => {
                      column.toggleVisibility(false)
                      handleClose()
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <VisibilityOffIcon fontSize="small" />
                    </ListItemIcon>
                    Hide
                  </MenuItem>,
                ]
              : []),
          ]}
        </MenuList>
      </Menu>
    </>
  )
}
