/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  // FilterFn,
  // FilterFnOption
} from '@tanstack/react-table'
// import { rankItem } from '@tanstack/match-sorter-utils'
import { JSX, useState } from 'react'
import { Input } from './input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'
import { Button } from './button'
import { cn } from '@renderer/lib/utils'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  multiRows?: boolean
  setSelection?: any
  className?: string
  pagination?: boolean
}

// const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
//   // Rank the item
//   const itemRank = rankItem(row.getValue(columnId), value)

//   // Store the itemRank info
//   addMeta({ itemRank })

//   // Return if the item should be filtered in/out
//   return itemRank.passed
// }

export function DataTable<TData, TValue>({
  columns,
  data,
  multiRows = true,
  setSelection,
  pagination = false,
  className
}: DataTableProps<TData, TValue>): JSX.Element {
  const [rowSelection, setRowSelection] = useState({})

  const [globalFilter, setGlobalFilter] = useState<any>([])
  const table = useReactTable({
    data,
    columns,
    // filterFns: {
    //   fuzzy: fuzzyFilter
    // },
    // globalFilterFn: 'fuzzy' as FilterFnOption<TData>,
    getCoreRowModel: getCoreRowModel(),
    enableMultiRowSelection: multiRows,
    onRowSelectionChange: (e) => {
      setRowSelection(e)
      if (setSelection) {
        setSelection(e)
      }
    },
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,

    getFilteredRowModel: getFilteredRowModel(),
    autoResetPageIndex: false,
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 100
      }
    }
  })

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by keyword"
          value={(globalFilter as string) ?? ''}
          onChange={(event) => table.setGlobalFilter(String(event.target.value))}
          className="max-w-sm"
        />
      </div>
      <div className={cn('overflow-hidden rounded-md border', className)}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="break-all">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="break-all"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="break-all">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center break-all">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
