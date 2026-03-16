'use client'

import type { ColumnSort, Table } from '@tanstack/react-table'
import {
  Box,
  Button,
  FormControl,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Popover,
  Select,
  Typography,
} from '@mui/material'
import SortIcon from '@mui/icons-material/SwapVert'
import { ToolbarActionButton } from './toolbar-action-button'
import DeleteIcon from '@mui/icons-material/Delete'
import { useCallback, useMemo, useState } from 'react'
import { dataTableConfig } from '@/config/data-table'

export interface DataTableSortListProps<TData> {
  table: Table<TData>
  disabled?: boolean
}

export function DataTableSortList<TData>({
  table,
  disabled = false,
}: DataTableSortListProps<TData>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const sorting = table.getState().sorting
  const onSortingChange = table.setSorting

  const { sortableColumns, availableToAdd } = useMemo(() => {
    const labels = new Map<string, string>()
    const sortable: { id: string; label: string }[] = []
    const usedIds = new Set(sorting.map((s) => s.id))
    const toAdd: { id: string; label: string }[] = []
    for (const col of table.getAllColumns()) {
      if (!col.getCanSort()) continue
      const label =
        (col.columnDef.meta as { label?: string } | undefined)?.label ?? col.id
      labels.set(col.id, label)
      sortable.push({ id: col.id, label })
      if (!usedIds.has(col.id)) toAdd.push({ id: col.id, label })
    }
    return {
      columnLabels: labels,
      sortableColumns: sortable,
      availableToAdd: toAdd,
    }
  }, [table, sorting])

  const onSortAdd = useCallback(() => {
    const first = availableToAdd[0]
    if (!first) return
    onSortingChange((prev) => [...prev, { id: first.id, desc: false }])
  }, [availableToAdd, onSortingChange])

  const onSortUpdate = useCallback(
    (sortId: string, updates: Partial<ColumnSort>) => {
      onSortingChange((prev) =>
        prev.map((s) => (s.id === sortId ? { ...s, ...updates } : s))
      )
    },
    [onSortingChange]
  )

  const onSortRemove = useCallback(
    (sortId: string) => {
      onSortingChange((prev) => prev.filter((s) => s.id !== sortId))
    },
    [onSortingChange]
  )

  const onSortingReset = useCallback(() => {
    onSortingChange(table.initialState?.sorting ?? [])
  }, [onSortingChange, table.initialState?.sorting])

  const handleClose = () => setAnchorEl(null)

  return (
    <>
      <ToolbarActionButton
        variant="outlined"
        size="small"
        startIcon={<SortIcon />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        disabled={disabled}
      >
        <span>Sort</span>
        {sorting.length > 0 && (
          <Box
            component="span"
            sx={{
              width: 20,
              height: 20,
              fontSize: 12,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '99px',
              backgroundColor: 'primary.main',
              color: 'white',
              ml: 1,
            }}
          >
            {sorting.length}
          </Box>
        )}
      </ToolbarActionButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: { minWidth: 320, maxWidth: 400, p: 2 },
          },
        }}
      >
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          {sorting.length > 0 ? 'Sort by' : 'No sorting applied'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {sorting.length > 0
            ? 'Modify sorting to organize your rows.'
            : 'Add sorting to organize your rows.'}
        </Typography>

        {sorting.length > 0 && (
          <List
            dense
            disablePadding
            sx={{ mb: 2, maxHeight: 280, overflow: 'auto' }}
          >
            {sorting.map((sort, index) => (
              <SortListItem
                key={`${sort.id}-${index}`}
                sort={sort}
                sortableColumns={sortableColumns}
                onUpdate={(updates) => onSortUpdate(sort.id, updates)}
                onRemove={() => onSortRemove(sort.id)}
              />
            ))}
          </List>
        )}

        <Typography
          component="div"
          sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}
        >
          <Button
            size="small"
            variant="contained"
            onClick={onSortAdd}
            disabled={availableToAdd.length === 0}
          >
            Add sort
          </Button>
          {sorting.length > 0 && (
            <Button size="small" variant="outlined" onClick={onSortingReset}>
              Reset sorting
            </Button>
          )}
        </Typography>
      </Popover>
    </>
  )
}

function SortListItem({
  sort,
  sortableColumns,
  onUpdate,
  onRemove,
}: {
  sort: ColumnSort
  sortableColumns: { id: string; label: string }[]
  onUpdate: (updates: Partial<ColumnSort>) => void
  onRemove: () => void
}) {
  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          size="small"
          onClick={onRemove}
          aria-label="Remove sort"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      }
      sx={{ alignItems: 'center', gap: 1, px: 0 }}
    >
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <Select
          value={sort.id}
          onChange={(e) => onUpdate({ id: e.target.value })}
          displayEmpty
          sx={{ height: 32, fontSize: 14 }}
        >
          {sortableColumns.map((col) => (
            <MenuItem key={col.id} value={col.id}>
              {col.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 90 }}>
        <Select
          value={sort.desc ? 'desc' : 'asc'}
          onChange={(e) => onUpdate({ desc: e.target.value === 'desc' })}
          sx={{ height: 32, fontSize: 14 }}
        >
          {dataTableConfig.sortOrders.map((order) => (
            <MenuItem key={order.value} value={order.value}>
              {order.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </ListItem>
  )
}
