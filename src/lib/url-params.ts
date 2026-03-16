import type { SortingState } from '@tanstack/react-table'

/**
 * Parse sort query string into TanStack Table sorting state.
 */
export function parseSortFromQuery(value: string | null): SortingState {
  if (!value?.trim()) return []
  try {
    const parsed = JSON.parse(value) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((item) => {
        if (
          item &&
          typeof item === 'object' &&
          'id' in item &&
          typeof (item as { id: unknown }).id === 'string'
        ) {
          const { id, desc } = item as { id: string; desc?: boolean }
          return { id, desc: Boolean(desc) }
        }
        return null
      })
      .filter((s): s is { id: string; desc: boolean } => s != null)
  } catch {
    return []
  }
}

/**
 * Serialize TanStack Table sorting state to query string
 * Produces: [{"id":"status","desc":true},{"id":"title","desc":false}]
 */
export function serializeSortToQuery(sorting: SortingState): string {
  if (!sorting.length) return ''
  return JSON.stringify(sorting)
}

/**
 * Params for building search string.
 * Order in URL: sort, perPage, page, then filter keys (e.g. type, title, search).
 */
export interface TableSearchParams {
  sort?: string
  perPage?: string
  page?: string
  [key: string]: string | undefined
}

/**
 * Encode sort JSON for URL: only double-quotes as %22.
 * e.g. [{"id":"title","desc":false}] → [{%22id%22:%22title%22,%22desc%22:false}]
 */
function encodeSortForQuery(sortJson: string): string {
  return sortJson.replace(/"/g, '%22')
}

/**
 * Build search string
 * - sort first, value with only " encoded as %22 e.g. sort=[{%22id%22:%22title%22,%22desc%22:false}]
 * - then perPage, page
 * - then other filter params (e.g. type, title, search) with encoded values
 */
export function buildSearchString(params: TableSearchParams): string {
  const parts: string[] = []

  if (params.sort != null && params.sort !== '') {
    parts.push(`sort=${encodeSortForQuery(params.sort)}`)
  }
  if (params.perPage != null && params.perPage !== '') {
    parts.push(`perPage=${encodeURIComponent(params.perPage)}`)
  }
  if (params.page != null && params.page !== '') {
    parts.push(`page=${encodeURIComponent(params.page)}`)
  }

  const filterKeys = Object.keys(params).filter(
    (k) => !['sort', 'perPage', 'page'].includes(k)
  )
  filterKeys.sort()
  for (const key of filterKeys) {
    const value = params[key]
    if (value != null && value !== '') {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    }
  }

  return parts.join('&')
}
