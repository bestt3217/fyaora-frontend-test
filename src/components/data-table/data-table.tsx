import { flexRender, type Table as TanstackTable } from '@tanstack/react-table'
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import { getColumnPinningStyle } from '@/lib/data-table'
import { DataTablePagination } from './pagination'

export interface DataTableProps<TData> {
  table: TanstackTable<TData>
  /** Renders when at least one row is selected (e.g. bulk actions). */
  actionBar?: React.ReactNode
  children?: React.ReactNode
  className?: string
  /** When true, shows a loading overlay over the table. */
  loading?: boolean
  /** When true, hides the "Rows per page" selector in pagination. */
  hidePageSizeSelector?: boolean
}

export function DataTable<TData>({
  table,
  actionBar,
  children,
  className,
  loading = false,
  hidePageSizeSelector = false,
}: DataTableProps<TData>) {
  const rows = table.getRowModel().rows
  const selectedCount = table.getFilteredSelectedRowModel().rows.length
  const columnCount = table.getAllColumns().length

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
      }}
    >
      {children}

      <Box sx={{ display: 'flex', width: '100%', overflow: 'auto' }}>
        <Box
          sx={{
            flex: 1,
            width: 0,
            position: 'relative',
            overflow: 'auto',
            borderRadius: 2,
            border: '1px solid',
            borderColor: (theme) => theme.palette.neutral400,
          }}
        >
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: (theme) => theme.palette.background.paper,
                opacity: 0.9,
                zIndex: 1,
              }}
            >
              <CircularProgress />
            </Box>
          )}
          <Table size="small" stickyHeader>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      colSpan={header.colSpan}
                      align="left"
                      sx={(theme) => ({
                        p: 2,
                        color: theme.palette.neutral200,
                        fontSize: 17,
                        lineHeight: '24px',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        bgcolor: theme.palette.neutral950,
                        borderBottom: '1px solid',
                        borderBottomColor: theme.palette.neutral700,
                        ...getColumnPinningStyle({ column: header.column }),
                        ...(header.column.getIsPinned() && {
                          zIndex: 3,
                          backgroundColor: theme.palette.neutral950,
                        }),
                      })}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {rows.length > 0 ? (
                rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    selected={row.getIsSelected()}
                    sx={(theme) => ({
                      ...(index % 2 === 1 && {
                        bgcolor: theme.palette.neutral900,
                      }),
                      '&.Mui-selected': {
                        ...(index % 2 === 1 && {
                          bgcolor: theme.palette.neutral900,
                        }),
                      },
                    })}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        align="left"
                        sx={(theme) => ({
                          p: 2,
                          color: theme.palette.neutral200,
                          fontSize: 14,
                          lineHeight: '20px',
                          letterSpacing: 0.25,
                          ...getColumnPinningStyle({ column: cell.column }),
                          ...(cell.column.getIsPinned() && {
                            backgroundColor:
                              index % 2 === 1
                                ? theme.palette.neutral900
                                : theme.palette.background.paper,
                          }),
                        })}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columnCount}
                    align="center"
                    sx={(theme) => ({
                      py: 6,
                      color: theme.palette.neutral200,
                      fontSize: 14,
                      lineHeight: '20px',
                      letterSpacing: 0.25,
                    })}
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <DataTablePagination
          table={table}
          showPageSizeSelector={!hidePageSizeSelector}
        />
        {actionBar != null && selectedCount > 0 && actionBar}
      </Box>
    </Box>
  )
}
