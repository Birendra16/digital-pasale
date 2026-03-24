"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { toast } from "sonner"
import CreateCustomer from "./create-customer"
import CustomersTable from "./customers-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select"

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

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
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

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const res = await axios.get("http://localhost:8080/api/customers", {
        params: { search: debouncedSearch, page, limit },
      })
      setCustomers(res.data.data || [])
      setTotalPages(res.data.totalPages || 1)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch customers")
    } finally {
      setLoading(false)
    }
  }

  const createCustomer = async (data: any) => {
    try {
      const res = await axios.post("http://localhost:8080/api/customers", data)
      toast.success(res.data.message)
      fetchCustomers()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create customer")
    }
  }

  const editCustomer = async (id: string, data: any) => {
    try {
      const res = await axios.put(`http://localhost:8080/api/customers/${id}`, data)
      toast.success(res.data.message)
      fetchCustomers()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update customer")
    }
  }

  const deleteCustomer = async (id: string) => {
    try {
      const res = await axios.delete(`http://localhost:8080/api/customers/${id}`)
      toast.success(res.data.message)
      fetchCustomers()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete customer")
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [page, debouncedSearch, limit])

  return (
    <div className="space-y-4 p-2 md:p-4">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <CreateCustomer createCustomer={createCustomer} />
        
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Input
            placeholder="Search by name, phone or shop..."
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
        <h2 className="text-2xl font-semibold">Customers Detail</h2>
      {/* Table */}
      <div className="overflow-x-auto">
        <CustomersTable
          customers={customers}
          loading={loading}
          editCustomer={editCustomer}
          deleteCustomer={deleteCustomer}
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

        {/* Optional: could add summary info here for small screens */}
        <div className="text-sm text-gray-500 md:text-right">
          Showing {customers.length} customers
        </div>
      </div>
    </div>
  )
}