"use client"

import { useEffect, useState, useRef } from "react"
import axios from "axios"
import PurchasesTable from "./purchases-table"
import CreatePurchase from "./create-purchase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select"

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [date, setDate] = useState("")
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

  const fetchPurchases = async () => {
    try {
      setLoading(true)
      const res = await axios.get("http://localhost:8080/api/purchases", {
        params: { search: debouncedSearch, date, page, limit },
      })
      setPurchases(res.data.purchases || [])
      setTotalPages(res.data.totalPages || 1)
    } catch (error) {
      console.error("Failed to fetch purchases", error)
      setPurchases([])
    } finally {
      setLoading(false)
    }
  }

  // Effect to refetch on changing parameters except `search` text dynamically typing
  useEffect(() => {
    fetchPurchases()
  }, [page, debouncedSearch, limit, date])

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Purchases</h1>
      <p className="text-sm text-muted-foreground">
        Record incoming stock from suppliers. You can view all purchase details and process returns.
      </p>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <CreatePurchase onCreated={fetchPurchases} />

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Input
            placeholder="Search supplier or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs w-full"
          />

          <Input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value)
              setPage(1)
            }}
            className="w-full md:w-36"
          />

          <Select value={String(limit)} onValueChange={(v) => {
            setLimit(Number(v))
            setPage(1)
          }}>
            <SelectTrigger className="w-full md:w-20">
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
        <PurchasesTable purchases={purchases} loading={loading} onRefresh={fetchPurchases} />
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
            disabled={page === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>

        <div className="text-sm text-gray-500 md:text-right">
          Showing {purchases.length} purchases
        </div>
      </div>
    </div>
  )
}