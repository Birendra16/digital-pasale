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

import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

import EditProduct from "./edit-product"
import DeleteProduct from "./delete-product"

interface Product {
  _id: string
  name: string
  sku: string
  baseUnit: { _id: string; name: string; symbol: string }
  units: { unit: string; sellingPrice: number; costPrice: number }[]
}

interface ProductsTableProps {
  products: Product[]
  isLoading: boolean
  editProduct: (id: string, data: any) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
}

export default function ProductsTable({ products, isLoading, editProduct, deleteProduct }: ProductsTableProps) {
  const columns: ColumnDef<Product>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "sku", header: "SKU" },
    { accessorFn: row => row.baseUnit?.name, header: "Base Unit" },
    { accessorFn: row => row.units?.[0]?.costPrice, header: "Cost Price", cell: ({ getValue }) => `Rs. ${getValue()}` },
    { accessorFn: row => row.units?.[0]?.sellingPrice, header: "Selling Price", cell: ({ getValue }) => `Rs. ${getValue()}` },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original
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
              <EditProduct product={product} editProduct={editProduct} />
              <DeleteProduct productId={product._id} deleteProduct={deleteProduct} />
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]

  const table = useReactTable({ data: products, columns, getCoreRowModel: getCoreRowModel() })

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center h-24">
                Loading products...
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center h-24">
                No products found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}