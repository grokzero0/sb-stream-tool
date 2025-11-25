'use client'

import { ColumnDef } from '@tanstack/react-table'
import { SetTableEntry } from './tournament'
import { Checkbox } from '@renderer/components/ui/checkbox'

export const columns: ColumnDef<SetTableEntry>[] = [
  {
    id: 'select',
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    )
  },

  {
    accessorKey: 'stream',
    header: 'Stream'
  },
  {
    accessorKey: 'matchName',
    header: 'Match'
  },
  {
    accessorKey: 'firstGroupName',
    header: 'Group 1'
  },
  {
    accessorKey: 'secondGroupName',
    header: 'Group 2'
  }
]
