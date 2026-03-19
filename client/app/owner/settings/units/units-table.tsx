"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

import EditUnit from "./edit-unit"
import DeleteUnit from "./delete-unit"

interface Unit {
  _id: string
  name: string
  shortName: string
}

interface UnitsTableProps {
  units: Unit[]
  loading: boolean
  editUnit: (id: string, data: any) => Promise<void>
  deleteUnit: (id: string) => Promise<void>
}

const UnitsTable = ({ units, loading, editUnit, deleteUnit }: UnitsTableProps) => {

  const columns: ColumnDef<Unit>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "shortName",
      header: "Short Name",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const unit = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
                <div className="flex">
              <EditUnit unit={unit} editUnit={editUnit} />
              <DeleteUnit id={unit._id} deleteUnit={deleteUnit} />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: units || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3}>
                <div className="flex justify-center p-4">Loading Units...</div>
              </TableCell>
            </TableRow>
          ) : units.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No units found
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default UnitsTable