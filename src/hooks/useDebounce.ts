import { useEffect, useState } from 'react'

/**
 * Returns a debounced value that updates after `delay` ms of the source value not changing.
 * Matches the pattern used with TanStack Table (e.g. drive table.setGlobalFilter(debouncedSearch)).
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
