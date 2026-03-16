import { useMemo } from 'react'
import type { Table } from '@tanstack/react-table'
import {
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  Typography,
  IconButton,
  styled,
} from '@mui/material'
import IconArrowRight from '../icons/IconArrowRight'
import IconArrowLeft from '../icons/IconArrowLeft'

const MAX_VISIBLE_PAGES = 5

function getVisiblePageNumbers(pageIndex: number, pageCount: number): number[] {
  if (pageCount <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: pageCount }, (_, i) => i + 1)
  }
  const half = Math.floor(MAX_VISIBLE_PAGES / 2)
  let start = Math.max(1, pageIndex + 1 - half)
  const end = Math.min(pageCount, start + MAX_VISIBLE_PAGES - 1)
  start = Math.max(1, end - MAX_VISIBLE_PAGES + 1)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

const PaginationNavButton = styled(IconButton)(({ theme }) => ({
  width: 32,
  height: 32,
  border: '1px solid',
  borderColor: theme.palette.dark20,
  borderRadius: 4,
  backgroundColor: theme.palette.common.white,
  color: theme.palette.dark100,
  '&:hover': {
    backgroundColor: theme.palette.neutral950,
    borderColor: theme.palette.dark20,
    color: theme.palette.dark100,
  },
  '&.Mui-disabled': {
    borderColor: theme.palette.dark20,
    color: theme.palette.dark20,
    backgroundColor: theme.palette.common.white,
  },
}))

const PageNumberButton = styled(Button)(({ theme }) => ({
  minWidth: 32,
  width: 32,
  height: 32,
  padding: 0,
  border: '1px solid',
  borderColor: theme.palette.light40,
  borderRadius: 4,
  backgroundColor: theme.palette.common.white,
  color: theme.palette.dark100,
  fontWeight: 500,
  fontSize: 14,
  '&:hover': {
    backgroundColor: theme.palette.neutral950,
    borderColor: theme.palette.light40,
    color: theme.palette.dark100,
  },
}))

export interface DataTablePaginationProps<TData> {
  table: Table<TData>
  pageSizeOptions?: number[]
  /** When false, hides the "Rows per page" selector. Default true. */
  showPageSizeSelector?: boolean
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  showPageSizeSelector = true,
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination
  const selectedCount = table.getFilteredSelectedRowModel().rows.length
  const totalRows = table.getFilteredRowModel().rows.length
  const pageCount = table.getPageCount()
  const currentPage = pageIndex + 1

  const visiblePages = useMemo(
    () => getVisiblePageNumbers(pageIndex, pageCount),
    [pageIndex, pageCount]
  )

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        p: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        {showPageSizeSelector && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" component="span" fontWeight={500}>
              Rows per page
            </Typography>
            <FormControl size="small" sx={{ minWidth: 72 }}>
              <Select
                value={String(pageSize)}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                variant="outlined"
                sx={{ height: 32 }}
              >
                {pageSizeOptions.map((size) => (
                  <MenuItem key={size} value={String(size)}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <PaginationNavButton
            size="small"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
            disableRipple
          >
            <IconArrowLeft width={12} height={12} />
          </PaginationNavButton>

          {visiblePages.map((page) => {
            const isActive = page === currentPage
            return (
              <PageNumberButton
                key={page}
                variant="text"
                color="inherit"
                onClick={() => table.setPageIndex(page - 1)}
                aria-label={`Page ${page}`}
                aria-current={isActive ? 'page' : undefined}
                sx={
                  isActive
                    ? (theme) => ({
                        borderColor: theme.palette.blue100,
                        color: theme.palette.blue100,
                        '&:hover': {
                          borderColor: theme.palette.blue100,
                          color: theme.palette.blue100,
                        },
                      })
                    : undefined
                }
              >
                {page}
              </PageNumberButton>
            )
          })}

          <PaginationNavButton
            size="small"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
            disableRipple
          >
            <IconArrowRight width={12} height={12} />
          </PaginationNavButton>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary">
        {selectedCount} of {totalRows} row(s) selected.
      </Typography>
    </Box>
  )
}
