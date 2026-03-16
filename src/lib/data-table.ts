import type { Column } from '@tanstack/react-table'

/**
 * Returns inline styles for sticky column pinning (left/right).
 */
export function getColumnPinningStyle<TData>({
  column,
  withBorder = false,
}: {
  column: Column<TData, unknown>
  withBorder?: boolean
}): React.CSSProperties {
  const isPinned = column.getIsPinned()
  const isLastLeftPinned =
    isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinned =
    isPinned === 'right' && column.getIsFirstColumn('right')

  const style: React.CSSProperties = {}
  if (isPinned) {
    style.position = 'sticky'
    style.zIndex = 1
    style.backgroundColor = 'var(--mui-palette-background-paper, #fff)'
    style.opacity = 0.97
    style.width = column.getSize()
  }

  if (isPinned === 'left') {
    style.left = `${column.getStart('left')}px`
    if (withBorder && isLastLeftPinned) {
      style.boxShadow = 'inset -4px 0 4px -4px rgba(0,0,0,0.1)'
    }
  } else if (isPinned === 'right') {
    style.right = `${column.getAfter('right')}px`
    if (withBorder && isFirstRightPinned) {
      style.boxShadow = 'inset 4px 0 4px -4px rgba(0,0,0,0.1)'
    }
  }

  return style
}
