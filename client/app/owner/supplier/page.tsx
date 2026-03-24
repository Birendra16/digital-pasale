"use client"

import axios from "axios"
import { useEffect, useState, useRef } from "react"
import { toast } from "sonner"

import CreateSupplier from "./create-supplier"
import SuppliersTable from "./suppliers-table" 
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select"

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
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

  const fetchSuppliers = async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/suppliers", {
          params: { search: debouncedSearch, page, limit }
        }
      )
      setSuppliers(data.suppliers)
      setTotalPages(data.totalPages || 1)
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to fetch suppliers"
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [page, debouncedSearch, limit])

  return (
    <div className="p-4 space-y-4"> {/* ✅ IMPROVED spacing */}
      
      {/* 🔹 Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <h1 className="text-xl font-semibold">Suppliers</h1>

        <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto mt-2 md:mt-0">
          <Input
            placeholder="Search by name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64"
          />

          <Select value={String(limit)} onValueChange={(v) => {
            setLimit(Number(v))
            setPage(1)
          }}>
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

          {/* Create Button */}
          <CreateSupplier fetchSuppliers={fetchSuppliers} />
        </div>
      </div>

     
      {isLoading ? (
        <p className="text-center p-4">Loading suppliers...</p> 
      ) : (
        <div className="overflow-x-auto">
          <SuppliersTable
            suppliers={suppliers}
            fetchSuppliers={fetchSuppliers} 
          />
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 mt-4">
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
          Showing {suppliers.length} suppliers
        </div>
      </div>
    </div>
  )
}

export default Suppliers