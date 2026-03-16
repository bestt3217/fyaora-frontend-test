import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from 'nuqs'
import { Button, Drawer, Stack, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import FilterBar from '@/components/waitlist/FilterBar'
import type { FilterValues } from '@/components/waitlist/FilterBar'
import {
  getSortingStateParser,
  parseAsCommaSeparatedArray,
} from '@/lib/parsers'
import { getWaitList, WAITLIST_SORT_COLUMN_IDS } from '@/lib/get-waitlist'
import type { WaitlistRow } from '@/types/waitlist'
import { WaitListTable } from './WaitListTable'
import PageLayout from '@/components/layout/PageLayout'

const WAITLIST_DATA_URL = '/data/waitlist.json'

function buildSidebarFiltersFromParams(params: {
  postcode?: string | null
  dateStart?: string | null
  dateEnd?: string | null
  registrationStatus?: string[] | null
  vendorType?: string[] | null
  serviceOffering?: string[] | null
}): FilterValues {
  return {
    postcode: params.postcode ?? '',
    dateStart: params.dateStart ?? '',
    dateEnd: params.dateEnd ?? '',
    registrationStatus: params.registrationStatus ?? [],
    vendorType: params.vendorType ?? [],
    serviceOffering: params.serviceOffering ?? [],
  }
}

export function WaitListTableWrapper() {
  const [fullData, setFullData] = useState<WaitlistRow[]>([])
  const [loading, setLoading] = useState(true)
  const [, setError] = useState<string | null>(null)
  const theme = useTheme()
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10))
  const [search] = useQueryState('search', parseAsString.withDefault(''))
  const [type] = useQueryState(
    'type',
    parseAsString.withDefault('service-providers')
  )
  const [sorting] = useQueryState(
    'sort',
    getSortingStateParser(WAITLIST_SORT_COLUMN_IDS).withDefault([])
  )

  const [sidebarParams, setSidebarParams] = useQueryStates(
    {
      postcode: parseAsString.withDefault(''),
      dateStart: parseAsString.withDefault(''),
      dateEnd: parseAsString.withDefault(''),
      registrationStatus: parseAsCommaSeparatedArray.withDefault([]),
      vendorType: parseAsCommaSeparatedArray.withDefault([]),
      serviceOffering: parseAsCommaSeparatedArray.withDefault([]),
    },
    { shallow: false }
  )

  const sidebarFilters = useMemo(
    () => buildSidebarFiltersFromParams(sidebarParams),
    [sidebarParams]
  )

  const handleApplyFilters = useCallback(
    (filters: FilterValues) => {
      setSidebarParams({
        postcode: filters.postcode,
        dateStart: filters.dateStart,
        dateEnd: filters.dateEnd,
        registrationStatus: filters.registrationStatus,
        vendorType: filters.vendorType,
        serviceOffering: filters.serviceOffering,
      })
      setPage(1)
    },
    [setSidebarParams, setPage]
  )

  const handleApplyFiltersAndClose = useCallback(
    (filters: FilterValues) => {
      handleApplyFilters(filters)
      setFiltersOpen(false)
    },
    [handleApplyFilters]
  )

  useEffect(() => {
    let cancelled = false
    fetch(WAITLIST_DATA_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json: WaitlistRow[]) => {
        if (!cancelled) setFullData(Array.isArray(json) ? json : [])
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Failed to load')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const { data, pageCount } = useMemo(
    () =>
      getWaitList(fullData, {
        search: search ?? undefined,
        sort: sorting ?? [],
        page: page ?? 1,
        perPage: perPage ?? 10,
        type: type ?? 'service-providers',
        postcode: sidebarFilters.postcode || undefined,
        registrationStatus:
          sidebarFilters.registrationStatus.length > 0
            ? sidebarFilters.registrationStatus
            : undefined,
        dateStart: sidebarFilters.dateStart || undefined,
        dateEnd: sidebarFilters.dateEnd || undefined,
        vendorType:
          sidebarFilters.vendorType.length > 0
            ? sidebarFilters.vendorType
            : undefined,
        serviceOffering:
          sidebarFilters.serviceOffering.length > 0
            ? sidebarFilters.serviceOffering
            : undefined,
      }),
    [fullData, search, sorting, page, perPage, type, sidebarFilters]
  )

  return (
    <>
      <Stack direction="row" spacing={3} flex={1}>
        {isLgUp && (
          <FilterBar
            initialValues={sidebarFilters}
            onApply={handleApplyFilters}
          />
        )}
        <PageLayout>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Typography variant="m3-display-small">Waitlist</Typography>
            {!isLgUp && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => setFiltersOpen(true)}
              >
                Filters
              </Button>
            )}
          </Stack>
          <WaitListTable data={data} pageCount={pageCount} loading={loading} />
        </PageLayout>
      </Stack>

      {!isLgUp && (
        <Drawer
          anchor="left"
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          slotProps={{
            paper: {
              sx: {
                width: '80vw',
                maxWidth: 360,
              },
            },
          }}
        >
          <FilterBar
            initialValues={sidebarFilters}
            onApply={handleApplyFiltersAndClose}
          />
        </Drawer>
      )}
    </>
  )
}
