import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  Cell,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"
import "./data-table.css"
import { statuses } from "../data/tasks.data"
import { Badge } from "@/components/ui/badge"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  updateTaskStatus: (taskId: string, newStatus: string) => Promise<void>
}

export function DataTable<TData, TValue>({
  columns,
  data,
  updateTaskStatus,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [editingCell, setEditingCell] = React.useState<{ rowIndex: number; columnId: string } | null>(null)


  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })


  // const openModal = (rowData: TData) => {
  // setOpen(true)
  // console.log("open modal clicked", rowData);
  // }

  // const openModalColumn = (columnData: Cell<TData, TValue>) => {
  // setOpen(true)
  //   console.log("open modal column", columnData);
  //   console.log("getValue", columnData.getValue());
  //   console.log("getRenderValue", columnData.renderValue());
  //   console.log("getContext", columnData.getContext());
  // }

  // const updateData = (rowIndex: number, columnId: string, value: any) => {
  //   console.log(`columnId: ${columnId}, value: ${value}`);
  // setData(old =>
  //   old.map((row, index) => {
  //     if (index === rowIndex) {
  //       return {
  //         ...old[rowIndex],
  //         [columnId]: value,
  //       }
  //     }
  //     return row
  //   })
  // )
  // }


  const renderCell = React.useCallback(
    (cell: Cell<TData, TValue>, rowIndex: number) => {
      const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.columnId === cell.column.id
      const columnId = cell.column.id

      if (isEditing && columnId === "status") {
        return (
          <Select
            defaultValue={cell.getValue() as string}
            onValueChange={(value) => {
              const taskId = (cell.row.original as any).id
              console.log("page.tsx: ", taskId);
              updateTaskStatus(taskId, value)
              // updateData(rowIndex, columnId, value)
              setEditingCell(null)
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.icon && (
                    <Badge variant="secondary">
                      <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{status.label}</span>
                    </Badge>

                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      }

      return flexRender(cell.column.columnDef.cell, cell.getContext())
    },
    [editingCell, updateTaskStatus]
  )

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader
            className="tbHeader"
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan} className="text-white">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="tbRow">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  // onClick={() => openModal(row.original)}
                  className="hover:bg-[#D7DAFD] hover:cursor-pointer "
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={() => {
                        if (cell.column.id === "status") {
                          setEditingCell({
                            rowIndex: rowIndex,
                            columnId: cell.column.id,
                          })
                        }
                      }}
                    >
                      {renderCell(cell, rowIndex)}
                      {/* {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )} */}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
