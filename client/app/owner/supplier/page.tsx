"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { toast } from "sonner"

import CreateSupplier from "./create-supplier"
import SuppliersTable from "./suppliers-table"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface Supplier {
  _id: string
  name: string
  phone?: string
  email?: string
  address?: string
  taxNumber?: string
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit, setLimit] = useState(5)
  const searchTimeout = useRef<NodeJS.Timeout | null>(null)

  // Debounce search
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 500)
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current)
    }
  }, [search])

  // Fetch suppliers from backend
  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/suppliers`, {
        params: { search: debouncedSearch, page, limit },
      })
      setSuppliers(res.data.suppliers || [])
      setTotalPages(res.data.totalPages || 1)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch suppliers")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [page, debouncedSearch, limit])

  return (
    <div className="space-y-4 p-2 md:p-4">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <CreateSupplier fetchSuppliers={fetchSuppliers} />

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Input
            placeholder="Search by name, phone or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm w-full md:w-sm"
          />

          <Select value={String(limit)} onValueChange={(v) => setLimit(Number(v))}>
            <SelectTrigger className="w-full md:w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <h2 className="text-2xl font-semibold">Suppliers Detail</h2>

      {/* Table */}
      <div className="overflow-x-auto">
        <SuppliersTable
          suppliers={suppliers}
          loading={loading}
          fetchSuppliers={fetchSuppliers}
        />
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 mt-2">
        <div className="flex gap-2">
          <Button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>

          <span className="flex items-center">
            Page {page} of {totalPages}
          </span>

          <Button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>

        <div className="text-sm text-gray-500 md:text-right">
          Showing {suppliers.length} suppliers
        </div>
      </div>
    </div>
  )
}