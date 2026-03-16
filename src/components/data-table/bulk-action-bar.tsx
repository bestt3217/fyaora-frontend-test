'use client'

import type { Table } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { IconButton, Paper, Stack, Toolbar, Typography } from '@mui/material'

export interface DataTableBulkActionBarProps<TData> {
  table: Table<TData>
  /** Action buttons (e.g. Export, Delete). Rendered after the selection count and clear button. */
  children?: ReactNode
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
    <Paper
      elevation={1}
      sx={{
        position: 'fixed',
        left: 0,
        right: 0,
        margin: '0 auto',
        bottom: 40,
        zIndex: (theme) => theme.zIndex.appBar,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        width: '100%',
        maxWidth: { xs: '95%', md: '600px' },
      }}
    >
      <Toolbar
        component="div"
        role="group"
        aria-label="Bulk actions"
        sx={{
          minHeight: 56,
          px: 1.5,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
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
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        {children ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            {children}
          </Stack>
        ) : null}
      </Toolbar>
    </Paper>
  )
}
