'use client'

import type { Table } from '@tanstack/react-table'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export interface DataTableBulkActionBarProps<TData> {
  table: Table<TData>
  /** Action buttons (e.g. Export, Delete). Rendered after the selection count and clear button. */
  children?: React.ReactNode
}

export function DataTableBulkActionBar<TData>({
  table,
  children,
}: DataTableBulkActionBarProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const count = selectedRows.length

  if (count === 0) return null

  const handleClearSelection = () => {
    table.toggleAllRowsSelected(false)
  }

  return (
    <Box
      component="div"
      role="group"
      aria-label="Bulk actions"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1.5,
        py: 1,
        px: 1.5,
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'action.selected',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body2" fontWeight={500}>
          {count} selected
        </Typography>
        <IconButton
          size="small"
          onClick={handleClearSelection}
          aria-label="Clear selection"
          sx={{ p: 0.5 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>
      {children && (
        <Stack direction="row" alignItems="center" spacing={1}>
          {children}
        </Stack>
      )}
    </Box>
  )
}
