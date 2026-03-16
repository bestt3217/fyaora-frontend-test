import { useCallback, useMemo } from 'react'
import { parseAsString, useQueryState } from 'nuqs'
import { DataTable, DataTableToolbar } from '@/components/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import type { WaitlistRow } from '@/types/waitlist'
import { getWaitlistTableColumns } from './waitlist-table-columns'
import { WaitlistTableActionBar } from './waitlist-table-action-bar'

const FILTERS = {
  type: 'toggle' as const,
  options: [
    { label: 'Service providers', value: 'service-providers' },
    { label: 'Customers', value: 'customers' },
  ],
}

export interface WaitListTableProps {
  /** One page of data (server-style: pre-filtered/sorted/paginated by getWaitList). */
  data: WaitlistRow[]
  /** Total number of pages (from getWaitList). */
  pageCount: number
  loading?: boolean
}

export function WaitListTable({
  data,
  pageCount,
  loading = false,
}: WaitListTableProps) {
  const [filterValue, setFilterValueRaw] = useQueryState(
    'type',
    parseAsString.withDefault(FILTERS.options[0].value)
  )

  const columns = useMemo(() => getWaitlistTableColumns(), [])

  const { table, setPage } = useDataTable({
    data,
    columns,
    pageCount,
    searchKey: 'search',
    queryKeys: {
      page: 'page',
      perPage: 'perPage',
      sort: 'sort',
    },
    initialState: {
      columnPinning: { right: ['actions'] },
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    getRowId: (row) => row.id,
  })

  const setFilterValue = useCallback(
    (value: string) => {
      setFilterValueRaw(value)
      setPage(1)
    },
    [setFilterValueRaw, setPage]
  )

  const search = table.getState().globalFilter ?? ''

  return (
    <>
      <DataTable
        table={table}
        loading={loading}
        hidePageSizeSelector
        actionBar={<WaitlistTableActionBar table={table} />}
      >
        <DataTableToolbar
          table={table}
          filters={FILTERS}
          filterValue={filterValue}
          onFilterChange={setFilterValue}
          searchValue={search}
          onSearchChange={(value) => table.setGlobalFilter(value)}
          searchPlaceholder="Search User"
        />
      </DataTable>
    </>
  )
}
