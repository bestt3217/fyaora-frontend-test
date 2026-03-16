import { createParser } from 'nuqs/server'
import { z } from 'zod'

import type { ExtendedColumnSort } from '@/types/data-table'

const COMMA = ','

/** Parser for comma-separated string array (e.g. ?key=a,b,c). */
export const parseAsCommaSeparatedArray = createParser({
  parse: (value) =>
    value?.trim()
      ? value.split(COMMA).map((s) => s.trim()).filter(Boolean)
      : [],
  serialize: (arr) =>
    Array.isArray(arr) && arr.length > 0 ? arr.join(COMMA) : '',
  eq: (a, b) =>
    a.length === b.length && a.every((v, i) => v === b[i]),
})

const sortingItemSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
})

export const getSortingStateParser = <TData>(
  columnIds?: string[] | Set<string>
) => {
  const validKeys = columnIds
    ? columnIds instanceof Set
      ? columnIds
      : new Set(columnIds)
    : null

  return createParser({
    parse: (value) => {
      try {
        const parsed = JSON.parse(value)
        const result = z.array(sortingItemSchema).safeParse(parsed)

        if (!result.success) return null

        if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
          return null
        }

        return result.data as ExtendedColumnSort<TData>[]
      } catch {
        return null
      }
    },
    serialize: (value) => JSON.stringify(value),
    eq: (a, b) =>
      a.length === b.length &&
      a.every(
        (item, index) =>
          item.id === b[index]?.id && item.desc === b[index]?.desc
      ),
  })
}
