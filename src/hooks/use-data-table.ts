import {
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table'
import {
  parseAsInteger,
  parseAsString,
  type UseQueryStateOptions,
  useQueryState,
} from 'nuqs'

import { getSortingStateParser } from '@/lib/parsers'
import type { ExtendedColumnSort, QueryKeys } from '@/types/data-table'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type TransitionStartFunction,
} from 'react'

const PAGE_KEY = 'page'
const PER_PAGE_KEY = 'perPage'
const SORT_KEY = 'sort'
const FILTERS_KEY = 'filters'
const JOIN_OPERATOR_KEY = 'joinOperator'
const SEARCH_KEY = 'search'
const DEBOUNCE_MS = 300
const THROTTLE_MS = 50

interface UseDataTableProps<TData> extends Omit<
  TableOptions<TData>,
  | 'state'
  | 'pageCount'
  | 'getCoreRowModel'
  | 'manualFiltering'
  | 'manualPagination'
  | 'manualSorting'
> {
  pageCount: number
  initialState?: Omit<Partial<TableState>, 'sorting'> & {
    sorting?: ExtendedColumnSort<TData>[]
  }
  queryKeys?: Partial<QueryKeys> & { search?: string }
  /** When set, global filter (search) is synced to this URL param and page resets on change. */
  searchKey?: string
  history?: 'push' | 'replace'
  debounceMs?: number
  throttleMs?: number
  clearOnDefault?: boolean
  scroll?: boolean
  shallow?: boolean
  startTransition?: TransitionStartFunction
}

export function useDataTable<TData>(props: UseDataTableProps<TData>) {
  const {
    columns,
    pageCount,
    initialState,
    queryKeys,
    searchKey: searchKeyProp,
    history = 'replace',
    debounceMs = DEBOUNCE_MS,
    throttleMs = THROTTLE_MS,
    clearOnDefault = false,
    scroll = false,
    shallow = true,
    startTransition,
    ...tableProps
  } = props
  const pageKey = queryKeys?.page ?? PAGE_KEY
  const perPageKey = queryKeys?.perPage ?? PER_PAGE_KEY
  const sortKey = queryKeys?.sort ?? SORT_KEY
  const filtersKey = queryKeys?.filters ?? FILTERS_KEY
  const joinOperatorKey = queryKeys?.joinOperator ?? JOIN_OPERATOR_KEY
  const searchKey = searchKeyProp ?? queryKeys?.search ?? SEARCH_KEY
  const useSearchInUrl = Boolean(searchKeyProp ?? queryKeys?.search)
  const effectiveSearchKey = useSearchInUrl ? searchKey : '__dt_s'

  const queryStateOptions = useMemo<
    Omit<UseQueryStateOptions<string>, 'parse'>
  >(
    () => ({
      history,
      scroll,
      shallow,
      throttleMs,
      debounceMs,
      clearOnDefault,
      startTransition,
    }),
    [
      history,
      scroll,
      shallow,
      throttleMs,
      debounceMs,
      clearOnDefault,
      startTransition,
    ]
  )

  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    initialState?.rowSelection ?? {}
  )
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialState?.columnVisibility ?? {}
  )

  const [page, setPage] = useQueryState(
    pageKey,
    parseAsInteger.withOptions(queryStateOptions).withDefault(1)
  )
  const [perPage, setPerPage] = useQueryState(
    perPageKey,
    parseAsInteger
      .withOptions(queryStateOptions)
      .withDefault(initialState?.pagination?.pageSize ?? 10)
  )

  const [globalFilter, setGlobalFilterRaw] = useQueryState(
    effectiveSearchKey,
    parseAsString.withOptions(queryStateOptions).withDefault('')
  )

  const onGlobalFilterChange = useCallback(
    (updaterOrValue: Updater<string>) => {
      if (!useSearchInUrl) return
      const next =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(globalFilter ?? '')
          : updaterOrValue
      void setPage(1)
      void setGlobalFilterRaw(next || null)
    },
    [globalFilter, setPage, setGlobalFilterRaw, useSearchInUrl]
  )

  const [localPagination, setLocalPagination] = useState<PaginationState>(
    () => ({
      pageIndex: (page ?? 1) - 1,
      pageSize: perPage ?? initialState?.pagination?.pageSize ?? 10,
    })
  )

  useEffect(() => {
    setLocalPagination({
      pageIndex: (page ?? 1) - 1,
      pageSize: perPage ?? 10,
    })
  }, [page, perPage])

  const onPaginationChange = useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      if (typeof updaterOrValue === 'function') {
        const newPagination = updaterOrValue(localPagination)
        setLocalPagination(newPagination)
        void setPage(newPagination.pageIndex + 1)
        void setPerPage(newPagination.pageSize)
      } else {
        setLocalPagination(updaterOrValue)
        void setPage(updaterOrValue.pageIndex + 1)
        void setPerPage(updaterOrValue.pageSize)
      }
    },
    [localPagination, setPage, setPerPage]
  )

  const columnIds = useMemo(() => {
    return new Set(
      columns.map((column) => column.id).filter(Boolean) as string[]
    )
  }, [columns])

  const [sorting, setSorting] = useQueryState(
    sortKey,
    getSortingStateParser<TData>(columnIds)
      .withOptions(queryStateOptions)
      .withDefault(initialState?.sorting ?? [])
  )

  const onSortingChange = useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      if (typeof updaterOrValue === 'function') {
        const newSorting = updaterOrValue(sorting)
        setSorting(newSorting as ExtendedColumnSort<TData>[])
      } else {
        setSorting(updaterOrValue as ExtendedColumnSort<TData>[])
      }
    },
    [sorting, setSorting]
  )

  const table = useReactTable({
    ...tableProps,
    columns,
    initialState,
    pageCount,
    state: {
      pagination: localPagination,
      sorting,
      columnVisibility,
      rowSelection,
      ...(useSearchInUrl && { globalFilter: globalFilter ?? '' }),
    },
    defaultColumn: {
      ...tableProps.defaultColumn,
      enableColumnFilter: false,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    ...(useSearchInUrl && { onGlobalFilterChange }),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    meta: {
      ...tableProps.meta,
      queryKeys: {
        page: pageKey,
        perPage: perPageKey,
        sort: sortKey,
        filters: filtersKey,
        joinOperator: joinOperatorKey,
      },
    },
  })

  return useMemo(
    () => ({ table, setPage, shallow, debounceMs, throttleMs }),
    [table, setPage, shallow, debounceMs, throttleMs]
  )
}
