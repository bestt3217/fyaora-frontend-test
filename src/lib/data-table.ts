import type { Column } from '@tanstack/react-table'

/**
 * Returns inline styles for sticky column pinning (left/right).
 */
export function getColumnPinningStyle<TData>({
  column,
}: {
  column: Column<TData, unknown>
}): React.CSSProperties {
  const isPinned = column.getIsPinned()

  const style: React.CSSProperties = {}
  if (isPinned) {
    style.position = 'sticky'
    style.zIndex = 2
    style.backgroundColor = 'transparent'
    style.backdropFilter = 'blur(8px)'
    style.width = column.getSize()
  }

  if (isPinned === 'left') {
    style.left = `${column.getStart('left')}px`
  } else if (isPinned === 'right') {
    style.right = `${column.getAfter('right')}px`
  }

  return style
}
