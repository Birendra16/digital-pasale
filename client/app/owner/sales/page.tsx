"use client"

import { useEffect, useState, useRef } from "react"
import axios from "axios"
import CreateSale from "./create-sale"
import SalesTable from "./sales-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select"

export default function SalesPage() {
  const [sales, setSales] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit, setLimit] = useState(10)
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

  const fetchSales = async () => {
    try {
      setLoading(true)
      const res = await axios.get("http://localhost:8080/api/sales", {
        params: { search: debouncedSearch, page, limit },
      })
      setSales(res.data.data || []) 
      setTotalPages(res.data.totalPages || 1)
    } catch (error) {
      console.error("Failed to fetch sales")
      setSales([]) 
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSales()
  }, [page, debouncedSearch, limit])

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Sales</h1>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <CreateSale onCreated={fetchSales} />

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Input
            placeholder="Search by customer or product..."
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

      <div className="overflow-x-auto">
        <SalesTable sales={sales} loading={loading} />
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
          Showing {sales.length} sales
        </div>
      </div>
    </div>
  )
}