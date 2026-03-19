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

import EditSubUnit from "./edit-subunit"
import DeleteSubUnit from "./delete-subunit"

interface SubUnit {
  _id: string
  name: string
  shortName: string
}

interface SubUnitsTableProps {
  subUnits: SubUnit[]
  editSubUnit: (id: string, data: any) => Promise<void>
  deleteSubUnit: (id: string) => Promise<void>
  loading: boolean
}

export default function SubUnitsTable({
  subUnits,
  editSubUnit,
  deleteSubUnit,
  loading,
}: SubUnitsTableProps) {
  const columns: ColumnDef<SubUnit>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "shortName", header: "Short Name" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const subUnit = row.original
        return (
          <div className="flex gap-2">
            <EditSubUnit subUnit={subUnit} editSubUnit={editSubUnit} />
            <DeleteSubUnit id={subUnit._id} deleteSubUnit={deleteSubUnit} />
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: subUnits || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => (
                <TableHead key={h.id}>
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3}>
                <div className="flex justify-center p-4">Loading...</div>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center p-4">
                No SubUnits found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}