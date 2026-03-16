import type { WaitlistRow } from '@/types/waitlist'

/** Sidebar filter values (from FilterBar). */
export interface WaitListSidebarFilters {
  postcode?: string
  registrationStatus?: string[]
  dateStart?: string
  dateEnd?: string
  vendorType?: string[]
  serviceOffering?: string[]
}

/** Column ids that can be used for sorting in the waitlist table (for URL parsing). */
export const WAITLIST_SORT_COLUMN_IDS = new Set([
  'email',
  'phoneNumber',
  'postcode',
  'vendorType',
  'serviceOffering',
  'dateRegistered',
  'registrationStatus',
])

export interface GetWaitListParams extends WaitListSidebarFilters {
  search?: string
  sort: { id: string; desc: boolean }[]
  page: number
  perPage: number
  type: string
}

export interface GetWaitListResult {
  data: WaitlistRow[]
  pageCount: number
}

const SEARCH_FIELDS: (keyof WaitlistRow)[] = [
  'email',
  'name',
  'phoneNumber',
  'postcode',
  'vendorType',
  'serviceOffering',
  'registrationStatus',
]

function matchesSearch(row: WaitlistRow, search: string): boolean {
  const s = search.toLowerCase().trim()
  if (!s) return true
  return SEARCH_FIELDS.some((key) => {
    const val = row[key]
    return String(val ?? '')
      .toLowerCase()
      .includes(s)
  })
}

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
  const aStr = String(a)
  const bStr = String(b)
  const aNum = Number(a)
  const bNum = Number(b)
  if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return aNum - bNum
  return aStr.localeCompare(bStr, undefined, { numeric: true })
}

function applySidebarFilters(
  rows: WaitlistRow[],
  filters: WaitListSidebarFilters
): WaitlistRow[] {
  let result = rows
  if (filters.postcode?.trim()) {
    const pc = filters.postcode.trim().toLowerCase()
    result = result.filter((row) =>
      String(row.postcode ?? '')
        .toLowerCase()
        .includes(pc)
    )
  }
  if (filters.registrationStatus?.length) {
    const set = new Set(filters.registrationStatus)
    result = result.filter((row) => set.has(row.registrationStatus))
  }
  // Date range (expects YYYY-MM-DD from FilterBar): compare with getTime()
  if (filters.dateStart?.trim() || filters.dateEnd?.trim()) {
    const startStr = filters.dateStart?.trim()
    const endStr = filters.dateEnd?.trim()
    const startTime = startStr
      ? new Date(startStr + 'T00:00:00.000Z').getTime()
      : -Infinity
    const endTime = endStr
      ? new Date(endStr + 'T23:59:59.999Z').getTime()
      : Infinity
    result = result.filter((row) => {
      const raw = row.dateRegistered
      if (raw == null || raw === '') return false
      const rowTime = new Date(raw).getTime()
      if (Number.isNaN(rowTime)) return false
      return rowTime >= startTime && rowTime <= endTime
    })
  }
  if (filters.vendorType?.length) {
    const set = new Set(filters.vendorType)
    result = result.filter((row) => set.has(row.vendorType))
  }
  if (filters.serviceOffering?.length) {
    const set = new Set(filters.serviceOffering)
    result = result.filter((row) => set.has(row.serviceOffering))
  }
  return result
}

/**
 * Server-style filtering: filter, sort, and paginate waitlist data in JS.
 * Returns one page of data and total page count (same shape as a server API).
 */
export function getWaitList(
  fullData: WaitlistRow[],
  params: GetWaitListParams
): GetWaitListResult {
  let rows = fullData.filter((row) => row.type === params.type)
  if (params.search?.trim()) {
    rows = rows.filter((row) => matchesSearch(row, params.search!))
  }
  rows = applySidebarFilters(rows, params)
  const sort = params.sort?.length ? [...params.sort].reverse() : []
  for (const { id, desc } of sort) {
    const key = id as keyof WaitlistRow
    rows = [...rows].sort((a, b) => {
      const cmp = compareValues(a[key], b[key])
      return desc ? -cmp : cmp
    })
  }
  const total = rows.length
  const pageCount = Math.max(1, Math.ceil(total / params.perPage))
  const page = Math.max(1, Math.min(params.page, pageCount))
  const start = (page - 1) * params.perPage
  const data = rows.slice(start, start + params.perPage)
  return { data, pageCount }
}
