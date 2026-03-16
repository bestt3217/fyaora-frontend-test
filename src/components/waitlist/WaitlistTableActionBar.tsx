import type { Table } from '@tanstack/react-table'
import { Button } from '@mui/material'
import { DataTableBulkActionBar } from '@/components/data-table'
import type { WaitlistRow } from '@/types/waitlist'
import { useToast } from '@/hooks/use-toast'

export interface WaitlistTableActionBarProps {
  table: Table<WaitlistRow>
}

export function WaitlistTableActionBar({ table }: WaitlistTableActionBarProps) {
  const { showToast } = useToast()

  const handleDelete = () => {
    // TODO: Implement delete action
    table.toggleAllRowsSelected(false)
    showToast('Users deleted')
  }

  return (
    <DataTableBulkActionBar table={table}>
      <Button
        size="small"
        color="error"
        variant="contained"
        onClick={handleDelete}
      >
        Delete
      </Button>
    </DataTableBulkActionBar>
  )
}
