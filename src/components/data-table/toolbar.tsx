import type { Column, Table } from '@tanstack/react-table'
import {
  Button,
  InputAdornment,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  styled,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useCallback, useEffect, useMemo, useState } from 'react'
import IconSearch from '../icons/IconSearch'
import { useDebounce } from '../../hooks/useDebounce'
import { DataTableViewOptions } from './view-options'
import { DataTableSortList } from './sort-list'

export type FilterOption = { label: string; value: string }

export type FilterConfig = { type: 'toggle'; options: FilterOption[] }

const ToolbarFilterToggleGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  gap: 16,
  borderRadius: 8,
  '& .MuiToggleButtonGroup-grouped': {
    marginLeft: 0,
    borderRadius: 8,
  },
  '& .MuiToggleButtonGroup-grouped:first-of-type': {
    borderRadius: 8,
  },
  '& .MuiToggleButtonGroup-grouped:last-of-type': {
    borderRadius: 8,
    borderLeft: '1px solid',
    borderColor: theme.palette.m3SysLightOutline,
  },
}))

const ToolbarFilterToggleButton = styled(ToggleButton)(({ theme }) => ({
  gap: 16,
  padding: '6px 8px',
  border: '1px solid',
  borderColor: theme.palette.m3SysLightOutline,
  borderRadius: 8,
  color: theme.palette.m3SysLightOnSurface,
  fontSize: 14,
  lineHeight: '20px',
  letterSpacing: '0.1px',
  fontWeight: 500,
  textTransform: 'capitalize',
  '&.Mui-selected': {
    backgroundColor: theme.palette.gumbo200,
    borderColor: theme.palette.gumbo200,
    color: theme.palette.m3SysLightOnSurface,
    '&:hover': {
      backgroundColor: theme.palette.gumbo200,
    },
  },
}))

const ToolbarSearchField = styled(TextField)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    minWidth: 240,
  },
  '& .MuiOutlinedInput-root': {
    height: 32,
    padding: '4px 12px',
    border: '1px solid',
    borderColor: theme.palette.dark10,
    borderRadius: 2,
    backgroundColor: theme.palette.common.white,
    '& fieldset': {
      border: 'none',
    },
    '&:hover': {
      borderColor: theme.palette.m3SysLightOutline,
    },
    '&.Mui-focused': {
      borderColor: theme.palette.primary.main,
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 0,
      },
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: 0,
    fontSize: 14,
    lineHeight: '22px',
    '&::placeholder': {
      color: theme.palette.neutral500,
      opacity: 1,
    },
  },
  '& .MuiInputAdornment-root': {
    padding: 4,
    borderRadius: 2,
    backgroundColor: theme.palette.common.white,
    margin: 0,
    marginLeft: 0,
  },
}))

const ColumnFilterInput = styled(TextField)(({ theme }) => ({
  width: 160,
  '& .MuiOutlinedInput-root': {
    height: 32,
    fontSize: 14,
    '& fieldset': { borderColor: theme.palette.divider },
  },
}))

const SEARCH_DEBOUNCE_MS = 500

export type DataTableToolbarProps<TData = unknown> = {
  /** When provided, enables table-driven toolbar: column filters, reset, view options. */
  table?: Table<TData>
  /** Extra content on the right (e.g. sort list). */
  children?: React.ReactNode
  /** Custom filter toggle (e.g. type: Service providers / Customers). */
  filters?: FilterConfig
  filterValue?: string
  onFilterChange?: (value: string) => void
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  /** Debounce delay for search in ms. Default 500. */
  searchDebounceMs?: number
}

function ColumnFilterCell<TData>({ column }: { column: Column<TData> }) {
  const meta = column.columnDef.meta as
    | { label?: string; placeholder?: string; variant?: string }
    | undefined
  if (meta?.variant !== 'text') return null
  const placeholder = meta.placeholder ?? meta.label ?? column.id
  const value = (column.getFilterValue() as string) ?? ''
  return (
    <ColumnFilterInput
      size="small"
      placeholder={placeholder}
      value={value}
      onChange={(e) => column.setFilterValue(e.target.value)}
      slotProps={{ input: { sx: { height: 32 } } }}
    />
  )
}

export function DataTableToolbar<TData>({
  table,
  children,
  filters,
  filterValue,
  onFilterChange,
  searchValue: controlledSearch,
  onSearchChange,
  searchPlaceholder = 'Search',
  searchDebounceMs = SEARCH_DEBOUNCE_MS,
}: DataTableToolbarProps<TData>) {
  const [searchValue, setSearchValue] = useState(controlledSearch ?? '')
  const debouncedSearch = useDebounce(searchValue, searchDebounceMs)

  useEffect(() => {
    if (controlledSearch === undefined) return
    const id = setTimeout(() => setSearchValue(controlledSearch), 0)
    return () => clearTimeout(id)
  }, [controlledSearch])

  useEffect(() => {
    if (controlledSearch === undefined) return
    if (debouncedSearch === controlledSearch) return
    onSearchChange?.(debouncedSearch)
  }, [debouncedSearch, onSearchChange, controlledSearch])

  const filterableColumns = useMemo(
    () =>
      table ? table.getAllColumns().filter((col) => col.getCanFilter()) : [],
    [table]
  )

  const isFiltered = table ? table.getState().columnFilters.length > 0 : false

  const onResetFilters = useCallback(() => {
    table?.resetColumnFilters()
  }, [table])

  const leftNode = (
    <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap" flex={1}>
      {filters?.type === 'toggle' && (
        <ToolbarFilterToggleGroup
          value={filterValue ?? filters.options[0]?.value ?? ''}
          exclusive
          onChange={(_, value) => value != null && onFilterChange?.(value)}
          aria-label="Filter"
        >
          {filters.options.map((opt) => (
            <ToolbarFilterToggleButton
              key={opt.value}
              value={opt.value}
              aria-label={opt.label}
            >
              {opt.label}
            </ToolbarFilterToggleButton>
          ))}
        </ToolbarFilterToggleGroup>
      )}
      {table &&
        filterableColumns.map((column) => (
          <ColumnFilterCell key={column.id} column={column} />
        ))}
      {isFiltered && (
        <Button
          aria-label="Reset filters"
          variant="outlined"
          size="small"
          startIcon={<CloseIcon />}
          onClick={onResetFilters}
          sx={{ borderStyle: 'dashed', height: 32 }}
        >
          Reset
        </Button>
      )}
    </Stack>
  )

  return (
    <Stack
      role="toolbar"
      aria-orientation="horizontal"
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      gap={2}
      width="100%"
      sx={{ p: 0.5 }}
    >
      {leftNode}

      <Stack direction="row" alignItems="center" gap={1}>
        {children}
        {table && <DataTableSortList table={table} />}
        {table && <DataTableViewOptions table={table} align="end" />}
        {onSearchChange != null && (
          <ToolbarSearchField
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            variant="outlined"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconSearch width={14} height={14} />
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
      </Stack>
    </Stack>
  )
}
