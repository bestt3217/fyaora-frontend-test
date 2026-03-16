'use client'

import type { Table } from '@tanstack/react-table'
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
  TextField,
  Typography,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import SettingsIcon from '@mui/icons-material/Settings'
import { ToolbarActionButton } from './toolbar-action-button'
import { useMemo, useState } from 'react'

export interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
  disabled?: boolean
  /** Align trigger button (e.g. 'end' to push right). */
  align?: 'start' | 'end'
}

export function DataTableViewOptions<TData>({
  table,
  disabled = false,
  align = 'end',
}: DataTableViewOptionsProps<TData>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [search, setSearch] = useState('')
  const open = Boolean(anchorEl)

  const columns = useMemo(
    () =>
      table
        .getAllColumns()
        .filter(
          (col) => typeof col.accessorFn !== 'undefined' && col.getCanHide()
        ),
    [table]
  )

  const filteredColumns = useMemo(() => {
    if (!search.trim()) return columns
    const q = search.trim().toLowerCase()
    return columns.filter((col) => {
      const label =
        (col.columnDef.meta as { label?: string } | undefined)?.label ?? col.id
      return label.toLowerCase().includes(q)
    })
  }, [columns, search])

  const handleClose = () => {
    setAnchorEl(null)
    setSearch('')
  }

  const horizontal = align === 'end' ? 'right' : 'left'

  return (
    <>
      <ToolbarActionButton
        aria-label="Toggle columns"
        variant="outlined"
        size="small"
        startIcon={<SettingsIcon />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        disabled={disabled}
        sx={{
          ml: align === 'end' ? 'auto' : 0,
        }}
      >
        View
      </ToolbarActionButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal }}
        transformOrigin={{ vertical: 'top', horizontal }}
        slotProps={{ paper: { sx: { width: 220, maxHeight: 320, p: 0 } } }}
      >
        <TextField
          size="small"
          placeholder="Search columns..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ px: 1.5, py: 1 }}
          slotProps={{ input: { sx: { fontSize: 14 } } }}
        />
        <MenuList
          dense
          disablePadding
          sx={{ maxHeight: 260, overflow: 'auto' }}
        >
          {filteredColumns.length === 0 ? (
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                No columns found.
              </Typography>
            </MenuItem>
          ) : (
            filteredColumns.map((column) => {
              const label =
                (column.columnDef.meta as { label?: string } | undefined)
                  ?.label ?? column.id
              const isVisible = column.getIsVisible()
              return (
                <MenuItem
                  key={column.id}
                  onClick={() => column.toggleVisibility(!isVisible)}
                >
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    {isVisible ? (
                      <CheckIcon fontSize="small" color="primary" />
                    ) : null}
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      variant: 'body2',
                      noWrap: true,
                    }}
                  />
                </MenuItem>
              )
            })
          )}
        </MenuList>
      </Popover>
    </>
  )
}
