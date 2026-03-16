import type { Table } from '@tanstack/react-table'
import { Button } from '@mui/material'
import {
  DataTableBulkActionBar,
} from '@/components/data-table'
import type { WaitlistRow } from '@/types/waitlist'

export interface WaitlistTableActionBarProps {
  table: Table<WaitlistRow>
}

export function WaitlistTableActionBar({ table }: WaitlistTableActionBarProps) {
  return (
    <DataTableBulkActionBar table={table}>
      <Button size="small" variant="outlined">
        Export
      </Button>
      <Button size="small" color="error" variant="outlined">
        Delete
      </Button>
    </DataTableBulkActionBar>
  )
}
