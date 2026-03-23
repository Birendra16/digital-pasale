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

import EditCustomer from "./edit-customer"
import DeleteCustomer from "./delete-customer"

interface Customer {
  _id: string
  name: string
  shopName?: string
  panNumber?: string
  phone: string
  email?: string
  address: string
  customerType: "retail" | "wholesale" | "vip"
  creditLimit?: number
  balanceDue?: number
}

interface Props {
  customers: Customer[]
  loading: boolean
  editCustomer: (id: string, data: any) => Promise<void>
  deleteCustomer: (id: string) => Promise<void>
}

export default function CustomersTable({ customers, loading, editCustomer, deleteCustomer }: Props) {
  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "shopName",
      header: "Shop",
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
      accessorKey: "customerType",
      header: "Type",
    },
    {
      accessorKey: "creditLimit",
      header: "Credit Limit",
      cell: ({ row }) => row.original.creditLimit?.toLocaleString() || 0,
    },
    {
      accessorKey: "balanceDue",
      header: "Balance Due",
      cell: ({ row }) => row.original.balanceDue?.toLocaleString() || 0,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const customer = row.original
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
              <div className="flex gap-1 px-2 py-1">
                <EditCustomer customer={customer} editCustomer={editCustomer} />
                <DeleteCustomer id={customer._id} deleteCustomer={deleteCustomer} />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: customers || [],
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
              <TableCell colSpan={8}>
                <div className="flex justify-center p-4">Loading customers...</div>
              </TableCell>
            </TableRow>
          ) : customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No customers found
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