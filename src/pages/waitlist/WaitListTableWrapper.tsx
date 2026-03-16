import { useEffect, useMemo, useState } from 'react'
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'
import { Stack, Typography } from '@mui/material'
import FilterBar from '@/components/waitlist/FilterBar'
import { getSortingStateParser } from '@/lib/parsers'
import { getWaitList, WAITLIST_SORT_COLUMN_IDS } from '@/lib/get-waitlist'
import type { WaitlistRow } from '@/types/waitlist'
import { WaitListTable } from './WaitListTable'

const WAITLIST_DATA_URL = '/data/waitlist.json'

export function WaitListTableWrapper() {
  const [fullData, setFullData] = useState<WaitlistRow[]>([])
  const [loading, setLoading] = useState(true)
  const [, setError] = useState<string | null>(null)

  const [page] = useQueryState('page', parseAsInteger.withDefault(1))
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
      }),
    [fullData, search, sorting, page, perPage, type]
  )

  return (
    <Stack direction="row" spacing={3} flex={1}>
      <FilterBar onApply={(filters) => console.log('Apply filters', filters)} />

      <Stack spacing={3} width="100%" alignItems="start">
        <Typography variant="m3-display-small">Waitlist</Typography>
        <Stack gap={3} width="100%">
          <WaitListTable data={data} pageCount={pageCount} loading={loading} />
        </Stack>
      </Stack>
    </Stack>
  )
}
