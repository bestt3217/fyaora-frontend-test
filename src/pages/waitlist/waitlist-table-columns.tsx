import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import { Box, IconButton, styled } from '@mui/material'
import Checkbox from '@/components/Checkbox'
import IconPencil from '@/components/icons/IconPencil'
import { DataTableColumnHeader } from '@/components/data-table'
import type { WaitlistRow } from '@/types/waitlist'

const columnHelper = createColumnHelper<WaitlistRow>()

const EditRowButton = styled(IconButton)(({ theme }) => ({
  padding: 3,
  color: theme.palette.neutral200,
  '&:hover': {
    color: theme.palette.primary.main,
  },
}))

export function getWaitlistTableColumns(): ColumnDef<WaitlistRow, unknown>[] {
  return [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
          }
          sx={{ p: 0 }}
          onChange={(_, checked) => table.toggleAllPageRowsSelected(!!checked)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          sx={{ p: 0 }}
          onChange={(_, checked) => row.toggleSelected(!!checked)}
        />
      ),
      size: 40,
      enableSorting: false,
    }),
    columnHelper.accessor('email', {
      id: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Email" />
      ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('phoneNumber', {
      id: 'phoneNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Phone Number" />
      ),
      cell: (info) => info.getValue() || '—',
    }),
    columnHelper.accessor('postcode', {
      id: 'postcode',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Postcode" />
      ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('vendorType', {
      id: 'vendorType',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Vendor Type" />
      ),
      cell: (info) => info.getValue() || '—',
    }),
    columnHelper.accessor('serviceOffering', {
      id: 'serviceOffering',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Service Offering" />
      ),
      cell: (info) => info.getValue() || '—',
    }),
    columnHelper.accessor('dateRegistered', {
      id: 'dateRegistered',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Signup Date" />
      ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('registrationStatus', {
      id: 'registrationStatus',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => 'Actions',
      cell: ({ row }) => (
        <Box sx={{ textAlign: 'right' }}>
          <EditRowButton
            size="small"
            onClick={() => {
              // TODO: open edit dialog/sheet for row.original
            }}
            disableRipple
            aria-label={`Edit ${row.original.email}`}
          >
            <IconPencil width={18} height={18} />
          </EditRowButton>
        </Box>
      ),
      size: 56,
      enableSorting: false,
    }),
  ] as ColumnDef<WaitlistRow, unknown>[]
}
