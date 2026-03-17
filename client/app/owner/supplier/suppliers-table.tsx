"use client"

import React from "react"
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

import EditSupplier from "./edit-supplier"
import DeleteSupplier from "./delete-supplier"


// Columns
const columns = (fetchSuppliers: any): ColumnDef<any>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "taxNumber",
    header: "Tax Number",
  },
  {
    id: "actions",
    header:"Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const supplier = row.original

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
            <div className="flex gap-2">
            {/* Edit */}
              <EditSupplier
                supplier={supplier}
                fetchSuppliers={fetchSuppliers}
              />

            {/* Delete */}
              <DeleteSupplier
                id={supplier._id}
                fetchSuppliers={fetchSuppliers}
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]



// DataTable Component
function DataTable({ columns, data }: any) {
  const table = useReactTable({
    data,
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
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center h-24">
                No suppliers found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}



const SuppliersTable = ({ suppliers, fetchSuppliers }: any) => {
  return (
    <div className="flex justify-center">
      <DataTable
        columns={columns(fetchSuppliers)}
        data={suppliers}
      />
    </div>
  )
}

export default SuppliersTable